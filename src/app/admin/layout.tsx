"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
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
    Menu,
    X,
    GraduationCap,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/layout/Navbar";
import { cn } from "@/lib/utils";

const sidebarLinks = [
    { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
    { href: "/admin/users", label: "User Management", icon: Users },
    { href: "/admin/instructor-appeals", label: "Instructor Appeals", icon: GraduationCap },
    { href: "/admin/roles", label: "Roles & Permissions", icon: Shield },
    { href: "/admin/content", label: "Content Control", icon: FileText },
    { href: "/admin/events", label: "Events Manager", icon: Calendar },
    { href: "/admin/sessions", label: "Live Sessions", icon: Video },
    { href: "/admin/settings", label: "Platform Settings", icon: Settings },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const [sidebarOpen, setSidebarOpen] = useState(false);

    const SidebarLinks = () => (
        <nav className="space-y-1">
            {sidebarLinks.map((link) => {
                const isActive = pathname === link.href;
                return (
                    <Link key={link.href} href={link.href} onClick={() => setSidebarOpen(false)}>
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
    );

    return (
        <div className="min-h-screen bg-background flex flex-col">
            <Navbar />
            <div className="flex-1 flex pt-[64px]">
                {/* Mobile overlay */}
                {sidebarOpen && (
                    <div className="fixed inset-0 bg-black/50 z-40 md:hidden" onClick={() => setSidebarOpen(false)} />
                )}

                {/* Mobile sidebar */}
                <aside className={cn(
                    "fixed inset-y-0 left-0 z-50 w-64 pt-[64px] bg-card/95 backdrop-blur-xl border-r border-border/40 flex flex-col transition-transform duration-200 md:hidden",
                    sidebarOpen ? "translate-x-0" : "-translate-x-full"
                )}>
                    <div className="p-6 flex items-center justify-between">
                        <h2 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Admin Governance</h2>
                        <button onClick={() => setSidebarOpen(false)} className="p-1 rounded-md hover:bg-accent/50">
                            <X className="w-4 h-4" />
                        </button>
                    </div>
                    <div className="px-6 flex-1"><SidebarLinks /></div>
                </aside>

                {/* Desktop sidebar */}
                <aside className="w-64 border-r border-border/40 fixed inset-y-0 pt-[64px] bg-card/30 backdrop-blur-xl hidden md:flex flex-col">
                    <div className="p-6">
                        <h2 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-4">Admin Governance</h2>
                        <SidebarLinks />
                    </div>
                </aside>

                {/* Main content */}
                <main className="flex-1 md:ml-64 p-6 lg:p-8">
                    {/* Mobile menu button */}
                    <button
                        onClick={() => setSidebarOpen(true)}
                        className="md:hidden flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-6 transition-colors"
                    >
                        <Menu className="w-4 h-4" /> Menu
                    </button>
                    {children}
                </main>
            </div>
        </div>
    );
}
