"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { MessageSquare, Users, Share2, Maximize, Settings, Hand, Loader2, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import Navbar from "@/components/layout/Navbar";
import { apiFetch } from "@/lib/api";

const MOCK_CHAT = [
    { u: "DevGuy", m: "Will this session be recorded?", c: "text-blue-400" },
    { u: "SarahJ", m: "Yes! They usually upload it within 24h", c: "text-purple-400" },
    { u: "CodeNinja", m: "That useMemo example is exactly what I needed", c: "text-green-400" },
    { u: "TechLead", m: "Does memoizing the array actually prevent the re-render if props change?", c: "text-orange-400" },
    { u: "DevGuy", m: "I think it only does a shallow compare", c: "text-blue-400" },
];

export default function SessionViewer() {
    const params = useParams();
    const [session, setSession] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [chatMsg, setChatMsg] = useState("");
    const [chatMessages, setChatMessages] = useState(MOCK_CHAT);

    useEffect(() => {
        const fetchSession = async () => {
            try {
                const data = await apiFetch(`/sessions/${params.id}`);
                setSession(data);
            } catch {
                // Fallback mock session
                setSession({
                    title: "React Performance Deep Dive",
                    subtitle: "Advanced Frontend Architecture Series",
                    hostId: { name: "Arjun Mehta" },
                    attendees: Array(1204).fill(null),
                    status: "live",
                    meetingLink: "#",
                });
            } finally {
                setLoading(false);
            }
        };
        if (params.id) fetchSession();
    }, [params.id]);

    const sendMessage = (e: React.FormEvent) => {
        e.preventDefault();
        if (!chatMsg.trim()) return;
        setChatMessages((prev) => [...prev, { u: "Me", m: chatMsg, c: "text-primary" }]);
        setChatMsg("");
    };

    if (loading) {
        return (
            <div className="h-screen bg-background flex items-center justify-center">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
        );
    }

    const hostName = session?.hostId?.name || "Host";
    const hostInitials = hostName.split(" ").map((n: string) => n[0]).join("");
    const attendeeCount = session?.attendees?.length || 0;

    return (
        <div className="h-screen bg-background flex flex-col overflow-hidden">
            <Navbar />
            <div className="flex-1 flex max-w-[1800px] w-full mx-auto overflow-hidden">
                {/* Main Video Area */}
                <div className="flex-1 lg:w-3/4 flex flex-col min-w-0 bg-black relative border-r border-border/40">
                    <div className="flex-1 relative flex items-center justify-center overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-br from-indigo-900 via-slate-900 to-black pointer-events-none" />

                        {/* Speaker PiP */}
                        <div className="absolute bottom-6 right-6 w-64 aspect-video bg-zinc-800 rounded-lg border-2 border-white/10 shadow-2xl overflow-hidden flex items-center justify-center z-10">
                            <div className="text-xs text-white/50 absolute bottom-2 left-2 font-mono">{hostName}</div>
                            <Avatar className="w-12 h-12 border-2 border-primary">
                                <AvatarFallback className="bg-primary/20 text-white">{hostInitials}</AvatarFallback>
                            </Avatar>
                        </div>

                        {/* Shared screen */}
                        <div className="w-[85%] aspect-video bg-gray-900 border border-white/10 rounded-lg shadow-2xl z-0 flex flex-col overflow-hidden relative">
                            <div className="h-8 bg-zinc-950 flex items-center px-4 border-b border-white/5 font-mono text-[10px] text-white/40 justify-center">
                                VS Code — PerformanceDemo.tsx
                            </div>
                            <div className="flex-1 p-6 font-mono text-sm text-green-400 bg-[#1e1e1e]">
                                <span className="text-pink-400">import</span> React, {`{ memo, useMemo }`} <span className="text-pink-400">from</span> <span className="text-yellow-300">'react'</span>;<br /><br />
                                <span className="text-blue-400">const</span> HeavyComponent = memo((<span className="text-orange-300">{`{ data }`}</span>) {`=>`} {`{`}<br />
                                &nbsp;&nbsp;<span className="text-blue-400">const</span> processed = useMemo({`() =>`} {`{`}<br />
                                &nbsp;&nbsp;&nbsp;&nbsp;<span className="text-gray-500">// Expensive calculation...</span><br />
                                &nbsp;&nbsp;&nbsp;&nbsp;<span className="text-pink-400">return</span> data.map(item {`=>`} item * 2);<br />
                                &nbsp;&nbsp;{`}`}, [data]);<br /><br />
                                &nbsp;&nbsp;<span className="text-pink-400">return</span> <span className="text-gray-300">&lt;div&gt;</span>...<span className="text-gray-300">&lt;/div&gt;</span>;<br />
                                {`}`});
                            </div>
                        </div>

                        {/* Live indicators */}
                        <div className="absolute top-6 left-6 flex items-center gap-3 z-10">
                            <Badge className="bg-red-500 hover:bg-red-600 text-white border-transparent gap-1.5 uppercase font-bold tracking-wider pt-1">
                                <div className="w-2 h-2 rounded-full bg-white animate-pulse" /> Live
                            </Badge>
                            <Badge variant="outline" className="bg-black/50 backdrop-blur-md border-white/10 text-white">
                                <Users className="w-3.5 h-3.5 mr-1" /> {attendeeCount.toLocaleString()}
                            </Badge>
                        </div>
                    </div>

                    {/* Controls bar */}
                    <div className="h-20 bg-zinc-950 border-t border-white/10 px-6 flex items-center justify-between shrink-0">
                        <div>
                            <h2 className="text-white font-semibold text-lg">{session?.title}</h2>
                            <p className="text-white/60 text-sm">{session?.subtitle || "Live Coding Session"}</p>
                        </div>
                        <div className="flex items-center gap-3">
                            {[Hand, Share2, Settings, Maximize].map((Icon, i) => (
                                <Button key={i} variant="ghost" size="icon" className="text-white/70 hover:text-white hover:bg-white/10 rounded-full h-10 w-10">
                                    <Icon className="w-5 h-5" />
                                </Button>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Sidebar Chat */}
                <div className="w-80 lg:w-96 bg-card flex flex-col shrink-0 hidden md:flex">
                    <div className="flex items-center gap-6 px-6 pt-4 border-b border-border/40 text-sm font-medium shrink-0">
                        <button className="pb-3 border-b-2 border-primary text-foreground">Live Chat</button>
                        <button className="pb-3 border-b-2 border-transparent text-muted-foreground hover:text-foreground transition-colors">Resources</button>
                        <button className="pb-3 border-b-2 border-transparent text-muted-foreground hover:text-foreground transition-colors">Q&A</button>
                    </div>

                    <div className="flex-1 overflow-y-auto p-4 space-y-4">
                        {chatMessages.map((msg, i) => (
                            <div key={i} className="flex items-start gap-2.5 text-sm leading-snug">
                                <Avatar className="w-6 h-6 shrink-0 border border-border/40 mt-0.5">
                                    <AvatarFallback className="text-[10px] bg-muted">{msg.u.slice(0, 2)}</AvatarFallback>
                                </Avatar>
                                <div>
                                    <span className={`font-semibold mr-2 ${msg.c}`}>{msg.u}</span>
                                    <span className="text-foreground">{msg.m}</span>
                                </div>
                            </div>
                        ))}
                    </div>

                    <form onSubmit={sendMessage} className="p-4 border-t border-border/40 bg-card/50 shrink-0">
                        <div className="flex items-center gap-2">
                            <Avatar className="w-8 h-8 shrink-0 border border-border/40">
                                <AvatarFallback className="text-xs bg-primary/20 text-primary">ME</AvatarFallback>
                            </Avatar>
                            <Input
                                value={chatMsg}
                                onChange={(e) => setChatMsg(e.target.value)}
                                placeholder="Send a message..."
                                className="flex-1 rounded-full bg-muted/50"
                            />
                            <Button type="submit" size="icon" className="w-9 h-9 shrink-0 rounded-full bg-primary hover:bg-primary/90">
                                <Send className="w-4 h-4" />
                            </Button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
