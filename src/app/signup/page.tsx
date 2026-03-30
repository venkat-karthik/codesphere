"use client";

import Link from "next/link";
import { useState } from "react";
import {
  Code2,
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  Github,
  Chrome,
  User,
  Zap,
  CheckCircle2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { apiFetch } from "@/lib/api";
import { toast } from "sonner";

const planBenefits = {
  free: ["Basic learning paths", "Join communities", "Browse events"],
  standard: ["Full learning paths", "All resources", "Live sessions", "Tests & analytics"],
  premium: ["AI roadmaps", "Private Codex projects", "Advanced sandbox", "Priority access"],
};

export default function SignupPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [step, setStep] = useState(1);
  const [selectedPlan, setSelectedPlan] = useState("free");
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [loading, setLoading] = useState(false);

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (step === 1) {
      setStep(2);
      return;
    }

    setLoading(true);
    try {
      const result = await apiFetch('/auth/register', {
        method: 'POST',
        body: JSON.stringify({
          email: form.email,
          password: form.password,
          name: form.name,
          role: 'student',
          plan: selectedPlan,
        }),
      });

      if (result.success) {
        // Set the auth-token cookie for middleware and future apiFetch calls
        document.cookie = `auth-token=${result.access_token}; path=/; max-age=86400; SameSite=Lax`;

        toast.success("Welcome to CodeSphere!");
        window.location.href = "/dashboard";
      }
    } catch (error: any) {
      toast.error(error.message || "Signup failed. Please try again.");
      setStep(1); // Go back to fix errors
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex">
      {/* Left panel */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-muted/20">
        <div className="absolute inset-0 hero-bg" />
        <div className="relative flex flex-col justify-between p-12 w-full">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl animated-border p-[2px]">
              <div className="w-full h-full rounded-[9px] bg-background flex items-center justify-center">
                <Code2 className="w-5 h-5 text-primary" />
              </div>
            </div>
            <span className="font-bold text-xl gradient-text">CodeSphere</span>
          </Link>

          <div className="space-y-6">
            <div>
              <h2 className="text-3xl font-bold mb-3">Start your journey today</h2>
              <p className="text-muted-foreground leading-relaxed">
                Join 50,000+ developers who are learning, building, and growing together.
                Your next breakthrough starts here.
              </p>
            </div>

            <div className="space-y-3">
              {[
                { icon: "🎯", text: "200+ structured learning paths" },
                { icon: "👥", text: "Vibrant global communities" },
                { icon: "🌍", text: "Discover events worldwide" },
                { icon: "💻", text: "Collaborative coding workspaces" },
                { icon: "🔴", text: "Live sessions with mentors" },
              ].map((item) => (
                <div key={item.text} className="flex items-center gap-3 text-sm">
                  <span className="text-lg">{item.icon}</span>
                  <span className="text-muted-foreground">{item.text}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="flex -space-x-2">
              {["PS", "AM", "KR", "RV", "SJ"].map((initials) => (
                <div
                  key={initials}
                  className="w-8 h-8 rounded-full bg-primary/30 border-2 border-background flex items-center justify-center text-xs font-semibold text-primary"
                >
                  {initials}
                </div>
              ))}
            </div>
            <span className="text-sm text-muted-foreground">50K+ developers already learning</span>
          </div>
        </div>
      </div>

      {/* Right panel */}
      <div className="flex-1 flex items-center justify-center p-6 lg:p-12">
        <div className="w-full max-w-md">
          {/* Mobile logo */}
          <div className="flex items-center gap-2 mb-8 lg:hidden">
            <div className="w-8 h-8 rounded-lg animated-border p-[1.5px]">
              <div className="w-full h-full rounded-[6px] bg-background flex items-center justify-center">
                <Code2 className="w-4 h-4 text-primary" />
              </div>
            </div>
            <span className="font-bold text-lg gradient-text">CodeSphere</span>
          </div>

          {/* Step indicator */}
          <div className="flex items-center gap-3 mb-8">
            {[1, 2].map((s) => (
              <div key={s} className="flex items-center gap-2">
                <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-semibold transition-colors ${step >= s ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
                  }`}>
                  {step > s ? <CheckCircle2 className="w-4 h-4" /> : s}
                </div>
                <span className={`text-xs ${step >= s ? "text-foreground" : "text-muted-foreground"}`}>
                  {s === 1 ? "Account" : "Choose Plan"}
                </span>
                {s < 2 && <div className={`w-8 h-px ${step > s ? "bg-primary" : "bg-border"}`} />}
              </div>
            ))}
          </div>

          {step === 1 ? (
            <>
              <h1 className="text-3xl font-bold mb-2">Create account</h1>
              <p className="text-muted-foreground mb-8">Your coding journey starts here — it&apos;s free</p>

              {/* OAuth buttons */}
              <div className="grid grid-cols-2 gap-3 mb-6">
                <Button variant="outline" className="gap-2 h-11">
                  <Chrome className="w-4 h-4" />
                  Google
                </Button>
                <Button variant="outline" className="gap-2 h-11">
                  <Github className="w-4 h-4" />
                  GitHub
                </Button>
              </div>

              <div className="relative mb-6">
                <Separator />
                <span className="absolute left-1/2 -translate-x-1/2 -translate-y-1/2 bg-background px-3 text-xs text-muted-foreground">
                  or sign up with email
                </span>
              </div>

              <form onSubmit={handleSignup} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      id="name"
                      type="text"
                      placeholder="Your full name"
                      className="pl-10 h-11"
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                      required
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="you@example.com"
                      className="pl-10 h-11"
                      value={form.email}
                      onChange={(e) => setForm({ ...form, email: e.target.value })}
                      required
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Create a strong password"
                      className="pl-10 pr-10 h-11"
                      value={form.password}
                      onChange={(e) => setForm({ ...form, password: e.target.value })}
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
                <Button type="submit" className="w-full h-11 gap-2 bg-primary hover:bg-primary/90">
                  Continue <ArrowRight className="w-4 h-4" />
                </Button>
              </form>

              <p className="text-center text-sm text-muted-foreground mt-6">
                Already have an account?{" "}
                <Link href="/login" className="text-primary hover:underline font-medium">Sign in</Link>
              </p>
            </>
          ) : (
            <>
              <h1 className="text-3xl font-bold mb-2">Choose your plan</h1>
              <p className="text-muted-foreground mb-8">Start free, upgrade anytime — no credit card required</p>

              <form onSubmit={handleSignup} className="space-y-4">
                {(["free", "standard", "premium"] as const).map((plan) => {
                  const details = {
                    free: { label: "Free", price: "₹0", desc: "Get started", color: "border-border/60" },
                    standard: { label: "Standard", price: "₹50/mo", desc: "Most popular", color: "border-primary/60 bg-primary/5" },
                    premium: { label: "Premium", price: "₹100/mo", desc: "Full power", color: "border-border/60" },
                  }[plan];
                  return (
                    <div
                      key={plan}
                      onClick={() => setSelectedPlan(plan)}
                      className={`relative p-4 rounded-xl border cursor-pointer transition-all ${selectedPlan === plan
                        ? `${details.color} ring-2 ring-primary/30`
                        : "border-border/40 hover:border-border/80"
                        }`}
                    >
                      {plan === "standard" && (
                        <Badge className="absolute -top-2 right-3 badge-gradient text-xs">Recommended</Badge>
                      )}
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${selectedPlan === plan ? "border-primary" : "border-muted-foreground"
                            }`}>
                            {selectedPlan === plan && <div className="w-2 h-2 rounded-full bg-primary" />}
                          </div>
                          <span className="font-semibold">{details.label}</span>
                        </div>
                        <span className="text-sm font-semibold text-primary">{details.price}</span>
                      </div>
                      <ul className="ml-6 space-y-1">
                        {planBenefits[plan].slice(0, 3).map((b) => (
                          <li key={b} className="text-xs text-muted-foreground flex items-center gap-1.5">
                            <CheckCircle2 className="w-3 h-3 text-green-400 shrink-0" />
                            {b}
                          </li>
                        ))}
                      </ul>
                    </div>
                  );
                })}

                <Button
                  type="submit"
                  className="w-full h-11 gap-2 bg-primary hover:bg-primary/90"
                  disabled={loading}
                >
                  {loading ? (
                    <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <>
                      <Zap className="w-4 h-4" />
                      Create Account
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </Button>
              </form>

              <button
                onClick={() => setStep(1)}
                className="w-full text-center text-sm text-muted-foreground mt-3 hover:text-foreground"
              >
                ← Back
              </button>

              <p className="text-center text-xs text-muted-foreground mt-4">
                By signing up, you agree to our{" "}
                <Link href="/terms" className="text-primary hover:underline">Terms</Link> and{" "}
                <Link href="/privacy" className="text-primary hover:underline">Privacy Policy</Link>
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
