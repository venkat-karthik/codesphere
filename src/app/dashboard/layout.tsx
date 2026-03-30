"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  Code2,
  LayoutDashboard,
  BookOpen,
  Layers,
  Users,
  Globe,
  Video,
  FlaskConical,
  FileText,
  Bell,
  Settings,
  ChevronRight,
  Zap,
  LogOut,
  Shield,
  CreditCard,
  Menu,
  X,
  GraduationCap,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { apiFetch } from "@/lib/api";
import { toast } from "sonner";

const navGroups = [
  {
    label: "Main",
    items: [
      { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
      { label: "Notifications", href: "/dashboard/notifications", icon: Bell, badge: "3" },
    ],
  },
  {
    label: "Learn",
    items: [
      { label: "Learning Paths", href: "/learning", icon: Layers },
      { label: "Resources", href: "/resources", icon: BookOpen },
      { label: "Sandbox", href: "/sandbox", icon: FlaskConical },
      { label: "Tests", href: "/tests", icon: FileText },
    ],
  },
  {
    label: "Connect",
    items: [
      { label: "Communities", href: "/communities", icon: Users },
      { label: "Events", href: "/events", icon: Globe },
      { label: "Live Sessions", href: "/sessions", icon: Video },
      { label: "Virtual Codex", href: "/codex", icon: Code2 },
    ],
  },
  {
    label: "Account",
    items: [
      { label: "Subscription", href: "/dashboard/subscription", icon: CreditCard },
      { label: "Settings", href: "/dashboard/settings", icon: Settings },
    ],
  },
];

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    apiFetch("/users/me").then(setUser).catch(() => {});
  }, []);

  const role: string = user?.role ?? "student";
  const isInstructor = role === "instructor" || role === "admin";
  const isAdmin = role === "admin";

  const handleLogout = () => {
    document.cookie = "auth-token=; path=/; max-age=0";
    document.cookie = "admin-verified=; path=/; max-age=0";
    toast.success("Signed out successfully");
    router.push("/login");
  };

  const initials = user?.name
    ? user.name.split(" ").map((n: string) => n[0]).join("").toUpperCase().slice(0, 2)
    : "CS";

  const SidebarContent = () => (
    <>
      {/* Logo */}
      <div className="p-5 border-b border-sidebar-border">
        <Link href="/" className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg animated-border p-[1.5px]">
            <div className="w-full h-full rounded-[6px] bg-sidebar flex items-center justify-center">
              <Code2 className="w-4 h-4 text-primary" />
            </div>
          </div>
          <span className="font-bold text-lg gradient-text">CodeSphere</span>
        </Link>
      </div>

      {/* User info */}
      <div className="p-4 border-b border-sidebar-border">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-primary/20 flex items-center justify-center text-primary font-semibold text-sm shrink-0">
            {initials}
          </div>
          <div className="min-w-0">
            <div className="font-medium text-sm text-sidebar-foreground truncate">
              {user?.name || "Loading..."}
            </div>
            <div className="flex items-center gap-1 mt-0.5">
              <Badge className="badge-gradient text-[10px] px-1.5 py-0 h-4">
                {user?.plan || "Free"}
              </Badge>
              {role !== "student" && (
                <Badge className={`text-[10px] px-1.5 py-0 h-4 capitalize ${role === "admin" ? "bg-primary/20 text-primary" : "bg-green-500/20 text-green-400"}`}>
                  {role}
                </Badge>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Nav groups */}
      <nav className="flex-1 p-3 space-y-5">
        {navGroups.map((group) => (
          <div key={group.label}>
            <div className="text-[10px] uppercase tracking-widest text-sidebar-foreground/40 px-2 mb-1.5 font-medium">
              {group.label}
            </div>
            <ul className="space-y-0.5">
              {group.items.map((item) => {
                const active = pathname === item.href || (item.href !== "/dashboard" && pathname?.startsWith(item.href));
                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      onClick={() => setSidebarOpen(false)}
                      className={cn(
                        "flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-sm transition-colors group",
                        active
                          ? "bg-sidebar-accent text-sidebar-accent-foreground font-medium"
                          : "text-sidebar-foreground/70 hover:text-sidebar-foreground hover:bg-sidebar-accent/50"
                      )}
                    >
                      <item.icon className={cn("w-4 h-4 shrink-0", active ? "text-primary" : "")} />
                      <span className="flex-1 truncate">{item.label}</span>
                      {item.badge && (
                        <Badge className="bg-primary/20 text-primary border-primary/30 text-[10px] px-1.5 py-0 h-4">
                          {item.badge}
                        </Badge>
                      )}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}

        {/* Instructor section — only shown to instructors/admins */}
        {isInstructor && (
          <div>
            <div className="text-[10px] uppercase tracking-widest text-sidebar-foreground/40 px-2 mb-1.5 font-medium">
              Instructor
            </div>
            <ul className="space-y-0.5">
              {[
                { label: "Instructor Dashboard", href: "/instructor", icon: GraduationCap },
              ].map((item) => {
                const active = pathname === item.href || pathname?.startsWith(item.href);
                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      onClick={() => setSidebarOpen(false)}
                      className={cn(
                        "flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-sm transition-colors",
                        active
                          ? "bg-green-500/10 text-green-400 font-medium"
                          : "text-sidebar-foreground/70 hover:text-green-400 hover:bg-green-500/10"
                      )}
                    >
                      <item.icon className="w-4 h-4 shrink-0" />
                      <span className="flex-1 truncate">{item.label}</span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        )}
      </nav>

      {/* Admin link + sign out */}
      <div className="p-3 border-t border-sidebar-border space-y-1">
        {!isInstructor && (
          <Link href="/dashboard/become-instructor" onClick={() => setSidebarOpen(false)} className="flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-sm text-green-400/80 hover:text-green-400 hover:bg-green-500/10 transition-colors">
            <GraduationCap className="w-4 h-4" /> Become Instructor
          </Link>
        )}
        {isAdmin && (
          <Link href="/admin" className="flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-sm text-sidebar-foreground/70 hover:text-sidebar-foreground hover:bg-sidebar-accent/50 transition-colors">
            <Shield className="w-4 h-4" /> Admin Panel
          </Link>
        )}
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-sm text-sidebar-foreground/70 hover:text-destructive hover:bg-destructive/10 transition-colors"
        >
          <LogOut className="w-4 h-4" /> Sign Out
        </button>
      </div>
    </>
  );

  return (
    <div className="flex h-screen bg-background overflow-hidden">
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Mobile sidebar */}
      <aside className={cn(
        "fixed inset-y-0 left-0 z-50 w-64 flex flex-col border-r border-sidebar-border bg-sidebar overflow-y-auto transition-transform duration-200 md:hidden",
        sidebarOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <button
          onClick={() => setSidebarOpen(false)}
          className="absolute top-4 right-4 p-1 rounded-md hover:bg-accent/50"
        >
          <X className="w-4 h-4" />
        </button>
        <SidebarContent />
      </aside>

      {/* Desktop sidebar */}
      <aside className="hidden md:flex w-64 flex-shrink-0 flex-col border-r border-sidebar-border bg-sidebar overflow-y-auto">
        <SidebarContent />
      </aside>

      {/* Main content */}
      <main className="flex-1 overflow-y-auto">
        {/* Mobile header */}
        <div className="md:hidden flex items-center gap-3 p-4 border-b border-border/40 bg-background sticky top-0 z-30">
          <Button variant="ghost" size="icon" className="w-8 h-8" onClick={() => setSidebarOpen(true)}>
            <Menu className="w-4 h-4" />
          </Button>
          <span className="font-bold gradient-text">CodeSphere</span>
        </div>
        {children}
      </main>
    </div>
  );
}
