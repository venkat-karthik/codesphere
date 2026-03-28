import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="max-w-3xl mx-auto px-4 pt-28 pb-16">
        <Link href="/signup" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground mb-8 transition-colors">
          <ArrowLeft className="w-4 h-4" /> Back
        </Link>
        <h1 className="text-4xl font-bold mb-2">Terms of Service</h1>
        <p className="text-muted-foreground mb-10">Last updated: March 28, 2026</p>

        <div className="prose prose-sm dark:prose-invert max-w-none space-y-8 text-muted-foreground leading-relaxed">
          <section>
            <h2 className="text-xl font-semibold text-foreground mb-3">1. Acceptance of Terms</h2>
            <p>By accessing or using CodeSphere, you agree to be bound by these Terms of Service. If you do not agree, please do not use the platform.</p>
          </section>
          <section>
            <h2 className="text-xl font-semibold text-foreground mb-3">2. Use of the Platform</h2>
            <p>You agree to use CodeSphere only for lawful purposes. You must not post harmful, offensive, or misleading content. We reserve the right to suspend accounts that violate these terms.</p>
          </section>
          <section>
            <h2 className="text-xl font-semibold text-foreground mb-3">3. Subscriptions & Billing</h2>
            <p>Paid plans are billed monthly or annually. You may cancel at any time. Refunds are available within 7 days of purchase. We use Razorpay for secure payment processing.</p>
          </section>
          <section>
            <h2 className="text-xl font-semibold text-foreground mb-3">4. Intellectual Property</h2>
            <p>All content on CodeSphere, including learning materials and platform code, is owned by CodeSphere or its licensors. User-generated content remains yours — you grant us a license to display it on the platform.</p>
          </section>
          <section>
            <h2 className="text-xl font-semibold text-foreground mb-3">5. Limitation of Liability</h2>
            <p>CodeSphere is provided "as is". We are not liable for any indirect, incidental, or consequential damages arising from your use of the platform.</p>
          </section>
          <section>
            <h2 className="text-xl font-semibold text-foreground mb-3">6. Contact</h2>
            <p>For questions about these terms, contact us at <a href="mailto:legal@codesphere.io" className="text-primary hover:underline">legal@codesphere.io</a>.</p>
          </section>
        </div>
      </div>
      <Footer />
    </div>
  );
}
