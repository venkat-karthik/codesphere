"use client";

import { Video, Sparkles } from "lucide-react";

export default function LiveSessionsPage() {
    return (
        <div className="h-[70vh] flex flex-col items-center justify-center text-center space-y-6">
            <div className="w-20 h-20 rounded-2xl bg-purple-500/10 flex items-center justify-center text-purple-500 animate-pulse">
                <Video className="w-10 h-10" />
            </div>
            <div className="space-y-2 max-w-md">
                <h1 className="text-3xl font-bold tracking-tight">Live Sessions</h1>
                <p className="text-muted-foreground">
                    Real-time streaming controls and session moderation tools are currently being integrated.
                </p>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-purple-500/5 border border-purple-500/20 text-purple-500 text-sm font-medium">
                <Sparkles className="w-4 h-4" />
                Coming Soon
            </div>
        </div>
    );
}
