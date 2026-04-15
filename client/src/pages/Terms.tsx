import { motion } from 'framer-motion';
import { FileText, UserCheck, ShieldCheck, Scale } from 'lucide-react';

export function Terms() {
  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      className="max-w-4xl mx-auto space-y-12 py-10"
    >
      <section className="text-center space-y-4">
        <div className="w-16 h-16 bg-primary/10 rounded-3xl flex items-center justify-center mx-auto mb-6">
          <FileText className="h-8 w-8 text-primary" />
        </div>
        <h1 className="text-4xl font-black text-gradient tracking-tight">Terms of Service</h1>
        <p className="text-muted-foreground">Revised: April 2024</p>
      </section>

      <div className="glass-card rounded-[2.5rem] p-8 md:p-12 space-y-10 leading-relaxed">
        <section className="space-y-4">
          <div className="flex items-center gap-3 text-primary">
            <UserCheck className="h-5 w-5" />
            <h2 className="text-xl font-bold uppercase tracking-widest text-sm">Account Terms</h2>
          </div>
          <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
            <li>Users must be 13 years or older.</li>
            <li>Users are responsible for their account security.</li>
            <li>Accounts cannot be shared between multiple people.</li>
            <li>User data on the Judge0 sandbox is not for storing sensitive info.</li>
          </ul>
        </section>

        <section className="space-y-4">
          <div className="flex items-center gap-3 text-primary">
            <Scale className="h-5 w-5" />
            <h2 className="text-xl font-bold uppercase tracking-widest text-sm">Acceptable Use</h2>
          </div>
          <p className="text-muted-foreground">
            CodeSphere is for learning and community engagement. Prohibited activities include:
          </p>
          <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
            <li>Spamming community channels with irrelevant content.</li>
            <li>Attempting to bypass Judge0 sandbox security.</li>
            <li>Scraping or harvesting data from the platform.</li>
            <li>Intellectual property infringement.</li>
          </ul>
        </section>

        <section className="space-y-4">
          <div className="flex items-center gap-3 text-primary">
            <ShieldCheck className="h-5 w-5" />
            <h2 className="text-xl font-bold uppercase tracking-widest text-sm">Fair Play Policy</h2>
          </div>
          <p className="text-muted-foreground">
            Gamification elements (XP, CodeCoins) should be earned through genuine learning. Users found to be exploit-hacking the leaderboard will face account suspension.
          </p>
        </section>

        <footer className="pt-10 border-t border-primary/10 text-center text-sm italic text-muted-foreground">
          By accessing CodeSphere, you agree to these terms. Failure to comply may result in account termination.
        </footer>
      </div>
    </motion.div>
  );
}
