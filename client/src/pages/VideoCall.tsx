import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { VideoCallState, Participant, ChatMessage } from '@/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { 
  Video, 
  VideoOff, 
  Mic, 
  MicOff, 
  Share, 
  Share2, 
  MessageSquare, 
  Users, 
  Settings, 
  Phone, 
  PhoneOff,
  Maximize,
  Minimize,
  MoreVertical
} from 'lucide-react';
import { io, Socket } from 'socket.io-client';

interface VideoCallProps {
  roomId: string;
  isHost: boolean;
  onClose: () => void;
}

export function VideoCall({ roomId, isHost, onClose }: VideoCallProps) {
  const { user } = useAuth();
  const [socket, setSocket] = useState<Socket | null>(null);
  const [localStream, setLocalStream] = useState<MediaStream | null>(null);
  const [remoteStreams, setRemoteStreams] = useState<Map<string, MediaStream>>(new Map());
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isVideoEnabled, setIsVideoEnabled] = useState(true);
  const [isAudioEnabled, setIsAudioEnabled] = useState(true);
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [showChat, setShowChat] = useState(false);
  const [showParticipants, setShowParticipants] = useState(false);
  const [newMessage, setNewMessage] = useState('');
  const [isConnecting, setIsConnecting] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const localVideoRef = useRef<HTMLVideoElement>(null);
  const remoteVideosRef = useRef<Map<string, HTMLVideoElement>>(new Map());
  const peersRef = useRef<Map<string, RTCPeerConnection>>(new Map());
  const screenStreamRef = useRef<MediaStream | null>(null);

  useEffect(() => {
    initializeVideoCall();
    return () => {
      cleanup();
    };
  }, []);

  const initializeVideoCall = async () => {
    try {
      // Initialize Socket.IO connection
      const socketInstance = io();
      setSocket(socketInstance);

      // Get user media
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true
      });
      setLocalStream(stream);

      if (localVideoRef.current) {
        localVideoRef.current.srcObject = stream;
      }

      // Join room
      socketInstance.emit('join-room', {
        roomId,
        userId: user?.id,
        userName: `${user?.firstName} ${user?.lastName}`,
        isHost
      });

      // Socket event listeners
      socketInstance.on('user-joined', handleUserJoined);
      socketInstance.on('user-left', handleUserLeft);
      socketInstance.on('offer', handleOffer);
      socketInstance.on('answer', handleAnswer);
      socketInstance.on('ice-candidate', handleIceCandidate);
      socketInstance.on('chat-message', handleChatMessage);
      socketInstance.on('stream-updated', handleStreamUpdated);
      socketInstance.on('screen-share-started', handleScreenShareStarted);
      socketInstance.on('screen-share-stopped', handleScreenShareStopped);
      socketInstance.on('user-muted', handleUserMuted);
      socketInstance.on('user-removed', handleUserRemoved);
      socketInstance.on('room-closed', handleRoomClosed);

      setIsConnecting(false);
    } catch (err) {
      console.error('Failed to initialize video call:', err);
      setError('Failed to access camera and microphone. Please check permissions.');
      setIsConnecting(false);
    }
  };

  const handleUserJoined = async (data: { userId: string; userName: string; isHost: boolean }) => {
    const newParticipant: Participant = {
      id: data.userId,
      userId: data.userId,
      name: data.userName,
      role: data.isHost ? 'host' : 'participant',
      isVideoEnabled: true,
      isAudioEnabled: true,
      isScreenSharing: false,
      isMuted: false,
      joinedAt: new Date().toISOString()
    };

    setParticipants(prev => [...prev, newParticipant]);

    // Create peer connection for new user
    if (localStream) {
      await createPeerConnection(data.userId);
    }
  };

  const handleUserLeft = (data: { userId: string }) => {
    setParticipants(prev => prev.filter(p => p.id !== data.userId));
    setRemoteStreams(prev => {
      const newMap = new Map(prev);
      newMap.delete(data.userId);
      return newMap;
    });
    
    // Close peer connection
    const peer = peersRef.current.get(data.userId);
    if (peer) {
      peer.close();
      peersRef.current.delete(data.userId);
    }
  };

  const createPeerConnection = async (userId: string) => {
    const peerConnection = new RTCPeerConnection({
      iceServers: [
        { urls: 'stun:stun.l.google.com:19302' },
        { urls: 'stun:stun1.l.google.com:19302' }
      ]
    });

    // Add local stream tracks
    if (localStream) {
      localStream.getTracks().forEach(track => {
        peerConnection.addTrack(track, localStream);
      });
    }

    // Handle ICE candidates
    peerConnection.onicecandidate = (event) => {
      if (event.candidate && socket) {
        socket.emit('ice-candidate', {
          to: userId,
          candidate: event.candidate
        });
      }
    };

    // Handle remote stream
    peerConnection.ontrack = (event) => {
      setRemoteStreams(prev => {
        const newMap = new Map(prev);
        newMap.set(userId, event.streams[0]);
        return newMap;
      });
    };

    peersRef.current.set(userId, peerConnection);

    // Create and send offer
    try {
      const offer = await peerConnection.createOffer();
      await peerConnection.setLocalDescription(offer);
      
      if (socket) {
        socket.emit('offer', {
          to: userId,
          offer: offer
        });
      }
    } catch (err) {
      console.error('Error creating offer:', err);
    }
  };

  const handleOffer = async (data: { from: string; offer: RTCSessionDescriptionInit }) => {
    const peerConnection = new RTCPeerConnection({
      iceServers: [
        { urls: 'stun:stun.l.google.com:19302' },
        { urls: 'stun:stun1.l.google.com:19302' }
      ]
    });

    // Add local stream tracks
    if (localStream) {
      localStream.getTracks().forEach(track => {
        peerConnection.addTrack(track, localStream);
      });
    }

    // Handle ICE candidates
    peerConnection.onicecandidate = (event) => {
      if (event.candidate && socket) {
        socket.emit('ice-candidate', {
          to: data.from,
          candidate: event.candidate
        });
      }
    };

    // Handle remote stream
    peerConnection.ontrack = (event) => {
      setRemoteStreams(prev => {
        const newMap = new Map(prev);
        newMap.set(data.from, event.streams[0]);
        return newMap;
      });
    };

    peersRef.current.set(data.from, peerConnection);

    try {
      await peerConnection.setRemoteDescription(new RTCSessionDescription(data.offer));
      const answer = await peerConnection.createAnswer();
      await peerConnection.setLocalDescription(answer);
      
      if (socket) {
        socket.emit('answer', {
          to: data.from,
          answer: answer
        });
      }
    } catch (err) {
      console.error('Error handling offer:', err);
    }
  };

  const handleAnswer = async (data: { from: string; answer: RTCSessionDescriptionInit }) => {
    const peerConnection = peersRef.current.get(data.from);
    if (peerConnection) {
      try {
        await peerConnection.setRemoteDescription(new RTCSessionDescription(data.answer));
      } catch (err) {
        console.error('Error handling answer:', err);
      }
    }
  };

  const handleIceCandidate = async (data: { from: string; candidate: RTCIceCandidateInit }) => {
    const peerConnection = peersRef.current.get(data.from);
    if (peerConnection) {
      try {
        await peerConnection.addIceCandidate(new RTCIceCandidate(data.candidate));
      } catch (err) {
        console.error('Error adding ICE candidate:', err);
      }
    }
  };

  const handleChatMessage = (message: ChatMessage) => {
    setMessages(prev => [...prev, message]);
  };

  const handleStreamUpdated = (data: { userId: string; isVideoEnabled: boolean; isAudioEnabled: boolean }) => {
    setParticipants(prev => 
      prev.map(p => 
        p.id === data.userId 
          ? { ...p, isVideoEnabled: data.isVideoEnabled, isAudioEnabled: data.isAudioEnabled }
          : p
      )
    );
  };

  const handleScreenShareStarted = (data: { userId: string }) => {
    setParticipants(prev => 
      prev.map(p => 
        p.id === data.userId ? { ...p, isScreenSharing: true } : p
      )
    );
  };

  const handleScreenShareStopped = (data: { userId: string }) => {
    setParticipants(prev => 
      prev.map(p => 
        p.id === data.userId ? { ...p, isScreenSharing: false } : p
      )
    );
  };

  const handleUserMuted = (data: { muted: boolean }) => {
    setIsMuted(data.muted);
  };

  const handleUserRemoved = (data: { reason: string }) => {
    alert(`You have been removed from the call: ${data.reason}`);
    onClose();
  };

  const handleRoomClosed = (data: { reason: string }) => {
    alert(`Room closed: ${data.reason}`);
    onClose();
  };

  const toggleVideo = () => {
    if (localStream) {
      const videoTrack = localStream.getVideoTracks()[0];
      if (videoTrack) {
        videoTrack.enabled = !videoTrack.enabled;
        setIsVideoEnabled(videoTrack.enabled);
        
        if (socket) {
          socket.emit('stream-update', {
            roomId,
            userId: user?.id,
            isVideoEnabled: videoTrack.enabled,
            isAudioEnabled: isAudioEnabled
          });
        }
      }
    }
  };

  const toggleAudio = () => {
    if (localStream) {
      const audioTrack = localStream.getAudioTracks()[0];
      if (audioTrack) {
        audioTrack.enabled = !audioTrack.enabled;
        setIsAudioEnabled(audioTrack.enabled);
        
        if (socket) {
          socket.emit('stream-update', {
            roomId,
            userId: user?.id,
            isVideoEnabled: isVideoEnabled,
            isAudioEnabled: audioTrack.enabled
          });
        }
      }
    }
  };

  const toggleScreenShare = async () => {
    try {
      if (!isScreenSharing) {
        const screenStream = await navigator.mediaDevices.getDisplayMedia({
          video: true,
          audio: true
        });
        
        screenStreamRef.current = screenStream;
        
        // Replace video track in all peer connections
        const videoTrack = screenStream.getVideoTracks()[0];
        peersRef.current.forEach(peer => {
          const sender = peer.getSenders().find(s => s.track?.kind === 'video');
          if (sender) {
            sender.replaceTrack(videoTrack);
          }
        });
        
        setIsScreenSharing(true);
        
        if (socket) {
          socket.emit('screen-share-start', { roomId, userId: user?.id });
        }
      } else {
        // Stop screen sharing
        if (screenStreamRef.current) {
          screenStreamRef.current.getTracks().forEach(track => track.stop());
          screenStreamRef.current = null;
        }
        
        // Restore camera video track
        if (localStream) {
          const videoTrack = localStream.getVideoTracks()[0];
          peersRef.current.forEach(peer => {
            const sender = peer.getSenders().find(s => s.track?.kind === 'video');
            if (sender && videoTrack) {
              sender.replaceTrack(videoTrack);
            }
          });
        }
        
        setIsScreenSharing(false);
        
        if (socket) {
          socket.emit('screen-share-stop', { roomId, userId: user?.id });
        }
      }
    } catch (err) {
      console.error('Error toggling screen share:', err);
    }
  };

  const sendMessage = () => {
    if (newMessage.trim() && socket) {
      socket.emit('chat-message', {
        roomId,
        userId: user?.id,
        userName: `${user?.firstName} ${user?.lastName}`,
        message: newMessage.trim()
      });
      setNewMessage('');
    }
  };

  const muteUser = (userId: string, muted: boolean) => {
    if (socket && isHost) {
      socket.emit('mute-user', { roomId, targetUserId: userId, muted });
    }
  };

  const removeUser = (userId: string) => {
    if (socket && isHost) {
      socket.emit('remove-user', { roomId, targetUserId: userId });
    }
  };

  const cleanup = () => {
    // Stop all tracks
    if (localStream) {
      localStream.getTracks().forEach(track => track.stop());
    }
    
    if (screenStreamRef.current) {
      screenStreamRef.current.getTracks().forEach(track => track.stop());
    }
    
    // Close all peer connections
    peersRef.current.forEach(peer => peer.close());
    peersRef.current.clear();
    
    // Disconnect socket
    if (socket) {
      socket.disconnect();
    }
  };

  if (isConnecting) {
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
        <div className="bg-background p-6 rounded-lg">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p>Connecting to video call...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
        <div className="bg-background p-6 rounded-lg max-w-md">
          <h3 className="text-lg font-semibold mb-2">Connection Error</h3>
          <p className="text-muted-foreground mb-4">{error}</p>
          <Button onClick={onClose}>Close</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black z-50 flex flex-col">
      {/* Header */}
      <div className="bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <h2 className="text-lg font-semibold">Live Class</h2>
            <Badge variant="destructive" className="animate-pulse">Live</Badge>
            <span className="text-sm text-muted-foreground">
              {participants.length} participants
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowParticipants(!showParticipants)}
            >
              <Users className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowChat(!showChat)}
            >
              <MessageSquare className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
            >
              <PhoneOff className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex">
        {/* Video Area */}
        <div className="flex-1 relative">
          <div className="absolute inset-0 p-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 h-full">
              {/* Local Video */}
              <div className="relative bg-muted rounded-lg overflow-hidden">
                <video
                  ref={localVideoRef}
                  autoPlay
                  muted
                  playsInline
                  className="w-full h-full object-cover"
                />
                <div className="absolute bottom-2 left-2 bg-black/50 text-white px-2 py-1 rounded text-sm">
                  You {isScreenSharing && '(Screen)'}
                </div>
                {!isVideoEnabled && (
                  <div className="absolute inset-0 bg-muted flex items-center justify-center">
                    <VideoOff className="h-12 w-12 text-muted-foreground" />
                  </div>
                )}
              </div>

              {/* Remote Videos */}
              {Array.from(remoteStreams.entries()).map(([userId, stream]) => {
                const participant = participants.find(p => p.id === userId);
                return (
                  <div key={userId} className="relative bg-muted rounded-lg overflow-hidden">
                    <video
                      ref={el => {
                        if (el) {
                          remoteVideosRef.current.set(userId, el);
                          el.srcObject = stream;
                        }
                      }}
                      autoPlay
                      playsInline
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute bottom-2 left-2 bg-black/50 text-white px-2 py-1 rounded text-sm">
                      {participant?.name} {participant?.isScreenSharing && '(Screen)'}
                    </div>
                    {!participant?.isVideoEnabled && (
                      <div className="absolute inset-0 bg-muted flex items-center justify-center">
                        <VideoOff className="h-12 w-12 text-muted-foreground" />
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        {(showChat || showParticipants) && (
          <div className="w-80 bg-background border-l">
            {showChat && (
              <div className="h-full flex flex-col">
                <div className="p-4 border-b">
                  <h3 className="font-semibold">Chat</h3>
                </div>
                <ScrollArea className="flex-1 p-4">
                  <div className="space-y-2">
                    {messages.map((message) => (
                      <div key={message.id} className="text-sm">
                        <span className="font-medium">{message.senderName}:</span>
                        <span className="ml-2">{message.message}</span>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
                <div className="p-4 border-t">
                  <div className="flex gap-2">
                    <Input
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      placeholder="Type a message..."
                      onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                    />
                    <Button size="sm" onClick={sendMessage}>Send</Button>
                  </div>
                </div>
              </div>
            )}

            {showParticipants && (
              <div className="h-full flex flex-col">
                <div className="p-4 border-b">
                  <h3 className="font-semibold">Participants ({participants.length})</h3>
                </div>
                <ScrollArea className="flex-1 p-4">
                  <div className="space-y-2">
                    {participants.map((participant) => (
                      <div key={participant.id} className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 bg-muted rounded-full flex items-center justify-center">
                            {participant.name.charAt(0)}
                          </div>
                          <div>
                            <div className="text-sm font-medium">{participant.name}</div>
                            <div className="text-xs text-muted-foreground">
                              {participant.role}
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-1">
                          {!participant.isAudioEnabled && <MicOff className="h-3 w-3" />}
                          {!participant.isVideoEnabled && <VideoOff className="h-3 w-3" />}
                          {participant.isScreenSharing && <Share2 className="h-3 w-3" />}
                          {isHost && participant.role !== 'host' && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => removeUser(participant.id)}
                            >
                              Remove
                            </Button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Controls */}
      <div className="bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-t p-4">
        <div className="flex items-center justify-center gap-4">
          <Button
            variant={isVideoEnabled ? "default" : "destructive"}
            size="lg"
            onClick={toggleVideo}
          >
            {isVideoEnabled ? <Video className="h-5 w-5" /> : <VideoOff className="h-5 w-5" />}
          </Button>
          
          <Button
            variant={isAudioEnabled ? "default" : "destructive"}
            size="lg"
            onClick={toggleAudio}
          >
            {isAudioEnabled ? <Mic className="h-5 w-5" /> : <MicOff className="h-5 w-5" />}
          </Button>
          
          <Button
            variant={isScreenSharing ? "destructive" : "default"}
            size="lg"
            onClick={toggleScreenShare}
          >
            <Share className="h-5 w-5" />
          </Button>
          
          <Button
            variant="destructive"
            size="lg"
            onClick={onClose}
          >
            <PhoneOff className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </div>
  );
} 