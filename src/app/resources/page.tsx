"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Search,
  FileText,
  Video,
  BookOpen,
  Bookmark,
  BookmarkCheck,
  Filter,
  Star,
  Clock,
  Tag,
  ChevronRight,
  Lock,
  Download,
  Eye,
  Play,
  StickyNote,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

const resourceTypes = [
  { label: "All", value: "all" },
  { label: "Notes", value: "notes", icon: StickyNote },
  { label: "PDFs", value: "pdf", icon: FileText },
  { label: "Videos", value: "video", icon: Video },
];

const categories = ["All Topics", "Web Dev", "Backend", "AI & ML", "DevOps", "Mobile", "Security", "DSA"];

const resources = [
  {
    id: 1, type: "pdf", title: "Complete Guide to React Hooks",
    desc: "Deep dive into useState, useEffect, useCallback, useMemo, and custom hooks with real examples.",
    category: "Web Dev", tags: ["React", "Hooks", "JavaScript"], views: 8400, rating: 4.9, duration: "45 min read",
    premium: false, saved: true, date: "Mar 15, 2025",
  },
  {
    id: 2, type: "video", title: "Node.js Authentication with JWT",
    desc: "Complete video walkthrough: build a secure auth system with access tokens and refresh tokens.",
    category: "Backend", tags: ["Node.js", "JWT", "Security"], views: 6200, rating: 4.8, duration: "1h 20min",
    premium: false, saved: false, date: "Mar 10, 2025",
  },
  {
    id: 3, type: "notes", title: "System Design Cheatsheet",
    desc: "Quick reference notes for load balancers, databases, caching, and distributed system patterns.",
    category: "Backend", tags: ["System Design", "Architecture"], views: 12000, rating: 4.9, duration: "20 min read",
    premium: true, saved: true, date: "Mar 8, 2025",
  },
  {
    id: 4, type: "video", title: "Tailwind CSS — Zero to Hero",
    desc: "Everything you need to build beautiful UIs with Tailwind. Utility classes, responsive design, dark mode.",
    category: "Web Dev", tags: ["Tailwind", "CSS", "UI"], views: 9800, rating: 4.7, duration: "2h 10min",
    premium: false, saved: false, date: "Mar 5, 2025",
  },
  {
    id: 5, type: "pdf", title: "Docker & Kubernetes Handbook",
    desc: "From containerization basics to Kubernetes orchestration. Deploy your apps like a pro.",
    category: "DevOps", tags: ["Docker", "Kubernetes", "DevOps"], views: 5400, rating: 4.8, duration: "1h 10min read",
    premium: true, saved: false, date: "Feb 28, 2025",
  },
  {
    id: 6, type: "notes", title: "DSA Patterns — 15 Must-Know",
    desc: "The 15 most common algorithm patterns for coding interviews. Sliding window, two pointers, BFS/DFS, and more.",
    category: "DSA", tags: ["DSA", "Algorithms", "Interviews"], views: 18000, rating: 4.9, duration: "30 min read",
    premium: false, saved: true, date: "Feb 22, 2025",
  },
  {
    id: 7, type: "video", title: "Machine Learning Fundamentals",
    desc: "Linear regression, classification, neural networks explained visually. For complete beginners.",
    category: "AI & ML", tags: ["ML", "Python", "scikit-learn"], views: 7600, rating: 4.8, duration: "3h 45min",
    premium: true, saved: false, date: "Feb 18, 2025",
  },
  {
    id: 8, type: "pdf", title: "TypeScript Advanced Patterns",
    desc: "Generics, conditional types, mapped types, decorators — become a TypeScript power user.",
    category: "Web Dev", tags: ["TypeScript", "JavaScript"], views: 4800, rating: 4.7, duration: "55 min read",
    premium: false, saved: true, date: "Feb 10, 2025",
  },
  {
    id: 9, type: "notes", title: "OWASP Top 10 Security Guide",
    desc: "Concise breakdown of the OWASP Top 10 vulnerabilities with prevention strategies.",
    category: "Security", tags: ["Security", "OWASP", "Web"], views: 6100, rating: 4.9, duration: "25 min read",
    premium: true, saved: false, date: "Feb 5, 2025",
  },
];

const typeConfig = {
  pdf: { icon: FileText, color: "text-red-400", bg: "bg-red-500/10", label: "PDF", action: "Download" },
  video: { icon: Video, color: "text-purple-400", bg: "bg-purple-500/10", label: "Video", action: "Watch" },
  notes: { icon: StickyNote, color: "text-blue-400", bg: "bg-blue-500/10", label: "Notes", action: "Read" },
};

