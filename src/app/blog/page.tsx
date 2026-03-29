import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Clock, User } from "lucide-react";

const posts = [
  { title: "Building a Full-Stack App with Next.js 15 and React 19", author: "Venkat Karthik", date: "Mar 20, 2026", readTime: "8 min read", tag: "Tutorial", desc: "A deep dive into the new features of Next.js 15 and how to leverage React 19 Server Components for production apps." },
  { title: "Why Community-Driven Learning Outperforms Solo Study", author: "Priya Sharma", date: "Mar 15, 2026", readTime: "5 min read", tag: "Opinion", desc: "Research shows developers who learn in communities progress 3x faster. Here's why and how to find your tribe." },
  { title: "The Rise of AI-Powered Learning Roadmaps", author: "Arjun Mehta", date: "Mar 10, 2026", readTime: "6 min read", tag: "AI", desc: "How CodeSphere uses AI to generate personalized learning paths based on your goals, current skills, and time availability." },
  { title: "From Zero to First Dev Job in 6 Months", author: "Kavya Reddy", date: "Mar 5, 2026", readTime: "10 min read", tag: "Career", desc: "A real story of how structured learning paths, live sessions, and community support helped land a full-stack role." },
  { title: "WebSockets vs Server-Sent Events: When to Use What", author: "Ravi Verma", date: "Feb 28, 2026", readTime: "7 min read", tag: "Technical", desc: "A practical comparison of real-time communication patterns with code examples for both approaches." },
  { title: "CodeSphere 2026 Roadmap: What's Coming Next", author: "CodeSphere Team", date: "Feb 20, 2026", readTime: "4 min read", tag: "Product", desc: "AI roadmaps, collaborative sandboxes, mobile app, and more — here's everything we're building this year." },
];

const tagColors: Record<string, string> = {
  Tutorial: "bg-blue-500/20 text-blue-400 border-blue-500/30",
  Opinion: "bg-purple-500/20 text-purple-400 border-purple-500/30",
  AI: "bg-cyan-500/20 text-cyan-400 border-cyan-500/30",
  Career: "bg-green-500/20 text-green-400 border-green-500/30",
  Technical: "bg-orange-500/20 text-orange-400 border-orange-500/30",
  Product: "bg-pink-500/20 text-pink-400 border-pink-500/30",
};

export default function BlogPage() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="pt-24 pb-16 max-w-5xl mx-auto px-4">
        <Badge variant="outline" className="mb-4 border-primary/30 text-primary">Blog</Badge>
        <h1 className="text-4xl font-bold mb-3">Stories, tutorials & insights</h1>
        <p className="text-muted-foreground text-lg mb-12">From the CodeSphere team and community.</p>
        <div className="grid md:grid-cols-2 gap-6">
          {posts.map((post) => (
            <Card key={post.title} className="border-border/40 bg-card/50 card-hover cursor-pointer group">
              <CardContent className="p-6">
                <Badge variant="outline" className={`text-[10px] px-2 py-0.5 mb-3 ${tagColors[post.tag] ?? ""}`}>{post.tag}</Badge>
                <h2 className="font-bold text-base mb-2 group-hover:text-primary transition-colors leading-snug">{post.title}</h2>
                <p className="text-sm text-muted-foreground mb-4 line-clamp-2">{post.desc}</p>
                <div className="flex items-center gap-4 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1"><User className="w-3 h-3" />{post.author}</span>
                  <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{post.readTime}</span>
                  <span className="ml-auto">{post.date}</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
      <Footer />
    </div>
  );
}
