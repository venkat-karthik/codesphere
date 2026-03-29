"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import {
    BookOpen,
    Trophy,
    Clock,
    CheckCircle2,
    Lock,
    PlayCircle,
    Code2,
    FileText,
    Star,
    Users,
    ChevronRight,
    MonitorPlay,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import Navbar from "@/components/layout/Navbar";
import { apiFetch } from "@/lib/api";

export default function LearningPathDetails() {
    const params = useParams();
    const id = params.id as string;
    const [path, setPath] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchPath = async () => {
            try {
                const data = await apiFetch(`/learning/${id}`);
                setPath(data);
            } catch {
                // Fallback mock path so the page never shows "not found" for valid IDs
                setPath({
                    title: "Full Stack Web Development",
                    description: "Master React, Node.js, databases, and deployment. Build production-grade applications from scratch.",
                    difficulty: "Intermediate",
                    estimatedHours: 40,
                    userProgress: 0,
                    modules: [
                        { title: "HTML, CSS & JavaScript Fundamentals", lessons: [{ title: "Intro to HTML5", type: "video", duration: "12 min", completed: false }, { title: "CSS Flexbox & Grid", type: "video", duration: "18 min", completed: false }, { title: "JavaScript ES6+", type: "article", duration: "25 min", completed: false }] },
                        { title: "React & Component Architecture", lessons: [{ title: "React Basics", type: "video", duration: "20 min", completed: false }, { title: "Hooks Deep Dive", type: "video", duration: "30 min", completed: false }, { title: "State Management", type: "code", duration: "45 min", completed: false }] },
                        { title: "Node.js & REST APIs", lessons: [{ title: "Express Setup", type: "video", duration: "15 min", completed: false }, { title: "REST API Design", type: "article", duration: "20 min", completed: false }, { title: "Authentication with JWT", type: "code", duration: "60 min", completed: false }] },
                    ],
                });
            } finally {
                setLoading(false);
            }
        };
        if (id) fetchPath();
    }, [id]);

    if (loading) {
        return (
            <div className="min-h-screen bg-background flex flex-col">
                <Navbar />
                <div className="flex-1 flex items-center justify-center">
                    <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mb-4" />
                    <p className="ml-3 text-muted-foreground animate-pulse">Loading path details...</p>
                </div>
            </div>
        );
    }

    if (!path) {
        return (
            <div className="min-h-screen bg-background flex flex-col">
                <Navbar />
                <div className="flex-1 flex flex-col items-center justify-center p-4 text-center">
                    <h1 className="text-2xl font-bold mb-2">Path Not Found</h1>
                    <p className="text-muted-foreground mb-6">The learning path you are looking for does not exist or has been removed.</p>
                    <Link href="/learning">
                        <Button>Back to Learning Paths</Button>
                    </Link>
                </div>
            </div>
        );
    }

    const pathData = {
        title: path.title,
        desc: path.description,
        instructor: "CodeSphere Expert", // Could be from backend later
        students: "1,200+",
        rating: "4.8",
        duration: path.estimatedHours + " Hours",
        level: path.difficulty,
        progress: path.userProgress ?? 0,
        modules: path.modules.map((mod: any, i: number) => ({
            title: mod.title,
            duration: "2h", // Mock duration per module
            status: i === 0 ? "in-progress" : "locked",
            lessons: mod.lessons.map((lesson: any) => ({
                title: lesson.title,
                type: lesson.type,
                duration: lesson.duration,
                completed: false
            }))
        }))
    };

    return (
        <div className="min-h-screen bg-background flex flex-col">
            <Navbar />

            {/* Hero Header */}
            <div className="bg-muted/30 border-b border-border/40 pt-24 pb-12">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <Link href="/learning" className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-6 transition-colors">
                        <ChevronRight className="w-4 h-4 rotate-180 mr-1" /> Back to Paths
                    </Link>

                    <div className="grid lg:grid-cols-3 gap-12 items-start">
                        <div className="lg:col-span-2 space-y-6">
                            <div className="flex gap-2">
                                <Badge variant="secondary" className="bg-primary/10 text-primary border-none">
                                    {pathData.level}
                                </Badge>
                                <Badge variant="outline" className="border-border/60">
                                    Web Development
                                </Badge>
                            </div>

                            <h1 className="text-4xl sm:text-5xl font-bold tracking-tight">
                                {pathData.title}
                            </h1>

                            <p className="text-lg text-muted-foreground leading-relaxed max-w-2xl">
                                {pathData.desc}
                            </p>

                            <div className="flex flex-wrap items-center gap-6 text-sm text-muted-foreground pt-4">
                                <div className="flex items-center gap-2">
                                    <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                                    <span className="font-medium text-foreground">{pathData.rating}</span>
                                    <span>(2.1k reviews)</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Users className="w-4 h-4" />
                                    <span>{pathData.students} students</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Clock className="w-4 h-4" />
                                    <span>{pathData.duration} total</span>
                                </div>
                            </div>
                        </div>

                        {/* Action Card */}
                        <Card className="bg-card/60 backdrop-blur-xl border-border/40 shadow-2xl overflow-hidden sticky top-24">
                            <div className="aspect-video bg-muted relative flex items-center justify-center border-b border-border/40 group cursor-pointer overflow-hidden">
                                <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1555066931-4365d14bab8c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80')] bg-cover bg-center opacity-40 group-hover:scale-105 transition-transform duration-500" />
                                <div className="w-16 h-16 rounded-full bg-background/50 backdrop-blur-md flex items-center justify-center z-10 group-hover:bg-primary/90 transition-colors">
                                    <PlayCircle className="w-8 h-8 text-foreground group-hover:text-primary-foreground" />
                                </div>
                                <div className="absolute bottom-3 right-3 bg-black/70 px-2 py-1 rounded text-xs text-white font-medium z-10">Preview</div>
                            </div>

                            <CardContent className="p-6">
                                <div className="mb-6 space-y-2">
                                    <div className="flex justify-between text-sm font-medium mb-1">
                                        <span>Course Progress</span>
                                        <span className="text-primary">{pathData.progress}%</span>
                                    </div>
                                    <Progress value={pathData.progress} className="h-2" />
                                </div>

                                <Button className="w-full h-12 text-base gap-2 bg-primary hover:bg-primary/90 mb-4">
                                    <MonitorPlay className="w-5 h-5" /> Continue Learning
                                </Button>

                                <p className="text-center text-xs text-muted-foreground">
                                    Last active: 2 days ago
                                </p>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>

            {/* Course Content */}
            <div className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-12">
                <div className="grid lg:grid-cols-3 gap-12">

                    <div className="lg:col-span-2">
                        <h2 className="text-2xl font-bold mb-8">Course Curriculum</h2>

                        <div className="space-y-6">
                            {pathData.modules.map((mod: any, i: number) => (
                                <div key={i} className={`rounded-xl border ${mod.status === 'locked' ? 'border-border/30 bg-muted/10 opacity-70' : 'border-border/60 bg-card/20'}`}>
                                    {/* Module Header */}
                                    <div className="p-6 flex items-center justify-between border-b border-border/40">
                                        <div className="flex gap-4">
                                            <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${mod.status === 'completed' ? 'bg-green-500/20 text-green-500' :
                                                mod.status === 'in-progress' ? 'bg-primary/20 text-primary' :
                                                    'bg-muted text-muted-foreground'
                                                }`}>
                                                {mod.status === 'completed' ? <CheckCircle2 className="w-5 h-5" /> :
                                                    mod.status === 'locked' ? <Lock className="w-4 h-4" /> :
                                                        <span className="font-bold text-sm">{i + 1}</span>}
                                            </div>
                                            <div>
                                                <h3 className="font-semibold text-lg">{mod.title}</h3>
                                                <div className="flex items-center gap-3 text-sm text-muted-foreground mt-1">
                                                    <span className="flex items-center gap-1"><BookOpen className="w-3.5 h-3.5" /> {mod.lessons.length} lessons</span>
                                                    <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" /> {mod.duration}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Lessons list */}
                                    <div className="p-2 space-y-1">
                                        {mod.lessons.map((lesson: any, j: number) => (
                                            <div key={j} className="flex items-center justify-between p-3 px-4 rounded-lg hover:bg-muted/30 transition-colors group cursor-pointer">
                                                <div className="flex items-center gap-3">
                                                    {lesson.type === 'video' ? <PlayCircle className={`w-4 h-4 ${lesson.completed ? 'text-green-500' : 'text-muted-foreground'}`} /> :
                                                        lesson.type === 'article' ? <FileText className={`w-4 h-4 ${lesson.completed ? 'text-green-500' : 'text-muted-foreground'}`} /> :
                                                            lesson.type === 'test' ? <Trophy className={`w-4 h-4 ${lesson.completed ? 'text-green-500' : 'text-orange-400'}`} /> :
                                                                <Code2 className={`w-4 h-4 ${lesson.completed ? 'text-green-500' : 'text-blue-400'}`} />}

                                                    <span className={`text-sm tracking-wide ${lesson.completed ? 'text-muted-foreground line-through' : 'text-foreground group-hover:text-primary transition-colors'}`}>
                                                        {lesson.title}
                                                    </span>
                                                </div>
                                                <span className="text-xs text-muted-foreground">{lesson.duration}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Sidebar Info */}
                    <div className="space-y-8">
                        <div>
                            <h3 className="font-semibold mb-4">What you&apos;ll build</h3>
                            <ul className="space-y-3">
                                {[
                                    "A full-stack social media dashboard",
                                    "Real-time chat functionality using WebSockets",
                                    "Secure user authentication with JWT",
                                    "Responsive, accessible UIs using Tailwind"
                                ].map((item, i) => (
                                    <li key={i} className="flex items-start gap-3 text-sm text-muted-foreground">
                                        <CheckCircle2 className="w-4 h-4 text-green-500 shrink-0 mt-0.5" />
                                        <span>{item}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
}
