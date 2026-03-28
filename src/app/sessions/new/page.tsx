"use client";

import { useState, useEffect } from "react";
import { ArrowLeft, Video, Calendar, Loader2, Users } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Navbar from "@/components/layout/Navbar";
import { apiFetch } from "@/lib/api";

export default function NewSession() {
    const [loading, setLoading] = useState(false);
    const [title, setTitle] = useState("");
    const [date, setDate] = useState("");
    const [time, setTime] = useState("");
    const [agenda, setAgenda] = useState("");
    const [communities, setCommunities] = useState<any[]>([]);
    const [selectedCommunity, setSelectedCommunity] = useState("");

    useEffect(() => {
        const fetchCommunities = async () => {
            try {
                const data = await apiFetch('/communities');
                // Filter for communities I'm a member of
                setCommunities(data.filter((c: any) => c.joined));
            } catch (err) {
                console.error("Failed to load communities", err);
            }
        };
        fetchCommunities();
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            const data = {
                title,
                description: agenda,
                startTime: new Date(`${date}T${time}`),
                duration: "60 mins",
                meetingLink: "https://meet.google.com/mock-link",
                type: "Workshop",
                communityId: selectedCommunity || undefined,
            };
            await apiFetch('/sessions', {
                method: 'POST',
                body: JSON.stringify(data),
            });
            toast.success("Live Session scheduled and ready to broadcast!");
            setTimeout(() => {
                window.location.href = "/sessions";
            }, 1500);
        } catch (error) {
            console.error("Failed to create session:", error);
            toast.error("Failed to schedule session. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-background flex flex-col">
            <Navbar />
            <div className="max-w-2xl mx-auto w-full px-4 pt-24 pb-12">
                <Link href="/sessions" className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-6 transition-colors">
                    <ArrowLeft className="w-4 h-4 mr-1" /> Back to Sessions
                </Link>

                <div className="mb-8">
                    <div className="w-12 h-12 rounded-xl bg-red-500/10 flex items-center justify-center text-red-500 mb-4">
                        <Video className="w-6 h-6" />
                    </div>
                    <h1 className="text-3xl font-bold tracking-tight mb-2">Host Live Session</h1>
                    <p className="text-muted-foreground">Broadcast your screen, answer Q&A, and teach the community.</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6 bg-card/50 border border-border/40 p-6 rounded-xl">
                    <div className="space-y-2">
                        <Label htmlFor="title">Session Title</Label>
                        <Input
                            id="title"
                            placeholder="e.g. Architecting a Global Database"
                            required
                            className="bg-muted/30"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="community">Announce to Community (Optional)</Label>
                        <select
                            id="community"
                            value={selectedCommunity}
                            onChange={(e) => setSelectedCommunity(e.target.value)}
                            className="w-full flex h-10 rounded-md border border-input bg-muted/30 px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                            <option value="">No Announcement</option>
                            {communities.map((c) => (
                                <option key={c._id} value={c._id}>
                                    📢 {c.name}
                                </option>
                            ))}
                        </select>
                        <p className="text-[10px] text-muted-foreground">Select a community to automatically post a real-time announcement when this session is scheduled.</p>
                    </div>

                    <div className="grid grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <Label htmlFor="date">Scheduled Date</Label>
                            <div className="relative">
                                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                <Input
                                    id="date"
                                    type="date"
                                    required
                                    className="pl-9 bg-muted/30"
                                    value={date}
                                    onChange={(e) => setDate(e.target.value)}
                                />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="time">Time</Label>
                            <Input
                                id="time"
                                type="time"
                                required
                                className="bg-muted/30"
                                value={time}
                                onChange={(e) => setTime(e.target.value)}
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="desc">Agenda</Label>
                        <textarea
                            id="desc"
                            required
                            placeholder="What will you cover in this session?"
                            className="w-full rounded-md border border-input bg-muted/30 px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 min-h-[100px] resize-none"
                            value={agenda}
                            onChange={(e) => setAgenda(e.target.value)}
                        />
                    </div>

                    <Button type="submit" disabled={loading} className="w-full gap-2 mt-4 bg-red-600 hover:bg-red-700 text-white font-semibold h-11">
                        {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Video className="w-4 h-4" />}
                        Schedule Broadcast
                    </Button>
                </form>
            </div>
        </div>
    );
}
