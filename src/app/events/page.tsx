"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  Search,
  Globe,
  MapPin,
  Calendar,
  ExternalLink,
  Filter,
  ChevronRight,
  Clock,
  Users,
  Tag,
  Star,
  Bell,
  Layers,
  Map,
  List,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { apiFetch } from "@/lib/api";

const statusConfig = {
  live: { label: "Live Now", color: "bg-red-500", text: "text-red-400", bg: "bg-red-500/10 border-red-500/20", pulse: true },
  near: { label: "Closing Soon", color: "bg-orange-500", text: "text-orange-400", bg: "bg-orange-500/10 border-orange-500/20", pulse: false },
  upcoming: { label: "Upcoming", color: "bg-green-500", text: "text-green-400", bg: "bg-green-500/10 border-green-500/20", pulse: false },
  expired: { label: "Expired", color: "bg-gray-500", text: "text-gray-400", bg: "bg-gray-500/10 border-gray-500/20", pulse: false },
};

function GlobePlaceholder({ events }: { events: any[] }) {
  return (
    <div className="relative w-full aspect-[2/1] bg-gradient-to-br from-blue-950/50 to-slate-950/80 rounded-2xl border border-border/40 overflow-hidden flex items-center justify-center">
      <svg className="absolute inset-0 w-full h-full opacity-10" viewBox="0 0 800 400" preserveAspectRatio="xMidYMid meet">
        <path d="M540 180 L560 170 L580 180 L585 210 L570 230 L550 220 Z" fill="white" opacity="0.15" />
        <path d="M590 160 L630 155 L640 175 L620 185 L600 180 Z" fill="white" opacity="0.15" />
        <path d="M390 100 L440 90 L460 110 L450 130 L410 125 Z" fill="white" opacity="0.15" />
        <path d="M410 160 L450 155 L465 200 L450 250 L420 255 L400 220 L405 180 Z" fill="white" opacity="0.12" />
        <path d="M170 100 L220 95 L230 140 L215 200 L195 210 L175 180 L165 140 Z" fill="white" opacity="0.12" />
        <path d="M640 130 L655 125 L658 140 L645 145 Z" fill="white" opacity="0.15" />
        <path d="M380 105 L390 100 L395 115 L383 118 Z" fill="white" opacity="0.15" />
      </svg>

      {events.map((e: any) => {
        const lat = 20;
        const lng = 77;
        const x = ((lng + 180) / 360) * 800;
        const y = ((90 - lat) / 180) * 400;
        const cfg = statusConfig.upcoming;
        return (
          <div
            key={e._id}
            className="absolute group cursor-pointer"
            style={{ left: `${(x / 800) * 100}%`, top: `${(y / 400) * 100}%`, transform: "translate(-50%,-50%)" }}
          >
            <div className={`w-3 h-3 rounded-full ${cfg.color} ${cfg.pulse ? "animate-ping absolute" : ""} opacity-75`} />
            <div className={`w-3 h-3 rounded-full ${cfg.color} relative`} />
            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover:block z-10">
              <div className="bg-background border border-border/60 rounded-lg p-2 text-xs whitespace-nowrap shadow-lg">
                <div className="font-semibold">{e.title}</div>
                <div className="text-muted-foreground">{e.location}, {new Date(e.date).toLocaleDateString()}</div>
              </div>
            </div>
          </div>
        );
      })}

      <div className="absolute bottom-3 right-3 flex items-center gap-3 text-xs bg-background/60 backdrop-blur-sm rounded-lg p-2 border border-border/40">
        <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-green-500 inline-block" /> Upcoming</span>
        <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-orange-500 inline-block" /> Near deadline</span>
        <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-red-500 inline-block animate-pulse" /> Live</span>
      </div>

      <div className="absolute top-3 left-3 text-xs text-muted-foreground bg-background/60 backdrop-blur-sm rounded-lg px-2 py-1 border border-border/40 flex items-center gap-1.5">
        <Globe className="w-3 h-3" />
        Global Events Map
        <Badge variant="outline" className="text-[10px] px-1 py-0 h-4 ml-1">Beta</Badge>
      </div>
    </div>
  );
}

