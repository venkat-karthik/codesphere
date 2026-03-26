"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  Search,
  Filter,
  ChevronRight,
  Lock,
  Star,
  BookOpen,
  Users,
  Clock,
  CheckCircle2,
  Layers,
  Code2,
  Cpu,
  Smartphone,
  Shield,
  Database,
  Globe,
  Zap,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { apiFetch } from "@/lib/api";

const categories = [
  { label: "All", value: "all", icon: Layers },
  { label: "Web Dev", value: "web", icon: Globe },
  { label: "Backend", value: "backend", icon: Database },
  { label: "Mobile", value: "mobile", icon: Smartphone },
  { label: "AI & ML", value: "ai", icon: Cpu },
  { label: "DevOps", value: "devops", icon: Code2 },
  { label: "Security", value: "security", icon: Shield },
];

export default function LearningPage() {
  const [activeCategory, setActiveCategory] = useState("all");
  const [search, setSearch] = useState("");
  const [paths, setPaths] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPaths = async () => {
      try {
        const data = await apiFetch('/learning');
        setPaths(data);
      } catch (error) {
        console.error("Failed to fetch learning paths:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchPaths();
  }, []);

  const filtered = paths.filter((p) => {
    const matchCat = activeCategory === "all" || p.tags.some((t: string) => t.toLowerCase().includes(activeCategory));
    const matchSearch = p.title.toLowerCase().includes(search.toLowerCase()) ||
      p.description.toLowerCase().includes(search.toLowerCase()) ||
      p.tags.some((t: string) => t.toLowerCase().includes(search.toLowerCase()));
    return matchCat && matchSearch;
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mb-4" />
          <p className="ml-3 text-muted-foreground animate-pulse">Loading paths...</p>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="pt-16">
        {/* Header */}
        <div className="relative py-16 hero-bg border-b border-border/40">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <Badge variant="outline" className="mb-4 border-primary/30 text-primary">Learning Paths</Badge>
            <h1 className="text-4xl sm:text-5xl font-bold mb-4">
              Your roadmap to
              <br />
              <span className="gradient-text">becoming unstoppable</span>
            </h1>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto mb-8">
              Structured paths from absolute beginner to job-ready engineer. Every path has curated
              resources, tests, and real-world projects.
            </p>
            {/* Search */}
            <div className="relative max-w-xl mx-auto">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search paths, topics, technologies..."
                className="pl-11 h-12 text-base bg-background/80 backdrop-blur-sm border-border/60"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Category filters */}
          <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-8 scrollbar-none">
            {categories.map((cat) => (
              <button
                key={cat.value}
                onClick={() => setActiveCategory(cat.value)}
                className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm whitespace-nowrap transition-colors border ${activeCategory === cat.value
                  ? "bg-primary text-primary-foreground border-primary"
                  : "border-border/60 hover:border-border/80 hover:bg-accent/50"
                  }`}
              >
                <cat.icon className="w-3.5 h-3.5" />
                {cat.label}
              </button>
            ))}
          </div>

          {/* Stats bar */}
          <div className="flex items-center justify-between mb-6">
            <p className="text-sm text-muted-foreground">
              Showing <span className="text-foreground font-medium">{filtered.length}</span> paths
            </p>
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <div className="flex items-center gap-1">
                <Lock className="w-3 h-3 text-yellow-400" /> = Premium only
              </div>
            </div>
          </div>

          {/* Paths grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((path) => (
              <Card
                key={path._id}
                className="border-border/40 bg-card/50 card-hover overflow-hidden group"
              >
                {/* Gradient header */}
                <div className={`h-2 bg-gradient-to-r ${path.color || 'from-primary/20 to-primary/40'}`} />
                <CardContent className="p-5">
                  {/* Top row */}
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex flex-wrap gap-1.5">
                      {path.tags.slice(0, 2).map((tag: string) => (
                        <Badge key={tag} variant="outline" className="text-[10px] px-1.5 py-0 h-4 border-border/60">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                    {path.premium && (
                      <Badge className="badge-gradient text-[10px] px-2 py-0 h-5 flex items-center gap-1 shrink-0">
                        <Lock className="w-2.5 h-2.5" /> Premium
                      </Badge>
                    )}
                  </div>

                  <h3 className="font-bold text-base mb-1.5 group-hover:text-primary transition-colors">{path.title}</h3>
                  <p className="text-xs text-muted-foreground leading-relaxed mb-4">{path.description}</p>

                  {/* Meta */}
                  <div className="flex items-center gap-3 text-xs text-muted-foreground mb-4">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" /> {path.duration || '20h'}
                    </span>
                    <span className="flex items-center gap-1">
                      <BookOpen className="w-3 h-3" /> {path.modules?.length || 0} modules
                    </span>
                    <span className="flex items-center gap-1">
                      <Users className="w-3 h-3" /> {path.estimatedHours || 0}h
                    </span>
                  </div>

                  {/* Rating & level */}
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-1">
                      <Star className="w-3.5 h-3.5 fill-yellow-400 text-yellow-400" />
                      <span className="text-xs font-medium">{path.rating || 4.5}</span>
                    </div>
                    <span className="text-xs text-muted-foreground">{path.difficulty}</span>
                  </div>

                  {/* Progress (if started) */}
                  {path.progress > 0 && (
                    <div className="mb-4">
                      <div className="flex items-center justify-between text-xs mb-1">
                        <span className="text-muted-foreground">Progress</span>
                        <span className="text-primary font-medium">{path.progress}%</span>
                      </div>
                      <Progress value={path.progress} className="h-1.5" />
                    </div>
                  )}

                  {/* CTA */}
                  <Link href={`/learning/${path._id}`}>
                    <Button
                      className={`w-full gap-2 ${path.isPremium ? "variant-outline" : ""}`}
                      variant={path.progress > 0 ? "default" : path.isPremium ? "outline" : "default"}
                      size="sm"
                    >
                      {path.isPremium ? (
                        <><Lock className="w-3.5 h-3.5" /> Unlock with Premium</>
                      ) : path.progress > 0 ? (
                        <>Continue Learning <ChevronRight className="w-3.5 h-3.5" /></>
                      ) : (
                        <>Start Path <ChevronRight className="w-3.5 h-3.5" /></>
                      )}
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>

          {filtered.length === 0 && (
            <div className="text-center py-20 text-muted-foreground">
              <Layers className="w-12 h-12 mx-auto mb-4 opacity-30" />
              <p className="text-lg">No paths found</p>
              <p className="text-sm">Try a different search or category</p>
            </div>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
}
