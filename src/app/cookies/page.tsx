import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function CookiesPage() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="max-w-3xl mx-auto px-4 pt-28 pb-16">
        <Link href="/" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground mb-8 transition-colors">
          <ArrowLeft className="w-4 h-4" /> Back
        </Link>
        <h1 className="text-4xl font-bold mb-2">Cookie Policy</h1>
        <p className="text-muted-foreground mb-10">Last updated: March 28, 2026</p>
        <div className="space-y-8 text-muted-foreground leading-relaxed">
          <section>
            <h2 className="text-xl font-semibold text-foreground mb-3">What Are Cookies</h2>
            <p>Cookies are small text files stored on your device when you visit a website. They help us provide a better experience by remembering your preferences and keeping you logged in.</p>
          </section>
          <section>
            <h2 className="text-xl font-semibold text-foreground mb-3">Cookies We Use</h2>
            <div className="space-y-3">
              {[
                { name: "auth-token", purpose: "Keeps you logged in across sessions. Expires after 24 hours.", type: "Essential" },
                { name: "admin-verified", purpose: "Stores admin panel secondary verification. Expires after 24 hours.", type: "Essential" },
                { name: "theme", purpose: "Remembers your light/dark mode preference.", type: "Functional" },
              ].map((cookie) => (
                <div key={cookie.name} className="p-4 rounded-lg border border-border/40 bg-card/30">
                  <div className="flex items-center gap-2 mb-1">
                    <code className="text-sm text-primary font-mono">{cookie.name}</code>
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-muted text-muted-foreground">{cookie.type}</span>
                  </div>
                  <p className="text-sm">{cookie.purpose}</p>
                </div>
              ))}
            </div>
          </section>
          <section>
            <h2 className="text-xl font-semibold text-foreground mb-3">Managing Cookies</h2>
            <p>You can disable cookies in your browser settings. Note that disabling essential cookies will prevent you from logging in to CodeSphere.</p>
          </section>
          <section>
            <h2 className="text-xl font-semibold text-foreground mb-3">Contact</h2>
            <p>For cookie-related questions, contact <a href="mailto:privacy@codesphere.io" className="text-primary hover:underline">privacy@codesphere.io</a>.</p>
          </section>
        </div>
      </div>
      <Footer />
    </div>
  );
}
