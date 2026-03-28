"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
    Code2,
    FolderDot,
    Users,
    GitBranch,
    Search,
    Plus,
    ArrowRight,
    MoreVertical,
    Activity,
    Lock,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import Navbar from "@/components/layout/Navbar";
import { apiFetch } from "@/lib/api";

const MOCK_PROJECTS = [
    { _id: "proj-1", name: "CodeSphere OSS", description: "Open source contributions to the main platform.", members: Array(142).fill(null), tasks: 24, tags: ["Next.js", "TypeScript"], isPublic: true, lastActive: "2 hours ago" },
    { _id: "proj-2", name: "Next.js E-Commerce Headless", description: "Building a scalable storefront with Tailwind and MedusaJS.", members: Array(12).fill(null), tasks: 8, tags: ["React", "Stripe"], isPublic: true, lastActive: "5 hours ago" },
    { _id: "proj-3", name: "AI Study Group", description: "Private workspace for the Advanced ML Study Cohort.", members: Array(5).fill(null), tasks: 2, tags: ["Python", "PyTorch"], isPublic: false, lastActive: "1 day ago" },
];

export default function CodexPage() {
    const [projects, setProjects] = useState<any[]>([]);
    const [search, setSearch] = useState("");
    const [filter, setFilter] = useState("all");
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        apiFetch("/codex").then((data) => setProjects(Array.isArray(data) ? data : [])).catch(() => setProjects(MOCK_PROJECTS)).finally(() => setLoading(false));
    }, []);

    const filtered = projects.filter((p) => {
        const matchSearch = p.name.toLowerCase().includes(search.toLowerCase()) || p.tags?.some((t: string) => t.toLowerCase().includes(search.toLowerCase()));
        const matchFilter = filter === "all" || (filter === "public" ? p.isPublic : !p.isPublic);
        return matchSearch && matchFilter;
    });

    return (
        <div className="min-h-screen bg-background flex flex-col">
            <Navbar />

            <div className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-24">
                {/* Header Section */}
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12 border-b border-border/40 pb-8">
                    <div className="max-w-2xl">
                        <Badge className="badge-gradient text-xs mb-4">Virtual Codex</Badge>
                        <h1 className="text-4xl font-bold tracking-tight mb-4">
                            Collaborative Project <span className="gradient-text">Workspaces</span>
                        </h1>
                        <p className="text-muted-foreground text-lg">
                            Join open-source projects, collaborate with your team, and build real-world applications together in shared workspaces.
                        </p>
                    </div>
                    <div className="flex items-center gap-3 shrink-0">
                        <Button variant="outline" className="gap-2 h-11">
                            <FolderDot className="w-4 h-4" /> My Projects
                        </Button>
                        <Link href="/codex/new">
                            <Button className="gap-2 h-11 bg-primary hover:bg-primary/90">
                                <Plus className="w-4 h-4" /> New Workspace
                            </Button>
                        </Link>
                    </div>
                </div>

                {/* Search & Filter */}
                <div className="flex flex-col sm:flex-row gap-4 mb-8">
                    <div className="relative flex-1 max-w-md">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <Input
                            placeholder="Search workspaces by name or tag..."
                            className="pl-10 h-11 bg-card/50 border-border/40"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>
                    <div className="flex gap-2">
                        <Button variant={filter === "all" ? "secondary" : "ghost"} className="h-11 border border-border/40" onClick={() => setFilter("all")}>All</Button>
                        <Button variant={filter === "public" ? "secondary" : "ghost"} className="h-11 border border-border/40" onClick={() => setFilter("public")}>Public</Button>
                        <Button variant={filter === "private" ? "secondary" : "ghost"} className="h-11 border border-border/40 gap-2" onClick={() => setFilter("private")}>
                            <Lock className="w-3.5 h-3.5" /> Private
                        </Button>
                    </div>
                </div>

                {/* Project Grid */}
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filtered.map((proj) => (
                        <Card key={proj._id} className="bg-card/40 border-border/40 hover:border-border/80 hover:bg-card/60 transition-all group flex flex-col h-full">
                            <CardContent className="p-6 flex flex-col h-full">
                                <div className="flex items-start justify-between mb-4">
                                    <div className="w-12 h-12 rounded-xl bg-background border border-border/40 flex items-center justify-center shrink-0">
                                        <Code2 className="w-6 h-6 text-foreground" />
                                    </div>
                                    <Button variant="ghost" size="icon" className="w-8 h-8 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <MoreVertical className="w-4 h-4" />
                                    </Button>
                                </div>

                                <div className="mb-4">
                                    <div className="flex items-center gap-2 mb-1.5">
                                        <h3 className="font-semibold text-lg line-clamp-1 group-hover:text-primary transition-colors">{proj.name}</h3>
                                        {!proj.isPublic && <Lock className="w-3.5 h-3.5 text-muted-foreground shrink-0" />}
                                    </div>
                                    <p className="text-sm text-muted-foreground line-clamp-2">{proj.description}</p>
                                </div>

                                <div className="flex flex-wrap gap-2 mb-6">
                                    {proj.tags?.map((tag: string) => (
                                        <Badge key={tag} variant="outline" className="text-[10px] bg-background/50">{tag}</Badge>
                                    ))}
                                </div>

                                <div className="mt-auto pt-4 border-t border-border/40">
                                    <div className="flex items-center justify-between text-xs text-muted-foreground mb-4">
                                        <div className="flex items-center gap-4">
                                            <span className="flex items-center gap-1.5"><Users className="w-3.5 h-3.5" /> {proj.members?.length ?? 0}</span>
                                            <span className="flex items-center gap-1.5"><GitBranch className="w-3.5 h-3.5" /> {proj.tasks ?? 0} tasks</span>
                                        </div>
                                        <span className="flex items-center gap-1.5"><Activity className="w-3.5 h-3.5" /> {proj.lastActive || "Recently"}</span>
                                    </div>
                                    <Link href={`/codex/${proj._id}`} className="w-full">
                                        <Button variant="secondary" className="w-full gap-2 group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                                            Enter Workspace <ArrowRight className="w-4 h-4" />
                                        </Button>
                                    </Link>
                                </div>
                            </CardContent>
                        </Card>
                    ))}

                    {/* Create New Prompt Card */}
                    <Card className="bg-primary/5 border-primary/20 border-dashed hover:bg-primary/10 transition-colors flex flex-col items-center justify-center text-center p-8 min-h-[320px] cursor-pointer">
                        <div className="w-14 h-14 rounded-full bg-primary/20 flex items-center justify-center mb-4 text-primary">
                            <Plus className="w-6 h-6" />
                        </div>
                        <h3 className="font-semibold text-lg mb-2">Create Workspace</h3>
                        <p className="text-sm text-muted-foreground mb-6 max-w-[250px]">
                            Start a new open-source project or private team collaboration.
                        </p>
                        <Link href="/codex/new">
                            <Button variant="outline" className="gap-2 border-primary/50 text-primary hover:bg-primary/20">
                                New Project
                            </Button>
                        </Link>
                    </Card>
                </div>
            </div>
        </div>
    );
}
