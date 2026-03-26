"use client";

import { useState } from "react";
import { ArrowLeft, Users, Send, Loader2 } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Navbar from "@/components/layout/Navbar";
import { apiFetch } from "@/lib/api";

export default function NewCommunity() {
    const [loading, setLoading] = useState(false);
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [tags, setTags] = useState("");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            const data = {
                name,
                description,
                tags: tags.split(",").map(t => t.trim()),
                members: [], // Owner added by backend
            };
            const result = await apiFetch('/communities', {
                method: 'POST',
                body: JSON.stringify(data),
            });
            toast.success("Community successfully created!");
            setTimeout(() => {
                window.location.href = `/communities/${result._id}`;
            }, 1500);
        } catch (error) {
            console.error("Failed to create community:", error);
            toast.error("Failed to create community. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-background flex flex-col">
            <Navbar />
            <div className="max-w-2xl mx-auto w-full px-4 pt-24 pb-12">
                <Link href="/communities" className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-6 transition-colors">
                    <ArrowLeft className="w-4 h-4 mr-1" /> Back to Communities
                </Link>

                <div className="mb-8">
                    <div className="w-12 h-12 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-500 mb-4">
                        <Users className="w-6 h-6" />
                    </div>
                    <h1 className="text-3xl font-bold tracking-tight mb-2">Create Community</h1>
                    <p className="text-muted-foreground">Start a new hub for developers to discuss and collaborate.</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6 bg-card/50 border border-border/40 p-6 rounded-xl">
                    <div className="space-y-2">
                        <Label htmlFor="name">Community Name</Label>
                        <Input
                            id="name"
                            placeholder="e.g. SvelteKit Enthusiasts"
                            required
                            className="bg-muted/30"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="desc">Description</Label>
                        <textarea
                            id="desc"
                            required
                            placeholder="What is this community about?"
                            className="w-full rounded-md border border-input bg-muted/30 px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 min-h-[100px] resize-none"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="tags">Tags (comma separated)</Label>
                        <Input
                            id="tags"
                            placeholder="Svelte, Frontend, Performance"
                            className="bg-muted/30"
                            value={tags}
                            onChange={(e) => setTags(e.target.value)}
                        />
                    </div>

                    <div className="space-y-2 pt-2">
                        <Label>Privacy</Label>
                        <div className="grid grid-cols-2 gap-3">
                            <div className="border border-primary bg-primary/5 rounded-lg p-3 cursor-pointer">
                                <div className="font-semibold text-sm">Public</div>
                                <div className="text-xs text-muted-foreground">Anyone can view and join</div>
                            </div>
                            <div className="border border-border/60 bg-muted/20 opacity-70 rounded-lg p-3 cursor-not-allowed">
                                <div className="font-semibold text-sm">Private</div>
                                <div className="text-xs text-muted-foreground">Premium feature</div>
                            </div>
                        </div>
                    </div>

                    <Button type="submit" disabled={loading} className="w-full gap-2 mt-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold h-11">
                        {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                        Launch Community
                    </Button>
                </form>
            </div>
        </div>
    );
}
