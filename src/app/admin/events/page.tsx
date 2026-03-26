"use client";

import { Calendar, Sparkles } from "lucide-react";

export default function EventsManagerPage() {
    return (
        <div className="h-[70vh] flex flex-col items-center justify-center text-center space-y-6">
            <div className="w-20 h-20 rounded-2xl bg-orange-500/10 flex items-center justify-center text-orange-500 animate-pulse">
                <Calendar className="w-10 h-10" />
            </div>
            <div className="space-y-2 max-w-md">
                <h1 className="text-3xl font-bold tracking-tight">Events Manager</h1>
                <p className="text-muted-foreground">
                    Scheduled events, hackathons, and community meetups will be manageable from this dashboard soon.
                </p>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-orange-500/5 border border-orange-500/20 text-orange-500 text-sm font-medium">
                <Sparkles className="w-4 h-4" />
                Under Development
            </div>
        </div>
    );
}
