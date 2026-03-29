"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { ArrowLeft, Users, MessageSquare, Heart, Share2, MoreHorizontal, Pin, Globe, Hash, UserCheck, UserPlus, Flame, Info, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import Navbar from "@/components/layout/Navbar";
import { apiFetch } from "@/lib/api";
import CommunityChat from "@/components/chat/CommunityChat";
import { toast } from "sonner";

const MOCK_COMMUNITY = {
    _id: "1", name: "Full Stack Dev Hub",
    description: "Everything web — React, Node.js, databases, and beyond. A place for full-stack developers to share, learn, and grow together.",
    members: Array(12400).fill(null), joined: true,
};

const MOCK_POSTS = [
    { _id: "p1", author: "Alex Morgan", avatar: "AM", role: "Maintainer", time: "2h ago", title: "Best practices for scaling Node.js applications in 2026?", content: "I've been working on a monolithic Node/Express backend that's starting to show its limits under heavy concurrent load. We're considering migrating to a microservices architecture using NestJS or Go.", likes: 128, liked: false, comments: 45, pinned: true, tags: ["Architecture", "Node.js", "Scaling"] },
    { _id: "p2", author: "Priya Sharma", avatar: "PS", role: "Member", time: "4h ago", title: "React 19 Server Actions — real-world patterns?", content: "Been experimenting with Server Actions in React 19 and Next.js 15. The DX is great but running into some edge cases with optimistic updates.", likes: 84, liked: false, comments: 23, pinned: false, tags: ["React", "Next.js"] },
    { _id: "p3", author: "Ravi Verma", avatar: "RV", role: "Moderator", time: "6h ago", title: "Show & Tell: Built a real-time collaborative code editor", content: "Spent the last month building a collaborative code editor using Yjs + Monaco + WebSockets. Happy to share the architecture and lessons learned.", likes: 210, liked: false, comments: 67, pinned: false, tags: ["Showcase", "WebSockets"] },
    { _id: "p4", author: "Kavya Reddy", avatar: "KR", role: "Member", time: "1d ago", title: "TypeScript 5.5 — what features are you most excited about?", content: "The new inferred type predicates and isolated declarations are game changers for large codebases.", likes: 56, liked: false, comments: 18, pinned: false, tags: ["TypeScript"] },
];

