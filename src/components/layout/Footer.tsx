import Link from "next/link";
import { Code2, Github, Twitter, Linkedin, Youtube, Heart } from "lucide-react";

const footerLinks = {
  Platform: [
    { label: "Learning Paths", href: "/learning" },
    { label: "Resource Hub", href: "/resources" },
    { label: "Live Sessions", href: "/sessions" },
    { label: "Virtual Codex", href: "/codex" },
    { label: "Sandbox", href: "/sandbox" },
  ],
  Community: [
    { label: "Communities", href: "/communities" },
    { label: "Events & Announcements", href: "/events" },
    { label: "Discussions", href: "/communities" },
    { label: "Leaderboard", href: "/dashboard" },
  ],
  Company: [
    { label: "About Us", href: "/about" },
    { label: "Pricing", href: "/pricing" },
    { label: "Blog", href: "/blog" },
    { label: "Careers", href: "/careers" },
    { label: "Contact", href: "/contact" },
  ],
  Legal: [
    { label: "Privacy Policy", href: "/privacy" },
    { label: "Terms of Service", href: "/terms" },
    { label: "Refund Policy", href: "/refund" },
    { label: "Cookie Policy", href: "/cookies" },
  ],
};

const socials = [
  { icon: Github, href: "https://github.com", label: "GitHub" },
  { icon: Twitter, href: "https://twitter.com", label: "Twitter" },
  { icon: Linkedin, href: "https://linkedin.com", label: "LinkedIn" },
  { icon: Youtube, href: "https://youtube.com", label: "YouTube" },
];

export default function Footer() {
  return (
    <footer className="border-t border-border/40 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main footer */}
        <div className="py-12 grid grid-cols-2 md:grid-cols-6 gap-8">
          {/* Brand */}
          <div className="col-span-2">
            <Link href="/" className="flex items-center gap-2.5 mb-4">
              <div className="w-8 h-8 rounded-lg animated-border p-[1.5px]">
                <div className="w-full h-full rounded-[6px] bg-background flex items-center justify-center">
                  <Code2 className="w-4 h-4 text-primary" />
                </div>
              </div>
              <span className="font-bold text-lg gradient-text">CodeSphere</span>
            </Link>
            <p className="text-sm text-muted-foreground leading-relaxed max-w-xs">
              The complete coding ecosystem — learn, build, connect, and grow with a global community of developers.
            </p>
            <div className="flex items-center gap-3 mt-5">
              {socials.map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-9 h-9 rounded-lg bg-muted hover:bg-primary/10 hover:text-primary flex items-center justify-center transition-colors"
                  aria-label={s.label}
                >
                  <s.icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Links */}
          {Object.entries(footerLinks).map(([section, links]) => (
            <div key={section}>
              <h3 className="text-sm font-semibold mb-3">{section}</h3>
              <ul className="space-y-2">
                {links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div className="py-5 border-t border-border/40 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-muted-foreground">
            © 2025 CodeSphere. All rights reserved.
          </p>
          <p className="text-xs text-muted-foreground flex items-center gap-1">
            Built with <Heart className="w-3 h-3 text-red-400 fill-red-400" /> for developers worldwide
          </p>
        </div>
      </div>
    </footer>
  );
}
