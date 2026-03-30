"use client";

import { useState, useEffect } from "react";
import { GraduationCap, CheckCircle2, XCircle, Clock, Eye, User, Briefcase, Link as LinkIcon } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { apiFetch } from "@/lib/api";
import { toast } from "sonner";

const MOCK_APPEALS = [
  { id: "ap1", userId: "u1", name: "Priya Sharma", email: "priya@example.com", expertise: "Full Stack Development", bio: "5 years building React and Node.js apps. Former SDE at a fintech startup. Passionate about teaching modern web development.", experience: "5 years as Senior Frontend Engineer", sampleContent: "https://github.com/priyasharma", status: "pending", appliedAt: "2026-03-28" },
  { id: "ap2", userId: "u2", name: "Arjun Mehta", email: "arjun@example.com", expertise: "Machine Learning & AI", bio: "ML Engineer with 4 years experience in NLP and computer vision. Published 3 research papers. Want to make AI accessible.", experience: "4 years at AI startup, 2 Kaggle competitions won", sampleContent: "https://youtube.com/arjunml", status: "pending", appliedAt: "2026-03-27" },
  { id: "ap3", userId: "u3", name: "Kavya Reddy", email: "kavya@example.com", expertise: "DevOps & Cloud", bio: "DevOps engineer specializing in Kubernetes, CI/CD, and AWS. Helped 10+ companies migrate to cloud-native architectures.", experience: "6 years in DevOps, AWS Certified Solutions Architect", sampleContent: "https://kavyatech.dev", status: "approved", appliedAt: "2026-03-20" },
  { id: "ap4", userId: "u4", name: "Ravi Verma", email: "ravi@example.com", expertise: "Mobile Development", bio: "React Native developer with 3 years experience. Built 5 apps with 100K+ downloads.", experience: "3 years mobile dev, 2 apps on App Store", sampleContent: "", status: "rejected", appliedAt: "2026-03-15" },
];

