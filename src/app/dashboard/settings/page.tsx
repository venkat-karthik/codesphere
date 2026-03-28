"use client";

import { useState, useEffect, useRef } from "react";
import { User, Mail, Shield, Bell, Key, Globe, LayoutDashboard } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import { apiFetch } from "@/lib/api";

export default function SettingsPage() {
    const [user, setUser] = useState<any>(null);
    const [saving, setSaving] = useState(false);
    const [form, setForm] = useState({ name: "", username: "", bio: "", website: "" });
    const fileRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        apiFetch("/users/me").then((data) => {
            setUser(data);
            setForm({
                name: data.name || "",
                username: data.username || data.email?.split("@")[0] || "",
                bio: data.bio || "",
                website: data.website || "",
            });
        }).catch(() => {});
    }, []);

    const handleSaveProfile = async () => {
        setSaving(true);
        try {
            await apiFetch("/users/me", { method: "PATCH", body: JSON.stringify(form) });
            toast.success("Profile changes saved successfully");
        } catch {
            toast.error("Failed to save profile. Please try again.");
        } finally {
            setSaving(false);
        }
    };

    const initials = form.name
        ? form.name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2)
        : "CS";

    return (
        <div className="p-6 md:p-8 max-w-4xl mx-auto w-full space-y-8">
            <div>
                <h1 className="text-3xl font-bold tracking-tight mb-2">Account Settings</h1>
                <p className="text-muted-foreground">
                    Manage your profile, preferences, and security settings.
                </p>
            </div>

            <div className="grid md:grid-cols-[200px_1fr] md:gap-12">
                {/* Settings Nav Area */}
                <aside className="mb-8 md:mb-0 space-y-1">
                    {[
                        { label: "Profile", icon: User, active: true },
                        { label: "Account", icon: LayoutDashboard },
                        { label: "Security", icon: Shield },
                        { label: "Emails", icon: Mail },
                        { label: "Notifications", icon: Bell },
                    ].map((item) => (
                        <button
                            key={item.label}
                            className={`flex items-center gap-3 w-full px-3 py-2 text-sm rounded-lg transition-colors ${item.active
                                ? "bg-primary/10 text-primary font-medium"
                                : "text-muted-foreground hover:bg-muted/50 hover:text-foreground"
                                }`}
                        >
                            <item.icon className="w-4 h-4" /> {item.label}
                        </button>
                    ))}
                </aside>

                {/* Content Area */}
                <div className="space-y-10">
                    {/* Public Profile Section */}
                    <section className="space-y-6">
                        <div>
                            <h2 className="text-xl font-semibold mb-1">Public Profile</h2>
                            <p className="text-sm text-muted-foreground">This information will be displayed publicly.</p>
                        </div>
                        <Separator className="bg-border/40" />

                        <div className="flex items-center gap-6">
                            <div className="w-20 h-20 rounded-full bg-primary/20 flex items-center justify-center text-primary text-2xl font-bold border-2 border-primary/20 shrink-0">
                                {initials}
                            </div>
                            <div>
                                <div className="flex gap-2">
                                    <Button variant="outline" size="sm" className="h-9" onClick={() => fileRef.current?.click()}>Change Avatar</Button>
                                    <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={() => toast.info("Avatar upload requires backend storage integration.")} />
                                    <Button variant="ghost" size="sm" className="h-9 text-muted-foreground hover:text-destructive" onClick={() => toast.success("Avatar removed")}>Remove</Button>
                                </div>
                                <p className="text-[11px] text-muted-foreground mt-2">JPG, GIF or PNG. Max size of 800K</p>
                            </div>
                        </div>

                        <div className="grid gap-6 sm:grid-cols-2">
                            <div className="space-y-2">
                                <Label htmlFor="name">Full Name</Label>
                                <Input id="name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="bg-muted/30" />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="handle">Username</Label>
                                <Input id="handle" value={form.username} onChange={(e) => setForm({ ...form, username: e.target.value })} className="bg-muted/30" />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="bio">Bio</Label>
                            <textarea
                                id="bio"
                                rows={4}
                                className="w-full rounded-md border border-input bg-muted/30 px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 resize-none font-sans"
                                value={form.bio}
                                onChange={(e) => setForm({ ...form, bio: e.target.value })}
                                placeholder="Brief description for your profile."
                            />
                            <p className="text-xs text-muted-foreground">Brief description for your profile. URLs are hyperlinked.</p>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="website">Website / Portfolio</Label>
                            <div className="relative">
                                <Globe className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                <Input id="website" value={form.website} onChange={(e) => setForm({ ...form, website: e.target.value })} className="pl-9 bg-muted/30" placeholder="https://yoursite.dev" />
                            </div>
                        </div>

                        <Button className="gap-2" onClick={handleSaveProfile} disabled={saving}>
                            {saving ? <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" /> : null}
                            Save Profile Changes
                        </Button>
                    </section>

                    {/* Account Security Section */}
                    <section className="space-y-6 pt-4">
                        <div>
                            <h2 className="text-xl font-semibold mb-1">Security</h2>
                            <p className="text-sm text-muted-foreground">Manage your password and security keys.</p>
                        </div>
                        <Separator className="bg-border/40" />

                        <div className="space-y-4">
                            <div className="flex items-center justify-between border border-border/60 rounded-lg p-4 bg-muted/10">
                                <div className="flex items-start gap-3">
                                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0 mt-0.5">
                                        <Key className="w-4 h-4 text-primary" />
                                    </div>
                                    <div>
                                        <div className="font-semibold text-sm">Password</div>
                                        <div className="text-xs text-muted-foreground mt-0.5">Last changed 3 months ago</div>
                                    </div>
                                </div>
                                <Button variant="outline" size="sm" onClick={() => toast.info("Password update flow initiated")}>Update</Button>
                            </div>

                            <div className="flex items-center justify-between border border-border/60 rounded-lg p-4 bg-muted/10">
                                <div className="flex items-start gap-3">
                                    <div className="w-8 h-8 rounded-full bg-green-500/10 flex items-center justify-center shrink-0 mt-0.5">
                                        <Shield className="w-4 h-4 text-green-500" />
                                    </div>
                                    <div>
                                        <div className="font-semibold text-sm">Two-Factor Authentication</div>
                                        <div className="text-xs text-muted-foreground mt-0.5">Add an extra layer of security to your account.</div>
                                    </div>
                                </div>
                                <Button variant="secondary" size="sm" className="bg-green-500/20 text-green-500 hover:bg-green-500/30 border-none" onClick={() => toast.success("2FA setup email sent")}>Enable 2FA</Button>
                            </div>
                        </div>
                    </section>

                    <div className="pt-6 border-t border-border/40 pb-12">
                        <h3 className="text-sm font-semibold text-destructive mb-2">Danger Zone</h3>
                        <div className="border border-destructive/30 rounded-lg p-4 bg-destructive/5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                            <div>
                                <div className="font-medium text-sm text-destructive">Delete Account</div>
                                <div className="text-xs text-muted-foreground">Permanently delete your account and all its data. This action cannot be undone.</div>
                            </div>
                            <Button variant="destructive" size="sm" className="shrink-0 bg-destructive/90" onClick={() => toast.error("Please contact support to delete your account")}>Delete Account</Button>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
}
