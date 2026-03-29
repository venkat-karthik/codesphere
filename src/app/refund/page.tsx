import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function RefundPage() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="max-w-3xl mx-auto px-4 pt-28 pb-16">
        <Link href="/" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground mb-8 transition-colors">
          <ArrowLeft className="w-4 h-4" /> Back
        </Link>
        <h1 className="text-4xl font-bold mb-2">Refund Policy</h1>
        <p className="text-muted-foreground mb-10">Last updated: March 28, 2026</p>
        <div className="space-y-8 text-muted-foreground leading-relaxed">
          <section>
            <h2 className="text-xl font-semibold text-foreground mb-3">7-Day Money-Back Guarantee</h2>
            <p>If you are not satisfied with your CodeSphere subscription, you may request a full refund within 7 days of your initial purchase. No questions asked.</p>
          </section>
          <section>
            <h2 className="text-xl font-semibold text-foreground mb-3">How to Request a Refund</h2>
            <p>Email <a href="mailto:billing@codesphere.io" className="text-primary hover:underline">billing@codesphere.io</a> with your registered email address and order ID. We will process your refund within 5-7 business days.</p>
          </section>
          <section>
            <h2 className="text-xl font-semibold text-foreground mb-3">Eligibility</h2>
            <p>Refunds are available for first-time purchases only. Renewals and plan upgrades are not eligible for refunds. Accounts found to be abusing the refund policy may be suspended.</p>
          </section>
          <section>
            <h2 className="text-xl font-semibold text-foreground mb-3">Cancellations</h2>
            <p>You may cancel your subscription at any time from your dashboard. Cancellation stops future billing but does not trigger a refund for the current billing period unless within the 7-day window.</p>
          </section>
          <section>
            <h2 className="text-xl font-semibold text-foreground mb-3">Contact</h2>
            <p>For refund questions, contact <a href="mailto:billing@codesphere.io" className="text-primary hover:underline">billing@codesphere.io</a>.</p>
          </section>
        </div>
      </div>
      <Footer />
    </div>
  );
}
