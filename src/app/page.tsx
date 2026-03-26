"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import {
  ArrowRight,
  Zap,
  BookOpen,
  Users,
  Globe,
  Video,
  Code2,
  Shield,
  TrendingUp,
  Star,
  CheckCircle2,
  Play,
  ChevronRight,
  Layers,
  FlaskConical,
  Award,
  Activity,
  Lock,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

const stats = [
  { label: "Active Learners", value: "50K+", icon: Users },
  { label: "Learning Paths", value: "200+", icon: Layers },
  { label: "Resources", value: "10K+", icon: BookOpen },
  { label: "Live Sessions/Month", value: "500+", icon: Video },
];

const features = [
  {
    icon: BookOpen,
    title: "Structured Learning",
    desc: "Follow curated roadmaps from beginner to expert. Notes, PDFs, videos, and hands-on tests — all in one place.",
    color: "text-blue-400",
    bg: "bg-blue-500/10",
    gradient: "from-blue-500/20 to-transparent",
    href: "/learning",
  },
  {
    icon: Users,
    title: "Vibrant Communities",
    desc: "Join public or private communities. Share knowledge, get help, pin important discussions, and grow together.",
    color: "text-purple-400",
    bg: "bg-purple-500/10",
    gradient: "from-purple-500/20 to-transparent",
    href: "/communities",
  },
  {
    icon: Globe,
    title: "Global Events",
    desc: "Discover tech events worldwide on an interactive 3D globe. Filter by topic, city, or urgency — never miss what matters.",
    color: "text-cyan-400",
    bg: "bg-cyan-500/10",
    gradient: "from-cyan-500/20 to-transparent",
    href: "/events",
  },
  {
    icon: Video,
    title: "Live Sessions",
    desc: "Create or join live coding sessions. Public or private, Google Meet integrated — collaborate in real time.",
    color: "text-green-400",
    bg: "bg-green-500/10",
    gradient: "from-green-500/20 to-transparent",
    href: "/sessions",
  },
  {
    icon: Code2,
    title: "Virtual Codex",
    desc: "Collaborative project workspaces with tasks, discussions, file sharing, and milestone tracking for your team.",
    color: "text-pink-400",
    bg: "bg-pink-500/10",
    gradient: "from-pink-500/20 to-transparent",
    href: "/codex",
  },
  {
    icon: FlaskConical,
    title: "Sandbox Learning",
    desc: "Learn by building real projects with guided step-by-step sandboxes. From portfolios to REST APIs — hands-on from day one.",
    color: "text-orange-400",
    bg: "bg-orange-500/10",
    gradient: "from-orange-500/20 to-transparent",
    href: "/sandbox",
  },
];

const plans = [
  {
    name: "Free",
    price: "₹0",
    period: "forever",
    desc: "Perfect to explore the platform",
    features: [
      "Basic learning paths",
      "Join public communities",
      "Browse events",
      "Limited resources",
    ],
    cta: "Start Free",
    href: "/signup",
    highlight: false,
  },
  {
    name: "Standard",
    price: "₹50",
    period: "per month",
    desc: "Everything you need to grow",
    features: [
      "Full learning paths & roadmaps",
      "All resources (notes, PDFs, videos)",
      "Join & create communities",
      "Live session access",
      "Codex participation",
      "Event registration",
      "Tests & performance analytics",
    ],
    cta: "Get Standard",
    href: "/signup?plan=standard",
    highlight: true,
  },
  {
    name: "Premium",
    price: "₹100",
    period: "per month",
    desc: "Unlock the full CodeSphere power",
    features: [
      "Everything in Standard",
      "AI-powered learning roadmaps",
      "Create private Codex projects",
      "Advanced sandbox workspaces",
      "Priority community access",
      "Premium tutorials & resources",
      "Advanced analytics dashboard",
    ],
    cta: "Go Premium",
    href: "/signup?plan=premium",
    highlight: false,
  },
];

const communities = [
  { name: "Full Stack Dev", members: "12.4K", tag: "Web", color: "bg-blue-500/20 text-blue-400 border-blue-500/30" },
  { name: "AI & ML Hub", members: "8.9K", tag: "AI", color: "bg-purple-500/20 text-purple-400 border-purple-500/30" },
  { name: "DevOps Circle", members: "6.2K", tag: "DevOps", color: "bg-orange-500/20 text-orange-400 border-orange-500/30" },
  { name: "Open Source Builders", members: "15.1K", tag: "OSS", color: "bg-green-500/20 text-green-400 border-green-500/30" },
  { name: "Mobile Dev Guild", members: "5.8K", tag: "Mobile", color: "bg-cyan-500/20 text-cyan-400 border-cyan-500/30" },
  { name: "Security Researchers", members: "4.3K", tag: "Security", color: "bg-red-500/20 text-red-400 border-red-500/30" },
];

