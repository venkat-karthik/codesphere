import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="max-w-3xl mx-auto px-4 pt-28 pb-16">
        <Link href="/signup" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground mb-8 transition-colors">
          <ArrowLeft className="w-4 h-4" /> Back
        </Link>
        <h1 className="text-4xl font-bold mb-2">Privacy Policy</h1>
        <p className="text-muted-foreground mb-10">Last updated: March 28, 2026</p>

        <div className="prose prose-sm dark:prose-invert max-w-none space-y-8 text-muted-foreground leading-relaxed">
          <section>
            <h2 className="text-xl font-semibold text-foreground mb-3">1. Information We Collect</h2>
            <p>We collect information you provide directly (name, email, password) and usage data (pages visited, features used) to improve the platform experience.</p>
          </section>
          <section>
            <h2 className="text-xl font-semibold text-foreground mb-3">2. How We Use Your Data</h2>
            <p>Your data is used to provide and improve CodeSphere services, send important notifications, process payments, and personalise your learning experience. We do not sell your data to third parties.</p>
          </section>
          <section>
            <h2 className="text-xl font-semibold text-foreground mb-3">3. Cookies</h2>
            <p>We use cookies for authentication (auth-token) and session management. You can disable cookies in your browser, but some features may not work correctly.</p>
          </section>
          <section>
            <h2 className="text-xl font-semibold text-foreground mb-3">4. Data Security</h2>
            <p>We use industry-standard encryption (TLS/SSL) and JWT-based authentication. Passwords are hashed and never stored in plain text.</p>
          </section>
          <section>
            <h2 className="text-xl font-semibold text-foreground mb-3">5. Your Rights</h2>
            <p>You can request access to, correction of, or deletion of your personal data at any time by contacting us. Account deletion removes all your data within 30 days.</p>
          </section>
          <section>
            <h2 className="text-xl font-semibold text-foreground mb-3">6. Contact</h2>
            <p>For privacy concerns, contact us at <a href="mailto:privacy@codesphere.io" className="text-primary hover:underline">privacy@codesphere.io</a>.</p>
          </section>
        </div>
      </div>
      <Footer />
    </div>
  );
}
