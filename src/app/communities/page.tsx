"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  Search,
  Users,
  Lock,
  Globe,
  Plus,
  ChevronRight,
  MessageSquare,
  Pin,
  Star,
  TrendingUp,
  Filter,
  Hash,
  Video,
  Bell,
  UserCheck,
  UserPlus,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { apiFetch } from "@/lib/api";
import { toast } from "sonner";

export default function CommunitiesPage() {
  const [search, setSearch] = useState("");
  const [communities, setCommunities] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCommunities = async () => {
      try {
        const data = await apiFetch('/communities');
        setCommunities(data);
      } catch (error) {
        console.error("Failed to fetch communities:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchCommunities();
  }, []);

  const toggleJoin = async (id: string, currentlyJoined: boolean) => {
    try {
      if (currentlyJoined) {
        // Leave logic could be added here
        toast.info("Leaving community...");
      } else {
        await apiFetch(`/communities/${id}/join`, { method: 'POST' });
        toast.success("Joined community!");
        // Refresh communities to update member count/joined status
        const data = await apiFetch('/communities');
        setCommunities(data);
      }
    } catch (error) {
      toast.error("Failed to update membership");
    }
  };

  const filtered = communities.filter((c) =>
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    c.description.toLowerCase().includes(search.toLowerCase()) ||
    c.tags.some((t: string) => t.toLowerCase().includes(search.toLowerCase()))
  );

  const myComms = communities.filter(c => c.joined);

  const pinnedPosts = [
    { id: 1, community: "Full Stack Dev Hub", title: "Monthly Project Showcase — Share what you're building!", replies: 48, type: "pinned" },
    { id: 2, community: "AI & ML Hub", title: "Best resources for learning LLMs from scratch (curated list)", replies: 34, type: "pinned" },
    { id: 3, community: "DevOps Circle", title: "Live Session Tonight: Zero-downtime deployment with Kubernetes", replies: 22, type: "session" },
  ];

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
                <Badge variant="outline" className="mb-3 border-purple-500/30 text-purple-400">Communities</Badge>
                <h1 className="text-4xl font-bold mb-2">
                  Find your tribe,
                  <br />
                  <span className="gradient-text">grow together</span>
                </h1>
                <p className="text-muted-foreground max-w-xl">
                  Public and private communities for every developer. Discuss, collaborate,
                  share sessions, and build real connections.
                </p>
              </div>
              <Link href="/communities/new">
                <Button className="gap-2 bg-primary hover:bg-primary/90 shrink-0">
                  <Plus className="w-4 h-4" />
                  Create Community
                </Button>
              </Link>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Tabs defaultValue="all">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
              <TabsList className="bg-muted/50">
                <TabsTrigger value="all">All Communities</TabsTrigger>
                <TabsTrigger value="mine">
                  My Communities
                  {myComms.length > 0 && (
                    <Badge className="ml-1.5 bg-primary/20 text-primary border-primary/30 text-[10px] h-4 px-1.5">
                      {myComms.length}
                    </Badge>
                  )}
                </TabsTrigger>
                <TabsTrigger value="trending">Trending</TabsTrigger>
              </TabsList>

              <div className="relative w-full sm:w-64">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Search communities..."
                  className="pl-9 h-9"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
            </div>

            <div className="grid lg:grid-cols-3 gap-6">
              {/* Main column */}
              <div className="lg:col-span-2">
                <TabsContent value="all" className="mt-0 space-y-4">
                  {filtered.map((c) => (
                    <CommunityCard key={c._id} c={c} onToggle={() => toggleJoin(c._id, false)} />
                  ))}
                </TabsContent>

                <TabsContent value="mine" className="mt-0 space-y-4">
                  <div className="text-center py-16 text-muted-foreground">
                    <Users className="w-12 h-12 mx-auto mb-4 opacity-30" />
                    <p>My Communities filter is coming soon based on your joined status.</p>
                  </div>
                </TabsContent>

                <TabsContent value="trending" className="mt-0 space-y-4">
                  {filtered.map((c) => (
                    <CommunityCard key={c._id} c={c} onToggle={() => toggleJoin(c._id, false)} />
                  ))}
                </TabsContent>
              </div>

              {/* Sidebar */}
              <div className="space-y-5">
                {/* Pinned posts */}
                <Card className="border-border/40 bg-card/50">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base flex items-center gap-2">
                      <Pin className="w-4 h-4 text-primary" /> Pinned Posts
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {pinnedPosts.map((p) => (
                      <div key={p.id} className="p-3 rounded-lg border border-border/40 hover:border-border/80 cursor-pointer transition-colors">
                        <div className="text-[10px] text-muted-foreground mb-1">{p.community}</div>
                        <div className="text-xs font-medium leading-snug mb-1.5">{p.title}</div>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <MessageSquare className="w-3 h-3" /> {p.replies} replies
                          {p.type === "session" && <Badge className="bg-green-500/20 text-green-400 border-green-500/30 text-[10px]">Live</Badge>}
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>

                {/* Stats */}
                <Card className="border-border/40 bg-card/50">
                  <CardContent className="p-5">
                    <div className="grid grid-cols-2 gap-4">
                      {[
                        { label: "Communities", value: "240+", icon: Hash },
                        { label: "Members", value: "50K+", icon: Users },
                        { label: "Posts Today", value: "1.2K", icon: MessageSquare },
                        { label: "Live Now", value: "12", icon: Video },
                      ].map((s) => (
                        <div key={s.label} className="text-center">
                          <s.icon className="w-4 h-4 text-muted-foreground mx-auto mb-1" />
                          <div className="font-bold text-lg gradient-text">{s.value}</div>
                          <div className="text-xs text-muted-foreground">{s.label}</div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </Tabs>
        </div>
      </div>
      <Footer />
    </div>
  );
}

function CommunityCard({
  c,
  onToggle,
}: {
  c: any;
  onToggle: () => void;
}) {
  const joined = false; // This should ideally come from backend user session

  return (
    <Card className="border-border/40 bg-card/50 card-hover overflow-hidden">
      <div className={`h-1 bg-gradient-to-r from-primary/20 to-transparent`} />
      <CardContent className="p-5">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1.5">
              <h3 className="font-semibold truncate">{c.name}</h3>
              {c.isPublic ? (
                <Globe className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
              ) : (
                <Lock className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
              )}
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed mb-3">{c.description}</p>
            <div className="flex items-center gap-3 text-xs text-muted-foreground mb-3">
              <span className="flex items-center gap-1">
                <Users className="w-3 h-3" /> {c.memberCount || 0} members
              </span>
              <span className="flex items-center gap-1">
                <MessageSquare className="w-3 h-3" /> 0 posts
              </span>
            </div>
            <div className="flex flex-wrap gap-1">
              {c.tags.map((tag: string) => (
                <span key={tag} className={`text-[10px] px-2 py-0.5 rounded-full border border-primary/20 bg-primary/5 text-primary`}>{tag}</span>
              ))}
            </div>
          </div>
          <div className="flex flex-col items-end gap-2 shrink-0">
            <Button
              size="sm"
              variant={joined ? "outline" : "default"}
              className={`gap-1.5 ${joined ? "" : "bg-primary hover:bg-primary/90"}`}
              onClick={onToggle}
            >
              {joined ? (
                <><UserCheck className="w-3.5 h-3.5" /> Joined</>
              ) : (
                <><UserPlus className="w-3.5 h-3.5" /> Join</>
              )}
            </Button>
            <Link href={`/communities/${c._id}`}>
              <Button size="sm" variant="ghost" className="gap-1.5 text-xs">
                View <ChevronRight className="w-3 h-3" />
              </Button>
            </Link>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
