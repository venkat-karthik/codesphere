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
  Zap,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { apiFetch } from "@/lib/api";
import { toast } from "sonner";

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const result = await apiFetch('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
      });

      if (result.success) {
        // Set the auth-token cookie for middleware and future apiFetch calls
        document.cookie = `auth-token=${result.access_token}; path=/; max-age=86400; SameSite=Lax`;

        toast.success("Welcome back to CodeSphere!");
        // Redirect back to intended page or dashboard
        const params = new URLSearchParams(window.location.search);
        const returnUrl = params.get("returnUrl") || "/dashboard";
        window.location.href = returnUrl;
      }
    } catch (error: any) {
      toast.error(error.message || "Invalid credentials. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex">
      {/* Left panel - decorative */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-muted/20">
        <div className="absolute inset-0 hero-bg" />
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}
        />
        <div className="relative flex flex-col justify-between p-12 w-full">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl animated-border p-[2px]">
              <div className="w-full h-full rounded-[9px] bg-background flex items-center justify-center">
                <Code2 className="w-5 h-5 text-primary" />
              </div>
            </div>
            <span className="font-bold text-xl gradient-text">CodeSphere</span>
          </Link>

          <div>
            <blockquote className="text-2xl font-semibold leading-relaxed mb-4">
              &ldquo;CodeSphere didn&apos;t just teach me to code — it gave me a community that believes in me.&rdquo;
            </blockquote>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-primary/30 flex items-center justify-center text-primary font-semibold text-sm">
                PS
              </div>
              <div>
                <div className="font-medium text-sm">Priya Sharma</div>
                <div className="text-xs text-muted-foreground">Full Stack Developer</div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4 text-center">
            {[["50K+", "Learners"], ["200+", "Paths"], ["10K+", "Resources"]].map(([v, l]) => (
              <div key={l} className="glass rounded-xl p-4">
                <div className="text-xl font-bold gradient-text">{v}</div>
                <div className="text-xs text-muted-foreground">{l}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right panel - form */}
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

          <h1 className="text-3xl font-bold mb-2">Welcome back</h1>
          <p className="text-muted-foreground mb-8">
            Sign in to your account to continue your journey
          </p>

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
              or continue with email
            </span>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  className="pl-10 h-11"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password">Password</Label>
                <Link href="/forgot-password" className="text-xs text-primary hover:underline">
                  Forgot password?
                </Link>
              </div>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  className="pl-10 pr-10 h-11"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
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
                  Sign In
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </Button>
          </form>

          <p className="text-center text-sm text-muted-foreground mt-6">
            Don&apos;t have an account?{" "}
            <Link href="/signup" className="text-primary hover:underline font-medium">
              Sign up free
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
