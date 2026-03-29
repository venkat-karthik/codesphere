import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Badge } from "@/components/ui/badge";
import { Users, BookOpen, Globe, Zap } from "lucide-react";

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="pt-24 pb-16 max-w-4xl mx-auto px-4">
        <Badge variant="outline" className="mb-4 border-primary/30 text-primary">About Us</Badge>
        <h1 className="text-5xl font-bold mb-6">We build the ecosystem<br /><span className="gradient-text">developers deserve</span></h1>
        <p className="text-muted-foreground text-lg leading-relaxed mb-12 max-w-2xl">
          CodeSphere was founded with a simple belief — learning to code should be social, structured, and accessible to everyone. We combine the best of online learning, developer communities, and collaborative tools in one platform.
        </p>
        <div className="grid sm:grid-cols-2 gap-6 mb-16">
          {[
            { icon: Users, title: "50,000+ Developers", desc: "A global community of learners, builders, and mentors.", color: "text-blue-400", bg: "bg-blue-500/10" },
            { icon: BookOpen, title: "200+ Learning Paths", desc: "Curated roadmaps from beginner to production-ready.", color: "text-purple-400", bg: "bg-purple-500/10" },
            { icon: Globe, title: "Global Events", desc: "Connecting developers to conferences and hackathons worldwide.", color: "text-cyan-400", bg: "bg-cyan-500/10" },
            { icon: Zap, title: "Live Sessions", desc: "Real-time coding sessions with mentors and peers.", color: "text-green-400", bg: "bg-green-500/10" },
          ].map((item) => (
            <div key={item.title} className="p-6 rounded-xl border border-border/40 bg-card/50">
              <div className={`w-10 h-10 rounded-xl ${item.bg} flex items-center justify-center mb-4`}>
                <item.icon className={`w-5 h-5 ${item.color}`} />
              </div>
              <h3 className="font-semibold mb-2">{item.title}</h3>
              <p className="text-sm text-muted-foreground">{item.desc}</p>
            </div>
          ))}
        </div>
        <div className="border-t border-border/40 pt-12">
          <h2 className="text-2xl font-bold mb-4">Our Mission</h2>
          <p className="text-muted-foreground leading-relaxed">
            To make world-class developer education accessible, collaborative, and community-driven. We believe the best way to learn is by building real things alongside real people — and that's exactly what CodeSphere enables.
          </p>
        </div>
      </div>
      <Footer />
    </div>
  );
}
