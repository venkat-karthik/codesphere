"use client";

import { useState } from "react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Mail, MessageSquare, Github, Twitter } from "lucide-react";
import { toast } from "sonner";

export default function ContactPage() {
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    await new Promise((r) => setTimeout(r, 800));
    toast.success("Message sent! We'll get back to you within 24 hours.");
    setForm({ name: "", email: "", subject: "", message: "" });
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="pt-24 pb-16 max-w-4xl mx-auto px-4">
        <Badge variant="outline" className="mb-4 border-primary/30 text-primary">Contact</Badge>
        <h1 className="text-4xl font-bold mb-3">Get in touch</h1>
        <p className="text-muted-foreground text-lg mb-12">We'd love to hear from you. Send us a message and we'll respond within 24 hours.</p>

        <div className="grid md:grid-cols-2 gap-12">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Name</Label>
                <Input placeholder="Your name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
              </div>
              <div className="space-y-2">
                <Label>Email</Label>
                <Input type="email" placeholder="you@example.com" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Subject</Label>
              <Input placeholder="How can we help?" value={form.subject} onChange={(e) => setForm({ ...form, subject: e.target.value })} required />
            </div>
            <div className="space-y-2">
              <Label>Message</Label>
              <textarea
                rows={5}
                placeholder="Tell us more..."
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 resize-none"
                value={form.message}
                onChange={(e) => setForm({ ...form, message: e.target.value })}
                required
              />
            </div>
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" /> : "Send Message"}
            </Button>
          </form>

          <div className="space-y-8">
            <div>
              <h3 className="font-semibold mb-4">Other ways to reach us</h3>
              <div className="space-y-4">
                {[
                  { icon: Mail, label: "Email", value: "hello@codesphere.io", href: "mailto:hello@codesphere.io" },
                  { icon: Twitter, label: "Twitter", value: "@codesphere_io", href: "https://twitter.com" },
                  { icon: Github, label: "GitHub", value: "github.com/codesphere", href: "https://github.com" },
                  { icon: MessageSquare, label: "Discord", value: "Join our community", href: "#" },
                ].map((item) => (
                  <a key={item.label} href={item.href} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 p-3 rounded-lg border border-border/40 hover:border-border/80 hover:bg-accent/30 transition-colors">
                    <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center text-primary shrink-0">
                      <item.icon className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-xs text-muted-foreground">{item.label}</div>
                      <div className="text-sm font-medium">{item.value}</div>
                    </div>
                  </a>
                ))}
              </div>
            </div>
            <div className="p-4 rounded-xl bg-muted/30 border border-border/40">
              <p className="text-sm text-muted-foreground">
                For billing and subscription issues, email <a href="mailto:billing@codesphere.io" className="text-primary hover:underline">billing@codesphere.io</a>.<br />
                For security reports, email <a href="mailto:security@codesphere.io" className="text-primary hover:underline">security@codesphere.io</a>.
              </p>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
