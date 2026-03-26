"use client";

import { Shield, Sparkles } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

export default function RolesManagementPage() {
    return (
        <div className="h-[70vh] flex flex-col items-center justify-center text-center space-y-6">
            <div className="w-20 h-20 rounded-2xl bg-primary/10 flex items-center justify-center text-primary animate-pulse">
                <Shield className="w-10 h-10" />
            </div>
            <div className="space-y-2 max-w-md">
                <h1 className="text-3xl font-bold tracking-tight">Roles & Permissions</h1>
                <p className="text-muted-foreground">
                    The advanced RBAC (Role-Based Access Control) engine is currently being optimized for high-scale governance. 
                </p>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-primary/5 border border-primary/20 text-primary text-sm font-medium">
                <Sparkles className="w-4 h-4" />
                Coming in v2.4 Update
            </div>
        </div>
    );
}
