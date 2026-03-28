"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { FlaskConical, Play, CheckCircle2, Terminal, Search, ArrowRight, MonitorPlay, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import Navbar from "@/components/layout/Navbar";
import { apiFetch } from "@/lib/api";

const MOCK_TUTORIALS = [
  { _id: "sbx-1", title: "Build a Modern ToDo App", desc: "Learn state management and basic CRUD operations using React hooks.", tech: ["React", "CSS"], level: "Beginner", time: "2 Hours", progress: 100, color: "bg-blue-500" },
  { _id: "sbx-2", title: "Full-Stack Authentication", desc: "Create a complete login system with JWT, HTTP-only cookies, and protected routes.", tech: ["Next.js", "Node.js"], level: "Intermediate", time: "4 Hours", progress: 45, color: "bg-purple-500" },
  { _id: "sbx-3", title: "Real-time Chat with Socket.io", desc: "Build a Discord-clone channel system using WebSockets for instant messaging.", tech: ["React", "Socket.io", "Express"], level: "Advanced", time: "6 Hours", progress: 0, color: "bg-red-500" },
  { _id: "sbx-4", title: "E-Commerce Shopping Cart", desc: "Manage global app state using Zustand or Redux to handle cart items and checkout.", tech: ["React", "Zustand"], level: "Intermediate", time: "3 Hours", progress: 0, color: "bg-orange-500" },
  { _id: "sbx-5", title: "REST API with Express & MongoDB", desc: "Build a production-ready REST API with authentication, validation, and error handling.", tech: ["Node.js", "Express", "MongoDB"], level: "Intermediate", time: "5 Hours", progress: 0, color: "bg-green-500" },
  { _id: "sbx-6", title: "Next.js Portfolio Site", desc: "Build a stunning developer portfolio with animations, dark mode, and MDX blog.", tech: ["Next.js", "Tailwind", "Framer Motion"], level: "Beginner", time: "3 Hours", progress: 0, color: "bg-cyan-500" },
];

