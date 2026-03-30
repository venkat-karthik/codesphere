"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { GraduationCap, BookOpen, Video, Users, Plus, BarChart2, Star, Clock, ArrowRight, Play } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import Navbar from "@/components/layout/Navbar";
import { apiFetch } from "@/lib/api";

const MOCK_STATS = { students: 1240, courses: 3, sessions: 18, rating: 4.8 };
const MOCK_COURSES = [
  { _id: "c1", title: "Full Stack Web Development", students: 840, rating: 4.9, progress: 100, status: "published" },
  { _id: "c2", title: "React 19 Deep Dive", students: 320, rating: 4.7, progress: 75, status: "draft" },
  { _id: "c3", title: "Node.js & REST APIs", students: 80, rating: 4.8, progress: 40, status: "draft" },
];

export default function InstructorDashboard() {
  const [user, setUser] = useState<any>(null);
  const [stats, setStats] = useState(MOCK_STATS);
  const [courses, setCourses] = useState(MOCK_COURSES);

  useEffect(() => {
    apiFetch("/users/me").then(setUser).catch(() => {});
    apiFetch("/instructor/stats").then(setStats).catch(() => {});
    apiFetch("/instructor/courses").then((d) => setCourses(Array.isArray(d) ? d : MOCK_COURSES)).catch(() => {});
  }, []);

  const firstName = user?.name?.split(" ")[0] || "Instructor";

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="pt-20 max-w-6xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Badge className="bg-green-500/20 text-green-400 border-green-500/30 gap-1">
                <GraduationCap className="w-3 h-3" /> Instructor
              </Badge>
            </div>
            <h1 className="text-2xl font-bold">Welcome back, {firstName} 👋</h1>
            <p className="text-muted-foreground text-sm mt-1">Manage your courses, sessions, and student progress.</p>
          </div>
          <div className="flex gap-2">
            <Link href="/sessions/new">
              <Button variant="outline" className="gap-2"><Video className="w-4 h-4" /> New Session</Button>
            </Link>
            <Link href="/learning">
              <Button className="gap-2 bg-primary hover:bg-primary/90"><Plus className="w-4 h-4" /> Create Course</Button>
            </Link>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[
            { label: "Total Students", value: stats.students.toLocaleString(), icon: Users, color: "text-blue-400", bg: "bg-blue-500/10" },
            { label: "Courses", value: stats.courses.toString(), icon: BookOpen, color: "text-purple-400", bg: "bg-purple-500/10" },
            { label: "Sessions Hosted", value: stats.sessions.toString(), icon: Video, color: "text-green-400", bg: "bg-green-500/10" },
            { label: "Avg. Rating", value: stats.rating.toString(), icon: Star, color: "text-yellow-400", bg: "bg-yellow-500/10" },
          ].map((s) => (
            <Card key={s.label} className="border-border/40 bg-card/50">
              <CardContent className="p-5">
                <div className={`w-10 h-10 rounded-xl ${s.bg} flex items-center justify-center mb-3`}>
                  <s.icon className={`w-5 h-5 ${s.color}`} />
                </div>
                <div className="text-2xl font-bold mb-0.5">{s.value}</div>
                <div className="text-xs text-muted-foreground">{s.label}</div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Courses */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="font-semibold text-lg">My Courses</h2>
              <Link href="/learning" className="text-xs text-primary hover:underline flex items-center gap-1">
                View All <ArrowRight className="w-3 h-3" />
              </Link>
            </div>
            {courses.map((course) => (
              <Card key={course._id} className="border-border/40 bg-card/50 card-hover group">
                <CardContent className="p-5">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-semibold text-sm group-hover:text-primary transition-colors truncate">{course.title}</h3>
                        <Badge variant="outline" className={`text-[10px] shrink-0 ${course.status === "published" ? "text-green-400 border-green-500/30" : "text-muted-foreground"}`}>
                          {course.status}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-4 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1"><Users className="w-3 h-3" /> {course.students} students</span>
                        <span className="flex items-center gap-1"><Star className="w-3 h-3 fill-yellow-400 text-yellow-400" /> {course.rating}</span>
                      </div>
                    </div>
                    <Button variant="ghost" size="sm" className="gap-1.5 text-xs shrink-0">
                      <Play className="w-3 h-3" /> Edit
                    </Button>
                  </div>
                  <div className="space-y-1">
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>Completion</span>
                      <span>{course.progress}%</span>
                    </div>
                    <Progress value={course.progress} className="h-1.5" />
                  </div>
                </CardContent>
              </Card>
            ))}

            <Card className="border-dashed border-border/60 bg-transparent hover:bg-card/30 transition-colors cursor-pointer">
              <CardContent className="p-5 flex items-center justify-center gap-3 text-muted-foreground">
                <Plus className="w-4 h-4" />
                <span className="text-sm">Create a new course</span>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-5">
            <Card className="border-border/40 bg-card/50">
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center gap-2">
                  <BarChart2 className="w-4 h-4 text-primary" /> Quick Actions
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {[
                  { label: "Host a Live Session", href: "/sessions/new", icon: Video, color: "text-green-400" },
                  { label: "Create Learning Path", href: "/learning", icon: BookOpen, color: "text-blue-400" },
                  { label: "View My Profile", href: "/profile", icon: Users, color: "text-purple-400" },
                  { label: "Browse Sessions", href: "/sessions", icon: Clock, color: "text-orange-400" },
                ].map((a) => (
                  <Link key={a.label} href={a.href}>
                    <div className="flex items-center gap-3 p-2.5 rounded-lg hover:bg-accent/30 transition-colors cursor-pointer">
                      <a.icon className={`w-4 h-4 ${a.color} shrink-0`} />
                      <span className="text-sm">{a.label}</span>
                      <ArrowRight className="w-3.5 h-3.5 text-muted-foreground ml-auto" />
                    </div>
                  </Link>
                ))}
              </CardContent>
            </Card>

            <Card className="border-primary/20 bg-primary/5">
              <CardContent className="p-5">
                <GraduationCap className="w-8 h-8 text-primary mb-3" />
                <h3 className="font-semibold mb-1">Instructor Resources</h3>
                <p className="text-xs text-muted-foreground mb-4">Tips, guidelines, and best practices for creating great content on CodeSphere.</p>
                <Button variant="outline" size="sm" className="w-full gap-2">
                  View Guidelines <ArrowRight className="w-3.5 h-3.5" />
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