export default function ResourcesPage() {
  const [activeType, setActiveType] = useState("all");
  const [activeCategory, setActiveCategory] = useState("All Topics");
  const [search, setSearch] = useState("");
  const [savedItems, setSavedItems] = useState<Set<number>>(
    new Set(resources.filter((r) => r.saved).map((r) => r.id))
  );

  const toggleSave = (id: number) => {
    setSavedItems((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
  };

  const filtered = resources.filter((r) => {
    const matchType = activeType === "all" || r.type === activeType;
    const matchCat = activeCategory === "All Topics" || r.category === activeCategory;
    const matchSearch = r.title.toLowerCase().includes(search.toLowerCase()) ||
      r.tags.some((t) => t.toLowerCase().includes(search.toLowerCase()));
    return matchType && matchCat && matchSearch;
  });

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="pt-16">
        {/* Hero */}
        <div className="relative py-16 hero-bg border-b border-border/40">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <Badge variant="outline" className="mb-4 border-purple-500/30 text-purple-400">Resource Hub</Badge>
            <h1 className="text-4xl sm:text-5xl font-bold mb-4">
              Everything you need to
              <br />
              <span className="gradient-text">learn and grow</span>
            </h1>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto mb-8">
              Curated notes, PDFs, and video tutorials by expert developers. Searchable, 
              bookmarkable, and organized by topic.
            </p>
            <div className="relative max-w-xl mx-auto">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search resources, topics, technologies..."
                className="pl-11 h-12 text-base bg-background/80 backdrop-blur-sm border-border/60"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Filters row */}
          <div className="flex flex-col sm:flex-row gap-4 mb-8">
            {/* Type filter */}
            <div className="flex items-center gap-2">
              {resourceTypes.map((t) => (
                <button
                  key={t.value}
                  onClick={() => setActiveType(t.value)}
                  className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-sm transition-colors border ${
                    activeType === t.value
                      ? "bg-primary text-primary-foreground border-primary"
                      : "border-border/60 hover:border-border/80"
                  }`}
                >
                  {t.icon && <t.icon className="w-3.5 h-3.5" />}
                  {t.label}
                </button>
              ))}
            </div>

            {/* Category filter */}
            <div className="flex items-center gap-2 overflow-x-auto">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`px-3 py-1.5 rounded-full text-xs whitespace-nowrap transition-colors border ${
                    activeCategory === cat
                      ? "bg-accent text-accent-foreground border-accent"
                      : "border-border/40 hover:border-border/80 text-muted-foreground"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Results count */}
          <div className="flex items-center justify-between mb-6">
            <p className="text-sm text-muted-foreground">
              <span className="text-foreground font-medium">{filtered.length}</span> resources found
            </p>
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <Bookmark className="w-3.5 h-3.5" />
              {savedItems.size} saved
            </div>
          </div>

          {/* Resource grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filtered.map((r) => {
              const config = typeConfig[r.type as keyof typeof typeConfig];
              const isSaved = savedItems.has(r.id);
              return (
                <Card key={r.id} className="border-border/40 bg-card/50 card-hover group overflow-hidden">
                  <CardContent className="p-5">
                    <div className="flex items-start justify-between mb-3">
                      <div className={`w-10 h-10 rounded-xl ${config.bg} flex items-center justify-center shrink-0`}>
                        <config.icon className={`w-5 h-5 ${config.color}`} />
                      </div>
                      <div className="flex items-center gap-2">
                        {r.premium && (
                          <Badge className="badge-gradient text-[10px] px-1.5 py-0 h-4 flex items-center gap-1">
                            <Lock className="w-2.5 h-2.5" /> Premium
                          </Badge>
                        )}
                        <button
                          onClick={() => toggleSave(r.id)}
                          className="p-1 rounded-md hover:bg-accent/50 transition-colors"
                        >
                          {isSaved
                            ? <BookmarkCheck className="w-4 h-4 text-primary" />
                            : <Bookmark className="w-4 h-4 text-muted-foreground" />
                          }
                        </button>
                      </div>
                    </div>

                    <Badge variant="outline" className="text-[10px] px-1.5 py-0 h-4 mb-2 border-border/60">
                      {r.category}
                    </Badge>

                    <h3 className="font-semibold text-sm mb-1.5 group-hover:text-primary transition-colors line-clamp-2">
                      {r.title}
                    </h3>
                    <p className="text-xs text-muted-foreground leading-relaxed mb-3 line-clamp-2">{r.desc}</p>

                    {/* Tags */}
                    <div className="flex flex-wrap gap-1 mb-4">
                      {r.tags.map((tag) => (
                        <span key={tag} className="text-[10px] bg-accent/50 px-1.5 py-0.5 rounded text-muted-foreground">
                          {tag}
                        </span>
                      ))}
                    </div>

                    {/* Meta */}
                    <div className="flex items-center gap-3 text-xs text-muted-foreground mb-4">
                      <span className="flex items-center gap-1">
                        <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" /> {r.rating}
                      </span>
                      <span className="flex items-center gap-1">
                        <Eye className="w-3 h-3" /> {(r.views / 1000).toFixed(1)}K
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" /> {r.duration}
                      </span>
                    </div>

                    <Button
                      className="w-full gap-2"
                      size="sm"
                      variant={r.premium ? "outline" : "default"}
                    >
                      {r.premium ? (
                        <><Lock className="w-3.5 h-3.5" /> Unlock Resource</>
                      ) : (
                        <>
                          {r.type === "video" ? <Play className="w-3.5 h-3.5" /> : r.type === "pdf" ? <Download className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                          {config.action}
                        </>
                      )}
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {filtered.length === 0 && (
            <div className="text-center py-20 text-muted-foreground">
              <BookOpen className="w-12 h-12 mx-auto mb-4 opacity-30" />
              <p className="text-lg">No resources found</p>
              <p className="text-sm">Try a different search or filter</p>
            </div>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
}