export default function SandboxPage() {
  const [tutorials, setTutorials] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const controller = new AbortController();
    apiFetch('/sandbox', {}, controller.signal)
      .then((data) => setTutorials(Array.isArray(data) ? data : []))
      .catch(() => setTutorials(MOCK_TUTORIALS))
      .finally(() => setLoading(false));
    return () => controller.abort();
  }, []);

  const filtered = tutorials.filter((t) =>
    t.title.toLowerCase().includes(search.toLowerCase()) ||
    t.tech?.some((tech: string) => tech.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      <div className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-24">
        {/* Hero */}
        <div className="relative rounded-3xl overflow-hidden border border-border/40 bg-card/30 mb-16">
          <div className="absolute inset-0 bg-gradient-to-r from-orange-500/10 via-background to-background" />
          <div className="relative p-8 md:p-12 flex flex-col md:flex-row items-center gap-12">
            <div className="flex-1 space-y-6">
              <Badge className="bg-orange-500/20 text-orange-400 hover:bg-orange-500/30 border-none px-3 py-1">
                <FlaskConical className="w-3.5 h-3.5 mr-2" /> Interactive Sandbox
              </Badge>
              <h1 className="text-4xl md:text-5xl font-bold tracking-tight">Learn by <span className="text-orange-400">Building</span></h1>
              <p className="text-muted-foreground text-lg leading-relaxed max-w-xl">Stop watching tutorials and start coding. Follow step-by-step interactive project guides inside a guided sandbox environment.</p>
              <div className="flex items-center gap-4">
                <Button className="h-12 px-8 gap-2 bg-foreground text-background hover:bg-foreground/90 rounded-full">
                  <Play className="w-4 h-4" /> Start Quickstart
                </Button>
                <div className="flex items-center gap-2 text-sm text-muted-foreground font-medium">
                  <MonitorPlay className="w-4 h-4" /> {tutorials.length}+ Projects
                </div>
              </div>
            </div>
            <div className="hidden md:block w-96 h-64 bg-black rounded-2xl border border-border/50 shadow-2xl relative overflow-hidden">
              <div className="h-8 border-b border-white/10 flex items-center px-4 gap-2 bg-white/5">
                <div className="w-3 h-3 rounded-full bg-red-500/80" /><div className="w-3 h-3 rounded-full bg-yellow-500/80" /><div className="w-3 h-3 rounded-full bg-green-500/80" />
              </div>
              <div className="p-4 font-mono text-xs text-green-400">
                <p>$ npm create codesphere-sandbox@latest</p>
                <p className="text-muted-foreground mt-2">✔ Initializing project environment...</p>
                <p className="text-muted-foreground">✔ Installing dependencies...</p>
                <p className="mt-2 text-blue-400">Welcome to the Sandbox. Your code is ready.</p>
                <div className="mt-4 flex gap-2"><span className="animate-pulse">_</span></div>
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-8">
          <h2 className="text-2xl font-bold">Project Library</h2>
          <div className="relative w-full sm:w-auto sm:min-w-[300px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input placeholder="Search projects by tech..." className="pl-10 bg-card/50" value={search} onChange={(e) => setSearch(e.target.value)} />
          </div>
        </div>

        {loading ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">{Array(6).fill(null).map((_, i) => <div key={i} className="h-72 rounded-xl bg-muted/30 animate-pulse" />)}</div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((tut) => {
              const id = tut._id ?? tut.id;
              return (
                <Card key={id} className="bg-card/40 border-border/40 hover:border-border/80 transition-all flex flex-col overflow-hidden group">
                  <div className={`h-2 w-full ${tut.color ?? "bg-primary"} opacity-80`} />
                  <CardContent className="p-6 flex flex-col flex-1">
                    <div className="flex justify-between items-start mb-4">
                      <Badge variant="outline" className={`bg-background text-xs ${tut.level === 'Beginner' ? 'text-blue-400 border-blue-400/30' : tut.level === 'Intermediate' ? 'text-orange-400 border-orange-400/30' : 'text-red-400 border-red-400/30'}`}>{tut.level}</Badge>
                      <div className="flex items-center gap-1.5 text-xs text-muted-foreground font-medium"><Clock className="w-3.5 h-3.5" />{tut.time}</div>
                    </div>
                    <h3 className="text-xl font-bold mb-2 group-hover:text-primary transition-colors">{tut.title}</h3>
                    <p className="text-sm text-muted-foreground mb-6 line-clamp-2">{tut.desc}</p>
                    <div className="flex flex-wrap gap-2 mb-8">
                      {tut.tech?.map((t: string) => <span key={t} className="text-[10px] font-semibold uppercase tracking-wider px-2 py-1 rounded bg-muted/50 text-muted-foreground">{t}</span>)}
                    </div>
                    <div className="mt-auto">
                      {(tut.progress ?? 0) > 0 ? (
                        <div className="space-y-3">
                          <div className="flex justify-between text-xs font-medium">
                            <span className={tut.progress === 100 ? "text-green-400" : "text-primary"}>{tut.progress === 100 ? "Completed" : "In Progress"}</span>
                            <span>{tut.progress}%</span>
                          </div>
                          <Progress value={tut.progress} className="h-1.5" />
                          <Link href={`/sandbox/${id}`} className="w-full">
                            <Button className={`w-full gap-2 mt-4 ${tut.progress === 100 ? "bg-green-600 hover:bg-green-700 text-white" : ""}`}>
                              {tut.progress === 100 ? <><CheckCircle2 className="w-4 h-4" /> Review Code</> : "Continue Building"}
                            </Button>
                          </Link>
                        </div>
                      ) : (
                        <Link href={`/sandbox/${id}`} className="w-full">
                          <Button variant="secondary" className="w-full gap-2 group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                            <Terminal className="w-4 h-4" /> Start Project
                          </Button>
                        </Link>
                      )}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}

        {!loading && filtered.length === 0 && (
          <div className="text-center py-20 text-muted-foreground">
            <FlaskConical className="w-12 h-12 mx-auto mb-4 opacity-30" />
            <p className="text-lg">No projects found</p>
            <Button variant="outline" className="mt-4" onClick={() => setSearch("")}>Clear search</Button>
          </div>
        )}
      </div>
    </div>
  );
}
