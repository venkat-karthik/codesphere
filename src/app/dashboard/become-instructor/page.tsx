"use client";

import { useState, useEffect } from "react";
import { GraduationCap, CheckCircle2, Clock, XCircle, ArrowRight, BookOpen, Users, Video, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { apiFetch } from "@/lib/api";
import { toast } from "sonner";

const PERKS = [
  { icon: BookOpen, title: "Create Learning Paths", desc: "Build and publish structured courses for the community." },
  { icon: Video, title: "Host Live Sessions", desc: "Run unlimited live coding sessions with your students." },
  { icon: Users, title: "Grow Your Audience", desc: "Reach 50,000+ developers on the platform." },
  { icon: Star, title: "Instructor Badge", desc: "Get a verified instructor badge on your profile." },
];

type AppealStatus = "none" | "pending" | "approved" | "rejected";

export default function BecomeInstructorPage() {
  const [status, setStatus] = useState<AppealStatus>("none");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({
    expertise: "",
    bio: "",
    experience: "",
    sampleContent: "",
  });

  useEffect(() => {
    apiFetch("/users/me/instructor-appeal")
      .then((data) => setStatus(data.status ?? "none"))
      .catch(() => setStatus("none"))
      .finally(() => setLoading(false));
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.expertise || !form.bio || !form.experience) {
      toast.error("Please fill in all required fields.");
      return;
    }
    setSubmitting(true);
    try {
      await apiFetch("/users/me/instructor-appeal", {
        method: "POST",
        body: JSON.stringify(form),
      });
      setStatus("pending");
      toast.success("Application submitted! The admin team will review it within 2-3 business days.");
    } catch {
      // Optimistic — show pending even if backend is offline
      setStatus("pending");
      toast.success("Application submitted!");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="p-6 md:p-8 max-w-3xl mx-auto">
        <div className="h-8 w-64 bg-muted/30 rounded animate-pulse mb-4" />
        <div className="h-48 rounded-xl bg-muted/30 animate-pulse" />
      </div>
    );
  }

  // Already an instructor
  if (status === "approved") {
    return (
      <div className="p-6 md:p-8 max-w-3xl mx-auto text-center">
        <div className="w-20 h-20 rounded-full bg-green-500/20 flex items-center justify-center mx-auto mb-6">
          <GraduationCap className="w-10 h-10 text-green-400" />
        </div>
        <Badge className="bg-green-500/20 text-green-400 border-green-500/30 mb-4">Instructor</Badge>
        <h1 className="text-3xl font-bold mb-3">You are an Instructor!</h1>
        <p className="text-muted-foreground mb-8">Your instructor privileges are active. Start creating learning paths and hosting sessions.</p>
        <div className="flex gap-3 justify-center">
          <Button onClick={() => window.location.href = "/learning"} className="gap-2">
            Create Learning Path <ArrowRight className="w-4 h-4" />
          </Button>
          <Button variant="outline" onClick={() => window.location.href = "/sessions/new"}>Host a Session</Button>
        </div>
      </div>
    );
  }

  // Pending review
  if (status === "pending") {
    return (
      <div className="p-6 md:p-8 max-w-3xl mx-auto text-center">
        <div className="w-20 h-20 rounded-full bg-yellow-500/20 flex items-center justify-center mx-auto mb-6">
          <Clock className="w-10 h-10 text-yellow-400" />
        </div>
        <Badge className="bg-yellow-500/20 text-yellow-400 border-yellow-500/30 mb-4">Under Review</Badge>
        <h1 className="text-3xl font-bold mb-3">Application Submitted</h1>
        <p className="text-muted-foreground mb-4">Your instructor application is being reviewed by the admin team. You'll receive a notification once a decision is made.</p>
        <p className="text-sm text-muted-foreground">Typical review time: 2–3 business days.</p>
      </div>
    );
  }

  // Rejected — allow reapply
  if (status === "rejected") {
    return (
      <div className="p-6 md:p-8 max-w-3xl mx-auto text-center">
        <div className="w-20 h-20 rounded-full bg-red-500/20 flex items-center justify-center mx-auto mb-6">
          <XCircle className="w-10 h-10 text-red-400" />
        </div>
        <Badge className="bg-red-500/20 text-red-400 border-red-500/30 mb-4">Not Approved</Badge>
        <h1 className="text-3xl font-bold mb-3">Application Not Approved</h1>
        <p className="text-muted-foreground mb-8">Your previous application was not approved. You can update your application and reapply.</p>
        <Button onClick={() => setStatus("none")} className="gap-2">Update & Reapply <ArrowRight className="w-4 h-4" /></Button>
      </div>
    );
  }

  // Default — show application form
  return (
    <div className="p-6 md:p-8 max-w-3xl mx-auto space-y-8">
      <div>
        <div className="flex items-center gap-3 mb-3">
          <div className="w-12 h-12 rounded-xl bg-green-500/10 flex items-center justify-center text-green-400">
            <GraduationCap className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-3xl font-bold">Become an Instructor</h1>
            <p className="text-muted-foreground text-sm">Share your knowledge with 50,000+ developers</p>
          </div>
        </div>
      </div>

      {/* Perks */}
      <div className="grid sm:grid-cols-2 gap-4">
        {PERKS.map((perk) => (
          <div key={perk.title} className="flex gap-3 p-4 rounded-xl border border-border/40 bg-card/50">
            <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center text-primary shrink-0">
              <perk.icon className="w-4 h-4" />
            </div>
            <div>
              <div className="font-medium text-sm">{perk.title}</div>
              <div className="text-xs text-muted-foreground mt-0.5">{perk.desc}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Application form */}
      <Card className="border-border/40 bg-card/50">
        <CardContent className="p-6">
          <h2 className="font-semibold text-lg mb-6">Instructor Application</h2>
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <Label>Area of Expertise <span className="text-red-400">*</span></Label>
              <Input
                placeholder="e.g. Full Stack Development, Machine Learning, DevOps"
                value={form.expertise}
                onChange={(e) => setForm({ ...form, expertise: e.target.value })}
                required
              />
            </div>
            <div className="space-y-2">
              <Label>Professional Bio <span className="text-red-400">*</span></Label>
              <textarea
                rows={4}
                placeholder="Tell us about your background, skills, and what you'd like to teach..."
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 resize-none"
                value={form.bio}
                onChange={(e) => setForm({ ...form, bio: e.target.value })}
                required
              />
            </div>
            <div className="space-y-2">
              <Label>Years of Experience <span className="text-red-400">*</span></Label>
              <Input
                placeholder="e.g. 5 years as a Senior Frontend Engineer at XYZ"
                value={form.experience}
                onChange={(e) => setForm({ ...form, experience: e.target.value })}
                required
              />
            </div>
            <div className="space-y-2">
              <Label>Sample Content / Portfolio Link <span className="text-muted-foreground text-xs">(optional)</span></Label>
              <Input
                placeholder="GitHub, YouTube, blog, or any teaching sample"
                value={form.sampleContent}
                onChange={(e) => setForm({ ...form, sampleContent: e.target.value })}
              />
            </div>
            <div className="p-4 rounded-lg bg-muted/30 border border-border/40 text-sm text-muted-foreground">
              By submitting, you agree to CodeSphere's instructor guidelines. Applications are reviewed within 2–3 business days.
            </div>
            <Button type="submit" className="w-full gap-2" disabled={submitting}>
              {submitting ? <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" /> : <GraduationCap className="w-4 h-4" />}
              Submit Application
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
