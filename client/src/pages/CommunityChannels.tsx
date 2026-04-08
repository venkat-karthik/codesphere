import { useState, useRef, useEffect, useCallback } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Hash, Volume2, Lock, Settings, Users, Plus, Send, Smile } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { apiRequest } from '@/lib/queryClient';
import { io, Socket } from 'socket.io-client';

// ── Types ──────────────────────────────────────────────────────────────────

interface Channel {
  id: number;
  name: string;
  type: 'text' | 'voice';
  description: string | null;
  memberCount: number;
  isPrivate: boolean;
}

interface Message {
  id: number | string;
  channelId: number;
  channelName: string;
  userId: number;
  userName: string;
  content: string;
  createdAt: string;
}

interface TypingUser {
  userId: number;
  userName: string;
}

// ── Component ──────────────────────────────────────────────────────────────

export function CommunityChannels() {
  const { user } = useAuth();
  const qc = useQueryClient();

  const [selectedChannel, setSelectedChannel] = useState<Channel | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [typingUsers, setTypingUsers] = useState<TypingUser[]>([]);
  const [socket, setSocket] = useState<Socket | null>(null);
  const [connected, setConnected] = useState(false);
  const [showNewChannelModal, setShowNewChannelModal] = useState(false);
  const [newChannelName, setNewChannelName] = useState('');
  const [newChannelType, setNewChannelType] = useState<'text' | 'voice'>('text');

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const typingTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // ── Fetch channels ─────────────────────────────────────────────────────
  const { data: channels = [] } = useQuery<Channel[]>({
    queryKey: ['/api/community/channels'],
  });

  // Set default channel once loaded
  useEffect(() => {
    if ((channels as Channel[]).length > 0 && !selectedChannel) {
      setSelectedChannel((channels as Channel[])[0]);
    }
  }, [channels]);

  // ── Socket.io connection ───────────────────────────────────────────────
  useEffect(() => {
    if (!user) return;

    const s = io('/chat', {
      auth: { userId: user.id, userName: `${user.firstName} ${user.lastName}` },
      transports: ['websocket', 'polling'],
    });

    s.on('connect', () => setConnected(true));
    s.on('disconnect', () => setConnected(false));

    s.on('new-message', (msg: Message) => {
      setMessages(prev => {
        // Avoid duplicates
        if (prev.some(m => m.id === msg.id)) return prev;
        return [...prev, msg];
      });
    });

    s.on('user-typing', ({ userId, userName, isTyping }: { userId: number; userName: string; isTyping: boolean }) => {
      if (userId === user.id) return;
      setTypingUsers(prev =>
        isTyping
          ? prev.some(u => u.userId === userId) ? prev : [...prev, { userId, userName }]
          : prev.filter(u => u.userId !== userId)
      );
    });

    setSocket(s);
    return () => { s.disconnect(); };
  }, [user]);

  // ── Join channel room when selection changes ───────────────────────────
  useEffect(() => {
    if (!socket || !selectedChannel) return;

    // Leave previous, join new
    socket.emit('join-channel', selectedChannel.name);

    // Load message history from DB
    fetch(`/api/community/channels/${selectedChannel.id}/messages?limit=50`, { credentials: 'include' })
      .then(r => r.json())
      .then((history: any[]) => {
        setMessages(history.map(m => ({
          id: m.id,
          channelId: m.channelId,
          channelName: selectedChannel.name,
          userId: m.userId,
          userName: m.userName || `User #${m.userId}`,
          content: m.content,
          createdAt: m.createdAt,
        })));
      })
      .catch(() => setMessages([]));

    setTypingUsers([]);

    return () => { socket.emit('leave-channel', selectedChannel.name); };
  }, [socket, selectedChannel?.id]);

  // ── Auto-scroll ────────────────────────────────────────────────────────
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // ── Send message ───────────────────────────────────────────────────────
  const sendMessage = useCallback(() => {
    if (!input.trim() || !socket || !selectedChannel || !user) return;

    socket.emit('send-message', {
      channelName: selectedChannel.name,
      channelId: selectedChannel.id,
      content: input.trim(),
    });

    setInput('');
    // Stop typing indicator
    socket.emit('typing', { channelName: selectedChannel.name, isTyping: false });
  }, [input, socket, selectedChannel, user]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  // ── Typing indicator ───────────────────────────────────────────────────
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value);
    if (!socket || !selectedChannel) return;

    socket.emit('typing', { channelName: selectedChannel.name, isTyping: true });
    if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
    typingTimeoutRef.current = setTimeout(() => {
      socket.emit('typing', { channelName: selectedChannel.name, isTyping: false });
    }, 2000);
  };

  // ── Create channel ─────────────────────────────────────────────────────
  const createChannel = useMutation({
    mutationFn: async () => {
      await apiRequest('POST', '/api/community/channels', {
        name: newChannelName.trim().toLowerCase().replace(/\s+/g, '-'),
        type: newChannelType,
      });
    },
    onSuccess: () => {
      setNewChannelName('');
      setShowNewChannelModal(false);
      qc.invalidateQueries({ queryKey: ['/api/community/channels'] });
    },
  });

  const textChannels = (channels as Channel[]).filter(c => c.type === 'text');
  const voiceChannels = (channels as Channel[]).filter(c => c.type === 'voice');

  const formatTime = (d: string) => new Date(d).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  const getInitials = (name: string) => name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);

  return (
    <div className="flex h-[calc(100vh-4rem)] bg-background overflow-hidden">

      {/* ── Channel Sidebar ─────────────────────────────────────────── */}
      <div className="w-52 md:w-60 bg-muted/30 border-r flex flex-col shrink-0 hidden sm:flex">
        <div className="p-4 border-b flex items-center justify-between">
          <h2 className="font-bold text-sm">CodeSphere Community</h2>
          <Dialog open={showNewChannelModal} onOpenChange={setShowNewChannelModal}>
            <DialogTrigger asChild>
              <Button size="sm" variant="ghost"><Plus className="h-4 w-4" /></Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader><DialogTitle>Create Channel</DialogTitle></DialogHeader>
              <div className="space-y-4 pt-2">
                <Input placeholder="channel-name" value={newChannelName}
                  onChange={e => setNewChannelName(e.target.value)} />
                <div className="flex gap-2">
                  <Button variant={newChannelType === 'text' ? 'default' : 'outline'} className="flex-1"
                    onClick={() => setNewChannelType('text')}>
                    <Hash className="mr-2 h-4 w-4" />Text
                  </Button>
                  <Button variant={newChannelType === 'voice' ? 'default' : 'outline'} className="flex-1"
                    onClick={() => setNewChannelType('voice')}>
                    <Volume2 className="mr-2 h-4 w-4" />Voice
                  </Button>
                </div>
                <Button className="w-full" disabled={!newChannelName.trim() || createChannel.isPending}
                  onClick={() => createChannel.mutate()}>
                  {createChannel.isPending ? 'Creating...' : 'Create'}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        <ScrollArea className="flex-1">
          <div className="p-2 space-y-4">
            {textChannels.length > 0 && (
              <div>
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide px-2 mb-1">Text Channels</p>
                {textChannels.map(ch => (
                  <button key={ch.id} onClick={() => setSelectedChannel(ch)}
                    className={`w-full flex items-center gap-2 px-2 py-1.5 rounded text-sm transition-colors ${selectedChannel?.id === ch.id ? 'bg-muted text-foreground' : 'text-muted-foreground hover:bg-muted/50'}`}>
                    <Hash className="h-4 w-4 shrink-0" />
                    <span className="truncate">{ch.name}</span>
                    {ch.isPrivate && <Lock className="h-3 w-3 ml-auto" />}
                  </button>
                ))}
              </div>
            )}
            {voiceChannels.length > 0 && (
              <div>
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide px-2 mb-1">Voice Channels</p>
                {voiceChannels.map(ch => (
                  <button key={ch.id} onClick={() => setSelectedChannel(ch)}
                    className={`w-full flex items-center gap-2 px-2 py-1.5 rounded text-sm transition-colors ${selectedChannel?.id === ch.id ? 'bg-muted text-foreground' : 'text-muted-foreground hover:bg-muted/50'}`}>
                    <Volume2 className="h-4 w-4 shrink-0" />
                    <span className="truncate">{ch.name}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
        </ScrollArea>

        {/* User info */}
        <div className="p-3 border-t flex items-center gap-2">
          <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-primary-foreground text-xs font-semibold shrink-0">
            {user ? getInitials(`${user.firstName} ${user.lastName}`) : '?'}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate">{user ? `${user.firstName} ${user.lastName}` : 'Guest'}</p>
            <p className="text-xs text-muted-foreground flex items-center gap-1">
              <span className={`w-2 h-2 rounded-full ${connected ? 'bg-green-500' : 'bg-gray-400'}`} />
              {connected ? 'Online' : 'Offline'}
            </p>
          </div>
          <Button size="sm" variant="ghost"><Settings className="h-4 w-4" /></Button>
        </div>
      </div>

      {/* ── Main Chat Area ───────────────────────────────────────────── */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Header */}
        <div className="p-4 border-b flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2">
            {selectedChannel?.type === 'text'
              ? <Hash className="h-5 w-5 text-muted-foreground" />
              : <Volume2 className="h-5 w-5 text-muted-foreground" />}
            <div>
              <h3 className="font-semibold">{selectedChannel?.name || 'Select a channel'}</h3>
              {selectedChannel?.description && (
                <p className="text-xs text-muted-foreground">{selectedChannel.description}</p>
              )}
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="secondary" className="text-xs">
              <Users className="mr-1 h-3 w-3" />
              {messages.length} messages
            </Badge>
          </div>
        </div>

        {/* Messages */}
        <ScrollArea className="flex-1 p-4">
          {!selectedChannel ? (
            <div className="flex items-center justify-center h-full text-muted-foreground text-sm">
              Select a channel to start chatting
            </div>
          ) : messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center">
              <Hash className="h-12 w-12 text-muted-foreground mb-3" />
              <p className="font-semibold">Welcome to #{selectedChannel.name}!</p>
              <p className="text-sm text-muted-foreground mt-1">This is the beginning of the channel. Say hello!</p>
            </div>
          ) : (
            <div className="space-y-3">
              {messages.map((msg, idx) => {
                const isMe = msg.userId === user?.id;
                const prevMsg = messages[idx - 1];
                const showHeader = !prevMsg || prevMsg.userId !== msg.userId ||
                  new Date(msg.createdAt).getTime() - new Date(prevMsg.createdAt).getTime() > 5 * 60 * 1000;

                return (
                  <div key={msg.id} className={`flex items-start gap-3 group ${isMe ? 'flex-row-reverse' : ''}`}>
                    {showHeader && (
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold shrink-0 ${isMe ? 'bg-primary text-primary-foreground' : 'bg-muted'}`}>
                        {getInitials(msg.userName)}
                      </div>
                    )}
                    {!showHeader && <div className="w-8 shrink-0" />}
                    <div className={`max-w-[70%] ${isMe ? 'items-end' : 'items-start'} flex flex-col`}>
                      {showHeader && (
                        <div className={`flex items-baseline gap-2 mb-0.5 ${isMe ? 'flex-row-reverse' : ''}`}>
                          <span className="text-sm font-semibold">{isMe ? 'You' : msg.userName}</span>
                          <span className="text-xs text-muted-foreground">{formatTime(msg.createdAt)}</span>
                        </div>
                      )}
                      <div className={`px-3 py-2 rounded-2xl text-sm break-words ${isMe ? 'bg-primary text-primary-foreground rounded-tr-sm' : 'bg-muted rounded-tl-sm'}`}>
                        {msg.content}
                      </div>
                    </div>
                  </div>
                );
              })}

              {/* Typing indicator */}
              {typingUsers.length > 0 && (
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <div className="flex gap-0.5">
                    <span className="w-1.5 h-1.5 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                    <span className="w-1.5 h-1.5 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                    <span className="w-1.5 h-1.5 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                  </div>
                  {typingUsers.map(u => u.userName).join(', ')} {typingUsers.length === 1 ? 'is' : 'are'} typing...
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>
          )}
        </ScrollArea>

        {/* Input */}
        <div className="p-4 border-t shrink-0">
          {!user ? (
            <p className="text-sm text-muted-foreground text-center">Sign in to send messages</p>
          ) : selectedChannel?.type === 'voice' ? (
            <p className="text-sm text-muted-foreground text-center">Voice channels don't support text chat</p>
          ) : (
            <div className="flex items-center gap-2">
              <Input
                placeholder={`Message #${selectedChannel?.name || '...'}`}
                value={input}
                onChange={handleInputChange}
                onKeyDown={handleKeyDown}
                disabled={!connected || !selectedChannel}
                className="flex-1"
              />
              <Button size="icon" onClick={sendMessage}
                disabled={!input.trim() || !connected || !selectedChannel}>
                <Send className="h-4 w-4" />
              </Button>
            </div>
          )}
          {!connected && user && (
            <p className="text-xs text-muted-foreground mt-1 text-center">Connecting to chat...</p>
          )}
        </div>
      </div>
    </div>
  );
}
