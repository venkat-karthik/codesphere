"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import {
  Code2,
  Menu,
  X,
  ChevronDown,
  Globe,
  BookOpen,
  Users,
  Video,
  Zap,
  LayoutDashboard,
  Shield,
  Layers,
  FlaskConical,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

const navItems = [
  {
    label: "Learn",
    icon: BookOpen,
    items: [
      { label: "Learning Paths", href: "/learning", icon: Layers, desc: "Structured roadmaps for every skill" },
      { label: "Resource Hub", href: "/resources", icon: BookOpen, desc: "Notes, PDFs, videos & more" },
      { label: "Sandbox", href: "/sandbox", icon: FlaskConical, desc: "Learn by building" },
    ],
  },
  {
    label: "Community",
    icon: Users,
    items: [
      { label: "Communities", href: "/communities", icon: Users, desc: "Join or create communities" },
      { label: "Live Sessions", href: "/sessions", icon: Video, desc: "Join live coding sessions" },
      { label: "Virtual Codex", href: "/codex", icon: Code2, desc: "Collaborative project spaces" },
    ],
  },
  {
    label: "Events",
    href: "/events",
    icon: Globe,
  },
  {
    label: "Pricing",
    href: "/pricing",
    icon: Zap,
  },
];

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isAuth, setIsAuth] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    // Check for mock token
    setIsAuth(document.cookie.includes("auth-token="));
  }, [pathname]);

  const handleSignout = () => {
    document.cookie = "auth-token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
    setIsAuth(false);
    window.location.href = "/";
  };

  const isDashboard = pathname?.startsWith("/dashboard") || pathname?.startsWith("/admin");

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 border-b border-border/40",
        "bg-background/80 backdrop-blur-xl"
      )}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="w-8 h-8 rounded-lg animated-border p-[1.5px] group-hover:scale-105 transition-transform">
              <div className="w-full h-full rounded-[6px] bg-background flex items-center justify-center">
                <Code2 className="w-4 h-4 text-primary" />
              </div>
            </div>
            <span className="font-bold text-lg gradient-text">CodeSphere</span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-1">
            {navItems.map((item) =>
              item.items ? (
                <DropdownMenu key={item.label}>
                  <DropdownMenuTrigger asChild>
                    <button className="flex items-center gap-1 px-3 py-2 text-sm text-muted-foreground hover:text-foreground rounded-md hover:bg-accent/50 transition-colors">
                      {item.label}
                      <ChevronDown className="w-3.5 h-3.5" />
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="start" className="w-64 p-2">
                    {item.items.map((sub) => (
                      <DropdownMenuItem key={sub.href} asChild className="p-0">
                        <Link
                          href={sub.href}
                          className="flex items-start gap-3 p-2.5 rounded-md hover:bg-accent/50 cursor-pointer"
                        >
                          <div className="w-8 h-8 rounded-md bg-primary/10 flex items-center justify-center shrink-0 mt-0.5">
                            <sub.icon className="w-4 h-4 text-primary" />
                          </div>
                          <div>
                            <div className="text-sm font-medium">{sub.label}</div>
                            <div className="text-xs text-muted-foreground">{sub.desc}</div>
                          </div>
                        </Link>
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <Link
                  key={item.label}
                  href={item.href!}
                  className={cn(
                    "px-3 py-2 text-sm rounded-md transition-colors",
                    pathname === item.href
                      ? "text-foreground bg-accent/50"
                      : "text-muted-foreground hover:text-foreground hover:bg-accent/50"
                  )}
                >
                  {item.label}
                </Link>
              )
            )}
          </nav>

          {/* Auth buttons */}
          <div className="hidden md:flex items-center gap-2">
            {isAuth ? (
              <>
                {!isDashboard && (
                  <Link href="/dashboard">
                    <Button variant="ghost" size="sm" className="gap-1.5">
                      <LayoutDashboard className="w-4 h-4" />
                      Dashboard
                    </Button>
                  </Link>
                )}
                {isDashboard && (
                  <Link href="/admin">
                    <Button variant="ghost" size="sm" className="gap-1.5">
                      <Shield className="w-4 h-4" />
                      Admin
                    </Button>
                  </Link>
                )}
                <Button variant="ghost" size="sm" onClick={handleSignout} className="text-muted-foreground hover:text-red-400">
                  Sign Out
                </Button>
              </>
            ) : (
              <>
                <Link href="/login">
                  <Button variant="ghost" size="sm">Sign In</Button>
                </Link>
                <Link href="/signup">
                  <Button size="sm" className="gap-1.5 bg-primary hover:bg-primary/90">
                    <Zap className="w-3.5 h-3.5" />
                    Get Started
                  </Button>
                </Link>
              </>
            )}
          </div>

          {/* Mobile toggle */}
          <button
            className="md:hidden p-2 rounded-md hover:bg-accent/50"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden border-t border-border/40 bg-background/95 backdrop-blur-xl">
          <div className="px-4 py-4 space-y-1">
            <Link href="/learning" className="flex items-center gap-2 px-3 py-2 text-sm rounded-md hover:bg-accent/50" onClick={() => setMobileOpen(false)}>
              <BookOpen className="w-4 h-4 text-primary" /> Learning Paths
            </Link>
            <Link href="/resources" className="flex items-center gap-2 px-3 py-2 text-sm rounded-md hover:bg-accent/50" onClick={() => setMobileOpen(false)}>
              <Layers className="w-4 h-4 text-primary" /> Resource Hub
            </Link>
            <Link href="/communities" className="flex items-center gap-2 px-3 py-2 text-sm rounded-md hover:bg-accent/50" onClick={() => setMobileOpen(false)}>
              <Users className="w-4 h-4 text-primary" /> Communities
            </Link>
            <Link href="/events" className="flex items-center gap-2 px-3 py-2 text-sm rounded-md hover:bg-accent/50" onClick={() => setMobileOpen(false)}>
              <Globe className="w-4 h-4 text-primary" /> Events
            </Link>
            <Link href="/sessions" className="flex items-center gap-2 px-3 py-2 text-sm rounded-md hover:bg-accent/50" onClick={() => setMobileOpen(false)}>
              <Video className="w-4 h-4 text-primary" /> Live Sessions
            </Link>
            <Link href="/codex" className="flex items-center gap-2 px-3 py-2 text-sm rounded-md hover:bg-accent/50" onClick={() => setMobileOpen(false)}>
              <Code2 className="w-4 h-4 text-primary" /> Virtual Codex
            </Link>
            <Link href="/sandbox" className="flex items-center gap-2 px-3 py-2 text-sm rounded-md hover:bg-accent/50" onClick={() => setMobileOpen(false)}>
              <FlaskConical className="w-4 h-4 text-primary" /> Sandbox
            </Link>
            <Link href="/pricing" className="flex items-center gap-2 px-3 py-2 text-sm rounded-md hover:bg-accent/50" onClick={() => setMobileOpen(false)}>
              <Zap className="w-4 h-4 text-primary" /> Pricing
            </Link>
            <div className="pt-3 border-t border-border/40 flex gap-2">
              <Link href="/login" className="flex-1" onClick={() => setMobileOpen(false)}>
                <Button variant="outline" className="w-full" size="sm">Sign In</Button>
              </Link>
              <Link href="/signup" className="flex-1" onClick={() => setMobileOpen(false)}>
                <Button className="w-full" size="sm">Get Started</Button>
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
