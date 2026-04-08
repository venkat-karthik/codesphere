import { motion } from 'framer-motion';
import { Shield, Lock, Eye, FileText } from 'lucide-react';

export function Privacy() {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-4xl mx-auto space-y-12 py-10"
    >
      <section className="text-center space-y-4">
        <div className="w-16 h-16 bg-primary/10 rounded-3xl flex items-center justify-center mx-auto mb-6">
          <Shield className="h-8 w-8 text-primary" />
        </div>
        <h1 className="text-4xl font-black text-gradient tracking-tight">Privacy Policy</h1>
        <p className="text-muted-foreground">Last updated: April 2024</p>
      </section>

      <div className="glass-card rounded-[2.5rem] p-8 md:p-12 space-y-10 leading-relaxed text-balance">
        <section className="space-y-4">
          <div className="flex items-center gap-3 text-primary">
            <Lock className="h-5 w-5" />
            <h2 className="text-xl font-bold uppercase tracking-widest text-sm">Security & Protection</h2>
          </div>
          <p>
            At CodeSphere, your privacy is our priority. We implement industry-standard encryption and security measures to protect your personal information and learning progress. We never sell your data to third parties.
          </p>
        </section>

        <section className="space-y-4 text-muted-foreground">
          <h3 className="text-lg font-bold text-foreground">Data Collection</h3>
          <p>
            We collect information you provide directly to us (e.g., when you create an account, complete problems, or contact support). This includes your name, email, and performance metrics within the platform.
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Profile Information: Name, avatar, bio</li>
            <li>Learning Data: XP, levels, problem solutions</li>
            <li>Usage Data: IP address, device type, browser logs via Sentry API</li>
          </ul>
        </section>

        <section className="space-y-4 text-muted-foreground">
          <h3 className="text-lg font-bold text-foreground">Third-Party Services</h3>
          <p>
            We utilize third-party services to enhance your experience:
          </p>
          <ul className="list-disc pl-6 space-y-2 font-mono text-xs">
            <li>Neon DB: Relational data storage</li>
            <li>Redis: High-performance caching</li>
            <li>Sentry: Error and performance monitoring</li>
            <li>Judge0: Code execution sandbox</li>
            <li>Razorpay: Secure payment processing</li>
          </ul>
        </section>

        <footer className="pt-10 border-t border-primary/10 text-center text-sm">
          For any data-related queries, contact us at <span className="text-primary font-bold">privacy@codesphere.com</span>
        </footer>
      </div>
    </motion.div>
  );
}
