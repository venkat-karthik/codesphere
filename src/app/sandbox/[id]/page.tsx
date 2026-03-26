"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, CheckCircle2, ChevronRight, Lock, MonitorPlay, Code2, Terminal, HelpCircle, FastForward } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import Navbar from "@/components/layout/Navbar";

export default function SandboxIDE() {
    const [step, setStep] = useState(1);
    const totalSteps = 5;

    return (
        <div className="h-screen bg-background flex flex-col overflow-hidden">
            {/* Small Navbar Override for immersive mode */}
            <header className="h-14 border-b border-border/40 bg-card/50 flex items-center justify-between px-4 shrink-0 transition-colors">
                <div className="flex items-center gap-4">
                    <Link href="/sandbox">
                        <Button variant="ghost" size="icon" className="w-8 h-8"><ArrowLeft className="w-4 h-4" /></Button>
                    </Link>
                    <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded bg-orange-500/20 text-orange-400 flex items-center justify-center shrink-0">
                            <Code2 className="w-3.5 h-3.5" />
                        </div>
                        <h1 className="text-sm font-semibold truncate hidden sm:block">Build a Modern ToDo App</h1>
                    </div>
                </div>

                <div className="flex items-center gap-4">
                    <div className="hidden md:flex items-center gap-3 w-48">
                        <Progress value={(step / totalSteps) * 100} className="h-2 bg-muted flex-1" />
                        <span className="text-xs font-medium text-muted-foreground">{step}/{totalSteps}</span>
                    </div>
                    <Button size="sm" variant="outline" className="h-8 gap-1.5"><HelpCircle className="w-3.5 h-3.5" /> Help</Button>
                    <Button size="sm" className="h-8 gap-1.5 bg-green-600 hover:bg-green-700 text-white" onClick={() => setStep(Math.min(totalSteps, step + 1))}>
                        Run Check <FastForward className="w-3.5 h-3.5" />
                    </Button>
                </div>
            </header>

            {/* Main content grid */}
            <div className="flex-1 flex overflow-hidden">
                {/* Left: Interactive Guide Panel */}
                <div className="w-[400px] border-r border-border/40 bg-card/20 flex flex-col shrink-0 overflow-y-auto">
                    <div className="p-6">
                        <div className="text-xs font-semibold text-orange-400 tracking-wider uppercase mb-2">Step {step} of {totalSteps}</div>
                        <h2 className="text-2xl font-bold mb-4">Initialize State & Context</h2>
                        <div className="prose prose-sm dark:prose-invert text-muted-foreground leading-relaxed">
                            <p>In React, state refers to data that can change over time. When state changes, React elegantly re-renders the component.</p>
                            <p>For our ToDo application, we need an array to hold the list of tasks. We'll use the <code>useState</code> hook inside our main component to accomplish this.</p>

                            <div className="bg-muted/50 p-4 rounded-lg border border-border/40 my-6 font-mono text-xs text-foreground">
                                <span className="text-green-400">{"// Example of useState"}</span><br />
                                <span className="text-blue-400">const</span> [todos, setTodos] = <span className="text-purple-400">useState</span>([]);
                            </div>

                            <h3 className="text-foreground font-semibold text-base mb-2">Instructions:</h3>
                            <ul className="space-y-3 mb-8">
                                <li className="flex items-start gap-2">
                                    <div className="w-4 h-4 rounded-full border border-border flex items-center justify-center mt-0.5 shrink-0"><CheckCircle2 className="w-3 h-3 text-muted-foreground opacity-50" /></div>
                                    <span>Import <code>useState</code> from react at the top of <code>App.tsx</code>.</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <div className="w-4 h-4 rounded-full border border-border flex items-center justify-center mt-0.5 shrink-0"><CheckCircle2 className="w-3 h-3 text-muted-foreground opacity-50" /></div>
                                    <span>Initialize an empty array state variable named <code>todos</code>.</span>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>

                {/* Center: Editor Code */}
                <div className="flex-1 flex flex-col border-r border-border/40 bg-[#0d1117] min-w-0">
                    <div className="flex items-center px-4 py-2 bg-[#161b22] border-b border-border/40 text-sm font-mono text-primary gap-2">
                        <Code2 className="w-4 h-4" /> App.tsx
                    </div>
                    <div className="flex-1 p-4 overflow-auto font-mono text-sm leading-relaxed text-[#c9d1d9] relative">
                        <div className="pl-4">
                            <div className="text-[#ff7b72]">import React from <span className="text-[#a5d6ff]">"react"</span>;</div>
                            <div className="text-[#ff7b72]">import <span className="text-[#a5d6ff]">"./style.css"</span>;</div>
                            <div>&nbsp;</div>
                            <div className="text-[#ff7b72]">export default function <span className="text-[#d2a8ff]">App</span>() {`{`}</div>
                            <div className="text-[#8b949e]">  // TODO: Initialize state here</div>
                            <div>&nbsp;&nbsp;<span className="text-[#ff7b72]">return</span> (</div>
                            <div>&nbsp;&nbsp;&nbsp;&nbsp;&lt;<span className="text-[#7ee787]">div</span> <span className="text-[#79c0ff]">className</span>=<span className="text-[#a5d6ff]">"container"</span>&gt;</div>
                            <div>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&lt;<span className="text-[#7ee787]">h1</span>&gt;My ToDos&lt;/<span className="text-[#7ee787]">h1</span>&gt;</div>
                            <div className="text-[#8b949e]">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;// Render list...</div>
                            <div>&nbsp;&nbsp;&nbsp;&nbsp;&lt;/<span className="text-[#7ee787]">div</span>&gt;</div>
                            <div>&nbsp;&nbsp;)</div>
                            <div>{`}`}</div>
                        </div>
                    </div>
                    {/* Output Terminal */}
                    <div className="h-32 border-t border-border/40 bg-[#0d1117] p-2">
                        <div className="text-xs font-mono text-muted-foreground flex items-center gap-2 uppercase tracking-wide mb-2"><Terminal className="w-3.5 h-3.5" /> Console Output</div>
                        <div className="font-mono text-xs text-red-400">
                            Error: ReferenceError: useState is not defined
                        </div>
                    </div>
                </div>

                {/* Right: Embedded Browser Preview */}
                <div className="w-[35%] bg-white hidden xl:flex flex-col relative shrink-0">
                    <div className="h-8 bg-muted flex items-center px-3 border-b border-border">
                        <div className="flex gap-1.5">
                            <div className="w-2.5 h-2.5 rounded-full bg-red-400" />
                            <div className="w-2.5 h-2.5 rounded-full bg-yellow-400" />
                            <div className="w-2.5 h-2.5 rounded-full bg-green-400" />
                        </div>
                        <div className="mx-auto bg-background px-4 py-0.5 rounded-sm text-[10px] text-muted-foreground font-mono">localhost:3000</div>
                    </div>
                    <div className="flex-1 p-6 text-black flex items-center justify-center">
                        <div className="text-center">
                            <MonitorPlay className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                            <p className="text-red-500 font-mono text-sm">Compilation Error</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
