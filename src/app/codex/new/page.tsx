"use client";

import { useState } from "react";
import { ArrowLeft, Code2, Plus, Loader2 } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Navbar from "@/components/layout/Navbar";
import { apiFetch } from "@/lib/api";

export default function NewWorkspace() {
    const [loading, setLoading] = useState(false);
    const [name, setName] = useState("");
    const [repo, setRepo] = useState("");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            const data = {
                name,
                githubRepo: repo,
                files: [
                    { name: 'App.tsx', content: '// New React App\nexport default function App() {\n  return <div>Hello World</div>;\n}' },
                    { name: 'style.css', content: 'body { font-family: sans-serif; }' }
                ],
                status: 'active'
            };
            const result = await apiFetch('/codex', {
                method: 'POST',
                body: JSON.stringify(data),
            });
            toast.success("Workspace environment provisioning initialized!");
            setTimeout(() => {
                window.location.href = `/codex/${result._id}`;
            }, 1500);
        } catch (error) {
            console.error("Failed to create workspace:", error);
            toast.error("Failed to provision workspace. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-background flex flex-col">
            <Navbar />
            <div className="max-w-2xl mx-auto w-full px-4 pt-24 pb-12">
                <Link href="/codex" className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-6 transition-colors">
                    <ArrowLeft className="w-4 h-4 mr-1" /> Back to Codex
                </Link>

                <div className="mb-8">
                    <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary mb-4">
                        <Code2 className="w-6 h-6" />
                    </div>
                    <h1 className="text-3xl font-bold tracking-tight mb-2">Create Workspace</h1>
                    <p className="text-muted-foreground">Provision a new cloud environment for your project.</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6 bg-card/50 border border-border/40 p-6 rounded-xl">
                    <div className="space-y-2">
                        <Label htmlFor="name">Workspace Name</Label>
                        <Input
                            id="name"
                            placeholder="e.g. NextJS E-commerce"
                            required
                            className="bg-muted/30"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="repo">GitHub Repository (Optional)</Label>
                        <Input
                            id="repo"
                            placeholder="https://github.com/user/repo"
                            className="bg-muted/30"
                            value={repo}
                            onChange={(e) => setRepo(e.target.value)}
                        />
                        <p className="text-[11px] text-muted-foreground">We will automatically clone and install dependencies.</p>
                    </div>

                    <div className="space-y-2">
                        <Label>Environment Preset</Label>
                        <div className="grid grid-cols-2 gap-3">
                            <div className="border border-primary bg-primary/5 rounded-lg p-3 cursor-pointer">
                                <div className="font-semibold text-sm">Node.js / React</div>
                                <div className="text-xs text-muted-foreground">Standard full-stack preset</div>
                            </div>
                            <div className="border border-border/60 bg-muted/20 opacity-70 rounded-lg p-3 cursor-not-allowed">
                                <div className="font-semibold text-sm">Python / Django</div>
                                <div className="text-xs text-muted-foreground">Premium feature</div>
                            </div>
                        </div>
                    </div>

                    <Button type="submit" disabled={loading} className="w-full gap-2 mt-4 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold h-11">
                        {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
                        Provision Workspace
                    </Button>
                </form>
            </div>
        </div>
    );
}
