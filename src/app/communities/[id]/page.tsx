"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { ArrowLeft, Users, MessageSquare, Heart, Share2, MoreHorizontal, Pin, Globe, Search, Filter, Hash, UserCheck, Flame, Info, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import Navbar from "@/components/layout/Navbar";
import { apiFetch } from "@/lib/api";
import CommunityChat from "@/components/chat/CommunityChat";

export default function CommunityPage() {
    const { id } = useParams();
    const [community, setCommunity] = useState<any>(null);
    const [user, setUser] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        const fetchData = async () => {
            try {
                const [commData, userData] = await Promise.all([
                    apiFetch(`/communities/${id}`),
                    apiFetch('/auth/profile')
                ]);
                setCommunity(commData);
                setUser(userData);
            } catch (error) {
                console.error("Failed to fetch community data:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [id]);

    const posts = [
        {
            id: 1,
            author: "Alex Morgan",
            avatar: "AM",
            role: "Maintainer",
            time: "2h ago",
            title: "Best practices for scaling Node.js applications in 2026?",
            content: "I've been working on a monolithic Node/Express backend that's starting to show its limits under heavy concurrent load. We're considering migrating to a microservices architecture using NestJS or Go. What have your experiences been? Any specific caching strategies you recommend before a full rewrite?",
            likes: 128,
            comments: 45,
            pinned: true,
            tags: ["Architecture", "Node.js", "Scaling"],
        },
        // ... rest of posts
    ];

    if (loading) {
        return (
            <div className="min-h-screen bg-background flex flex-col">
                <Navbar />
                <div className="flex-1 flex items-center justify-center">
                    <Loader2 className="w-8 h-8 animate-spin text-primary" />
                </div>
            </div>
        );
    }

    if (!community) return null;

    return (
        <div className="min-h-screen bg-background flex flex-col">
            <Navbar />

            {/* Community Banner & Header */}
            <div className="bg-muted/30 border-b border-border/40 pb-6 pt-24 relative overflow-hidden">
                <div className="absolute inset-0 bg-blue-500/5 pointer-events-none" />
                <div className="max-w-6xl mx-auto px-4 relative z-10">
                    <Link href="/communities" className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-6 transition-colors">
                        <ArrowLeft className="w-4 h-4 mr-1" /> Back to Communities
                    </Link>

                    <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
                        <div className="flex gap-4 items-start">
                            <div className="w-20 h-20 rounded-2xl bg-blue-500/10 border border-blue-500/20 flex flex-col items-center justify-center text-blue-400 font-bold text-2xl shrink-0 uppercase">
                                {community.name.substring(0, 2)}
                            </div>
                            <div>
                                <div className="flex items-center gap-2 mb-1">
                                    <h1 className="text-3xl font-bold tracking-tight">{community.name}</h1>
                                    <Badge variant="outline" className="border-border/60 text-muted-foreground bg-background"><Globe className="w-3 h-3 mr-1" /> Public</Badge>
                                </div>
                                <p className="text-muted-foreground max-w-xl mb-4 text-sm leading-relaxed">
                                    {community.description}
                                </p>
                                <div className="flex items-center gap-4 text-sm font-medium">
                                    <span className="flex items-center gap-1.5"><Users className="w-4 h-4 text-muted-foreground" /> {community.members.length} Members</span>
                                    <span className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-green-500" /> Live Chat Active</span>
                                </div>
                            </div>
                        </div>

                        <div className="flex gap-2 w-full md:w-auto shrink-0">
                            <Button variant="outline" className="gap-2 border-border/60"><Info className="w-4 h-4" /> About</Button>
                            <Button className="gap-2" variant="secondary"><UserCheck className="w-4 h-4" /> Joined</Button>
                        </div>
                    </div>
                </div>
            </div>

            <div className="flex-1 max-w-6xl mx-auto w-full px-4 py-8 grid lg:grid-cols-3 gap-8">

                {/* Main Feed */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Post Composer Box */}
                    <div className="border border-border/40 bg-card/50 rounded-xl p-4 flex gap-4">
                        <Avatar className="w-10 h-10 border border-border/40">
                            <AvatarFallback className="bg-primary/10 text-primary">ME</AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                            <Input placeholder="Share something with the community..." className="bg-muted/30 border-border/40 h-10 mb-3" />
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-1">
                                    <Button variant="ghost" size="sm" className="h-8 text-muted-foreground"><MessageSquare className="w-4 h-4 mr-1.5" /> Topic</Button>
                                </div>
                                <Button size="sm" className="bg-primary text-primary-foreground">Post</Button>
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center justify-between border-b border-border/40 pb-2">
                        <div className="flex gap-4 text-sm font-medium">
                            <button className="text-foreground border-b-2 border-primary pb-2">Recent</button>
                            <button className="text-muted-foreground hover:text-foreground pb-2 transition-colors flex items-center gap-1"><Flame className="w-3.5 h-3.5" /> Trending</button>
                        </div>
                        <Button variant="ghost" size="sm" className="h-8 text-muted-foreground gap-1"><Filter className="w-4 h-4" /> Filter</Button>
                    </div>

                    {/* Posts List */}
                    <div className="space-y-4">
                        {posts.map(post => (
                            <div key={post.id} className={`border ${post.pinned ? 'border-primary/30 bg-primary/5' : 'border-border/40 bg-card/50'} rounded-xl p-5 hover:border-border/80 transition-colors cursor-pointer`}>
                                {post.pinned && (
                                    <div className="flex items-center gap-1.5 text-xs font-medium text-primary mb-3">
                                        <Pin className="w-3.5 h-3.5" /> Pinned by Admins
                                    </div>
                                )}
                                <div className="flex items-start justify-between mb-3">
                                    <div className="flex items-center gap-3">
                                        <Avatar className="w-9 h-9 border border-border/40">
                                            <AvatarFallback className="text-xs bg-accent text-accent-foreground">{post.avatar}</AvatarFallback>
                                        </Avatar>
                                        <div>
                                            <div className="flex items-center gap-2">
                                                <span className="font-medium text-sm hover:underline">{post.author}</span>
                                                {post.role === 'Maintainer' && <Badge variant="secondary" className="text-[9px] h-4 px-1 bg-blue-500/10 text-blue-400 hover:bg-blue-500/20">{post.role}</Badge>}
                                            </div>
                                            <div className="text-xs text-muted-foreground">{post.time}</div>
                                        </div>
                                    </div>
                                    <Button variant="ghost" size="icon" className="w-8 h-8 opacity-0 hover:opacity-100 group-hover:opacity-100 transition-opacity"><MoreHorizontal className="w-4 h-4" /></Button>
                                </div>

                                <h3 className="text-lg font-bold mb-2 leading-snug">{post.title}</h3>
                                <p className="text-sm text-muted-foreground line-clamp-3 mb-4 leading-relaxed">
                                    {post.content}
                                </p>

                                <div className="flex flex-wrap gap-2 mb-4">
                                    {post.tags.map(tag => (
                                        <Badge variant="outline" key={tag} className="text-xs font-normal border-border/60 bg-muted/20">
                                            {tag}
                                        </Badge>
                                    ))}
                                </div>

                                <Separator className="bg-border/40 mb-3" />

                                <div className="flex items-center gap-4 text-muted-foreground">
                                    <button className="flex items-center gap-1.5 text-sm font-medium hover:text-foreground transition-colors">
                                        <Heart className="w-4 h-4" /> {post.likes}
                                    </button>
                                    <button className="flex items-center gap-1.5 text-sm font-medium hover:text-foreground transition-colors">
                                        <MessageSquare className="w-4 h-4" /> {post.comments}
                                    </button>
                                    <button className="flex items-center gap-1.5 text-sm font-medium hover:text-foreground transition-colors ml-auto">
                                        <Share2 className="w-4 h-4" /> Share
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Sidebar */}
                <div className="space-y-6">
                    {/* Real-time Discord-style Chat */}
                    {user && (
                        <CommunityChat
                            communityId={id as string}
                            userId={user._id || user.id}
                        />
                    )}

                    <div className="border border-border/40 bg-card/50 rounded-xl p-5">
                        <h3 className="font-semibold mb-4">Popular Tags</h3>
                        <div className="flex flex-wrap gap-2">
                            {["React", "Node.js", "Architecture", "Help", "Showcase", "Tutorial", "Job Board"].map(tag => (
                                <button key={tag} className="flex items-center gap-1 text-xs font-medium px-2 py-1.5 rounded-md bg-muted/50 hover:bg-muted text-muted-foreground hover:text-foreground transition-colors border border-border/40">
                                    <Hash className="w-3 h-3" /> {tag}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="border border-border/40 bg-card/50 rounded-xl p-5">
                        <h3 className="font-semibold mb-4 text-sm flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" /> Live Now
                        </h3>
                        <div className="p-3 border border-border/60 rounded-lg bg-muted/20 hover:border-border/80 transition-colors cursor-pointer group">
                            <div className="text-xs font-medium text-primary mb-1">Q&A Session</div>
                            <div className="text-sm font-medium group-hover:text-primary transition-colors mb-2">Frontend system design interview prep</div>
                            <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                <Users className="w-3.5 h-3.5" /> 124 watching
                            </div>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
}
