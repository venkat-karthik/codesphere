"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import {
    Code2,
    GitBranch,
    Terminal,
    FolderDot,
    FileText,
    Play,
    FolderClosed,
    ChevronRight,
    Settings,
    Loader2,
    Cloud,
    Plus,
    Users
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Navbar from "@/components/layout/Navbar";
import { apiFetch } from "@/lib/api";
import { toast } from "sonner";

export default function CodexWorkspace() {
    const params = useParams();
    const id = params?.id;
    const [activeTab, setActiveTab] = useState("code");
    const [workspace, setWorkspace] = useState<any>(null);
    const [files, setFiles] = useState<any>({});
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    // Fetch workspace on mount
    useEffect(() => {
        if (!id) return;
        const fetchWorkspace = async () => {
            try {
                const data = await apiFetch(`/codex/${id}`);
                setWorkspace(data);
                setFiles(data.files || {});
            } catch {
                // Fallback mock workspace
                setWorkspace({
                    name: "CodeSphere OSS",
                    description: "Open source contributions to the main platform.",
                    isPublic: true,
                    files: {},
                });
            } finally {
                setLoading(false);
            }
        };
        fetchWorkspace();
    }, [id]);

    // Auto-save debounced effect
    useEffect(() => {
        if (!workspace || loading || !id) return;

        const timer = setTimeout(async () => {
            setSaving(true);
            try {
                await apiFetch(`/codex/${id}`, {
                    method: 'PUT',
                    body: JSON.stringify({ files }),
                });
            } catch (error) {
                console.error("Auto-save failed:", error);
            } finally {
                setSaving(false);
            }
        }, 3000);

        return () => clearTimeout(timer);
    }, [files, id, workspace, loading]);

    if (loading) {
        return (
            <div className="min-h-screen bg-background flex flex-col items-center justify-center">
                <Loader2 className="w-8 h-8 animate-spin text-primary mb-4" />
                <p className="text-sm text-muted-foreground font-mono">Initializing virtual environment...</p>
            </div>
        );
    }

    if (!workspace) {
        return (
            <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6 text-center">
                <div className="w-16 h-16 bg-red-500/10 text-red-500 rounded-full flex items-center justify-center mb-6">
                    <Code2 className="w-8 h-8" />
                </div>
                <h2 className="text-2xl font-bold mb-2">Workspace Not Found</h2>
                <p className="text-muted-foreground mb-8">This environment may have been deleted or moved.</p>
                <Button onClick={() => window.location.href = "/dashboard"}>Return to Dashboard</Button>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background flex flex-col overflow-hidden">
            <Navbar />

            {/* Workspace Header Strip */}
            <div className="bg-muted/30 border-b border-border/40 pt-20 pb-3 shrink-0">
                <div className="max-w-[1800px] mx-auto px-4 w-full">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center text-primary shadow-lg shadow-primary/10">
                                <Code2 className="w-5 h-5" />
                            </div>
                            <div>
                                <div className="flex items-center gap-2">
                                    <h1 className="text-lg font-bold tracking-tight">{workspace.name}</h1>
                                    <Badge variant="outline" className={`text-[10px] h-5 px-1.5 border-primary/30 text-primary bg-primary/5 ${workspace.isPublic ? "" : "border-muted text-muted-foreground"}`}>
                                        {workspace.isPublic ? "Public" : "Private"}
                                    </Badge>
                                    <div className="flex items-center gap-2 ml-4">
                                        {saving ? (
                                            <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground animate-pulse">
                                                <Loader2 className="w-3 h-3 animate-spin" /> Auto-saving...
                                            </div>
                                        ) : (
                                            <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground/60">
                                                <Cloud className="w-3 h-3 text-green-500/50" /> Synced to cloud
                                            </div>
                                        )}
                                    </div>
                                </div>
                                <div className="text-[11px] text-muted-foreground flex items-center gap-3 mt-0.5">
                                    <span className="flex items-center gap-1 font-mono text-primary/80"><GitBranch className="w-3 h-3" /> main</span>
                                    <span className="opacity-30">•</span>
                                    <span>{workspace.description || "No description provided"}</span>
                                </div>
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                            <Button size="sm" variant="ghost" className="h-8 text-xs gap-2"><Users className="w-3.5 h-3.5" /> 2 Online</Button>
                            <Button size="sm" variant="outline" className="h-8 text-xs gap-2 border-border/60"><Settings className="w-3.5 h-3.5" /> Configure</Button>
                            <Button size="sm" className="h-8 text-xs gap-2 bg-primary hover:bg-primary/90 text-primary-foreground shadow-sm shadow-primary/20" onClick={() => toast.info("Code execution requires a connected backend runtime.")}>
                                <Play className="w-3 h-3 fill-current" /> Run Project
                            </Button>
                        </div>
                    </div>

                    <div className="flex items-center gap-6 text-[13px] font-medium">
                        {["code", "deploy", "team", "settings"].map((tab) => (
                            <button
                                key={tab}
                                onClick={() => setActiveTab(tab)}
                                className={`pb-2 border-b-2 transition-all capitalize ${activeTab === tab
                                    ? "border-primary text-foreground"
                                    : "border-transparent text-muted-foreground hover:text-foreground hover:border-border/60"
                                    }`}
                            >
                                {tab}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Main IDE Layout */}
            <div className="flex-1 flex max-w-[1800px] mx-auto w-full px-4 py-4 gap-4 overflow-hidden">
                {/* File Explorer */}
                <div className="w-64 border border-border/40 rounded-xl bg-card/40 flex flex-col overflow-hidden hidden lg:flex shrink-0 backdrop-blur-sm">
                    <div className="p-3 border-b border-border/40 flex items-center justify-between text-xs font-semibold text-muted-foreground uppercase tracking-widest">
                        <div className="flex items-center gap-2">
                            <FolderDot className="w-4 h-4" /> Explorer
                        </div>
                        <Plus className="w-4 h-4 cursor-pointer hover:text-primary transition-colors" />
                    </div>

                    <div className="flex-1 overflow-y-auto p-2 text-sm font-mono space-y-0.5">
                        <div className="flex items-center gap-2 py-1.5 px-2 rounded-lg hover:bg-muted/50 cursor-pointer text-muted-foreground/80 group">
                            <ChevronRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />
                            <FolderClosed className="w-4 h-4 text-primary/70 fill-primary/10" />
                            <span className="flex-1">src</span>
                        </div>
                        <div className="flex items-center gap-2 py-1.5 px-3 rounded-lg hover:bg-muted/50 cursor-pointer text-muted-foreground/80 group">
                            <ChevronRight className="w-3.5 h-3.5 rotate-90" />
                            <FolderClosed className="w-4 h-4 text-primary/70 fill-primary/10" />
                            <span className="flex-1">components</span>
                        </div>
                        <div className="flex items-center gap-2 py-1.5 px-4 rounded-lg bg-primary/10 text-primary cursor-pointer border border-primary/20 ml-4">
                            <FileText className="w-4 h-4" />
                            <span className="flex-1">button.tsx</span>
                        </div>
                        <div className="flex items-center gap-2 py-1.5 px-4 rounded-lg hover:bg-muted/50 cursor-pointer text-muted-foreground/70 ml-4 group">
                            <FileText className="w-4 h-4 group-hover:text-primary transition-colors" />
                            <span className="flex-1">card.tsx</span>
                        </div>
                        <div className="flex items-center gap-2 py-1.5 px-2 rounded-lg hover:bg-muted/50 cursor-pointer text-muted-foreground/80 group">
                            <ChevronRight className="w-3.5 h-3.5" />
                            <FolderClosed className="w-4 h-4 text-primary/70 fill-primary/10" />
                            <span className="flex-1">lib</span>
                        </div>
                        <div className="flex items-center gap-2 py-1.5 px-2 rounded-lg hover:bg-muted/50 cursor-pointer text-muted-foreground/70 group mt-4">
                            <FileText className="w-4 h-4 text-emerald-400 group-hover:scale-110 transition-transform" />
                            <span className="flex-1">package.json</span>
                        </div>
                    </div>
                </div>

                {/* Editor & Terminal Panel */}
                <div className="flex-1 flex flex-col gap-4 overflow-hidden">
                    <div className="flex-1 border border-border/40 rounded-xl bg-[#09090b] flex flex-col overflow-hidden shadow-2xl relative ring-1 ring-white/5">
                        {/* Tab Bar */}
                        <div className="flex items-center bg-[#18181b]/80 backdrop-blur-md border-b border-border/40 h-10 text-[13px] font-mono">
                            <div className="px-5 py-2.5 bg-[#09090b] border-r border-border/40 flex items-center gap-2.5 text-primary border-t-2 border-t-primary h-full">
                                <FileText className="w-3.5 h-3.5" /> button.tsx
                            </div>
                            <div className="px-5 py-2.5 text-muted-foreground/60 hover:text-muted-foreground hover:bg-muted/10 cursor-pointer border-r border-border/40 flex items-center gap-2.5 transition-all">
                                <FileText className="w-3.5 h-3.5" /> card.tsx
                            </div>
                            <div className="flex-1" />
                            <div className="px-4 text-muted-foreground/40 text-[11px] uppercase tracking-tighter">TypeScript v5.2</div>
                        </div>

                        {/* Code Content */}
                        <div className="flex-1 p-6 overflow-auto font-mono text-[14px] leading-relaxed text-[#d4d4d8]">
                            <div className="flex">
                                <div className="w-12 text-[#52525b] text-right pr-6 select-none border-r border-border/10 mr-4 opacity-50">
                                    {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14].map(n => <div key={n}>{n}</div>)}
                                </div>
                                <div className="flex-1">
                                    <div className="text-[#94a3b8] italic mb-1">// Standard CodeSphere Button Component</div>
                                    <div className="group"><span className="text-[#f43f5e]">import</span> * <span className="text-[#f43f5e]">as</span> React <span className="text-[#f43f5e]">from</span> <span className="text-[#38bdf8]">"react"</span>;</div>
                                    <div className="group"><span className="text-[#f43f5e]">import</span> {`{ cva }`} <span className="text-[#f43f5e]">from</span> <span className="text-[#38bdf8]">"class-variance-authority"</span>;</div>
                                    <div>&nbsp;</div>
                                    <div className="group"><span className="text-[#f43f5e]">export const</span> <span className="text-[#fbbf24]">Button</span> = React.forwardRef((<span className="text-[#94a3b8]">{`{ children, variant, ...props }`}</span>, ref) =&gt; {`{`}</div>
                                    <div className="pl-6">&nbsp;&nbsp;<span className="text-[#f43f5e]">return</span> (</div>
                                    <div className="pl-6">&nbsp;&nbsp;&nbsp;&nbsp;&lt;<span className="text-[#4ade80]">button</span></div>
                                    <div className="pl-6">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span className="text-[#38bdf8]">ref</span>={`{`}<span className="text-[#d4d4d8]">ref</span>{`}`}</div>
                                    <div className="pl-6">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span className="text-[#38bdf8]">className</span>={`{`}<span className="text-[#fbbf24]">cn</span>(buttonVariants({`{ variant }`}), props.className){`}`}</div>
                                    <div className="pl-6">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{`{...props}`}</div>
                                    <div className="pl-6">&nbsp;&nbsp;&nbsp;&nbsp;&gt;</div>
                                    <div className="pl-6">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{`{children}`}</div>
                                    <div className="pl-6">&nbsp;&nbsp;&nbsp;&nbsp;&lt;/<span className="text-[#4ade80]">button</span>&gt;</div>
                                    <div className="pl-6">&nbsp;&nbsp;);</div>
                                    <div>{`});`}</div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Terminal Window */}
                    <div className="h-56 border border-border/40 rounded-xl bg-[#09090b] flex flex-col overflow-hidden shadow-lg backdrop-blur-md">
                        <div className="flex items-center justify-between px-4 py-2 bg-[#18181b]/50 border-b border-border/40 text-[11px] font-mono text-muted-foreground uppercase tracking-widest">
                            <div className="flex items-center gap-2">
                                <Terminal className="w-3.5 h-3.5" /> Console
                            </div>
                            <div className="flex gap-4">
                                <span className="text-green-500/80">Running Node.js v20.10.0</span>
                                <span className="text-blue-500/80 cursor-pointer hover:underline">Clear</span>
                            </div>
                        </div>
                        <div className="p-4 font-mono text-[12px] text-[#a1a1aa] space-y-1.5 overflow-y-auto">
                            <div className="flex gap-2">
                                <span className="text-primary font-bold">➜</span>
                                <span>Starting CodeSphere dev server...</span>
                            </div>
                            <div className="text-emerald-400 opacity-80">✓ Compiling client-side bundles...</div>
                            <div className="text-emerald-400 opacity-80">✓ Server ready on http://localhost:3000</div>
                            <div className="text-muted-foreground mt-2 font-light italic opacity-50">[HMR] Waiting for changes...</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
