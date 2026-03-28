"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  ArrowRight,
  BookOpen,
  Users,
  Globe,
  Video,
  TrendingUp,
  Clock,
  CheckCircle2,
  Zap,
  Star,
  Bell,
  ChevronRight,
  Layers,
  Target,
  Flame,
  Award,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { apiFetch } from "@/lib/api";

const recentPaths = [
  { title: "Full Stack Web Dev", progress: 65, topic: "Web", color: "bg-blue-500/20 text-blue-400" },
  { title: "React & Next.js", progress: 40, topic: "Frontend", color: "bg-purple-500/20 text-purple-400" },
  { title: "Node.js & APIs", progress: 22, topic: "Backend", color: "bg-green-500/20 text-green-400" },
];

const upcomingSessions = [
  { title: "React Performance Deep Dive", host: "Arjun M.", time: "Today, 7:00 PM", live: false },
  { title: "System Design for Beginners", host: "Kavya R.", time: "Tomorrow, 6:00 PM", live: false },
  { title: "Intro to Docker", host: "Ravi V.", time: "Live Now", live: true },
];

const joinedCommunities = [
  { name: "Full Stack Dev", unread: 12, color: "bg-blue-500/20 text-blue-400" },
  { name: "AI & ML Hub", unread: 5, color: "bg-purple-500/20 text-purple-400" },
  { name: "DevOps Circle", unread: 0, color: "bg-orange-500/20 text-orange-400" },
];

const savedResources = [
  { title: "Complete Guide to React Hooks", type: "PDF", date: "2 days ago" },
  { title: "TypeScript Advanced Patterns", type: "Video", date: "4 days ago" },
  { title: "Docker for Developers", type: "Notes", date: "1 week ago" },
];

const upcomingEvents = [
  { title: "React Conf India", date: "Mar 22", color: "bg-green-500" },
  { title: "HackIndia Finals", date: "Mar 20", color: "bg-red-500", live: true },
];