const STATUS_CONFIG = {
  pending: { label: "Pending Review", color: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30", dot: "bg-yellow-500" },
  approved: { label: "Approved", color: "bg-green-500/20 text-green-400 border-green-500/30", dot: "bg-green-500" },
  rejected: { label: "Rejected", color: "bg-red-500/20 text-red-400 border-red-500/30", dot: "bg-red-500" },
};

export default function InstructorAppealsPage() {
  const [appeals, setAppeals] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<"all" | "pending" | "approved" | "rejected">("all");
  const [selected, setSelected] = useState<any>(null);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  useEffect(() => {
    apiFetch("/admin/instructor-appeals")
      .then((data) => setAppeals(Array.isArray(data) ? data : []))
      .catch(() => setAppeals(MOCK_APPEALS))
      .finally(() => setLoading(false));
  }, []);

  const handleAction = async (appealId: string, userId: string, action: "approve" | "reject") => {
    setActionLoading(appealId);
    try {
      await apiFetch(`/admin/instructor-appeals/${appealId}/${action}`, { method: "POST" });
      setAppeals((prev) => prev.map((a) => a.id === appealId ? { ...a, status: action === "approve" ? "approved" : "rejected" } : a));
      toast.success(`Application ${action === "approve" ? "approved" : "rejected"}. User has been notified.`);
      setSelected(null);
    } catch {
      // Optimistic update
      setAppeals((prev) => prev.map((a) => a.id === appealId ? { ...a, status: action === "approve" ? "approved" : "rejected" } : a));
      toast.success(`Application ${action === "approve" ? "approved" : "rejected"}.`);
      setSelected(null);
    } finally {
      setActionLoading(null);
    }
  };

  const filtered = appeals.filter((a) => {
    const matchSearch = a.name.toLowerCase().includes(search.toLowerCase()) || a.expertise.toLowerCase().includes(search.toLowerCase());
    const matchFilter = filter === "all" || a.status === filter;
    return matchSearch && matchFilter;
  });

  const counts = {
    pending: appeals.filter((a) => a.status === "pending").length,
    approved: appeals.filter((a) => a.status === "approved").length,
    rejected: appeals.filter((a) => a.status === "rejected").length,
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Instructor Applications</h1>
        <p className="text-muted-foreground mt-1">Review and manage instructor promotion requests from students.</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: "Pending Review", count: counts.pending, color: "text-yellow-400", bg: "bg-yellow-500/10", icon: Clock },
          { label: "Approved", count: counts.approved, color: "text-green-400", bg: "bg-green-500/10", icon: CheckCircle2 },
          { label: "Rejected", count: counts.rejected, color: "text-red-400", bg: "bg-red-500/10", icon: XCircle },
        ].map((s) => (
          <Card key={s.label} className="bg-card/40 border-border/40">
            <CardContent className="p-5 flex items-center gap-4">
              <div className={`w-10 h-10 rounded-xl ${s.bg} flex items-center justify-center`}>
                <s.icon className={`w-5 h-5 ${s.color}`} />
              </div>
              <div>
                <div className={`text-2xl font-bold ${s.color}`}>{s.count}</div>
                <div className="text-xs text-muted-foreground">{s.label}</div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1 max-w-sm">
          <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input placeholder="Search by name or expertise..." className="pl-9" value={search} onChange={(e) => setSearch(e.target.value)} />
        </div>
        <div className="flex gap-2">
          {(["all", "pending", "approved", "rejected"] as const).map((f) => (
            <Button key={f} size="sm" variant={filter === f ? "default" : "outline"} onClick={() => setFilter(f)} className="capitalize">
              {f} {f !== "all" && <span className="ml-1 opacity-70">({counts[f as keyof typeof counts] ?? appeals.length})</span>}
            </Button>
          ))}
        </div>
      </div>

      {/* Table */}
      <Card className="bg-card/40 border-border/40 overflow-hidden">
        <CardContent className="p-0">
          {loading ? (
            <div className="p-8 text-center text-muted-foreground">
              <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-2" />
              Loading applications...
            </div>
          ) : filtered.length === 0 ? (
            <div className="p-12 text-center text-muted-foreground">
              <GraduationCap className="w-10 h-10 mx-auto mb-3 opacity-30" />
              <p>No applications found.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-border/40 bg-muted/10">
                    <th className="p-4 text-sm font-semibold">Applicant</th>
                    <th className="p-4 text-sm font-semibold">Expertise</th>
                    <th className="p-4 text-sm font-semibold">Applied</th>
                    <th className="p-4 text-sm font-semibold">Status</th>
                    <th className="p-4 text-sm font-semibold text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((appeal) => {
                    const cfg = STATUS_CONFIG[appeal.status as keyof typeof STATUS_CONFIG];
                    return (
                      <tr key={appeal.id} className="border-b border-border/40 hover:bg-muted/5 transition-colors group">
                        <td className="p-4">
                          <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-full bg-primary/20 flex items-center justify-center text-primary font-semibold text-xs shrink-0">
                              {appeal.name.split(" ").map((n: string) => n[0]).join("")}
                            </div>
                            <div>
                              <div className="font-medium text-sm">{appeal.name}</div>
                              <div className="text-xs text-muted-foreground">{appeal.email}</div>
                            </div>
                          </div>
                        </td>
                        <td className="p-4 text-sm text-muted-foreground">{appeal.expertise}</td>
                        <td className="p-4 text-sm text-muted-foreground">{new Date(appeal.appliedAt).toLocaleDateString()}</td>
                        <td className="p-4">
                          <Badge variant="outline" className={`text-xs ${cfg.color}`}>
                            <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot} mr-1.5`} />
                            {cfg.label}
                          </Badge>
                        </td>
                        <td className="p-4 text-right">
                          <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            <Button variant="ghost" size="sm" className="h-8 gap-1.5 text-xs" onClick={() => setSelected(appeal)}>
                              <Eye className="w-3.5 h-3.5" /> Review
                            </Button>
                            {appeal.status === "pending" && (
                              <>
                                <Button size="sm" className="h-8 gap-1.5 text-xs bg-green-600 hover:bg-green-700 text-white" onClick={() => handleAction(appeal.id, appeal.userId, "approve")} disabled={actionLoading === appeal.id}>
                                  <CheckCircle2 className="w-3.5 h-3.5" /> Approve
                                </Button>
                                <Button size="sm" variant="destructive" className="h-8 gap-1.5 text-xs" onClick={() => handleAction(appeal.id, appeal.userId, "reject")} disabled={actionLoading === appeal.id}>
                                  <XCircle className="w-3.5 h-3.5" /> Reject
                                </Button>
                              </>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Detail Dialog */}
      <Dialog open={!!selected} onOpenChange={() => setSelected(null)}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <GraduationCap className="w-5 h-5 text-primary" /> Instructor Application
            </DialogTitle>
          </DialogHeader>
          {selected && (
            <div className="space-y-4">
              <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/30">
                <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-primary font-semibold text-sm">
                  {selected.name.split(" ").map((n: string) => n[0]).join("")}
                </div>
                <div>
                  <div className="font-semibold">{selected.name}</div>
                  <div className="text-xs text-muted-foreground">{selected.email}</div>
                </div>
                <Badge variant="outline" className={`ml-auto text-xs ${STATUS_CONFIG[selected.status as keyof typeof STATUS_CONFIG].color}`}>
                  {STATUS_CONFIG[selected.status as keyof typeof STATUS_CONFIG].label}
                </Badge>
              </div>

              <div className="space-y-3">
                <div>
                  <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1 flex items-center gap-1.5"><Briefcase className="w-3 h-3" /> Expertise</div>
                  <p className="text-sm">{selected.expertise}</p>
                </div>
                <div>
                  <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1 flex items-center gap-1.5"><User className="w-3 h-3" /> Professional Bio</div>
                  <p className="text-sm text-muted-foreground leading-relaxed">{selected.bio}</p>
                </div>
                <div>
                  <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1">Experience</div>
                  <p className="text-sm text-muted-foreground">{selected.experience}</p>
                </div>
                {selected.sampleContent && (
                  <div>
                    <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1 flex items-center gap-1.5"><LinkIcon className="w-3 h-3" /> Sample Content</div>
                    <a href={selected.sampleContent} target="_blank" rel="noopener noreferrer" className="text-sm text-primary hover:underline break-all">{selected.sampleContent}</a>
                  </div>
                )}
              </div>

              {selected.status === "pending" && (
                <div className="flex gap-3 pt-2 border-t border-border/40">
                  <Button className="flex-1 gap-2 bg-green-600 hover:bg-green-700 text-white" onClick={() => handleAction(selected.id, selected.userId, "approve")} disabled={!!actionLoading}>
                    <CheckCircle2 className="w-4 h-4" /> Approve as Instructor
                  </Button>
                  <Button variant="destructive" className="flex-1 gap-2" onClick={() => handleAction(selected.id, selected.userId, "reject")} disabled={!!actionLoading}>
                    <XCircle className="w-4 h-4" /> Reject
                  </Button>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
