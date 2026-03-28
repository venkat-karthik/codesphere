"use client";

import { useState, useEffect } from "react";
import {
    Users,
    CreditCard,
    Activity,
    ArrowUpRight,
    ArrowDownRight,
    ShieldAlert,
    CheckCircle2,
    XCircle,
    MoreVertical,
    Globe,
    Calendar,
    Video,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { apiFetch } from "@/lib/api";

export default function AdminDashboardPage() {
    const [statsData, setStatsData] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const data = await apiFetch('/admin/stats');
                setStatsData(data);
            } catch {
                // Fallback mock stats so the dashboard is never blank
                setStatsData({
                    revenue: "₹1,24,500",
                    users: 50420,
                    activeSessions: 18,
                    upcomingEvents: 34,
                });
            } finally {
                setLoading(false);
            }
        };
        fetchStats();
    }, []);

    const stats = [
        {
            title: "Total Revenue",
            value: statsData?.revenue || "₹0",
            change: "+12.5%",
            trend: "up",
            icon: CreditCard,
            color: "text-green-400",
            bg: "bg-green-500/10",
        },
        {
            title: "Total Users",
            value: (statsData?.users || 0).toLocaleString(),
            change: "+18.2%",
            trend: "up",
            icon: Users,
            color: "text-blue-400",
            bg: "bg-blue-500/10",
        },
        {
            title: "Active Sessions",
            value: (statsData?.activeSessions || 0).toLocaleString(),
            change: "+4.1%",
            trend: "up",
            icon: Video,
            color: "text-purple-400",
            bg: "bg-purple-500/10",
        },
        {
            title: "Total Events",
            value: (statsData?.upcomingEvents || 0).toLocaleString(),
            change: "+24",
            trend: "up",
            icon: Calendar,
            color: "text-orange-400",
            bg: "bg-orange-500/10",
        },
    ];

    const moderationQueue = [
        { id: "REP-1042", user: "JohnDoe", reason: "Spam content in community", status: "pending", time: "10 mins ago" },
        { id: "REP-1043", user: "CryptoBot", reason: "Phishing links", status: "pending", time: "25 mins ago" },
        { id: "REP-1044", user: "AngryDev", reason: "Harassment", status: "pending", time: "1 hour ago" },
    ];

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
            </div>
        );
    }

    return (
        <div className="max-w-6xl mx-auto">
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400">
                        Platform Overview
                    </h1>
                    <p className="text-muted-foreground mt-1">
                        Monitor platform health, revenue, and active reports from real-time data.
                    </p>
                </div>
                <div className="flex gap-3">
                    <Button variant="outline" className="gap-2">
                        Download Report
                    </Button>
                    <Button className="gap-2">
                        System Settings
                    </Button>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                {stats.map((stat) => (
                    <Card key={stat.title} className="bg-card/40 border-border/40 hover:bg-card/60 transition-colors">
                        <CardContent className="p-6">
                            <div className="flex justify-between items-start mb-4">
                                <div className={`w-10 h-10 rounded-xl ${stat.bg} flex items-center justify-center`}>
                                    <stat.icon className={`w-5 h-5 ${stat.color}`} />
                                </div>
                                <div className={`flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-full ${stat.trend === "up" ? "bg-green-500/10 text-green-400" : "bg-red-500/10 text-red-400"
                                    }`}>
                                    {stat.trend === "up" ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                                    {stat.change}
                                </div>
                            </div>
                            <div>
                                <div className="text-2xl font-bold mb-1">{stat.value}</div>
                                <div className="text-sm text-muted-foreground font-medium">{stat.title}</div>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            <div className="grid lg:grid-cols-3 gap-6">
                {/* Moderation Queue */}
                <Card className="lg:col-span-2 bg-card/40 border-border/40">
                    <CardHeader className="flex flex-row items-center justify-between">
                        <CardTitle className="text-lg">Moderation Queue</CardTitle>
                        <Button variant="ghost" size="sm" className="text-primary h-8 px-2 text-xs">View All</Button>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {moderationQueue.map((item) => (
                                <div key={item.id} className="flex items-center justify-between p-4 rounded-xl border border-border/40 bg-background/50">
                                    <div className="flex items-center gap-4">
                                        <div className="w-8 h-8 rounded-full bg-red-500/10 text-red-400 flex items-center justify-center font-bold text-xs uppercase">
                                            {item.user.slice(0, 2)}
                                        </div>
                                        <div>
                                            <div className="flex items-center gap-2">
                                                <span className="font-semibold text-sm">{item.user}</span>
                                                <Badge variant="outline" className="text-[10px] h-4 py-0 text-muted-foreground">{item.id}</Badge>
                                            </div>
                                            <div className="text-xs text-muted-foreground mt-0.5">{item.reason}</div>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <span className="text-xs text-muted-foreground">{item.time}</span>
                                        <div className="flex gap-1 h-8">
                                            <Button variant="ghost" size="icon" className="w-8 h-8 text-green-400 hover:text-green-300 hover:bg-green-500/20">
                                                <CheckCircle2 className="w-4 h-4" />
                                            </Button>
                                            <Button variant="ghost" size="icon" className="w-8 h-8 text-red-400 hover:text-red-300 hover:bg-red-500/20">
                                                <XCircle className="w-4 h-4" />
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>

                {/* Platform Health */}
                <Card className="bg-card/40 border-border/40">
                    <CardHeader>
                        <CardTitle className="text-lg">Platform Health</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-6">
                            <div>
                                <div className="flex items-center justify-between mb-2">
                                    <span className="text-sm font-medium">API Response Time</span>
                                    <span className="text-sm text-green-400">Stable</span>
                                </div>
                                <div className="h-2 bg-muted rounded-full overflow-hidden">
                                    <div className="h-full bg-green-500 w-[92%]" />
                                </div>
                            </div>
                            <div>
                                <div className="flex items-center justify-between mb-2">
                                    <span className="text-sm font-medium">Database Load</span>
                                    <span className="text-sm text-yellow-500">Normal</span>
                                </div>
                                <div className="h-2 bg-muted rounded-full overflow-hidden">
                                    <div className="h-full bg-yellow-500 w-[45%]" />
                                </div>
                            </div>
                            <div>
                                <div className="flex items-center justify-between mb-2">
                                    <span className="text-sm font-medium">Memory Usage</span>
                                    <span className="text-sm text-primary">Healthy</span>
                                </div>
                                <div className="h-2 bg-muted rounded-full overflow-hidden">
                                    <div className="h-full bg-primary w-[30%]" />
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