const testimonials = [
  {
    name: "Priya Sharma",
    role: "Full Stack Developer",
    avatar: "PS",
    text: "CodeSphere transformed how I learn. The structured paths and live sessions are incredible. Went from a beginner to landing my first dev job in 6 months.",
    stars: 5,
  },
  {
    name: "Arjun Mehta",
    role: "ML Engineer",
    avatar: "AM",
    text: "The AI & ML community here is top-notch. Real practitioners, quality discussions, and the events page helped me find two hackathons near me.",
    stars: 5,
  },
  {
    name: "Kavya Reddy",
    role: "DevOps Engineer",
    avatar: "KR",
    text: "Virtual Codex is a game-changer for remote teams. We use it to collaborate on our open-source project. The sandbox tutorials saved me countless hours.",
    stars: 5,
  },
];

const upcomingEvents = [
  { title: "React Conf India 2025", location: "Bangalore, India", date: "Mar 22", color: "bg-green-500", type: "upcoming" },
  { title: "AI Summit Asia", location: "Singapore", date: "Mar 28", color: "bg-orange-500", type: "near" },
  { title: "DevFest Mumbai", location: "Mumbai, India", date: "Apr 5", color: "bg-blue-500", type: "upcoming" },
  { title: "HackIndia Finals", location: "Delhi, India", date: "Mar 20", color: "bg-red-500", type: "live" },
];

