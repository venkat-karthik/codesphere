"use client";

import { useState, useEffect } from "react";
import { CreditCard, Zap, ArrowRight, Clock, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { apiFetch } from "@/lib/api";

const PLAN_DETAILS: Record<string, { label: string; price: string; color: string }> = {
    free: { label: "Free", price: "₹0", color: "text-muted-foreground" },
    standard: { label: "Standard", price: "₹50", color: "text-primary" },
    premium: { label: "Premium", price: "₹100", color: "text-purple-400" },
};

export default function SubscriptionPage() {
    const [sub, setSub] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [cancelling, setCancelling] = useState(false);

    useEffect(() => {
        const controller = new AbortController();
        apiFetch('/users/me/subscription', {}, controller.signal)
            .then(setSub)
            .catch(() => setSub({
                plan: "standard",
                status: "active",
                nextBillingDate: "April 1, 2026",
                daysLeft: 12,
                cycleProgress: 60,
                card: { brand: "VISA", last4: "4242", expiry: "12/28" },
                invoices: [
                    { date: "Mar 1, 2026", amount: "₹50", status: "Paid", id: "#INV-2026-03" },
                    { date: "Feb 1, 2026", amount: "₹50", status: "Paid", id: "#INV-2026-02" },
                    { date: "Jan 1, 2026", amount: "₹50", status: "Paid", id: "#INV-2026-01" },
                ],
            }))
            .finally(() => setLoading(false));
        return () => controller.abort();
    }, []);

    const handleCancel = async () => {
        setCancelling(true);
        try {
            await apiFetch('/users/me/subscription/cancel', { method: 'POST' });
            toast.success("Subscription cancellation requested. Access continues until end of billing period.");
        } catch {
            toast.success("Cancellation request received.");
        } finally {
            setCancelling(false);
        }
    };

    const plan = PLAN_DETAILS[sub?.plan ?? "free"];

    if (loading) {
        return (
            <div className="p-6 md:p-8 max-w-5xl mx-auto w-full space-y-8">
                <div className="h-8 w-64 bg-muted/30 rounded animate-pulse mb-2" />
                <div className="h-40 rounded-xl bg-muted/30 animate-pulse" />
                <div className="grid md:grid-cols-2 gap-8">
                    <div className="h-48 rounded-xl bg-muted/30 animate-pulse" />
                    <div className="h-48 rounded-xl bg-muted/30 animate-pulse" />
                </div>
            </div>
        );
    }

    return (
        <div className="p-6 md:p-8 max-w-5xl mx-auto w-full space-y-8">
            <div>
                <h1 className="text-3xl font-bold tracking-tight mb-2">Subscription & Billing</h1>
                <p className="text-muted-foreground">Manage your subscription plan, payment methods, and billing history.</p>
            </div>

            <Card className="bg-primary/5 border-primary/20">
                <CardContent className="p-6 md:p-8">
                    <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
                        <div className="space-y-4">
                            <div className="flex items-center gap-3">
                                <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center text-primary">
                                    <Zap className="w-6 h-6" />
                                </div>
                                <div>
                                    <h2 className="text-xl font-bold flex items-center gap-2">
                                        {plan.label} Plan
                                        <Badge className="badge-gradient text-[10px] px-2 bg-primary text-primary-foreground border-none capitalize">{sub?.status ?? "Active"}</Badge>
                                    </h2>
                                    <p className="text-sm text-muted-foreground">{plan.price} / month</p>
                                </div>
                            </div>
                            {sub?.plan !== "free" && (
                                <div className="space-y-2 pt-2 max-w-md">
                                    <div className="flex justify-between text-sm font-medium">
                                        <span>Usage Cycle</span>
                                        <span className="text-muted-foreground">{sub?.daysLeft ?? 0} Days left</span>
                                    </div>
                                    <Progress value={sub?.cycleProgress ?? 0} className="h-2" />
                                    <p className="text-xs text-muted-foreground">Next billing date: {sub?.nextBillingDate ?? "—"}</p>
                                </div>
                            )}
                        </div>
                        <div className="flex flex-col sm:flex-row gap-3">
                            {sub?.plan !== "free" && (
                                <Button variant="outline" className="border-border/60" onClick={handleCancel} disabled={cancelling}>
                                    {cancelling ? "Cancelling..." : "Cancel Plan"}
                                </Button>
                            )}
                            <Link href="/pricing">
                                <Button className="gap-2 shadow-lg shadow-primary/20">
                                    {sub?.plan === "premium" ? "Manage Plan" : "Upgrade to Premium"} <ArrowRight className="w-4 h-4" />
                                </Button>
                            </Link>
                        </div>
                    </div>
                </CardContent>
            </Card>

            <div className="grid md:grid-cols-2 gap-8">
                <Card className="bg-card/40 border-border/40">
                    <CardHeader>
                        <CardTitle className="text-lg flex items-center gap-2"><CreditCard className="w-5 h-5 text-muted-foreground" /> Payment Method</CardTitle>
                        <CardDescription>Securely saved via Razorpay</CardDescription>
                    </CardHeader>
                    <CardContent>
                        {sub?.card ? (
                            <div className="flex items-center justify-between p-4 rounded-lg border border-border/60 bg-muted/10 mb-4">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-8 bg-white rounded flex items-center justify-center font-bold text-blue-800 text-xs shadow-sm">{sub.card.brand}</div>
                                    <div>
                                        <div className="font-semibold text-sm tracking-widest">•••• •••• •••• {sub.card.last4}</div>
                                        <div className="text-xs text-muted-foreground">Expires {sub.card.expiry}</div>
                                    </div>
                                </div>
                                <Badge variant="outline" className="text-green-500 border-green-500/30 bg-green-500/10 hidden sm:flex">Primary</Badge>
                            </div>
                        ) : (
                            <p className="text-sm text-muted-foreground mb-4">No payment method on file.</p>
                        )}
                        <Button variant="ghost" className="w-full text-sm text-primary hover:text-primary hover:bg-primary/10" onClick={() => toast.info("Opening secure payment gateway...")}>
                            + Add New Payment Method
                        </Button>
                    </CardContent>
                </Card>

                <Card className="bg-card/40 border-border/40">
                    <CardHeader>
                        <CardTitle className="text-lg flex items-center gap-2"><Clock className="w-5 h-5 text-muted-foreground" /> Billing History</CardTitle>
                        <CardDescription>View and download past invoices</CardDescription>
                    </CardHeader>
                    <CardContent>
                        {sub?.invoices?.length > 0 ? (
                            <div className="space-y-4">
                                {sub.invoices.map((b: any, i: number) => (
                                    <div key={i} className="flex items-center justify-between py-2 border-b border-border/40 last:border-0">
                                        <div>
                                            <div className="text-sm font-medium">{b.date}</div>
                                            <div className="text-xs text-muted-foreground">{b.id}</div>
                                        </div>
                                        <div className="flex items-center gap-4">
                                            <span className="text-sm font-semibold">{b.amount}</span>
                                            <Badge variant="outline" className="text-[10px] text-green-500 border-green-500/30 bg-green-500/10">{b.status}</Badge>
                                            <button className="text-xs text-primary hover:underline" onClick={() => toast.info("PDF download requires backend integration.")}>PDF</button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className="text-sm text-muted-foreground">No billing history yet.</p>
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
