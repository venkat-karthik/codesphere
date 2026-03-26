"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
    LayoutDashboard,
    Users,
    Shield,
    FileText,
    Calendar,
    Video,
    Settings,
    LogOut,
    ChevronRight,
    TrendingDown,
    TrendingUp,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/layout/Navbar";

const sidebarLinks = [
    { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
    { href: "/admin/users", label: "User Management", icon: Users },
    { href: "/admin/roles", label: "Roles & Permissions", icon: Shield },
    { href: "/admin/content", label: "Content Control", icon: FileText },
    { href: "/admin/events", label: "Events Manager", icon: Calendar },
    { href: "/admin/sessions", label: "Live Sessions", icon: Video },
    { href: "/admin/settings", label: "Platform Settings", icon: Settings },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();

    return (
        <div className="min-h-screen bg-background flex flex-col">
            <Navbar />
            <div className="flex-1 flex pt-[64px]">
                {/* Sidebar */}
                <aside className="w-64 border-r border-border/40 fixed inset-y-0 pt-[64px] bg-card/30 backdrop-blur-xl hidden md:flex flex-col">
                    <div className="p-6">
                        <h2 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-4">
                            Admin Governance
                        </h2>
                        <nav className="space-y-1">
                            {sidebarLinks.map((link) => {
                                const isActive = pathname === link.href;
                                return (
                                    <Link key={link.href} href={link.href}>
                                        <Button
                                            variant={isActive ? "secondary" : "ghost"}
                                            className={`w-full justify-start gap-3 h-10 ${isActive
                                                    ? "bg-primary/10 text-primary hover:bg-primary/20"
                                                    : "text-muted-foreground hover:text-foreground hover:bg-accent/50"
                                                }`}
                                        >
                                            <link.icon className="w-4 h-4" />
                                            <span className="text-sm font-medium">{link.label}</span>
                                        </Button>
                                    </Link>
                                );
                            })}
                        </nav>
                    </div>
                    <div className="mt-auto p-6 border-t border-border/40">
                        <Button variant="ghost" className="w-full justify-start gap-3 h-10 text-red-400 hover:text-red-300 hover:bg-red-950/30">
                            <LogOut className="w-4 h-4" />
                            <span className="text-sm font-medium">Admin Logout</span>
                        </Button>
                    </div>
                </aside>

                {/* Main Content */}
                <main className="flex-1 md:ml-64 p-6 md:p-8">
                    {children}
                </main>
            </div>
        </div>
    );
}
