"use client";

import { useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import {
    CreditCard,
    ShieldCheck,
    ArrowLeft,
    CheckCircle2,
    Lock,
    Zap
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Navbar from "@/components/layout/Navbar";
import { Suspense } from "react";

function CheckoutContent() {
    const searchParams = useSearchParams();
    const plan = searchParams.get("plan") || "standard";

    const [isProcessing, setIsProcessing] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [cardName, setCardName] = useState("");
    const [cardNumber, setCardNumber] = useState("");
    const [expiry, setExpiry] = useState("");
    const [cvv, setCvv] = useState("");

    const planDetails = {
        standard: { name: "Standard", basePrice: 50 },
        premium: { name: "Premium", basePrice: 100 },
    }[plan as "standard" | "premium"] || { name: "Standard", basePrice: 50 };

    const gst = Math.round(planDetails.basePrice * 0.18);
    const total = planDetails.basePrice + gst;

    const handlePayment = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!cardName || !cardNumber || !expiry || !cvv) return;
        setIsProcessing(true);
        // Razorpay integration point — simulate for now
        await new Promise((r) => setTimeout(r, 2000));
        setIsProcessing(false);
        setIsSuccess(true);
    };

    if (isSuccess) {
        return (
            <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6 text-center">
                <div className="w-20 h-20 bg-green-500/20 text-green-400 rounded-full flex items-center justify-center mx-auto mb-6">
                    <CheckCircle2 className="w-10 h-10" />
                </div>
                <h1 className="text-3xl font-bold mb-4">Payment Successful!</h1>
                <p className="text-muted-foreground mb-8 max-w-md mx-auto">
                    Welcome to CodeSphere {planDetails.name}. Your account has been upgraded and all premium features are now unlocked.
                </p>
                <Link href="/dashboard">
                    <Button size="lg" className="gap-2">
                        Go to Dashboard <ArrowLeft className="w-4 h-4 rotate-180" />
                    </Button>
                </Link>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background flex flex-col">
            <Navbar />

            <div className="flex-1 py-12 pt-24 max-w-5xl mx-auto w-full px-4 sm:px-6">
                <Link href="/pricing" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-8 transition-colors">
                    <ArrowLeft className="w-4 h-4" /> Back to Pricing
                </Link>

                <div className="grid md:grid-cols-5 gap-8 lg:gap-12">
                    {/* Checkout Form */}
                    <div className="md:col-span-3">
                        <h1 className="text-3xl font-bold mb-6">Complete your purchase</h1>

                        <form onSubmit={handlePayment} className="space-y-8">
                            <Card className="bg-card/40 border-border/40">
                                <CardContent className="p-6">
                                    <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                                        <CreditCard className="w-5 h-5 text-primary" /> Payment Method
                                    </h2>

                        <div className="space-y-4">
                                        <div className="grid gap-2">
                                            <Label htmlFor="name">Name on Card</Label>
                                            <Input id="name" placeholder="John Doe" required className="bg-background" value={cardName} onChange={(e) => setCardName(e.target.value)} />
                                        </div>
                                        <div className="grid gap-2">
                                            <Label htmlFor="card">Card Number</Label>
                                            <Input id="card" placeholder="0000 0000 0000 0000" required className="bg-background font-mono" maxLength={19} value={cardNumber} onChange={(e) => setCardNumber(e.target.value.replace(/\D/g, "").replace(/(.{4})/g, "$1 ").trim())} />
                                        </div>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="grid gap-2">
                                                <Label htmlFor="expiry">Expiry Date</Label>
                                                <Input id="expiry" placeholder="MM/YY" required className="bg-background" maxLength={5} value={expiry} onChange={(e) => setExpiry(e.target.value)} />
                                            </div>
                                            <div className="grid gap-2">
                                                <Label htmlFor="cvv">CVV</Label>
                                                <Input id="cvv" placeholder="123" required className="bg-background" type="password" maxLength={4} value={cvv} onChange={(e) => setCvv(e.target.value)} />
                                            </div>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            <Button type="submit" size="lg" className="w-full gap-2 text-base h-14" disabled={isProcessing}>
                                {isProcessing ? (
                                    <>Processing...</>
                                ) : (
                                    <>
                                        <Lock className="w-4 h-4" /> Pay ₹{total} securely
                                    </>
                                )}
                            </Button>

                            <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
                                <ShieldCheck className="w-4 h-4 text-green-500" />
                                Payments are secured and encrypted by Razorpay
                            </div>
                        </form>
                    </div>

                    {/* Order Summary */}
                    <div className="md:col-span-2">
                        <Card className="bg-primary/5 border-primary/20 sticky top-24">
                            <CardContent className="p-6">
                                <h2 className="text-lg font-semibold mb-6">Order Summary</h2>

                                <div className="flex items-center justify-between mb-4 pb-4 border-b border-border/40">
                                    <div className="flex items-center gap-2">
                                        <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center text-primary">
                                            <Zap className="w-5 h-5" />
                                        </div>
                                        <div>
                                            <div className="font-semibold text-sm">CodeSphere {planDetails.name}</div>
                                            <div className="text-xs text-muted-foreground">Monthly subscription</div>
                                        </div>
                                    </div>
                                    <div className="font-semibold">₹{planDetails.basePrice}</div>
                                </div>

                                <div className="space-y-3 text-sm mb-6 pb-6 border-b border-border/40">
                                    <div className="flex justify-between text-muted-foreground">
                                        <span>Subtotal</span>
                                        <span className="text-foreground">₹{planDetails.basePrice}</span>
                                    </div>
                                    <div className="flex justify-between text-muted-foreground">
                                        <span>GST (18%)</span>
                                        <span className="text-foreground">₹{gst}</span>
                                    </div>
                                </div>

                                <div className="flex justify-between items-end mb-8">
                                    <span className="font-semibold">Total Due</span>
                                    <div className="text-right">
                                        <span className="text-2xl font-bold">₹{total}</span>
                                        <div className="text-xs text-muted-foreground">includes all taxes</div>
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <div className="flex items-start gap-2 text-xs text-muted-foreground">
                                        <CheckCircle2 className="w-4 h-4 shrink-0 text-green-500" />
                                        <span>Cancel anytime. No hidden fees.</span>
                                    </div>
                                    <div className="flex items-start gap-2 text-xs text-muted-foreground">
                                        <CheckCircle2 className="w-4 h-4 shrink-0 text-green-500" />
                                        <span>Instant access to all premium features.</span>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default function CheckoutPage() {
    return (
        <Suspense fallback={<div className="min-h-screen bg-background flex flex-col items-center justify-center p-6"><Navbar /><div className="flex-1 mt-24">Loading checkout...</div></div>}>
            <CheckoutContent />
        </Suspense>
    );
}
