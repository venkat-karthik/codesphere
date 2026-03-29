import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { MapPin, Clock, ArrowRight } from "lucide-react";

const openings = [
  { title: "Senior Full-Stack Engineer", team: "Engineering", location: "Remote / Bangalore", type: "Full-time", desc: "Build and scale the core CodeSphere platform using Next.js, Node.js, and MongoDB." },
  { title: "Product Designer (UI/UX)", team: "Design", location: "Remote", type: "Full-time", desc: "Shape the visual language and user experience of a platform used by 50K+ developers." },
  { title: "Developer Advocate", team: "Community", location: "Remote", type: "Full-time", desc: "Create content, run live sessions, and grow the CodeSphere developer community." },
  { title: "Backend Engineer (Node.js)", team: "Engineering", location: "Remote / Mumbai", type: "Full-time", desc: "Design and build scalable APIs, real-time features, and data pipelines." },
  { title: "Content Creator (Technical)", team: "Content", location: "Remote", type: "Contract", desc: "Write tutorials, create video courses, and build learning paths for our platform." },
];

export default function CareersPage() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="pt-24 pb-16 max-w-4xl mx-auto px-4">
        <Badge variant="outline" className="mb-4 border-primary/30 text-primary">Careers</Badge>
        <h1 className="text-4xl font-bold mb-3">Build the future of<br /><span className="gradient-text">developer education</span></h1>
        <p className="text-muted-foreground text-lg mb-12 max-w-2xl">
          We're a small, remote-first team on a mission to make world-class developer education accessible to everyone. Join us.
        </p>
        <div className="space-y-4 mb-12">
          {openings.map((job) => (
            <Card key={job.title} className="border-border/40 bg-card/50 card-hover group cursor-pointer">
              <CardContent className="p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <h2 className="font-semibold group-hover:text-primary transition-colors">{job.title}</h2>
                    <Badge variant="outline" className="text-[10px]">{job.team}</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground mb-2">{job.desc}</p>
                  <div className="flex items-center gap-4 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1"><MapPin className="w-3 h-3" />{job.location}</span>
                    <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{job.type}</span>
                  </div>
                </div>
                <Button variant="outline" size="sm" className="gap-1.5 shrink-0">Apply <ArrowRight className="w-3.5 h-3.5" /></Button>
              </CardContent>
            </Card>
          ))}
        </div>
        <div className="p-6 rounded-xl border border-primary/20 bg-primary/5 text-center">
          <h3 className="font-semibold mb-2">Don't see a fit?</h3>
          <p className="text-sm text-muted-foreground mb-4">We're always looking for talented people. Send us your resume and tell us how you'd contribute.</p>
          <Button className="gap-2" onClick={() => window.open("mailto:careers@codesphere.io")}>
            Send Open Application <ArrowRight className="w-4 h-4" />
          </Button>
        </div>
      </div>
      <Footer />
    </div>
  );
}
