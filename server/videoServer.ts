import { Server as SocketIOServer } from 'socket.io';
import { Server as HTTPServer } from 'http';
import { storage } from './storage';

export interface VideoRoomData {
  id: string;
  name: string;
  hostId: string;
  participants: string[];
  isActive: boolean;
  createdAt: Date;
}

export class VideoServer {
  private io: SocketIOServer;
  private rooms: Map<string, VideoRoomData> = new Map();
  private userSockets: Map<string, string> = new Map(); // userId -> socketId

  constructor(server: HTTPServer) {
    this.io = new SocketIOServer(server, {
      cors: { origin: "*", methods: ["GET", "POST"] }
    });

    this.setupCommunityChat();
    this.setupVideoHandlers();
  }

  // ── Community real-time chat ─────────────────────────────────────────────
  private setupCommunityChat() {
    const chat = this.io.of('/chat');

    chat.on('connection', (socket) => {
      const userId = socket.handshake.auth?.userId as number | undefined;
      const userName = socket.handshake.auth?.userName as string | undefined;
      // Join a channel room
      socket.on('join-channel', (channelName: string) => {
        socket.join(`channel:${channelName}`);
        socket.emit('joined-channel', { channel: channelName });
      });

      socket.on('leave-channel', (channelName: string) => {
        socket.leave(`channel:${channelName}`);
      });

      // Send a message to a channel
      socket.on('send-message', async (data: {
        channelName: string;
        channelId: number;
        content: string;
      }) => {
        if (!userId || !data.content?.trim()) return;

        try {
          // Persist to DB
          const saved = await storage.createChannelMessage({
            channelId: data.channelId,
            userId,
            content: data.content.trim(),
            messageType: 'text',
          });

          const outgoing = {
            id: saved.id,
            channelId: data.channelId,
            channelName: data.channelName,
            userId,
            userName: userName || `User #${userId}`,
            content: data.content.trim(),
            createdAt: saved.createdAt,
          };

          // Broadcast to everyone in the channel (including sender)
          chat.to(`channel:${data.channelName}`).emit('new-message', outgoing);
        } catch (err) {
          socket.emit('error', { message: 'Failed to send message' });
        }
      });

      // Typing indicator
      socket.on('typing', (data: { channelName: string; isTyping: boolean }) => {
        socket.to(`channel:${data.channelName}`).emit('user-typing', {
          userId,
          userName: userName || `User #${userId}`,
          isTyping: data.isTyping,
        });
      });
    });
  }