export default function EventsPage() {
  const [view, setView] = useState<"globe" | "list">("list");
  const [search, setSearch] = useState("");
  const [activeFilter, setActiveFilter] = useState("all");
  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const data = await apiFetch('/events');
        setEvents(data);
      } catch {
        setEvents([
          { _id: "1", title: "React Conf India 2025", description: "The biggest React conference in India.", location: "Bangalore, India", date: new Date(Date.now() + 86400000 * 5).toISOString(), type: "Talk", status: "upcoming", attendees: Array(840).fill(null), link: "#" },
          { _id: "2", title: "AI Summit Asia", description: "Explore the future of AI and machine learning.", location: "Singapore", date: new Date(Date.now() + 86400000 * 2).toISOString(), type: "Workshop", status: "near", attendees: Array(1200).fill(null), link: "#" },
          { _id: "3", title: "DevFest Mumbai", description: "Google Developer Festival — talks, workshops, and networking.", location: "Mumbai, India", date: new Date(Date.now() + 86400000 * 10).toISOString(), type: "Networking", status: "upcoming", attendees: Array(600).fill(null), link: "#" },
          { _id: "4", title: "HackIndia Finals", description: "India's largest hackathon — 48 hours of building.", location: "Delhi, India", date: new Date().toISOString(), type: "Hackathon", status: "live", attendees: Array(2000).fill(null), link: "#" },
          { _id: "5", title: "Node.js Global Summit", description: "Deep dives into Node.js internals and ecosystem.", location: "Remote", date: new Date(Date.now() + 86400000 * 20).toISOString(), type: "Talk", status: "upcoming", attendees: Array(3000).fill(null), link: "#" },
          { _id: "6", title: "Open Source Day", description: "Contribute to open source projects with mentors.", location: "Chennai, India", date: new Date(Date.now() - 86400000 * 2).toISOString(), type: "Workshop", status: "expired", attendees: Array(400).fill(null), link: "#" },
        ]);
      } finally {
        setLoading(false);
      }
    };
    fetchEvents();
  }, []);

  const filters = ["all", "Workshop", "Hackathon", "Talk", "Networking"];

  const filtered = events.filter((e) => {
    const matchSearch = e.title.toLowerCase().includes(search.toLowerCase()) ||
      (e.location || "").toLowerCase().includes(search.toLowerCase());
    const matchFilter = activeFilter === "all" || e.type === activeFilter;
    return matchSearch && matchFilter;
  });

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
        <div className="relative py-14 hero-bg border-b border-border/40">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-8">
              <Badge variant="outline" className="mb-3 border-cyan-500/30 text-cyan-400">Global Events</Badge>
              <h1 className="text-4xl sm:text-5xl font-bold mb-3">
                The world of tech,
                <br />
                <span className="gradient-text">one map at a time</span>
              </h1>
              <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                Discover conferences, hackathons, and meetups worldwide. Color-coded by urgency — never miss what matters.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 max-w-2xl mx-auto">
              <div className="relative flex-1">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Search events, cities, topics..."
                  className="pl-11 h-11 bg-background/80 backdrop-blur-sm"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
              <div className="flex items-center gap-1 bg-muted/50 rounded-lg p-1">
                <button
                  onClick={() => setView("globe")}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm transition-colors ${view === "globe" ? "bg-background shadow-sm" : "text-muted-foreground hover:text-foreground"
                    }`}
                >
                  <Map className="w-3.5 h-3.5" /> Globe
                </button>
                <button
                  onClick={() => setView("list")}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm transition-colors ${view === "list" ? "bg-background shadow-sm" : "text-muted-foreground hover:text-foreground"
                    }`}
                >
                  <List className="w-3.5 h-3.5" /> List
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {view === "globe" && (
            <div className="mb-8">
              <GlobePlaceholder events={events} />
              <p className="text-xs text-center text-muted-foreground mt-3">
                Hover over markers to preview events.
              </p>
            </div>
          )}

          <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-6">
            {filters.map((f) => (
              <button
                key={f}
                onClick={() => setActiveFilter(f)}
                className={`px-3 py-1.5 rounded-full text-xs whitespace-nowrap transition-colors border capitalize ${activeFilter === f
                  ? "bg-primary text-primary-foreground border-primary"
                  : "border-border/60 hover:border-border/80"
                  }`}
              >
                {f}
              </button>
            ))}
          </div>

          <p className="text-sm text-muted-foreground mb-5">
            Showing <span className="text-foreground font-medium">{filtered.length}</span> events
          </p>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filtered.map((e) => {
              const cfg = statusConfig[(e.status as keyof typeof statusConfig)] || statusConfig.upcoming;
              return (
                <Card key={e._id} className="border-border/40 bg-card/50 card-hover group overflow-hidden">
                  <CardContent className="p-5">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-2 flex-wrap">
                        <div className={`flex items-center gap-1.5 px-2 py-0.5 rounded-full border text-xs ${cfg.bg} ${cfg.text}`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${cfg.color}`} />
                          {cfg.label}
                        </div>
                        <Badge variant="outline" className="text-[10px] px-1.5 py-0 h-4 border-border/60">
                          {e.type}
                        </Badge>
                      </div>
                    </div>

                    <h3 className="font-bold text-sm mb-1.5 group-hover:text-primary transition-colors">{e.title}</h3>
                    <p className="text-xs text-muted-foreground leading-relaxed mb-4 line-clamp-2">{e.description}</p>

                    <div className="space-y-1.5 text-xs text-muted-foreground mb-4">
                      <div className="flex items-center gap-2">
                        <MapPin className="w-3.5 h-3.5 text-primary" />
                        {e.location}
                      </div>
                      <div className="flex items-center gap-2">
                        <Calendar className="w-3.5 h-3.5 text-primary" />
                        {new Date(e.date).toLocaleDateString()}
                      </div>
                      <div className="flex items-center gap-2">
                        <Users className="w-3.5 h-3.5 text-blue-400" />
                        {e.attendees?.length || 0} registered
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <Button className="flex-1 gap-1.5" size="sm" asChild>
                        <a href={e.link || "#"} target="_blank" rel="noopener noreferrer">
                          Register <ExternalLink className="w-3 h-3" />
                        </a>
                      </Button>
                      <Button variant="outline" size="sm" className="w-9 px-0">
                        <Bell className="w-3.5 h-3.5" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {filtered.length === 0 && (
            <div className="text-center py-16 text-muted-foreground">
              <Globe className="w-12 h-12 mx-auto mb-4 opacity-30" />
              <p className="text-lg">No events found</p>
            </div>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
}
