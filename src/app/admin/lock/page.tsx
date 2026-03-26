"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Shield, Lock, ArrowRight, AlertCircle, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function AdminLockPage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const returnUrl = searchParams.get("returnUrl") || "/admin";
    const [key, setKey] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    // Default admin key for this implementation
    const ADMIN_SECRET = "CODESPHERE_ADMIN_2026";

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setLoading(true);

        try {
            // Simulate a secure check
            await new Promise(resolve => setTimeout(resolve, 800));

            if (key === ADMIN_SECRET) {
                // Set cookie
                document.cookie = `admin-verified=true; path=/; max-age=${60 * 60 * 24}; SameSite=Strict`;
                router.push(returnUrl);
                router.refresh();
            } else {
                setError("Invalid administrative key. Access denied.");
            }
        } catch (err) {
            setError("A system error occurred. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#020617] flex items-center justify-center p-4 overflow-hidden relative">
            {/* Background elements */}
            <div className="absolute top-0 left-0 w-full h-full pointer-events-none opacity-20">
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-500/20 blur-[120px] rounded-full animate-pulse" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-500/20 blur-[120px] rounded-full animate-pulse delay-1000" />
            </div>

            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, ease: "easeOut" }}
                className="w-full max-w-md relative z-10"
            >
                <div className="flex justify-center mb-8">
                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary to-purple-600 flex items-center justify-center shadow-[0_0_30px_rgba(59,130,246,0.3)] border border-white/10">
                        <Shield className="w-8 h-8 text-white" />
                    </div>
                </div>

                <Card className="bg-slate-900/50 border-slate-800 backdrop-blur-xl shadow-2xl overflow-hidden">
                    <div className="h-1 w-full bg-gradient-to-r from-transparent via-primary/50 to-transparent" />
                    <CardHeader className="text-center pb-2">
                        <CardTitle className="text-2xl font-bold tracking-tight text-white mb-2">Restricted Access</CardTitle>
                        <CardDescription className="text-slate-400">
                            Enter your unique administrative key to unlock the platform governance tools.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="pt-6">
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="space-y-2 relative">
                                <div className="absolute left-3 top-[34px] text-slate-500">
                                    <Lock className="w-4 h-4" />
                                </div>
                                <Input
                                    type="password"
                                    placeholder="••••••••••••••••"
                                    value={key}
                                    onChange={(e) => setKey(e.target.value)}
                                    className="h-12 bg-slate-950/50 border-slate-700 pl-10 focus:border-primary/50 focus:ring-primary/20 transition-all text-center tracking-[0.3em] font-mono"
                                    required
                                    autoFocus
                                />
                            </div>

                            <AnimatePresence mode="wait">
                                {error && (
                                    <motion.div
                                        initial={{ opacity: 0, height: 0 }}
                                        animate={{ opacity: 1, height: "auto" }}
                                        exit={{ opacity: 0, height: 0 }}
                                        className="bg-red-500/10 border border-red-500/20 text-red-400 p-3 rounded-lg text-sm flex items-start gap-2"
                                    >
                                        <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
                                        <span>{error}</span>
                                    </motion.div>
                                )}
                            </AnimatePresence>

                            <Button 
                                type="submit" 
                                disabled={loading || !key}
                                className="w-full h-12 text-md font-semibold gap-2 bg-gradient-to-r from-primary to-blue-600 hover:from-primary/90 hover:to-blue-600/90 shadow-[0_4px_15px_rgba(59,130,246,0.2)]"
                            >
                                {loading ? (
                                    <Loader2 className="w-5 h-5 animate-spin" />
                                ) : (
                                    <>
                                        Access Administration
                                        <ArrowRight className="w-4 h-4" />
                                    </>
                                )}
                            </Button>
                        </form>
                    </CardContent>
                </Card>

                <div className="mt-8 text-center">
                    <Button 
                        variant="link" 
                        onClick={() => router.push("/")}
                        className="text-slate-400 hover:text-white transition-colors"
                    >
                        Return to Public Platform
                    </Button>
                </div>
            </motion.div>

            {/* Futuristic Grid Overlay */}
            <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 pointer-events-none mix-blend-overlay" />
            <div className="absolute inset-0 bg-[linear-gradient(rgba(15,23,42,0.8)_1px,transparent_1px),linear-gradient(90deg,rgba(15,23,42,0.8)_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] opacity-30 pointer-events-none" />
        </div>
    );
}