  // ── Video / WebRTC handlers ──────────────────────────────────────────────
  private setupVideoHandlers() {
    this.io.on('connection', (socket) => {

      // Join room
      socket.on('join-room', async (data: { roomId: string; userId: string; userName: string; isHost: boolean }) => {
        const { roomId, userId, userName, isHost } = data;
        
        // Store bidirectional mapping
        this.userSockets.set(userId, socket.id);
        (socket as any).userId = userId; // store on socket for disconnect cleanup
        
        socket.join(roomId);
        
        // Get or create room
        let room = this.rooms.get(roomId);
        if (!room) {
          room = {
            id: roomId,
            name: `Room ${roomId}`,
            hostId: isHost ? userId : '',
            participants: [],
            isActive: true,
            createdAt: new Date()
          };
          this.rooms.set(roomId, room);
        }
        
        // Add participant to room
        if (!room.participants.includes(userId)) {
          room.participants.push(userId);
        }
        
        // Notify others in room
        socket.to(roomId).emit('user-joined', {
          userId,
          userName,
          isHost,
          participantCount: room.participants.length
        });
        
        // Send room info to joining user
        socket.emit('room-joined', {
          roomId,
          participants: room.participants,
          isHost
        });
        
        console.log(`User ${userName} joined room ${roomId}`);
      });

      // Handle WebRTC signaling — route by userId, fall back to broadcast in room
      socket.on('offer', (data: { to: string; offer: any; roomId?: string }) => {
        const targetSocketId = this.userSockets.get(data.to);
        if (targetSocketId) {
          this.io.to(targetSocketId).emit('offer', { from: socket.id, offer: data.offer });
        } else if (data.roomId) {
          socket.to(data.roomId).emit('offer', { from: socket.id, offer: data.offer });
        }
      });

      socket.on('answer', (data: { to: string; answer: any; roomId?: string }) => {
        const targetSocketId = this.userSockets.get(data.to);
        if (targetSocketId) {
          this.io.to(targetSocketId).emit('answer', { from: socket.id, answer: data.answer });
        } else if (data.roomId) {
          socket.to(data.roomId).emit('answer', { from: socket.id, answer: data.answer });
        }
      });

      socket.on('ice-candidate', (data: { to: string; candidate: any; roomId?: string }) => {
        const targetSocketId = this.userSockets.get(data.to);
        if (targetSocketId) {
          this.io.to(targetSocketId).emit('ice-candidate', { from: socket.id, candidate: data.candidate });
        } else if (data.roomId) {
          socket.to(data.roomId).emit('ice-candidate', { from: socket.id, candidate: data.candidate });
        }
      });

      // Handle media stream updates
      socket.on('stream-update', (data: { roomId: string; userId: string; isVideoEnabled: boolean; isAudioEnabled: boolean }) => {
        socket.to(data.roomId).emit('stream-updated', data);
      });

      // Handle screen sharing
      socket.on('screen-share-start', (data: { roomId: string; userId: string }) => {
        socket.to(data.roomId).emit('screen-share-started', data);
      });

      socket.on('screen-share-stop', (data: { roomId: string; userId: string }) => {
        socket.to(data.roomId).emit('screen-share-stopped', data);
      });

      // Handle chat messages
      socket.on('chat-message', (data: { roomId: string; userId: string; userName: string; message: string }) => {
        const messageData = {
          id: Date.now().toString(),
          senderId: data.userId,
          senderName: data.userName,
          message: data.message,
          timestamp: new Date().toISOString(),
          type: 'text' as const
        };
        
        this.io.to(data.roomId).emit('chat-message', messageData);
      });

      // Handle room management
      socket.on('mute-user', (data: { roomId: string; targetUserId: string; muted: boolean }) => {
        const targetSocketId = this.userSockets.get(data.targetUserId);
        if (targetSocketId) {
          socket.to(targetSocketId).emit('user-muted', { muted: data.muted });
        }
      });

      socket.on('remove-user', (data: { roomId: string; targetUserId: string }) => {
        const targetSocketId = this.userSockets.get(data.targetUserId);
        if (targetSocketId) {
          socket.to(targetSocketId).emit('user-removed', { reason: 'Removed by host' });
        }
      });

      // Handle recording
      socket.on('start-recording', (data: { roomId: string; userId: string }) => {
        this.io.to(data.roomId).emit('recording-started', { startedBy: data.userId });
      });

      socket.on('stop-recording', (data: { roomId: string; userId: string }) => {
        this.io.to(data.roomId).emit('recording-stopped', { stoppedBy: data.userId });
      });

      socket.on('disconnect', () => {
        console.log(`User disconnected: ${socket.id}`);
        const userId = (socket as any).userId as string | undefined;
        
        if (userId) {
          this.userSockets.delete(userId);
          for (const [roomId, room] of this.rooms.entries()) {
            if (room.participants.includes(userId)) {
              room.participants = room.participants.filter(id => id !== userId);
              socket.to(roomId).emit('user-left', { userId, participantCount: room.participants.length });
              if (room.participants.length === 0) this.rooms.delete(roomId);
              break;
            }
          }
        }
      });
    });
  }

  public getRooms(): VideoRoomData[] {
    return Array.from(this.rooms.values());
  }

  // Broadcast leaderboard update to all connected clients
  public broadcastLeaderboardUpdate() {
    this.io.emit('leaderboard-updated');
  }

  public getRoom(roomId: string): VideoRoomData | undefined {
    return this.rooms.get(roomId);
  }

  public closeRoom(roomId: string): void {
    const room = this.rooms.get(roomId);
    if (room) {
      this.io.to(roomId).emit('room-closed', { reason: 'Room closed by host' });
      this.rooms.delete(roomId);
    }
  }
} 