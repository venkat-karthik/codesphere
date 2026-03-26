"use client";

import { useState } from "react";
import { 
    Settings, 
    Globe, 
    Lock, 
    Bell, 
    Database, 
    Users, 
    ShieldCheck,
    Save, 
    RefreshCcw,
    Layout
} from "lucide-react";
import { 
    Card, 
    CardContent, 
    CardHeader, 
    CardTitle,
    CardDescription 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

export default function PlatformSettingsPage() {
    const [saving, setSaving] = useState(false);

    const handleSave = () => {
        setSaving(true);
        setTimeout(() => setSaving(false), 1500);
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Platform Settings</h1>
                    <p className="text-muted-foreground mt-1">
                        Global configuration and system governance.
                    </p>
                </div>
                <Button onClick={handleSave} disabled={saving} className="gap-2 shadow-lg hover:shadow-primary/20">
                    {saving ? <RefreshCcw className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                    {saving ? "Saving Changes..." : "Save Configuration"}
                </Button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* General Settings */}
                <Card className="lg:col-span-2 bg-card/40 border-border/40 shadow-xl backdrop-blur-md">
                    <CardHeader className="border-b border-border/40">
                        <CardTitle className="text-lg flex items-center gap-2">
                            <Globe className="w-5 h-5 text-primary" />
                            General Information
                        </CardTitle>
                        <CardDescription>Basic platform identification and branding settings.</CardDescription>
                    </CardHeader>
                    <CardContent className="p-6 space-y-6">
                        <div className="grid md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="siteName">Platform Name</Label>
                                <Input id="siteName" defaultValue="Codesphere" className="bg-background/50 border-border/40" />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="contactEmail">Administrative Email</Label>
                                <Input id="contactEmail" defaultValue="admin@codesphere.io" className="bg-background/50 border-border/40" />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="description">Platform Description</Label>
                            <Input id="description" defaultValue="The ultimate collaborative platform for modern developers." className="bg-background/50 border-border/40" />
                        </div>
                        <div className="pt-4 border-t border-border/40 space-y-4">
                            <h3 className="text-sm font-medium">Public Access Control</h3>
                            <div className="flex items-center justify-between p-4 rounded-xl bg-muted/20 border border-border/40">
                                <div className="space-y-0.5">
                                    <div className="text-sm font-semibold">User Registration</div>
                                    <div className="text-xs text-muted-foreground">Allow new users to sign up to the platform.</div>
                                </div>
                                <Switch defaultChecked />
                            </div>
                            <div className="flex items-center justify-between p-4 rounded-xl bg-muted/20 border border-border/40">
                                <div className="space-y-0.5">
                                    <div className="text-sm font-semibold">Maintenance Mode</div>
                                    <div className="text-xs text-danger text-red-400">Restricts public access with a maintenance screen.</div>
                                </div>
                                <Switch />
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Sidebar Quick Settings */}
                <div className="space-y-6">
                    <Card className="bg-card/40 border-border/40 shadow-xl backdrop-blur-md">
                        <CardHeader>
                            <CardTitle className="text-lg flex items-center gap-2">
                                <Lock className="w-5 h-5 text-amber-500" />
                                Security Policies
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex items-center justify-between">
                                <Label className="text-sm cursor-pointer" htmlFor="2fa-req">Require 2FA for Admins</Label>
                                <Switch id="2fa-req" defaultChecked />
                            </div>
                            <div className="flex items-center justify-between">
                                <Label className="text-sm cursor-pointer" htmlFor="token-exp">Strict Token Expiry</Label>
                                <Switch id="token-exp" />
                            </div>
                            <div className="flex items-center justify-between">
                                <Label className="text-sm cursor-pointer" htmlFor="geo-lock">Geo-IP Access Locking</Label>
                                <Switch id="geo-lock" />
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="bg-card/40 border-border/40 shadow-xl backdrop-blur-md">
                        <CardHeader>
                            <CardTitle className="text-lg flex items-center gap-2">
                                <Bell className="w-5 h-5 text-blue-500" />
                                Notifications
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex items-center justify-between">
                                <Label className="text-sm cursor-pointer" htmlFor="notify-reg">New User Alerts</Label>
                                <Switch id="notify-reg" defaultChecked />
                            </div>
                            <div className="flex items-center justify-between">
                                <Label className="text-sm cursor-pointer" htmlFor="notify-err">Critical System Errors</Label>
                                <Switch id="notify-err" defaultChecked />
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="bg-primary/5 border-primary/20 shadow-xl backdrop-blur-md overflow-hidden relative group">
                        <div className="absolute top-0 right-0 w-24 h-24 bg-primary/10 blur-2xl rounded-full translate-x-12 -translate-y-12 group-hover:bg-primary/20 transition-all duration-700" />
                        <CardHeader>
                            <CardTitle className="text-lg flex items-center gap-2">
                                <Database className="w-5 h-5 text-primary" />
                                System Health
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3 pb-6">
                            <div className="flex justify-between text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                                <span>DB Connection</span>
                                <span className="text-green-400">Active</span>
                            </div>
                            <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden">
                                <div className="h-full bg-green-500 w-[100%]" />
                            </div>
                            <div className="flex justify-between text-xs font-semibold uppercase tracking-wider text-muted-foreground mt-4">
                                <span>Storage (42GB / 100GB)</span>
                                <span className="text-primary">42%</span>
                            </div>
                            <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden">
                                <div className="h-full bg-primary w-[42%]" />
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