export default function DashboardPage() {
  const [user, setUser] = useState<any>(null);
  const [stats, setStats] = useState({ paths: 0, resources: 0, streak: 0, achievements: 0 });

  useEffect(() => {
    apiFetch("/users/me").then((data) => {
      setUser(data);
      setStats({
        paths: data.activePaths ?? 3,
        resources: data.savedResources ?? 24,
        streak: data.streak ?? 12,
        achievements: data.achievements?.length ?? 7,
      });
    }).catch(() => {
      setStats({ paths: 3, resources: 24, streak: 12, achievements: 7 });
    });
  }, []);

  const greeting = () => {
    const h = new Date().getHours();
    if (h < 12) return "Good morning";
    if (h < 18) return "Good afternoon";
    return "Good evening";
  };

  const firstName = user?.name?.split(" ")[0] || "there";

  return (
    <div className="p-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold">{greeting()}, {firstName} 👋</h1>
          <p className="text-muted-foreground text-sm mt-1">You have 3 unread notifications and 1 live session happening now.</p>
        </div>
        <div className="flex items-center gap-2">
          <Link href="/dashboard/notifications">
            <Button variant="outline" size="sm" className="gap-1.5 relative">
              <Bell className="w-4 h-4" />
              Notifications
              <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-primary text-primary-foreground text-[10px] flex items-center justify-center">3</span>
            </Button>
          </Link>
          <Link href="/pricing">
            <Button size="sm" className="gap-1.5 bg-primary hover:bg-primary/90">
              <Zap className="w-3.5 h-3.5" />
              Upgrade to Premium
            </Button>
          </Link>
        </div>
      </div>

      {/* Stats cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {[
          { label: "Paths In Progress", value: stats.paths.toString(), icon: Layers, color: "text-blue-400", bg: "bg-blue-500/10" },
          { label: "Resources Saved", value: stats.resources.toString(), icon: BookOpen, color: "text-purple-400", bg: "bg-purple-500/10" },
          { label: "Day Streak", value: stats.streak.toString(), icon: Flame, color: "text-orange-400", bg: "bg-orange-500/10" },
          { label: "Achievements", value: stats.achievements.toString(), icon: Award, color: "text-yellow-400", bg: "bg-yellow-500/10" },
        ].map((s) => (
          <Card key={s.label} className="border-border/40 bg-card/50">
            <CardContent className="p-5">
              <div className={`w-10 h-10 rounded-xl ${s.bg} flex items-center justify-center mb-3`}>
                <s.icon className={`w-5 h-5 ${s.color}`} />
              </div>
              <div className="text-2xl font-bold mb-0.5">{s.value}</div>
              <div className="text-xs text-muted-foreground">{s.label}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Learning progress */}
        <div className="lg:col-span-2 space-y-6">
          {/* Current paths */}
          <Card className="border-border/40 bg-card/50">
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base">Continue Learning</CardTitle>
                <Link href="/learning" className="text-xs text-primary hover:underline flex items-center gap-1">
                  View All <ChevronRight className="w-3 h-3" />
                </Link>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {recentPaths.map((path) => (
                <div key={path.title} className="group">
                  <div className="flex items-center justify-between mb-1.5">
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className={`text-[10px] px-1.5 py-0 h-4 border ${path.color}`}>
                        {path.topic}
                      </Badge>
                      <span className="text-sm font-medium">{path.title}</span>
                    </div>
                    <span className="text-xs text-muted-foreground">{path.progress}%</span>
                  </div>
                  <Progress value={path.progress} className="h-1.5" />
                </div>
              ))}
              <Link href="/learning">
                <Button variant="outline" className="w-full gap-2 mt-2" size="sm">
                  <Layers className="w-4 h-4" /> Browse All Paths
                </Button>
              </Link>
            </CardContent>
          </Card>

          {/* Live sessions */}
          <Card className="border-border/40 bg-card/50">
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base">Upcoming Sessions</CardTitle>
                <Link href="/sessions" className="text-xs text-primary hover:underline flex items-center gap-1">
                  View All <ChevronRight className="w-3 h-3" />
                </Link>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              {upcomingSessions.map((s) => (
                <div key={s.title} className="flex items-center gap-3 p-3 rounded-lg border border-border/40 hover:border-border/80 transition-colors cursor-pointer group">
                  <div className={`w-2 h-2 rounded-full shrink-0 ${s.live ? "bg-red-400 animate-pulse" : "bg-green-400"}`} />
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium truncate">{s.title}</div>
                    <div className="text-xs text-muted-foreground">by {s.host}</div>
                  </div>
                  <div className="flex items-center gap-2">
                    {s.live && <Badge className="bg-red-500/20 text-red-400 border-red-500/30 text-[10px]">LIVE</Badge>}
                    <span className="text-xs text-muted-foreground whitespace-nowrap">{s.time}</span>
                    <ChevronRight className="w-3.5 h-3.5 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Saved resources */}
          <Card className="border-border/40 bg-card/50">
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base">Saved Resources</CardTitle>
                <Link href="/resources" className="text-xs text-primary hover:underline flex items-center gap-1">
                  View All <ChevronRight className="w-3 h-3" />
                </Link>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              {savedResources.map((r) => (
                <div key={r.title} className="flex items-center gap-3 group cursor-pointer">
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 text-xs font-semibold ${r.type === "PDF" ? "bg-red-500/20 text-red-400" :
                    r.type === "Video" ? "bg-purple-500/20 text-purple-400" :
                      "bg-blue-500/20 text-blue-400"
                    }`}>
                    {r.type.slice(0, 1)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm truncate group-hover:text-primary transition-colors">{r.title}</div>
                    <div className="text-xs text-muted-foreground">{r.date}</div>
                  </div>
                  <Badge variant="outline" className="text-[10px]">{r.type}</Badge>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Right sidebar */}
        <div className="space-y-6">
          {/* Plan card */}
          <Card className="border-primary/30 bg-primary/5">
            <CardContent className="p-5">
              <div className="flex items-center gap-2 mb-3">
                <Badge className="badge-gradient text-xs">Standard Plan</Badge>
              </div>
              <p className="text-sm text-muted-foreground mb-4">
                Unlock AI roadmaps, private Codex projects, and premium tutorials with Premium.
              </p>
              <Link href="/pricing">
                <Button className="w-full gap-2 bg-primary hover:bg-primary/90" size="sm">
                  <Zap className="w-3.5 h-3.5" />
                  Upgrade to Premium — ₹100/mo
                </Button>
              </Link>
            </CardContent>
          </Card>

          {/* Communities */}
          <Card className="border-border/40 bg-card/50">
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base">My Communities</CardTitle>
                <Link href="/communities" className="text-xs text-primary hover:underline flex items-center gap-1">
                  Explore <ChevronRight className="w-3 h-3" />
                </Link>
              </div>
            </CardHeader>
            <CardContent className="space-y-2.5">
              {joinedCommunities.map((c) => (
                <div key={c.name} className="flex items-center gap-2.5 p-2.5 rounded-lg hover:bg-accent/30 transition-colors cursor-pointer">
                  <div className={`w-8 h-8 rounded-lg ${c.color} flex items-center justify-center text-xs font-bold`}>
                    {c.name.slice(0, 2).toUpperCase()}
                  </div>
                  <span className="flex-1 text-sm">{c.name}</span>
                  {c.unread > 0 && (
                    <Badge className="bg-primary/20 text-primary border-primary/30 text-[10px] h-4 px-1.5">{c.unread}</Badge>
                  )}
                </div>
              ))}
              <Link href="/communities">
                <Button variant="outline" className="w-full gap-2 mt-1" size="sm">
                  <Users className="w-4 h-4" /> Find Communities
                </Button>
              </Link>
            </CardContent>
          </Card>

          {/* Upcoming events */}
          <Card className="border-border/40 bg-card/50">
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base">Upcoming Events</CardTitle>
                <Link href="/events" className="text-xs text-primary hover:underline flex items-center gap-1">
                  View Map <ChevronRight className="w-3 h-3" />
                </Link>
              </div>
            </CardHeader>
            <CardContent className="space-y-2.5">
              {upcomingEvents.map((e) => (
                <div key={e.title} className="flex items-center gap-2.5 p-2.5 rounded-lg hover:bg-accent/30 transition-colors cursor-pointer">
                  <div className={`w-2 h-2 rounded-full shrink-0 ${e.color} ${(e as any).live ? "animate-pulse" : ""}`} />
                  <div className="flex-1 min-w-0">
                    <div className="text-sm truncate">{e.title}</div>
                  </div>
                  <span className="text-xs text-muted-foreground whitespace-nowrap">{e.date}</span>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Quick actions */}
          <Card className="border-border/40 bg-card/50">
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-2 gap-2">
              {[
                { label: "New Session", href: "/sessions/new", icon: Video, color: "text-green-400" },
                { label: "Join Community", href: "/communities", icon: Users, color: "text-purple-400" },
                { label: "Browse Events", href: "/events", icon: Globe, color: "text-cyan-400" },
                { label: "Start Sandbox", href: "/sandbox", icon: Target, color: "text-orange-400" },
              ].map((a) => (
                <Link key={a.label} href={a.href}>
                  <div className="p-3 rounded-lg border border-border/40 hover:border-border/80 hover:bg-accent/30 transition-colors cursor-pointer text-center">
                    <a.icon className={`w-4 h-4 ${a.color} mx-auto mb-1`} />
                    <span className="text-xs">{a.label}</span>
                  </div>
                </Link>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
