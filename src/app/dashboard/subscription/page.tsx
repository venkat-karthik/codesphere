"use client";

import { CreditCard, CheckCircle2, Zap, ArrowRight, Clock, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

export default function SubscriptionPage() {
    return (
        <div className="p-6 md:p-8 max-w-5xl mx-auto w-full space-y-8">
            <div>
                <h1 className="text-3xl font-bold tracking-tight mb-2">Subscription & Billing</h1>
                <p className="text-muted-foreground">
                    Manage your subscription plan, payment methods, and billing history.
                </p>
            </div>

            {/* Current Plan Card */}
            <Card className="bg-primary/5 border-primary/20">
                <CardContent className="p-6 md:p-8">
                    <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
                        <div className="space-y-4">
                            <div className="flex items-center gap-3">
                                <div className="w-12 h-12 rounded-xl bg-primary/20 flex flex-col items-center justify-center text-primary">
                                    <Zap className="w-6 h-6" />
                                </div>
                                <div>
                                    <h2 className="text-xl font-bold flex items-center gap-2">
                                        Standard Plan <Badge className="badge-gradient text-[10px] px-2 bg-primary text-primary-foreground border-none">Active</Badge>
                                    </h2>
                                    <p className="text-sm text-muted-foreground">₹50 / month</p>
                                </div>
                            </div>

                            <div className="space-y-2 pt-2 max-w-md">
                                <div className="flex justify-between text-sm font-medium">
                                    <span>Usage Cycle</span>
                                    <span className="text-muted-foreground">12 Days left</span>
                                </div>
                                <Progress value={60} className="h-2" />
                                <p className="text-xs text-muted-foreground">Your next billing date is April 1, 2026.</p>
                            </div>
                        </div>

                        <div className="flex flex-col sm:flex-row gap-3">
                            <Button variant="outline" className="border-border/60" onClick={() => toast.success("Plan cancellation requested")}>Cancel Plan</Button>
                            <Link href="/pricing">
                                <Button className="gap-2 shadow-lg shadow-primary/20">
                                    Upgrade to Premium <ArrowRight className="w-4 h-4" />
                                </Button>
                            </Link>
                        </div>
                    </div>
                </CardContent>
            </Card>

            <div className="grid md:grid-cols-2 gap-8">
                {/* Payment Method */}
                <Card className="bg-card/40 border-border/40">
                    <CardHeader>
                        <CardTitle className="text-lg flex items-center gap-2">
                            <CreditCard className="w-5 h-5 text-muted-foreground" /> Payment Method
                        </CardTitle>
                        <CardDescription>Securely saved via Razorpay</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="flex items-center justify-between p-4 rounded-lg border border-border/60 bg-muted/10 mb-4">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-8 bg-white rounded flex items-center justify-center font-bold text-blue-800 text-xs shadow-sm">
                                    VISA
                                </div>
                                <div>
                                    <div className="font-semibold text-sm tracking-widest">•••• •••• •••• 4242</div>
                                    <div className="text-xs text-muted-foreground">Expires 12/28</div>
                                </div>
                            </div>
                            <Badge variant="outline" className="text-green-500 border-green-500/30 bg-green-500/10 hidden sm:flex">Primary</Badge>
                        </div>
                        <Button variant="ghost" className="w-full text-sm text-primary hover:text-primary hover:bg-primary/10" onClick={() => toast.info("Opening secure payment gateway...")}>
                            + Add New Payment Method
                        </Button>
                    </CardContent>
                </Card>

                {/* Invoice History */}
                <Card className="bg-card/40 border-border/40">
                    <CardHeader>
                        <CardTitle className="text-lg flex items-center gap-2">
                            <Clock className="w-5 h-5 text-muted-foreground" /> Billing History
                        </CardTitle>
                        <CardDescription>View and download past invoices</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {[
                                { date: "Mar 1, 2026", amount: "₹50", status: "Paid", inv: "#INV-2026-03" },
                                { date: "Feb 1, 2026", amount: "₹50", status: "Paid", inv: "#INV-2026-02" },
                                { date: "Jan 1, 2026", amount: "₹50", status: "Paid", inv: "#INV-2026-01" },
                            ].map((b, i) => (
                                <div key={i} className="flex items-center justify-between py-2 border-b border-border/40 last:border-0 pb-3 last:pb-0">
                                    <div>
                                        <div className="text-sm font-medium">{b.date}</div>
                                        <div className="text-xs text-muted-foreground">{b.inv}</div>
                                    </div>
                                    <div className="flex items-center gap-4">
                                        <span className="text-sm font-semibold">{b.amount}</span>
                                        <Badge variant="outline" className="text-[10px] text-green-500 border-green-500/30 bg-green-500/10">{b.status}</Badge>
                                        <button className="text-xs text-primary hover:underline">PDF</button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </div>

        </div>
    );
}
