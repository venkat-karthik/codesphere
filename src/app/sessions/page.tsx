"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  Video,
  Plus,
  Search,
  Clock,
  Users,
  Lock,
  Globe,
  ChevronRight,
  Calendar,
  Play,
  ExternalLink,
  Bell,
  Star,
  Filter,
  Mic,
  MicOff,
  Hash,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { apiFetch } from "@/lib/api";
import { toast } from "sonner";

const statusConfig = {
  live: { label: "Live Now", color: "bg-red-500/10 text-red-400 border-red-500/20", dot: "bg-red-500 animate-pulse" },
  upcoming: { label: "Upcoming", color: "bg-green-500/10 text-green-400 border-green-500/20", dot: "bg-green-500" },
  ended: { label: "Ended", color: "bg-gray-500/10 text-gray-400 border-gray-500/20", dot: "bg-gray-500" },
  planned: { label: "Planned", color: "bg-blue-500/10 text-blue-400 border-blue-500/20", dot: "bg-blue-500" },
};

function CreateSessionDialog() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="gap-2 bg-primary hover:bg-primary/90">
          <Plus className="w-4 h-4" /> Create Session
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Create a Live Session</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-2">
          <div className="space-y-2">
            <Label>Session Title</Label>
            <Input placeholder="e.g. Build a REST API from scratch" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Date</Label>
              <Input type="date" />
            </div>
            <div className="space-y-2">
              <Label>Time</Label>
              <Input type="time" />
            </div>
          </div>
          <div className="space-y-2">
            <Label>Visibility</Label>
            <Select defaultValue="public">
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="public">
                  <div className="flex items-center gap-2"><Globe className="w-4 h-4" /> Public — Anyone can join</div>
                </SelectItem>
                <SelectItem value="private">
                  <div className="flex items-center gap-2"><Lock className="w-4 h-4" /> Private — Invite only</div>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>Link to Community (optional)</Label>
            <Select>
              <SelectTrigger>
                <SelectValue placeholder="Select community..." />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="fullstack">Full Stack Dev Hub</SelectItem>
                <SelectItem value="aiml">AI & ML Hub</SelectItem>
                <SelectItem value="devops">DevOps Circle</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="p-3 rounded-lg bg-blue-500/10 border border-blue-500/20 text-sm flex items-start gap-2">
            <Video className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
            <span className="text-blue-400">
              A Google Meet link will be auto-generated and shared with participants.
            </span>
          </div>
          <Button className="w-full gap-2 bg-primary hover:bg-primary/90">
            <Video className="w-4 h-4" /> Create & Get Meet Link
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default function SessionsPage() {
  const [search, setSearch] = useState("");
  const [sessions, setSessions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSessions = async () => {
      try {
        const data = await apiFetch('/sessions');
        setSessions(data);
      } catch (error) {
        console.error("Failed to fetch sessions:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchSessions();
  }, []);

  const liveSessions = sessions.filter((s) => s.status === "live");
  const upcomingSessions = sessions.filter((s) => s.status === "upcoming" || s.status === "planned");

  const filtered = sessions.filter((s) =>
    s.title.toLowerCase().includes(search.toLowerCase()) ||
    (s.hostId?.name || "").toLowerCase().includes(search.toLowerCase())
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="pt-16">
        {/* Hero */}
        <div className="relative py-14 hero-bg border-b border-border/40">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
              <div>
                <Badge variant="outline" className="mb-3 border-green-500/30 text-green-400">Live Sessions</Badge>
                <h1 className="text-4xl font-bold mb-2">
                  Learn live, build live,
                  <br />
                  <span className="gradient-text">grow live</span>
                </h1>
                <p className="text-muted-foreground max-w-xl">
                  Public and private live coding sessions powered by Google Meet.
                  Create a session or join one happening right now.
                </p>
              </div>
              <CreateSessionDialog />
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Live now banner */}
          {liveSessions.length > 0 && (
            <div className="mb-8 p-4 rounded-xl bg-red-500/10 border border-red-500/20 flex items-center gap-3">
              <div className="w-3 h-3 rounded-full bg-red-500 animate-pulse shrink-0" />
              <div className="flex-1">
                <span className="font-semibold text-red-400">{liveSessions.length} session{liveSessions.length > 1 ? "s" : ""} happening right now</span>
                <span className="text-sm text-muted-foreground ml-2">— Join before you miss it!</span>
              </div>
              <Button size="sm" className="bg-red-500 hover:bg-red-600 text-white gap-1.5 shrink-0">
                <Play className="w-3.5 h-3.5" /> Join Now
              </Button>
            </div>
          )}

          <div className="grid lg:grid-cols-3 gap-6">
            {/* Main */}
            <div className="lg:col-span-2">
              {/* Search */}
              <div className="relative mb-6">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Search sessions..."
                  className="pl-9 h-10"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>

              <Tabs defaultValue="all">
                <TabsList className="mb-5">
                  <TabsTrigger value="all">All Sessions</TabsTrigger>
                  <TabsTrigger value="live">
                    <span className="flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                      Live ({liveSessions.length})
                    </span>
                  </TabsTrigger>
                  <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
                </TabsList>

                <TabsContent value="all" className="mt-0 space-y-4">
                  {filtered.map((s) => <SessionCard key={s._id} s={s} />)}
                </TabsContent>
                <TabsContent value="live" className="mt-0 space-y-4">
                  {liveSessions.map((s) => <SessionCard key={s._id} s={s} />)}
                </TabsContent>
                <TabsContent value="upcoming" className="mt-0 space-y-4">
                  {upcomingSessions.map((s) => <SessionCard key={s._id} s={s} />)}
                </TabsContent>
              </Tabs>
            </div>

            {/* Sidebar */}
            <div className="space-y-5">
              {/* Stats */}
              <Card className="border-border/40 bg-card/50">
                <CardContent className="p-5">
                  <div className="grid grid-cols-2 gap-4">
                    {[
                      { label: "Live Now", value: liveSessions.length.toString(), color: "text-red-400" },
                      { label: "This Week", value: "24", color: "text-green-400" },
                      { label: "Total Hosts", value: "180+", color: "text-blue-400" },
                      { label: "Avg. Attendees", value: "120", color: "text-purple-400" },
                    ].map((s) => (
                      <div key={s.label} className="text-center">
                        <div className={`text-2xl font-bold ${s.color}`}>{s.value}</div>
                        <div className="text-xs text-muted-foreground">{s.label}</div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Top hosts */}
              <Card className="border-border/40 bg-card/50">
                <CardHeader className="pb-3">
                  <CardTitle className="text-base flex items-center gap-2">
                    <Star className="w-4 h-4 text-yellow-400" /> Top Hosts
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {[
                    { name: "Arjun Mehta", sessions: 24, topic: "Web Dev", initials: "AM" },
                    { name: "Kavya Reddy", sessions: 18, topic: "Career", initials: "KR" },
                    { name: "Ravi Verma", sessions: 16, topic: "DevOps", initials: "RV" },
                    { name: "Preethi Kumar", sessions: 12, topic: "AI & ML", initials: "PK" },
                  ].map((h) => (
                    <div key={h.name} className="flex items-center gap-2.5">
                      <div className="w-9 h-9 rounded-full bg-primary/20 flex items-center justify-center text-primary font-semibold text-sm shrink-0">
                        {h.initials}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-medium">{h.name}</div>
                        <div className="text-xs text-muted-foreground">{h.sessions} sessions • {h.topic}</div>
                      </div>
                      <Bell className="w-4 h-4 text-muted-foreground hover:text-primary cursor-pointer transition-colors" />
                    </div>
                  ))}
                </CardContent>
              </Card>

              {/* How it works */}
              <Card className="border-primary/20 bg-primary/5">
                <CardHeader className="pb-3">
                  <CardTitle className="text-base">How Sessions Work</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2.5 text-sm text-muted-foreground">
                  {[
                    "Create a session with date, time, and topic",
                    "Choose public or private visibility",
                    "A Google Meet link is auto-generated",
                    "Participants join via the Meet link",
                    "Optionally link to your community",
                  ].map((step, i) => (
                    <div key={i} className="flex items-start gap-2">
                      <span className="w-5 h-5 rounded-full bg-primary/20 text-primary text-xs flex items-center justify-center shrink-0 font-medium mt-0.5">{i + 1}</span>
                      {step}
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}

function SessionCard({ s }: { s: any }) {
  const status = (s.status === 'planned' || s.status === 'upcoming') ? 'planned' : s.status;
  const cfg = statusConfig[status as keyof typeof statusConfig] || statusConfig.planned;
  const hostName = s.hostId?.name || "Anonymous";
  const hostInitials = hostName.split(' ').map((n: string) => n[0]).join('');
  const attendeesCount = s.attendees?.length || 0;
  const maxAttendees = 100; // Mock Max
  const fillPct = Math.round((attendeesCount / maxAttendees) * 100);

  return (
    <Card className="border-border/40 bg-card/50 card-hover group overflow-hidden">
      <CardContent className="p-5">
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex items-center gap-2 flex-wrap">
            <div className={`flex items-center gap-1.5 px-2 py-0.5 rounded-full border text-xs ${cfg.color}`}>
              <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`} />
              {cfg.label}
            </div>
            <div className={`flex items-center gap-1 text-xs text-muted-foreground`}>
              <Globe className="w-3 h-3" />
              Public
            </div>
          </div>
        </div>

        <h3 className="font-semibold mb-1.5 group-hover:text-primary transition-colors line-clamp-2">{s.title}</h3>

        <div className="flex items-center gap-2 mb-3">
          <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center text-primary font-semibold text-[10px] shrink-0">
            {hostInitials}
          </div>
          <span className="text-sm text-muted-foreground">{hostName}</span>
        </div>

        <div className="flex flex-wrap gap-3 text-xs text-muted-foreground mb-3">
          <span className="flex items-center gap-1"><Calendar className="w-3 h-3" /> {new Date(s.startTime).toLocaleDateString()}</span>
          <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {s.duration}</span>
          <span className="flex items-center gap-1"><Users className="w-3 h-3" /> {attendeesCount}/{maxAttendees}</span>
        </div>

        {/* Capacity bar */}
        <div className="mb-4">
          <div className="h-1.5 bg-muted rounded-full overflow-hidden">
            <div className={`h-full rounded-full transition-all ${fillPct > 80 ? "bg-red-400" : fillPct > 50 ? "bg-orange-400" : "bg-primary"}`} style={{ width: `${fillPct}%` }} />
          </div>
          <div className="text-[10px] text-muted-foreground mt-1">{fillPct}% capacity</div>
        </div>

        <div className="flex items-center gap-2">
          <Button className="flex-1 gap-1.5" size="sm" variant={s.status === "live" ? "default" : "outline"} asChild>
            <a href={s.meetingLink || "#"} target="_blank" rel="noopener noreferrer">
              {s.status === "live" ? <><Play className="w-3.5 h-3.5" /> Join Now</> : <><ExternalLink className="w-3.5 h-3.5" /> View Details</>}
            </a>
          </Button>
          <Button variant="outline" size="sm" className="w-9 px-0">
            <Bell className="w-3.5 h-3.5" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