function AnimatedCounter({ value }: { value: string }) {
  return <span>{value}</span>;
}

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center pt-16 overflow-hidden hero-bg">
        {/* Background grid */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}
        />

        {/* Floating orbs */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-purple-500/5 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-1/2 right-1/3 w-64 h-64 bg-cyan-500/5 rounded-full blur-3xl pointer-events-none" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
          {/* Announcement badge */}
          <div className="flex justify-center mb-8">
            <Link href="/events">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-primary/30 bg-primary/10 text-sm hover:bg-primary/15 transition-colors cursor-pointer">
                <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                <span className="text-primary font-medium">HackIndia Finals are Live now</span>
                <ArrowRight className="w-3.5 h-3.5 text-primary" />
              </div>
            </Link>
          </div>

          {/* Headline */}
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight mb-6 leading-[1.1]">
            The Coding Ecosystem
            <br />
            <span className="gradient-text">That Changes Lives</span>
          </h1>

          <p className="text-lg sm:text-xl text-muted-foreground max-w-3xl mx-auto mb-10 leading-relaxed">
            Learn with structured paths, build with collaborative tools, connect through vibrant communities,
            and discover global events — all in one beautifully crafted platform.
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
            <Link href="/signup">
              <Button size="lg" className="gap-2 text-base px-8 py-6 bg-primary hover:bg-primary/90 shadow-lg shadow-primary/20">
                <Zap className="w-5 h-5" />
                Start Learning Free
                <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
            <Link href="/learning">
              <Button variant="outline" size="lg" className="gap-2 text-base px-8 py-6 border-border/60 hover:bg-accent/50">
                <Play className="w-4 h-4" />
                Explore Paths
              </Button>
            </Link>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-2xl mx-auto">
            {stats.map((s) => (
              <div key={s.label} className="glass rounded-xl p-4 text-center">
                <div className="text-2xl font-bold gradient-text mb-1">
                  <AnimatedCounter value={s.value} />
                </div>
                <div className="text-xs text-muted-foreground">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <Badge variant="outline" className="mb-4 border-primary/30 text-primary">Platform Features</Badge>
            <h2 className="text-4xl font-bold mb-4">
              Everything a developer needs,
              <br />
              <span className="gradient-text">in one place</span>
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              From your first line of code to landing your dream job — CodeSphere walks with you every step of the way.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((f) => (
              <Link key={f.title} href={f.href}>
                <Card
                  className="border-border/40 bg-card/50 backdrop-blur-sm card-hover overflow-hidden group relative h-full"
                >
                  <div className={`absolute inset-0 bg-gradient-to-br ${f.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />
                  <CardContent className="p-6 relative">
                    <div className={`w-12 h-12 rounded-xl ${f.bg} flex items-center justify-center mb-4`}>
                      <f.icon className={`w-6 h-6 ${f.color}`} />
                    </div>
                    <h3 className="font-semibold text-lg mb-2">{f.title}</h3>
                    <p className="text-muted-foreground text-sm leading-relaxed">{f.desc}</p>
                    <div className={`mt-4 flex items-center gap-1 text-sm ${f.color} opacity-0 group-hover:opacity-100 transition-opacity`}>
                      Explore <ChevronRight className="w-3.5 h-3.5" />
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Communities Section */}
      <section className="py-24 bg-muted/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <Badge variant="outline" className="mb-4 border-purple-500/30 text-purple-400">Communities</Badge>
              <h2 className="text-4xl font-bold mb-4">
                Find your tribe,
                <br />
                <span className="gradient-text">level up together</span>
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-8">
                Join thousands of developers in topic-focused communities. Public or private, moderated
                and welcoming. Share your journey, ask questions, collaborate on projects.
              </p>
              <div className="space-y-3 mb-8">
                {[
                  "Public & private community types",
                  "Pinned posts and moderation tools",
                  "Linked events and live sessions",
                  "Community-specific announcements",
                ].map((item) => (
                  <div key={item} className="flex items-center gap-2 text-sm">
                    <CheckCircle2 className="w-4 h-4 text-green-400 shrink-0" />
                    {item}
                  </div>
                ))}
              </div>
              <Link href="/communities">
                <Button className="gap-2">
                  Browse Communities <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
            </div>

            <div className="grid grid-cols-2 gap-3">
              {communities.map((c) => (
                <div
                  key={c.name}
                  className={`p-4 rounded-xl border ${c.color} card-hover cursor-pointer`}
                >
                  <div className={`text-xs font-medium px-2 py-0.5 rounded-full border w-fit mb-2 ${c.color}`}>
                    {c.tag}
                  </div>
                  <div className="font-semibold text-sm">{c.name}</div>
                  <div className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
                    <Users className="w-3 h-3" /> {c.members} members
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Events Preview Section */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Events list */}
            <div className="space-y-3">
              {upcomingEvents.map((e) => (
                <div
                  key={e.title}
                  className="flex items-center gap-4 p-4 rounded-xl border border-border/40 bg-card/50 card-hover"
                >
                  <div className={`w-3 h-3 rounded-full ${e.color} shrink-0 ${e.type === 'live' ? 'animate-pulse' : ''}`} />
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-sm truncate">{e.title}</div>
                    <div className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5">
                      <Globe className="w-3 h-3" /> {e.location}
                    </div>
                  </div>
                  <div className="text-xs text-muted-foreground whitespace-nowrap">{e.date}</div>
                  {e.type === 'live' && (
                    <Badge className="bg-red-500/20 text-red-400 border-red-500/30 text-xs">LIVE</Badge>
                  )}
                </div>
              ))}

              <div className="pt-2">
                <div className="flex items-center gap-4 text-xs text-muted-foreground mb-4">
                  <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-green-500 inline-block" /> Upcoming</span>
                  <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-orange-500 inline-block" /> Near deadline</span>
                  <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-red-500 inline-block animate-pulse" /> Live now</span>
                </div>
                <Link href="/events">
                  <Button variant="outline" className="gap-2">
                    Explore All Events <ArrowRight className="w-4 h-4" />
                  </Button>
                </Link>
              </div>
            </div>

            <div>
              <Badge variant="outline" className="mb-4 border-cyan-500/30 text-cyan-400">Global Events</Badge>
              <h2 className="text-4xl font-bold mb-4">
                The world of tech,
                <br />
                <span className="gradient-text">at your fingertips</span>
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-6">
                Discover conferences, hackathons, and meetups globally. Our interactive 3D globe shows
                events with color-coded urgency markers. Never miss a local event or global summit again.
              </p>
              <div className="space-y-3">
                {[
                  "Interactive 3D world map view",
                  "Color-coded event urgency",
                  "Filters by topic, city, date",
                  "Direct registration links",
                ].map((item) => (
                  <div key={item} className="flex items-center gap-2 text-sm">
                    <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0" />
                    {item}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-24 bg-muted/20" id="pricing">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <Badge variant="outline" className="mb-4 border-green-500/30 text-green-400">Fair Pricing</Badge>
            <h2 className="text-4xl font-bold mb-4">
              Start free, upgrade when
              <br />
              <span className="gradient-text">you're ready to grow</span>
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              No hard paywalls. Premium enhances your experience — core value is always accessible.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {plans.map((plan) => (
              <div
                key={plan.name}
                className={`relative rounded-2xl p-6 border ${plan.highlight
                  ? "border-primary/50 bg-primary/5 shadow-lg shadow-primary/10"
                  : "border-border/40 bg-card/50"
                  } card-hover`}
              >
                {plan.highlight && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <Badge className="badge-gradient text-xs px-3">Most Popular</Badge>
                  </div>
                )}
                <div className="mb-6">
                  <h3 className="font-bold text-xl mb-1">{plan.name}</h3>
                  <p className="text-sm text-muted-foreground mb-4">{plan.desc}</p>
                  <div className="flex items-end gap-1">
                    <span className="text-4xl font-bold">{plan.price}</span>
                    <span className="text-muted-foreground pb-1">/{plan.period}</span>
                  </div>
                </div>
                <ul className="space-y-2.5 mb-6">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-start gap-2 text-sm">
                      <CheckCircle2 className={`w-4 h-4 shrink-0 mt-0.5 ${plan.highlight ? "text-primary" : "text-green-400"}`} />
                      {f}
                    </li>
                  ))}
                </ul>
                <Link href={plan.href}>
                  <Button
                    className={`w-full ${plan.highlight ? "bg-primary hover:bg-primary/90" : ""}`}
                    variant={plan.highlight ? "default" : "outline"}
                  >
                    {plan.cta}
                  </Button>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <Badge variant="outline" className="mb-4 border-yellow-500/30 text-yellow-400">Success Stories</Badge>
            <h2 className="text-4xl font-bold mb-4">
              Developers who
              <br />
              <span className="gradient-text">changed their lives</span>
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {testimonials.map((t) => (
              <Card key={t.name} className="border-border/40 bg-card/50 card-hover">
                <CardContent className="p-6">
                  <div className="flex items-center gap-1 mb-4">
                    {Array.from({ length: t.stars }).map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                  <p className="text-sm text-muted-foreground leading-relaxed mb-5 italic">
                    &ldquo;{t.text}&rdquo;
                  </p>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-primary font-semibold text-sm">
                      {t.avatar}
                    </div>
                    <div>
                      <div className="font-medium text-sm">{t.name}</div>
                      <div className="text-xs text-muted-foreground">{t.role}</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Security / Trust */}
      <section className="py-16 bg-muted/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h3 className="text-xl font-semibold mb-2">Built for trust, built for scale</h3>
            <p className="text-muted-foreground text-sm">Enterprise-grade security with developer-first experience</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { icon: Shield, label: "JWT + OAuth Auth", color: "text-blue-400" },
              { icon: Lock, label: "End-to-End Security", color: "text-green-400" },
              { icon: Activity, label: "99.9% Uptime SLA", color: "text-purple-400" },
              { icon: Award, label: "RBAC Governance", color: "text-orange-400" },
            ].map((item) => (
              <div key={item.label} className="flex flex-col items-center gap-2 p-4 rounded-xl border border-border/40 bg-card/30 text-center">
                <item.icon className={`w-6 h-6 ${item.color}`} />
                <span className="text-sm font-medium">{item.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-24">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="relative p-12 rounded-3xl border border-primary/20 bg-primary/5 overflow-hidden">
            <div className="absolute inset-0 hero-bg opacity-50" />
            <div className="relative">
              <div className="flex justify-center mb-6">
                <div className="w-16 h-16 rounded-2xl animated-border p-[2px]">
                  <div className="w-full h-full rounded-[14px] bg-background flex items-center justify-center">
                    <Sparkles className="w-8 h-8 text-primary" />
                  </div>
                </div>
              </div>
              <h2 className="text-4xl sm:text-5xl font-bold mb-4">
                Ready to transform
                <br />
                <span className="gradient-text">your coding journey?</span>
              </h2>
              <p className="text-muted-foreground text-lg mb-8 max-w-2xl mx-auto">
                Join 50,000+ developers already learning, building, and growing on CodeSphere.
                Start free — upgrade whenever you're ready.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link href="/signup">
                  <Button size="lg" className="gap-2 text-base px-8 py-6 bg-primary hover:bg-primary/90 shadow-lg shadow-primary/20">
                    <Zap className="w-5 h-5" />
                    Start for Free Today
                    <ArrowRight className="w-4 h-4" />
                  </Button>
                </Link>
                <Link href="/pricing">
                  <Button variant="ghost" size="lg" className="text-base px-8 py-6">
                    View All Plans
                  </Button>
                </Link>
              </div>
              <p className="text-xs text-muted-foreground mt-4">
                No credit card required · Cancel anytime · ₹50/month for full access
              </p>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
