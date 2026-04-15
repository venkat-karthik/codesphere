import { Link } from 'wouter';
import { Github, Twitter, Linkedin, Mail, Heart } from 'lucide-react';

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="mt-20 border-t border-primary/10 bg-background/50 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          {/* Brand Section */}
          <div className="md:col-span-1 space-y-4">
            <Link href="/" className="flex items-center gap-2 group">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center transition-transform group-hover:scale-110">
                <span className="text-primary-foreground font-bold text-sm">CS</span>
              </div>
              <span className="font-black text-xl tracking-tighter text-gradient">CodeSphere</span>
            </Link>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Empowering the next generation of developers through immersive, high-fidelity learning experiences.
            </p>
            <div className="flex items-center gap-4">
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors"><Twitter className="h-5 w-5" /></a>
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors"><Github className="h-5 w-5" /></a>
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors"><Linkedin className="h-5 w-5" /></a>
            </div>
          </div>

          {/* Platform Links */}
          <div className="space-y-4">
            <h4 className="font-bold text-sm uppercase tracking-widest text-primary">Platform</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link href="/learning/roadmaps" className="hover:text-primary transition-colors">Roadmaps</Link></li>
              <li><Link href="/practice/problems" className="hover:text-primary transition-colors">Daily Problems</Link></li>
              <li><Link href="/learning/live-classes" className="hover:text-primary transition-colors">Live Classes</Link></li>
              <li><Link href="/mentor" className="hover:text-primary transition-colors">AI Mentor</Link></li>
            </ul>
          </div>

          {/* Support Links */}
          <div className="space-y-4">
            <h4 className="font-bold text-sm uppercase tracking-widest text-primary">Resources</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link href="/learning/resources" className="hover:text-primary transition-colors">PDF Library</Link></li>
              <li><Link href="/community" className="hover:text-primary transition-colors">Student Lounge</Link></li>
              <li><Link href="/store" className="hover:text-primary transition-colors">CodeCoin Store</Link></li>
              <li><a href="mailto:support@codesphere.com" className="hover:text-primary transition-colors">Help Center</a></li>
              <li><a href="mailto:support@codesphere.com" className="hover:text-primary transition-colors">Contact Support</a></li>
            </ul>
          </div>

          {/* Legal Section */}
          <div className="space-y-4">
            <h4 className="font-bold text-sm uppercase tracking-widest text-primary">Legal</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link href="/privacy" className="hover:text-primary transition-colors">Privacy Policy</Link></li>
              <li><Link href="/terms" className="hover:text-primary transition-colors">Terms of Service</Link></li>
              <li><Link href="/terms" className="hover:text-primary transition-colors">Accessibility</Link></li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-primary/5 flex flex-col md:flex-row items-center justify-between gap-4 text-xs font-bold text-muted-foreground/60">
          <p>© {currentYear} CodeSphere. All rights reserved.</p>
          <div className="flex items-center gap-1 uppercase tracking-widest">
            Made with <Heart className="h-3 w-3 text-red-500 fill-current" /> by CodeSphere Team
          </div>
        </div>
      </div>
    </footer>
  );
}
