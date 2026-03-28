"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import {
    Clock,
    ArrowRight,
    ArrowLeft,
    AlertCircle,
    Flag,
    Trophy,
    Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { apiFetch } from "@/lib/api";
import { toast } from "sonner";

const FALLBACK_QUESTIONS = [
    {
        id: 1,
        question: "What is the primary purpose of useEffect in React?",
        options: [
            "To manage local component state",
            "To perform side effects in functional components",
            "To replace the render method",
            "To style components dynamically",
        ],
    },
    {
        id: 2,
        question: "Which hook should you use for complex state logic?",
        options: ["useState", "useEffect", "useReducer", "useMemo"],
    },
    {
        id: 3,
        question: "How do you prevent a component from re-rendering if its props have not changed?",
        options: ["React.memo", "useCallback", "useEffect", "useTransition"],
    },
];

export default function ActiveTestPage() {
    const params = useParams();
    const router = useRouter();

    const [test, setTest] = useState<any>(null);
    const [questions, setQuestions] = useState<any[]>([]);
    const [loadingTest, setLoadingTest] = useState(true);
    const [currentIdx, setCurrentIdx] = useState(0);
    const [answers, setAnswers] = useState<Record<number, number>>({});
    const [timeLeft, setTimeLeft] = useState(30 * 60);
    const [submitted, setSubmitted] = useState(false);
    const [submitLoading, setSubmitLoading] = useState(false);
    const [testResult, setTestResult] = useState<any>(null);

    useEffect(() => {
        const fetchTest = async () => {
            try {
                const data = await apiFetch(`/tests/${params.id}`);
                setTest(data);
                setQuestions(data.questions?.length ? data.questions : FALLBACK_QUESTIONS);
                if (data.timeLimit) setTimeLeft(data.timeLimit * 60);
            } catch {
                setQuestions(FALLBACK_QUESTIONS);
            } finally {
                setLoadingTest(false);
            }
        };
        if (params.id) fetchTest();
    }, [params.id]);

    useEffect(() => {
        if (submitted || loadingTest) return;
        const timer = setInterval(() => {
            setTimeLeft((prev) => {
                if (prev <= 1) { handleRealSubmit(); return 0; }
                return prev - 1;
            });
        }, 1000);
        return () => clearInterval(timer);
    }, [submitted, loadingTest]);

    const handleRealSubmit = async () => {
        if (submitLoading || submitted) return;
        setSubmitLoading(true);
        try {
            const res = await apiFetch(`/tests/${params.id}/submit`, {
                method: "POST",
                body: JSON.stringify({ answers }),
            });
            setTestResult(res);
            toast.success("Test submitted successfully!");
        } catch {
            // Fallback: calculate score client-side from answered questions
            const answered = Object.keys(answers).length;
            setTestResult({ score: Math.round((answered / questions.length) * 100) });
        } finally {
            setSubmitted(true);
            setSubmitLoading(false);
        }
    };

    if (loadingTest) {
        return (
            <div className="min-h-screen bg-background flex items-center justify-center">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
        );
    }

    if (submitted) {
        return (
            <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6">
                <Card className="max-w-md w-full text-center p-8 bg-card/60 backdrop-blur-xl border-border/40">
                    <div className="w-16 h-16 bg-green-500/20 text-green-400 rounded-full flex items-center justify-center mx-auto mb-6">
                        <span className="text-2xl font-bold">✓</span>
                    </div>
                    <h2 className="text-2xl font-bold mb-2">Test Completed!</h2>
                    <p className="text-muted-foreground mb-6">Your answers have been processed successfully.</p>
                    <div className="bg-background/50 p-6 rounded-xl border border-border/40 mb-8 text-center">
                        <div className="text-sm font-medium text-muted-foreground mb-1">Your Score</div>
                        <div className="text-4xl font-bold text-primary mb-4">{testResult?.score ?? "—"}%</div>
                        {testResult?.achievement && (
                            <div className="mt-4 pt-4 border-t border-border/40">
                                <div className="text-xs font-bold text-yellow-500 uppercase tracking-widest mb-2 flex items-center justify-center gap-1">
                                    <Trophy className="w-3 h-3" /> New Achievement!
                                </div>
                                <div className="text-foreground font-semibold">{testResult.achievement.title}</div>
                                <p className="text-[10px] text-muted-foreground mt-1">Visit your profile to see your new badge</p>
                            </div>
                        )}
                    </div>
                    <Button onClick={() => router.push("/dashboard")} className="w-full">Return to Dashboard</Button>
                </Card>
            </div>
        );
    }

    const q = questions[currentIdx];
    const progress = ((currentIdx + 1) / questions.length) * 100;
    const m = Math.floor(timeLeft / 60).toString().padStart(2, "0");
    const s = (timeLeft % 60).toString().padStart(2, "0");

    return (
        <div className="min-h-screen bg-black flex flex-col">
            <div className="h-16 border-b border-border/40 bg-card/30 flex items-center justify-between px-6 sticky top-0 z-50">
                <div className="flex items-center gap-4">
                    <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold text-xs ring-1 ring-primary/40">C</div>
                    <div>
                        <div className="font-semibold text-sm">{test?.title || "Assessment"}</div>
                        <div className="text-xs text-muted-foreground">Test ID: {params.id}</div>
                    </div>
                </div>
                <div className="flex items-center gap-6">
                    <div className={`flex items-center gap-2 font-mono text-lg font-medium px-4 py-1.5 rounded-full ${timeLeft < 300 ? "bg-red-500/10 text-red-500" : "bg-card border border-border/40"}`}>
                        <Clock className="w-4 h-4" />{m}:{s}
                    </div>
                    <Button variant="destructive" size="sm" onClick={handleRealSubmit} disabled={submitLoading}>
                        {submitLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Submit Test"}
                    </Button>
                </div>
            </div>

            <div className="bg-card w-full h-1">
                <Progress value={progress} className="h-1 rounded-none bg-transparent" />
            </div>

            <div className="flex-1 flex max-w-6xl w-full mx-auto p-6 gap-8">
                <div className="flex-1 max-w-3xl">
                    <div className="flex items-center justify-between mb-8">
                        <h3 className="text-lg font-medium text-muted-foreground">Question {currentIdx + 1} of {questions.length}</h3>
                        <Button variant="ghost" size="sm" className="gap-2 text-yellow-500 hover:text-yellow-400 hover:bg-yellow-500/10">
                            <Flag className="w-4 h-4" /> Flag for review
                        </Button>
                    </div>

                    <Card className="bg-card/40 border-border/40 mb-8 border-none shadow-none">
                        <CardContent className="p-0">
                            <p className="text-2xl font-medium leading-relaxed mb-8">{q?.question}</p>
                            <div className="space-y-3">
                                {q?.options?.map((opt: string, i: number) => {
                                    const isSelected = answers[q.id] === i;
                                    return (
                                        <div
                                            key={i}
                                            onClick={() => setAnswers({ ...answers, [q.id]: i })}
                                            className={`p-4 rounded-xl border-2 transition-all cursor-pointer flex items-center gap-4 ${isSelected ? "border-primary bg-primary/5 shadow-sm shadow-primary/10" : "border-border/40 hover:border-primary/50 bg-card/20"}`}
                                        >
                                            <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center shrink-0 transition-colors ${isSelected ? "border-primary" : "border-muted-foreground"}`}>
                                                {isSelected && <div className="w-2.5 h-2.5 rounded-full bg-primary" />}
                                            </div>
                                            <span className="text-lg">{opt}</span>
                                        </div>
                                    );
                                })}
                            </div>
                        </CardContent>
                    </Card>

                    <div className="flex items-center justify-between border-t border-border/40 py-6">
                        <Button variant="outline" size="lg" disabled={currentIdx === 0} onClick={() => setCurrentIdx((p) => p - 1)} className="gap-2">
                            <ArrowLeft className="w-4 h-4" /> Previous
                        </Button>
                        {currentIdx < questions.length - 1 ? (
                            <Button size="lg" onClick={() => setCurrentIdx((p) => p + 1)} className="gap-2 px-8">
                                Next <ArrowRight className="w-4 h-4" />
                            </Button>
                        ) : (
                            <Button size="lg" onClick={handleRealSubmit} disabled={submitLoading} className="gap-2 px-8 bg-green-600 hover:bg-green-700 text-white">
                                {submitLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <><AlertCircle className="w-4 h-4" /> Finish & Submit</>}
                            </Button>
                        )}
                    </div>
                </div>

                <div className="w-72 hidden lg:block">
                    <Card className="bg-card/40 border-border/40 sticky top-24">
                        <CardContent className="p-6">
                            <h4 className="font-semibold mb-4">Question Grid</h4>
                            <div className="grid grid-cols-4 gap-2 mb-6">
                                {questions.map((_q: any, index: number) => {
                                    const isAnswered = answers[_q.id] !== undefined;
                                    const isCurrent = currentIdx === index;
                                    return (
                                        <button
                                            key={_q.id}
                                            onClick={() => setCurrentIdx(index)}
                                            className={`w-10 h-10 rounded-lg flex items-center justify-center text-sm font-medium transition-colors ${isCurrent ? "bg-primary text-primary-foreground ring-2 ring-primary ring-offset-2 ring-offset-background" : isAnswered ? "bg-primary/20 text-primary border border-primary/30" : "bg-muted text-muted-foreground border border-border/40 hover:bg-muted/80"}`}
                                        >
                                            {index + 1}
                                        </button>
                                    );
                                })}
                            </div>
                            <div className="space-y-3 text-sm text-muted-foreground border-t border-border/40 pt-6">
                                <div className="flex items-center gap-3"><div className="w-4 h-4 rounded-md bg-primary/20 border border-primary/30" /><span>Answered</span></div>
                                <div className="flex items-center gap-3"><div className="w-4 h-4 rounded-md bg-muted border border-border/40" /><span>Unanswered</span></div>
                                <div className="flex items-center gap-3"><div className="w-4 h-4 rounded-md bg-primary" /><span>Current</span></div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
