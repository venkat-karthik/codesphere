"use client";

import Link from "next/link";
import { useState } from "react";
import {
  CheckCircle2,
  X,
  Zap,
  ArrowRight,
  Star,
  Shield,
  Lock,
  Sparkles,
  CreditCard,
  Globe,
  Users,
  Video,
  BookOpen,
  Layers,
  Code2,
  FlaskConical,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

const plans = [
  {
    name: "Free",
    price: { monthly: 0, annual: 0 },
    desc: "Explore the platform and get started",
    badge: null,
    gradient: "border-border/40",
    highlight: false,
    features: {
      "Learning": [
        { label: "Basic learning paths (5 paths)", included: true },
        { label: "Full library (200+ paths)", included: false },
        { label: "Resources (limited)", included: true },
        { label: "Full resource hub", included: false },
        { label: "Tests & quizzes", included: false },
        { label: "AI-powered roadmaps", included: false },
      ],
      "Community": [
        { label: "Join public communities", included: true },
        { label: "Create communities", included: false },
        { label: "Community posts & replies", included: true },
        { label: "Live sessions (view only)", included: true },
        { label: "Create live sessions", included: false },
      ],
      "Events": [
        { label: "Browse events", included: true },
        { label: "Event registration links", included: true },
        { label: "Event reminders", included: false },
      ],
      "Codex & Sandbox": [
        { label: "Join Codex projects", included: false },
        { label: "Create private Codex projects", included: false },
        { label: "Sandbox tutorials (basic)", included: false },
      ],
    },
    cta: "Get Started Free",
    ctaVariant: "outline" as const,
    href: "/signup",
  },
  {
    name: "Standard",
    price: { monthly: 50, annual: 40 },
    desc: "Everything you need to grow as a developer",
    badge: "Most Popular",
    gradient: "border-primary/50 shadow-lg shadow-primary/10",
    highlight: true,
    features: {
      "Learning": [
        { label: "Full library (200+ paths)", included: true },
        { label: "Complete resource hub", included: true },
        { label: "Tests & performance analytics", included: true },
        { label: "Progress tracking", included: true },
        { label: "AI-powered roadmaps", included: false },
      ],
      "Community": [
        { label: "Join all communities", included: true },
        { label: "Create public communities", included: true },
        { label: "Full posts & discussions", included: true },
        { label: "Create live sessions", included: true },
        { label: "Join private sessions", included: true },
      ],
      "Events": [
        { label: "Browse & register for events", included: true },
        { label: "Event reminders", included: true },
        { label: "Event calendar sync", included: true },
      ],
      "Codex & Sandbox": [
        { label: "Join Codex projects", included: true },
        { label: "Create private Codex projects", included: false },
        { label: "Sandbox tutorials (all)", included: true },
      ],
    },
    cta: "Get Standard",
    ctaVariant: "default" as const,
    href: "/checkout?plan=standard",
  },
  {
    name: "Premium",
    price: { monthly: 100, annual: 80 },
    desc: "Unlock the full power of CodeSphere",
    badge: "Best Value",
    gradient: "border-purple-500/40",
    highlight: false,
    features: {
      "Learning": [
        { label: "Everything in Standard", included: true },
        { label: "AI-powered personalized roadmaps", included: true },
        { label: "Priority resource access", included: true },
        { label: "Premium exclusive tutorials", included: true },
        { label: "Advanced analytics dashboard", included: true },
      ],
      "Community": [
        { label: "Everything in Standard", included: true },
        { label: "Create private communities", included: true },
        { label: "Advanced moderation tools", included: true },
        { label: "Unlimited session creation", included: true },
      ],
      "Events": [
        { label: "Everything in Standard", included: true },
        { label: "Priority event recommendations", included: true },
      ],
      "Codex & Sandbox": [
        { label: "Create private Codex projects", included: true },
        { label: "Advanced team collaboration", included: true },
        { label: "Premium sandbox environments", included: true },
        { label: "Unlimited project members", included: true },
      ],
    },
    cta: "Go Premium",
    ctaVariant: "outline" as const,
    href: "/checkout?plan=premium",
  },
];

const faqs = [
  {
    q: "Can I switch plans anytime?",
    a: "Yes, you can upgrade or downgrade your plan at any time. Changes take effect from your next billing cycle.",
  },
  {
    q: "Is there a free trial for paid plans?",
    a: "We offer a 7-day free trial for both Standard and Premium plans. No credit card required to start the trial.",
  },
  {
    q: "What payment methods do you accept?",
    a: "We accept all major Indian payment methods via Razorpay — UPI, debit/credit cards, net banking, and wallets.",
  },
  {
    q: "Are there hard paywalls on content?",
    a: "No. Our philosophy is fair access. Premium enhances your experience but core learning is always accessible.",
  },
  {
    q: "Is there a refund policy?",
    a: "Yes. We offer a 7-day full refund guarantee if you're not satisfied with your subscription.",
  },
  {
    q: "Do you offer team or institutional pricing?",
    a: "Yes! We offer custom pricing for teams, bootcamps, and educational institutions. Contact us for details.",
  },
];

export default function PricingPage() {
  const [annual, setAnnual] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="pt-16">
        {/* Hero */}
        <div className="relative py-16 hero-bg border-b border-border/40 text-center">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <Badge variant="outline" className="mb-4 border-green-500/30 text-green-400">Pricing</Badge>
            <h1 className="text-4xl sm:text-5xl font-bold mb-4">
              Simple, transparent pricing.
              <br />
              <span className="gradient-text">No surprises.</span>
            </h1>
            <p className="text-muted-foreground text-lg mb-8 max-w-2xl mx-auto">
              Start free — upgrade when you&apos;re ready. Core value is always accessible.
              Premium enhances, not gates.
            </p>

            {/* Billing toggle */}
            <div className="inline-flex items-center gap-3 bg-muted/50 rounded-full p-1">
              <button
                onClick={() => setAnnual(false)}
                className={`px-4 py-1.5 rounded-full text-sm transition-colors ${!annual ? "bg-background shadow-sm font-medium" : "text-muted-foreground"
                  }`}
              >
                Monthly
              </button>
              <button
                onClick={() => setAnnual(true)}
                className={`px-4 py-1.5 rounded-full text-sm transition-colors flex items-center gap-2 ${annual ? "bg-background shadow-sm font-medium" : "text-muted-foreground"
                  }`}
              >
                Annual
                <Badge className="bg-green-500/20 text-green-400 border-green-500/30 text-[10px]">Save 20%</Badge>
              </button>
            </div>
          </div>
        </div>

        {/* Plans */}
        <section className="py-16">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid md:grid-cols-3 gap-6 mb-16">
              {plans.map((plan) => {
                const price = annual ? plan.price.annual : plan.price.monthly;
                return (
                  <div
                    key={plan.name}
                    className={`relative rounded-2xl border p-6 ${plan.gradient} ${plan.highlight ? "bg-primary/5" : "bg-card/50"}`}
                  >
                    {plan.badge && (
                      <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                        <Badge className={`${plan.highlight ? "badge-gradient" : "bg-purple-500/20 text-purple-400 border-purple-500/30"} text-xs px-3`}>
                          {plan.badge}
                        </Badge>
                      </div>
                    )}

                    <div className="mb-5">
                      <h3 className="font-bold text-xl mb-1">{plan.name}</h3>
                      <p className="text-sm text-muted-foreground mb-4">{plan.desc}</p>
                      <div className="flex items-end gap-1">
                        <span className="text-4xl font-bold">₹{price}</span>
                        {price > 0 && <span className="text-muted-foreground pb-1.5">/month</span>}
                        {price === 0 && <span className="text-muted-foreground pb-1.5">forever</span>}
                      </div>
                      {annual && price > 0 && (
                        <p className="text-xs text-green-400 mt-1">Billed ₹{price * 12}/year</p>
                      )}
                    </div>

                    <Link href={plan.href}>
                      <Button
                        className={`w-full mb-5 ${plan.highlight ? "bg-primary hover:bg-primary/90" : ""}`}
                        variant={plan.ctaVariant}
                      >
                        {plan.cta}
                      </Button>
                    </Link>

                    <div className="space-y-4">
                      {Object.entries(plan.features).map(([section, items]) => (
                        <div key={section}>
                          <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">{section}</div>
                          <ul className="space-y-1.5">
                            {items.map((f) => (
                              <li key={f.label} className={`flex items-start gap-2 text-sm ${f.included ? "" : "opacity-40"}`}>
                                {f.included
                                  ? <CheckCircle2 className={`w-4 h-4 shrink-0 mt-0.5 ${plan.highlight ? "text-primary" : "text-green-400"}`} />
                                  : <X className="w-4 h-4 shrink-0 mt-0.5 text-muted-foreground" />
                                }
                                {f.label}
                              </li>
                            ))}
                          </ul>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Security badges */}
            <div className="flex flex-wrap items-center justify-center gap-8 py-8 border-t border-border/40 mb-16">
              {[
                { icon: Shield, label: "256-bit SSL Encryption" },
                { icon: CreditCard, label: "Razorpay Secure Payments" },
                { icon: Star, label: "7-Day Money Back" },
                { icon: Lock, label: "No Hidden Charges" },
              ].map((item) => (
                <div key={item.label} className="flex items-center gap-2 text-sm text-muted-foreground">
                  <item.icon className="w-4 h-4 text-green-400" />
                  {item.label}
                </div>
              ))}
            </div>

            {/* Feature comparison summary */}
            <div className="mb-16">
              <h2 className="text-2xl font-bold text-center mb-8">
                What makes each plan <span className="gradient-text">different?</span>
              </h2>
              <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                  { icon: Layers, label: "Learning Paths", free: "5 paths", std: "200+ paths", premium: "200+ + AI recommended", color: "text-blue-400", bg: "bg-blue-500/10" },
                  { icon: Users, label: "Communities", free: "Join public", std: "Join + Create public", premium: "Join + Create private too", color: "text-purple-400", bg: "bg-purple-500/10" },
                  { icon: Video, label: "Live Sessions", free: "View only", std: "Create + Join all", premium: "Unlimited creation", color: "text-green-400", bg: "bg-green-500/10" },
                  { icon: Code2, label: "Virtual Codex", free: "Not included", std: "Join projects", premium: "Create private projects", color: "text-pink-400", bg: "bg-pink-500/10" },
                ].map((item) => (
                  <Card key={item.label} className="border-border/40 bg-card/50">
                    <CardContent className="p-4">
                      <div className={`w-10 h-10 rounded-xl ${item.bg} flex items-center justify-center mb-3`}>
                        <item.icon className={`w-5 h-5 ${item.color}`} />
                      </div>
                      <h4 className="font-semibold text-sm mb-2">{item.label}</h4>
                      <div className="space-y-1.5 text-xs">
                        <div className="flex items-center justify-between">
                          <span className="text-muted-foreground">Free</span>
                          <span>{item.free}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-muted-foreground">Standard</span>
                          <span className="text-primary">{item.std}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-muted-foreground">Premium</span>
                          <span className="gradient-text font-medium">{item.premium}</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            {/* FAQ */}
            <div className="max-w-2xl mx-auto">
              <h2 className="text-2xl font-bold text-center mb-8">Frequently Asked Questions</h2>
              <div className="space-y-3">
                {faqs.map((faq, i) => (
                  <div key={i} className="border border-border/40 rounded-xl overflow-hidden">
                    <button
                      className="w-full flex items-center justify-between p-4 text-left hover:bg-accent/30 transition-colors"
                      onClick={() => setOpenFaq(openFaq === i ? null : i)}
                    >
                      <span className="font-medium text-sm">{faq.q}</span>
                      {openFaq === i ? <ChevronUp className="w-4 h-4 text-muted-foreground shrink-0" /> : <ChevronDown className="w-4 h-4 text-muted-foreground shrink-0" />}
                    </button>
                    {openFaq === i && (
                      <div className="px-4 pb-4 text-sm text-muted-foreground">{faq.a}</div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-16 bg-muted/20">
          <div className="max-w-3xl mx-auto px-4 text-center">
            <Sparkles className="w-10 h-10 text-primary mx-auto mb-4" />
            <h2 className="text-3xl font-bold mb-3">Ready to start your journey?</h2>
            <p className="text-muted-foreground mb-6">Start free, upgrade when you&apos;re ready. No commitment, no risk.</p>
            <Link href="/signup">
              <Button size="lg" className="gap-2 bg-primary hover:bg-primary/90">
                <Zap className="w-5 h-5" /> Start for Free <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
          </div>
        </section>
      </div>
      <Footer />
    </div>
  );
}
