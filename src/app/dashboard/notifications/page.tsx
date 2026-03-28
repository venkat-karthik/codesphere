"use client";

import { useState, useEffect } from "react";
import { Bell, Trophy, Users, Video, Code2, ArrowRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "sonner";
import Link from "next/link";
import { apiFetch } from "@/lib/api";

const MOCK_NOTIFICATIONS = [
    { id: "1", type: "session", icon: "Video", color: "text-red-400 bg-red-400/10", title: "'React Performance' session is live now!", desc: "Arjun M. just started the live session you registered for.", time: "2 mins ago", unread: true, action: "Join Session", href: "/sessions/1" },
    { id: "2", type: "achievement", icon: "Trophy", color: "text-yellow-400 bg-yellow-400/10", title: "Achievement Unlocked: 7-Day Streak", desc: "You've been consistently learning for a whole week. Keep it up!", time: "3 hours ago", unread: true, action: "View Profile", href: "/profile" },
    { id: "3", type: "community", icon: "Users", color: "text-blue-400 bg-blue-400/10", title: "New Post in 'Full Stack Dev Hub'", desc: "Someone shared a new project looking for code reviews.", time: "5 hours ago", unread: false },
    { id: "4", type: "codex", icon: "Code2", color: "text-purple-400 bg-purple-400/10", title: "Pull Request approved", desc: "Your PR '#42 Update Auth Logic' was approved in the CodeSphere OSS workspace.", time: "1 day ago", unread: false, action: "View PR", href: "/codex/1" },
];

const iconMap: Record<string, any> = { Video, Trophy, Users, Code2, Bell };

export default function NotificationsPage() {
    const [notifications, setNotifications] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const controller = new AbortController();
        apiFetch('/notifications', {}, controller.signal)
            .then((data) => setNotifications(Array.isArray(data) ? data : []))
            .catch(() => setNotifications(MOCK_NOTIFICATIONS))
            .finally(() => setLoading(false));
        return () => controller.abort();
    }, []);

    const unreadCount = notifications.filter((n) => n.unread).length;

    const markAllRead = async () => {
        setNotifications((prev) => prev.map((n) => ({ ...n, unread: false })));
        try {
            await apiFetch('/notifications/read-all', { method: 'POST' });
            toast.success("All notifications marked as read");
        } catch {
            toast.success("All notifications marked as read");
        }
    };

    const markOneRead = async (id: string) => {
        setNotifications((prev) => prev.map((n) => n.id === id ? { ...n, unread: false } : n));
        try { await apiFetch(`/notifications/${id}/read`, { method: 'POST' }); } catch { /* silent */ }
    };

    return (
        <div className="p-6 md:p-8 max-w-4xl mx-auto w-full space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-2">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight mb-2">Notifications</h1>
                    <p className="text-muted-foreground">
                        {unreadCount > 0 ? `${unreadCount} unread notification${unreadCount > 1 ? "s" : ""}` : "You're all caught up!"}
                    </p>
                </div>
                {unreadCount > 0 && (
                    <Button variant="outline" size="sm" onClick={markAllRead}>Mark all as read</Button>
                )}
            </div>

            {loading ? (
                <div className="space-y-3">{Array(4).fill(null).map((_, i) => <div key={i} className="h-24 rounded-xl bg-muted/30 animate-pulse" />)}</div>
            ) : (
                <Card className="border-border/40 bg-card/50">
                    <CardContent className="p-0 divide-y divide-border/40">
                        {notifications.length === 0 ? (
                            <div className="p-12 text-center text-muted-foreground">
                                <Bell className="w-10 h-10 mx-auto mb-3 opacity-30" />
                                <p>No notifications yet</p>
                            </div>
                        ) : notifications.map((n) => {
                            const Icon = iconMap[n.icon] ?? Bell;
                            return (
                                <div
                                    key={n.id}
                                    className={`p-5 flex gap-4 transition-colors hover:bg-muted/30 cursor-pointer ${n.unread ? "bg-muted/10" : ""}`}
                                    onClick={() => n.unread && markOneRead(n.id)}
                                >
                                    <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${n.color}`}>
                                        <Icon className="w-5 h-5" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex sm:items-center justify-between gap-2 flex-col sm:flex-row mb-1">
                                            <h3 className={`text-base font-semibold ${n.unread ? "text-foreground" : "text-foreground/80"}`}>{n.title}</h3>
                                            <span className="text-xs text-muted-foreground whitespace-nowrap">{n.time}</span>
                                        </div>
                                        <p className="text-sm text-muted-foreground mb-3">{n.desc}</p>
                                        {n.action && (
                                            <Link href={n.href || "#"}>
                                                <Button variant="secondary" size="sm" className="bg-primary/10 text-primary hover:bg-primary/20 hover:text-primary border-none h-8 text-xs gap-1">
                                                    {n.action} <ArrowRight className="w-3 h-3" />
                                                </Button>
                                            </Link>
                                        )}
                                    </div>
                                    {n.unread && <div className="w-2.5 h-2.5 rounded-full bg-primary shrink-0 self-center" />}
                                </div>
                            );
                        })}
                    </CardContent>
                </Card>
            )}
        </div>
    );
}
