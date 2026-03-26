"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
    BrainCircuit,
    Clock,
    Award,
    ChevronRight,
    Search,
    CheckCircle2,
    Lock,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { apiFetch } from "@/lib/api";

export default function TestsPage() {
    const [search, setSearch] = useState("");
    const [tests, setTests] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchTests = async () => {
            try {
                const data = await apiFetch('/tests');
                setTests(data);
            } catch (error) {
                console.error("Failed to fetch tests:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchTests();
    }, []);

    const filtered = tests.filter((test) =>
        test.title.toLowerCase().includes(search.toLowerCase()) ||
        test.category.toLowerCase().includes(search.toLowerCase())
    );

    if (loading) {
        return (
            <div className="min-h-screen bg-background flex flex-col">
                <Navbar />
                <div className="flex-1 flex items-center justify-center">
                    <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
                </div>
                <Footer />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background">
            <Navbar />

            {/* Header */}
            <div className="pt-24 pb-12 bg-muted/20 border-b border-border/40">
                <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                    <Badge variant="outline" className="mb-4 border-green-500/30 text-green-400">Assessments</Badge>
                    <h1 className="text-4xl font-bold mb-4">
                        Test your <span className="gradient-text">Knowledge</span>
                    </h1>
                    <p className="text-muted-foreground text-lg max-w-2xl">
                        Take timed quizzes, earn badges, and identify areas to improve. Your scores contribute to your personalized learning path.
                    </p>

                    <div className="relative mt-8 max-w-xl flex items-center">
                        <Search className="absolute left-3 w-5 h-5 text-muted-foreground" />
                        <Input
                            placeholder="Search tests by topic or keyword..."
                            className="pl-10 h-12 bg-background border-border/50 text-base rounded-xl"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="py-12 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">

                {/* Stats Row */}
                <div className="grid grid-cols-3 gap-4 mb-12">
                    <Card className="bg-card/40 border-border/40">
                        <CardContent className="p-6">
                            <div className="text-sm font-medium text-muted-foreground mb-1">Average Score</div>
                            <div className="text-3xl font-bold text-green-400">0%</div>
                        </CardContent>
                    </Card>
                    <Card className="bg-card/40 border-border/40">
                        <CardContent className="p-6">
                            <div className="text-sm font-medium text-muted-foreground mb-1">Tests Completed</div>
                            <div className="text-3xl font-bold">0</div>
                        </CardContent>
                    </Card>
                    <Card className="bg-card/40 border-border/40">
                        <CardContent className="p-6">
                            <div className="text-sm font-medium text-muted-foreground mb-1">Current Rank</div>
                            <div className="text-3xl font-bold text-purple-400">New</div>
                        </CardContent>
                    </Card>
                </div>

                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-bold">Available Tests</h2>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                    {filtered.map((test) => (
                        <div key={test._id} className="p-6 rounded-2xl border border-border/40 bg-card/40 hover:bg-card/60 transition-colors flex flex-col sm:flex-row gap-4">
                            <div className={`w-12 h-12 shrink-0 rounded-xl flex items-center justify-center bg-primary/20 text-primary`}>
                                <BrainCircuit className="w-6 h-6" />
                            </div>

                            <div className="flex-1">
                                <div className="flex items-center gap-2 mb-1 cursor-pointer">
                                    <h3 className="font-semibold text-lg">{test.title}</h3>
                                </div>

                                <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground mb-4">
                                    <span className="flex items-center gap-1">
                                        <Badge variant="outline" className="font-normal text-[10px] h-4 py-0">{test.category}</Badge>
                                    </span>
                                    <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" /> {test.timeLimit} mins</span>
                                    <span className="flex items-center gap-1"><Award className="w-3.5 h-3.5" /> {test.questions?.length || 0} Qs</span>
                                </div>

                                <div className="flex items-center justify-between">
                                    <span className={`text-xs font-medium ${test.difficulty === "Beginner" ? "text-blue-400" :
                                        test.difficulty === "Intermediate" ? "text-orange-400" : "text-red-400"
                                        }`}>{test.difficulty}</span>
                                    <Link href={`/tests/${test._id}`}>
                                        <Button size="sm" variant="default" className="gap-2">
                                            Start Test <ChevronRight className="w-4 h-4" />
                                        </Button>
                                    </Link>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
            <Footer />
        </div>
    );
}
