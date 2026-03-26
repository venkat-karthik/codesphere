"use client";

import { useState, useEffect, useRef } from "react";
import { io, Socket } from "socket.io-client";
import { Send, User, Clock, Loader2, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { apiFetch } from "@/lib/api";
import { toast } from "sonner";

interface Message {
    _id: string;
    content: string;
    authorId: {
        _id: string;
        name: string;
        email: string;
    };
    createdAt: string;
}

export default function CommunityChat({ communityId, userId }: { communityId: string; userId: string }) {
    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState("");
    const [loading, setLoading] = useState(true);
    const [socket, setSocket] = useState<Socket | null>(null);
    const scrollRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        // Fetch history
        const fetchHistory = async () => {
            try {
                const data = await apiFetch(`/communities/${communityId}/messages`);
                setMessages(data);
            } catch (error) {
                console.error("Failed to fetch chat history:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchHistory();

        // Connect WebSocket
        const newSocket = io(process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001");
        setSocket(newSocket);

        newSocket.emit("joinRoom", communityId);

        newSocket.on("message", (message: Message) => {
            setMessages((prev) => [...prev, message]);
        });

        return () => {
            newSocket.emit("leaveRoom", communityId);
            newSocket.disconnect();
        };
    }, [communityId]);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollIntoView({ behavior: "smooth" });
        }
    }, [messages]);

    const handleSendMessage = (e: React.FormEvent) => {
        e.preventDefault();
        if (!input.trim() || !socket) return;

        const messageData = {
            communityId,
            authorId: userId,
            content: input,
            type: "text",
        };

        socket.emit("sendMessage", messageData);
        setInput("");
    };

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center h-[500px] border border-border/40 rounded-xl bg-card/30">
                <Loader2 className="w-8 h-8 animate-spin text-primary mb-2" />
                <p className="text-sm text-muted-foreground">Loading chat history...</p>
            </div>
        );
    }

    return (
        <div className="flex flex-col h-[600px] border border-border/40 rounded-xl bg-card/30 overflow-hidden">
            <div className="p-4 border-b border-border/40 bg-muted/20 flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <MessageSquare className="w-4 h-4 text-primary" />
                    <h3 className="font-semibold text-sm">Community Chat</h3>
                </div>
                <div className="flex items-center gap-1.5">
                    <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                    <span className="text-[10px] text-muted-foreground uppercase tracking-wider font-bold">Live</span>
                </div>
            </div>

            <ScrollArea className="flex-1 p-4">
                <div className="space-y-4">
                    {messages.length === 0 && (
                        <div className="text-center py-12">
                            <p className="text-sm text-muted-foreground italic">No messages yet. Start the conversation!</p>
                        </div>
                    )}
                    {messages.map((msg) => (
                        <div key={msg._id} className={`flex gap-3 ${msg.authorId._id === userId ? "flex-row-reverse" : "flex-row"}`}>
                            <Avatar className="w-8 h-8 shrink-0 border border-border/40">
                                <AvatarFallback className="text-[10px] bg-primary/10 text-primary">
                                    {msg.authorId.name.charAt(0)}
                                </AvatarFallback>
                            </Avatar>
                            <div className={`flex flex-col max-w-[80%] ${msg.authorId._id === userId ? "items-end" : "items-start"}`}>
                                <div className="flex items-center gap-2 mb-1">
                                    <span className="text-xs font-semibold">{msg.authorId.name}</span>
                                    <span className="text-[10px] text-muted-foreground">{new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                                </div>
                                <div className={`p-3 rounded-2xl text-sm ${msg.authorId._id === userId
                                        ? "bg-primary text-primary-foreground rounded-tr-none"
                                        : "bg-muted/50 rounded-tl-none border border-border/40"
                                    }`}>
                                    {msg.content}
                                </div>
                            </div>
                        </div>
                    ))}
                    <div ref={scrollRef} />
                </div>
            </ScrollArea>

            <form onSubmit={handleSendMessage} className="p-4 border-t border-border/40 bg-muted/10 gap-2 flex">
                <Input
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Message the community..."
                    className="flex-1 bg-background"
                />
                <Button type="submit" size="icon" className="shrink-0">
                    <Send className="w-4 h-4" />
                </Button>
            </form>
        </div>
    );
}
