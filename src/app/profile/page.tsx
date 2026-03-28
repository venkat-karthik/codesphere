"use client";

import { useState, useEffect } from "react";import {
    MapPin,
    Link as LinkIcon,
    Calendar,
    Github,
    Twitter,
    Layers,
    BookOpen,
    Star,
    MessageSquare,
    Trophy,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { apiFetch } from "@/lib/api";
import { toast } from "sonner";
import Navbar from "@/components/layout/Navbar";

export default function ProfilePage() {
    const [user, setUser] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const data = await apiFetch('/users/me');
                setUser(data);
            } catch (error) {
                console.error("Failed to fetch profile:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchProfile();
    }, []);

    if (loading) {
        return (
            <div className="min-h-screen bg-background flex flex-col items-center justify-center">
                <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mb-4" />
                <p className="text-muted-foreground animate-pulse">Loading profile...</p>
            </div>
        );
    }

    // Default mock data for missing fields
    const profile = {
        name: user?.name || "CodeSphere User",
        email: user?.email || "user@codesphere.io",
        handle: user?.username || user?.email?.split('@')[0] || "user",
        avatar: user?.name?.split(' ').map((n: string) => n[0]).join('').toUpperCase() || "CU",
        bio: user?.bio || "CodeSphere learner and developer. Passionate about building the future of the web.",
        location: user?.location || "Global",
        website: user?.website || "",
        joinedDate: user?.createdAt ? new Date(user.createdAt).toLocaleDateString('en-US', { month: 'long', year: 'numeric' }) : "March 2026",
        skills: user?.skills?.length ? user.skills : ["React", "TypeScript", "Next.js", "Node.js", "Tailwind CSS"],
        following: user?.following ?? 142,
        followers: user?.followers ?? 1200,
    };

    const [activeTab, setActiveTab] = useState("overview");

    return (
        <div className="min-h-screen bg-background flex flex-col">
            <Navbar />

            {/* Profile Header Block */}
            <div className="bg-muted/30 border-b border-border/40 pt-24 pb-8">
                <div className="max-w-5xl mx-auto px-4 flex flex-col md:flex-row gap-8 items-start">
                    <div className="w-32 h-32 rounded-3xl bg-primary/20 flex flex-col items-center justify-center text-primary text-4xl font-bold border-4 border-background shadow-xl shrink-0 -mt-8 md:mt-0 relative z-10 font-mono">
                        {profile.avatar}
                    </div>
                    <div className="flex-1 mt-2">
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                            <div>
                                <h1 className="text-3xl font-bold tracking-tight">{profile.name}</h1>
                                <p className="text-muted-foreground font-mono text-sm mt-1">@{profile.handle}</p>
                            </div>
                            <div className="flex gap-2">
                                <Button variant="outline" onClick={() => toast.info("Direct messaging coming soon")}>Message</Button>
                                <Button className="bg-primary text-primary-foreground" onClick={() => toast.success(`You are now following ${profile.name}`)}>Follow</Button>
                            </div>
                        </div>

                        <p className="max-w-xl text-sm leading-relaxed mt-4">
                            {profile.bio}
                        </p>

                        <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground mt-4">
                            <span className="flex items-center gap-1.5"><MapPin className="w-4 h-4" /> {profile.location}</span>
                            <span className="flex items-center gap-1.5"><LinkIcon className="w-4 h-4" /> <a className="hover:text-primary transition-colors" href="#">{profile.handle}.dev</a></span>
                            <span className="flex items-center gap-1.5"><Calendar className="w-4 h-4" /> Joined {profile.joinedDate}</span>
                        </div>

                        <div className="flex gap-4 mt-6">
                            <div className="text-sm"><span className="font-bold text-foreground">{profile.following.toLocaleString()}</span> <span className="text-muted-foreground">Following</span></div>
                            <div className="text-sm"><span className="font-bold text-foreground">{profile.followers.toLocaleString()}</span> <span className="text-muted-foreground">Followers</span></div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="flex-1 max-w-5xl mx-auto w-full px-4 py-8 grid md:grid-cols-[1fr_300px] gap-8">
                {/* Main Content */}
                <div className="space-y-8">
                    <div className="flex items-center gap-6 border-b border-border/40 pb-2 text-sm font-medium">
                        <button onClick={() => setActiveTab("overview")} className={`pb-2 transition-colors ${activeTab === "overview" ? "text-foreground border-b-2 border-primary" : "text-muted-foreground hover:text-foreground"}`}>Overview</button>
                        <button onClick={() => setActiveTab("activity")} className={`pb-2 transition-colors ${activeTab === "activity" ? "text-foreground border-b-2 border-primary" : "text-muted-foreground hover:text-foreground"}`}>Activity</button>
                        <button onClick={() => setActiveTab("certificates")} className={`pb-2 transition-colors ${activeTab === "certificates" ? "text-foreground border-b-2 border-primary" : "text-muted-foreground hover:text-foreground"}`}>Certificates ({user?.certificates?.length ?? 3})</button>
                    </div>

                    {activeTab === "overview" && (
                        <div className="space-y-8">
                        <div>
                        <h3 className="font-semibold text-lg flex items-center gap-2 mb-4"><Star className="w-5 h-5 text-yellow-500" /> Top OSS Contributions</h3>
                        <div className="grid sm:grid-cols-2 gap-4">
                            {[1, 2].map(i => (
                                <Card key={i} className="border-border/40 bg-card/50">
                                    <CardContent className="p-4">
                                        <div className="flex items-center gap-2 mb-2">
                                            <BookOpen className="w-4 h-4 text-muted-foreground" />
                                            <span className="font-medium text-sm text-primary hover:underline cursor-pointer">codesphere / core-engine</span>
                                        </div>
                                        <p className="text-xs text-muted-foreground mb-3">Refactored authentication hooks to use server components and middleware.</p>
                                        <div className="flex items-center gap-3 text-xs text-muted-foreground">
                                            <span className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-blue-400" /> TypeScript</span>
                                            <span className="flex items-center gap-1"><Star className="w-3 h-3" /> 1.4k</span>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                        </div>
                        <Separator className="bg-border/40" />
                        <div>
                        <h3 className="font-semibold text-lg flex items-center gap-2 mb-4"><Layers className="w-5 h-5 text-blue-500" /> Learning Progress</h3>
                        <div className="space-y-3">
                            <div className="flex items-center justify-between p-3 rounded-lg border border-border/40 bg-card/50">
                                <div className="text-sm font-medium">Full Stack Next.js & Node</div>
                                <Badge className="bg-blue-500/20 text-blue-400 border-none px-2 h-5 text-[10px]">12% Complete</Badge>
                            </div>
                            <div className="flex items-center justify-between p-3 rounded-lg border border-border/40 bg-card/50">
                                <div className="text-sm font-medium">Docker Fundamentals</div>
                                <Badge className="bg-green-500/20 text-green-400 border-none px-2 h-5 text-[10px]">100% Complete</Badge>
                            </div>
                        </div>
                        </div>
                        </div>
                    )}

                    {activeTab === "activity" && (
                        <div className="text-center py-12 text-muted-foreground">
                            <MessageSquare className="w-10 h-10 mx-auto mb-3 opacity-30" />
                            <p>Activity feed coming soon.</p>
                        </div>
                    )}

                    {activeTab === "certificates" && (
                        <div className="text-center py-12 text-muted-foreground">
                            <Trophy className="w-10 h-10 mx-auto mb-3 opacity-30" />
                            <p>Certificates will appear here once you complete learning paths.</p>
                        </div>
                    )}
                </div>
                <div className="space-y-6">
                    <div className="border border-border/40 bg-card/50 rounded-xl p-5 space-y-4">
                        <h3 className="font-semibold text-sm flex items-center gap-2">
                            <Star className="w-4 h-4 text-yellow-500" /> Achievements & Badges
                        </h3>
                        {user?.achievements?.length > 0 ? (
                            <div className="space-y-3">
                                {user.achievements.map((ach: any, idx: number) => (
                                    <div key={idx} className="flex items-center gap-3 p-2 rounded-lg bg-muted/20 border border-border/40">
                                        <div className="w-10 h-10 rounded-full bg-yellow-500/10 flex items-center justify-center">
                                            <Trophy className="w-5 h-5 text-yellow-500" />
                                        </div>
                                        <div>
                                            <div className="text-xs font-bold">{ach.title}</div>
                                            <div className="text-[10px] text-muted-foreground">{new Date(ach.date).toLocaleDateString()}</div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className="text-[10px] text-muted-foreground italic">No achievements yet. Complete tests to earn badges!</p>
                        )}
                    </div>

                    <div className="border border-border/40 bg-card/50 rounded-xl p-5 space-y-4">
                        <h3 className="font-semibold text-sm">Skills</h3>
                        <div className="flex flex-wrap gap-2">
                            {profile.skills.map((skill: string) => (
                                <Badge key={skill} variant="outline" className="border-border/60 bg-muted/30 font-normal">{skill}</Badge>
                            ))}
                        </div>
                    </div>

                    <div className="border border-border/40 bg-card/50 rounded-xl p-5 space-y-4">
                        <h3 className="font-semibold text-sm">Social Links</h3>
                        <div className="space-y-3 text-sm text-muted-foreground">
                            <a href="#" className="flex items-center gap-2 hover:text-foreground transition-colors"><Github className="w-4 h-4" /> GitHub</a>
                            <a href="#" className="flex items-center gap-2 hover:text-foreground transition-colors"><Twitter className="w-4 h-4" /> Twitter</a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