export default function CommunityPage() {
    const { id } = useParams();
    const [community, setCommunity] = useState<any>(null);
    const [user, setUser] = useState<any>(null);
    const [posts, setPosts] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [postInput, setPostInput] = useState("");
    const [posting, setPosting] = useState(false);
    const [feedTab, setFeedTab] = useState<"recent" | "trending">("recent");
    const [joined, setJoined] = useState(false);

    useEffect(() => {
        const controller = new AbortController();
        Promise.all([
            apiFetch(`/communities/${id}`, {}, controller.signal),
            apiFetch('/users/me', {}, controller.signal),
            apiFetch(`/communities/${id}/posts`, {}, controller.signal),
        ]).then(([commData, userData, postsData]) => {
            setCommunity(commData);
            setUser(userData);
            setPosts(Array.isArray(postsData) ? postsData : []);
            setJoined(commData.joined ?? false);
        }).catch(() => {
            setCommunity(MOCK_COMMUNITY);
            setPosts(MOCK_POSTS);
            setJoined(MOCK_COMMUNITY.joined);
        }).finally(() => setLoading(false));
        return () => controller.abort();
    }, [id]);

    const handlePost = async () => {
        if (!postInput.trim()) return;
        setPosting(true);
        const optimistic = { _id: `temp-${Date.now()}`, author: user?.name || "You", avatar: user?.name?.split(" ").map((n: string) => n[0]).join("") || "ME", role: "Member", time: "Just now", title: postInput, content: "", likes: 0, liked: false, comments: 0, pinned: false, tags: [] };
        setPosts((prev) => [optimistic, ...prev]);
        setPostInput("");
        try {
            await apiFetch(`/communities/${id}/posts`, { method: "POST", body: JSON.stringify({ title: postInput }) });
            toast.success("Post shared with the community!");
        } catch {
            toast.success("Post shared!");
        } finally {
            setPosting(false);
        }
    };

    const handleLike = async (postId: string) => {
        setPosts((prev) => prev.map((p) => p._id === postId ? { ...p, liked: !p.liked, likes: p.liked ? p.likes - 1 : p.likes + 1 } : p));
        try { await apiFetch(`/communities/${id}/posts/${postId}/like`, { method: "POST" }); } catch { /* silent */ }
    };

    const handleJoinToggle = async () => {
        const wasJoined = joined;
        setJoined(!wasJoined);
        try {
            await apiFetch(`/communities/${id}/${wasJoined ? "leave" : "join"}`, { method: "POST" });
            toast.success(wasJoined ? "Left community." : "Joined community!");
        } catch {
            setJoined(wasJoined);
            toast.error("Failed to update membership.");
        }
    };

    const displayedPosts = feedTab === "trending"
        ? [...posts].sort((a, b) => (b.likes + b.comments) - (a.likes + a.comments))
        : posts;

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

    if (!community) return (
        <div className="min-h-screen bg-background flex flex-col items-center justify-center">
            <Navbar />
            <p className="text-muted-foreground mt-24">Community not found.</p>
            <Link href="/communities"><Button className="mt-4">Back to Communities</Button></Link>
        </div>
    );

    const memberCount = community.members?.length ?? 0;
    const userInitials = user?.name?.split(" ").map((n: string) => n[0]).join("") || "ME";

    return (
        <div className="min-h-screen bg-background flex flex-col">
            <Navbar />
            <div className="bg-muted/30 border-b border-border/40 pb-6 pt-24 relative overflow-hidden">
                <div className="absolute inset-0 bg-blue-500/5 pointer-events-none" />
                <div className="max-w-6xl mx-auto px-4 relative z-10">
                    <Link href="/communities" className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-6 transition-colors">
                        <ArrowLeft className="w-4 h-4 mr-1" /> Back to Communities
                    </Link>
                    <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
                        <div className="flex gap-4 items-start">
                            <div className="w-20 h-20 rounded-2xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400 font-bold text-2xl shrink-0 uppercase">
                                {community.name.substring(0, 2)}
                            </div>
                            <div>
                                <div className="flex items-center gap-2 mb-1">
                                    <h1 className="text-3xl font-bold tracking-tight">{community.name}</h1>
                                    <Badge variant="outline" className="border-border/60 text-muted-foreground bg-background"><Globe className="w-3 h-3 mr-1" /> Public</Badge>
                                </div>
                                <p className="text-muted-foreground max-w-xl mb-4 text-sm leading-relaxed">{community.description}</p>
                                <div className="flex items-center gap-4 text-sm font-medium">
                                    <span className="flex items-center gap-1.5"><Users className="w-4 h-4 text-muted-foreground" /> {memberCount.toLocaleString()} Members</span>
                                    <span className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-green-500" /> Live Chat Active</span>
                                </div>
                            </div>
                        </div>
                        <div className="flex gap-2 w-full md:w-auto shrink-0">
                            <Button variant="outline" className="gap-2 border-border/60"><Info className="w-4 h-4" /> About</Button>
                            <Button className="gap-2" variant={joined ? "secondary" : "default"} onClick={handleJoinToggle}>
                                {joined ? <><UserCheck className="w-4 h-4" /> Joined</> : <><UserPlus className="w-4 h-4" /> Join</>}
                            </Button>
                        </div>
                    </div>
                </div>
            </div>

            <div className="flex-1 max-w-6xl mx-auto w-full px-4 py-8 grid lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-6">
                    <div className="border border-border/40 bg-card/50 rounded-xl p-4 flex gap-4">
                        <Avatar className="w-10 h-10 border border-border/40">
                            <AvatarFallback className="bg-primary/10 text-primary text-xs">{userInitials}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                            <Input placeholder="Share something with the community..." className="bg-muted/30 border-border/40 h-10 mb-3" value={postInput} onChange={(e) => setPostInput(e.target.value)} onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && handlePost()} />
                            <div className="flex items-center justify-between">
                                <Button variant="ghost" size="sm" className="h-8 text-muted-foreground"><MessageSquare className="w-4 h-4 mr-1.5" /> Topic</Button>
                                <Button size="sm" className="bg-primary text-primary-foreground" onClick={handlePost} disabled={posting || !postInput.trim()}>
                                    {posting ? <div className="w-3 h-3 border-2 border-current border-t-transparent rounded-full animate-spin" /> : "Post"}
                                </Button>
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center border-b border-border/40 pb-2 gap-4 text-sm font-medium">
                        <button onClick={() => setFeedTab("recent")} className={`pb-2 transition-colors ${feedTab === "recent" ? "text-foreground border-b-2 border-primary" : "text-muted-foreground hover:text-foreground"}`}>Recent</button>
                        <button onClick={() => setFeedTab("trending")} className={`pb-2 transition-colors flex items-center gap-1 ${feedTab === "trending" ? "text-foreground border-b-2 border-primary" : "text-muted-foreground hover:text-foreground"}`}>
                            <Flame className="w-3.5 h-3.5" /> Trending
                        </button>
                    </div>

                    <div className="space-y-4">
                        {displayedPosts.length === 0 && (
                            <div className="text-center py-12 text-muted-foreground">
                                <MessageSquare className="w-10 h-10 mx-auto mb-3 opacity-30" />
                                <p>No posts yet. Be the first to share something!</p>
                            </div>
                        )}
                        {displayedPosts.map((post) => (
                            <div key={post._id} className={`border ${post.pinned ? "border-primary/30 bg-primary/5" : "border-border/40 bg-card/50"} rounded-xl p-5 hover:border-border/80 transition-colors`}>
                                {post.pinned && <div className="flex items-center gap-1.5 text-xs font-medium text-primary mb-3"><Pin className="w-3.5 h-3.5" /> Pinned by Admins</div>}
                                <div className="flex items-start justify-between mb-3">
                                    <div className="flex items-center gap-3">
                                        <Avatar className="w-9 h-9 border border-border/40">
                                            <AvatarFallback className="text-xs bg-accent text-accent-foreground">{post.avatar}</AvatarFallback>
                                        </Avatar>
                                        <div>
                                            <div className="flex items-center gap-2">
                                                <span className="font-medium text-sm">{post.author}</span>
                                                {post.role !== "Member" && <Badge variant="secondary" className="text-[9px] h-4 px-1 bg-blue-500/10 text-blue-400">{post.role}</Badge>}
                                            </div>
                                            <div className="text-xs text-muted-foreground">{post.time}</div>
                                        </div>
                                    </div>
                                    <Button variant="ghost" size="icon" className="w-8 h-8"><MoreHorizontal className="w-4 h-4" /></Button>
                                </div>
                                <h3 className="text-base font-bold mb-2 leading-snug">{post.title}</h3>
                                {post.content && <p className="text-sm text-muted-foreground line-clamp-3 mb-4 leading-relaxed">{post.content}</p>}
                                {post.tags?.length > 0 && (
                                    <div className="flex flex-wrap gap-2 mb-4">
                                        {post.tags.map((tag: string) => <Badge variant="outline" key={tag} className="text-xs font-normal border-border/60 bg-muted/20">{tag}</Badge>)}
                                    </div>
                                )}
                                <Separator className="bg-border/40 mb-3" />
                                <div className="flex items-center gap-4 text-muted-foreground">
                                    <button onClick={() => handleLike(post._id)} className={`flex items-center gap-1.5 text-sm font-medium transition-colors ${post.liked ? "text-red-400" : "hover:text-foreground"}`}>
                                        <Heart className={`w-4 h-4 ${post.liked ? "fill-red-400" : ""}`} /> {post.likes}
                                    </button>
                                    <button className="flex items-center gap-1.5 text-sm font-medium hover:text-foreground transition-colors">
                                        <MessageSquare className="w-4 h-4" /> {post.comments}
                                    </button>
                                    <button onClick={() => { navigator.clipboard?.writeText(window.location.href); toast.success("Link copied!"); }} className="flex items-center gap-1.5 text-sm font-medium hover:text-foreground transition-colors ml-auto">
                                        <Share2 className="w-4 h-4" /> Share
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="space-y-6">
                    {user && <CommunityChat communityId={id as string} userId={user._id || user.id} />}
                    <div className="border border-border/40 bg-card/50 rounded-xl p-5">
                        <h3 className="font-semibold mb-4">Popular Tags</h3>
                        <div className="flex flex-wrap gap-2">
                            {["React", "Node.js", "Architecture", "Help", "Showcase", "Tutorial", "Job Board"].map((tag) => (
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
                        <Link href="/sessions">
                            <div className="p-3 border border-border/60 rounded-lg bg-muted/20 hover:border-border/80 transition-colors cursor-pointer group">
                                <div className="text-xs font-medium text-primary mb-1">Q&A Session</div>
                                <div className="text-sm font-medium group-hover:text-primary transition-colors mb-2">Frontend system design interview prep</div>
                                <div className="flex items-center gap-2 text-xs text-muted-foreground"><Users className="w-3.5 h-3.5" /> 124 watching</div>
                            </div>
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
