import { useState, useMemo } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';
import { Progress } from '@/components/ui/progress';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Search, Trophy, Flame, Star, CheckCircle2, Circle, ChevronRight,
  Lightbulb, Eye, EyeOff, BarChart2, Target, Zap, Lock, BookOpen, ExternalLink, ThumbsUp
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { apiRequest } from '@/lib/queryClient';

interface Problem {
  id: number;
  title: string;
  description: string;
  difficulty: string;
  category: string;
  tags: string[];
  hints: string[];
  solution: string | null;
  xpReward: number;
  isDaily: boolean;
}

interface UserSolution {
  id: number;
  problemId: number;
  solution: string;
  isCorrect: boolean;
  xpEarned: number;
  submittedAt: string;
}

const DIFFICULTY_CONFIG: Record<string, { color: string; bg: string; xp: string }> = {
  Easy:   { color: 'text-green-600',  bg: 'bg-green-100 dark:bg-green-900/30',  xp: '80–150 XP' },
  Medium: { color: 'text-yellow-600', bg: 'bg-yellow-100 dark:bg-yellow-900/30', xp: '200–300 XP' },
  Hard:   { color: 'text-red-600',    bg: 'bg-red-100 dark:bg-red-900/30',       xp: '350–500 XP' },
};

const CATEGORIES = ['all', 'Arrays', 'Strings', 'Linked Lists', 'Trees', 'Graphs', 'Dynamic Programming', 'Math', 'Design', 'Binary Search', 'Stack', 'Heap'];

export function Problems() {
  const { user } = useAuth();
  const qc = useQueryClient();

  // Filters
  const [search, setSearch] = useState('');
  const [difficulty, setDifficulty] = useState('all');
  const [category, setCategory] = useState('all');
  const [tab, setTab] = useState('all'); // all | daily | solved | unsolved

  // Upvotes — persisted in localStorage per user
  const [upvotedIds, setUpvotedIds] = useState<Set<number>>(() => {
    try {
      const key = `upvoted-problems-${user?.id ?? 'guest'}`;
      return new Set(JSON.parse(localStorage.getItem(key) || '[]'));
    } catch { return new Set(); }
  });

  const toggleUpvote = (problemId: number) => {
    setUpvotedIds(prev => {
      const arr = Array.from(prev);
      const next = new Set(prev.has(problemId) ? arr.filter(id => id !== problemId) : [...arr, problemId]);
      const key = `upvoted-problems-${user?.id ?? 'guest'}`;
      localStorage.setItem(key, JSON.stringify(Array.from(next)));
      return next;
    });
  };

  // Problem modal
  const [selected, setSelected] = useState<Problem | null>(null);
  const [userCode, setUserCode] = useState('');
  const [showHint, setShowHint] = useState(false);
  const [hintIndex, setHintIndex] = useState(0);
  const [showSolution, setShowSolution] = useState(false);
  const [submitResult, setSubmitResult] = useState<'correct' | 'wrong' | null>(null);

  // Fetch all problems
  const { data: problems = [], isLoading } = useQuery<Problem[]>({
    queryKey: ['/api/content/problems'],
  });

  // Fetch user solutions
  const { data: solutions = [] } = useQuery<UserSolution[]>({
    queryKey: [`/api/users/${user?.id}/solutions`],
    enabled: !!user,
  });

  // Fetch user analytics
  const { data: analytics = [] } = useQuery<any[]>({
    queryKey: [`/api/analytics/users/${user?.id}`],
    enabled: !!user,
  });

  const solvedIds = useMemo(() =>
    new Set(solutions.filter(s => s.isCorrect).map(s => s.problemId)),
    [solutions]
  );

  const submitMutation = useMutation({
    mutationFn: async ({ problemId, isCorrect }: { problemId: number; isCorrect: boolean }) => {
      const xpEarned = isCorrect ? (selected?.xpReward || 100) : 0;
      const res = await apiRequest('POST', `/api/users/${user!.id}/solutions`, {
        problemId,
        solution: userCode,
        isCorrect,
        xpEarned,
      });
      return res.json();
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: [`/api/users/${user?.id}/solutions`] });
      qc.invalidateQueries({ queryKey: [`/api/analytics/users/${user?.id}`] });
    },
  });

  const handleSubmit = (isCorrect: boolean) => {
    if (!user || !selected) return;
    setSubmitResult(isCorrect ? 'correct' : 'wrong');
    submitMutation.mutate({ problemId: selected.id, isCorrect });
  };

  const openProblem = (p: Problem) => {
    setSelected(p);
    setUserCode('');
    setShowHint(false);
    setHintIndex(0);
    setShowSolution(false);
    setSubmitResult(null);
  };

  // Filter logic
  const filtered = useMemo(() => {
    return problems.filter(p => {
      const q = search.toLowerCase();
      const matchSearch = !search ||
        p.title.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q) ||
        p.tags.some(t => t.toLowerCase().includes(q));
      const matchDiff = difficulty === 'all' || p.difficulty === difficulty;
      const matchCat = category === 'all' || p.category === category;
      const matchTab =
        tab === 'all' ? true :
        tab === 'daily' ? p.isDaily :
        tab === 'solved' ? solvedIds.has(p.id) :
        tab === 'unsolved' ? !solvedIds.has(p.id) : true;
      return matchSearch && matchDiff && matchCat && matchTab;
    });
  }, [problems, search, difficulty, category, tab, solvedIds]);

  // Analytics summary
  const totalSolved = solvedIds.size;
  const totalProblems = problems.length;
  const easySolved = problems.filter(p => p.difficulty === 'Easy' && solvedIds.has(p.id)).length;
  const mediumSolved = problems.filter(p => p.difficulty === 'Medium' && solvedIds.has(p.id)).length;
  const hardSolved = problems.filter(p => p.difficulty === 'Hard' && solvedIds.has(p.id)).length;
  const easyTotal = problems.filter(p => p.difficulty === 'Easy').length;
  const mediumTotal = problems.filter(p => p.difficulty === 'Medium').length;
  const hardTotal = problems.filter(p => p.difficulty === 'Hard').length;

  const totalXpEarned = solutions.filter(s => s.isCorrect).reduce((sum, s) => sum + s.xpEarned, 0);

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold mb-1">Daily Problems</h1>
        <p className="text-muted-foreground">Sharpen your skills with coding challenges. Earn XP and CodeCoins for every problem you solve.</p>
        <p className="text-sm text-primary/80 mt-1 font-medium">💛 Upvote if it helped • Be consistent • Keep learning 💛</p>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
              <Trophy className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="text-2xl font-bold">{totalSolved}</p>
              <p className="text-xs text-muted-foreground">Solved</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-yellow-500/10 flex items-center justify-center">
              <Zap className="h-5 w-5 text-yellow-500" />
            </div>
            <div>
              <p className="text-2xl font-bold">{totalXpEarned}</p>
              <p className="text-xs text-muted-foreground">XP Earned</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-orange-500/10 flex items-center justify-center">
              <Flame className="h-5 w-5 text-orange-500" />
            </div>
            <div>
              <p className="text-2xl font-bold">{user?.streak ?? 0}</p>
              <p className="text-xs text-muted-foreground">Day Streak</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-green-500/10 flex items-center justify-center">
              <Target className="h-5 w-5 text-green-500" />
            </div>
            <div>
              <p className="text-2xl font-bold">{totalProblems > 0 ? Math.round((totalSolved / totalProblems) * 100) : 0}%</p>
              <p className="text-xs text-muted-foreground">Completion</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Difficulty Breakdown */}
      <Card>
        <CardContent className="p-4">
          <h3 className="font-semibold mb-3 flex items-center gap-2"><BarChart2 className="h-4 w-4" /> Progress by Difficulty</h3>
          <div className="space-y-3">
            {[
              { label: 'Easy', solved: easySolved, total: easyTotal, color: 'bg-green-500' },
              { label: 'Medium', solved: mediumSolved, total: mediumTotal, color: 'bg-yellow-500' },
              { label: 'Hard', solved: hardSolved, total: hardTotal, color: 'bg-red-500' },
            ].map(({ label, solved, total, color }) => (
              <div key={label} className="flex items-center gap-3">
                <span className="w-16 text-sm font-medium">{label}</span>
                <div className="flex-1">
                  <Progress value={total > 0 ? (solved / total) * 100 : 0} className="h-2" />
                </div>
                <span className="text-sm text-muted-foreground w-16 text-right">{solved}/{total}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Filters */}
      <Card>
        <CardContent className="p-4 space-y-3">
          <div className="flex flex-col lg:flex-row gap-3">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Search problems, tags..." value={search}
                onChange={e => setSearch(e.target.value)} className="pl-10" />
            </div>
            <Select value={difficulty} onValueChange={setDifficulty}>
              <SelectTrigger className="w-40"><SelectValue placeholder="Difficulty" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Difficulties</SelectItem>
                <SelectItem value="Easy">Easy</SelectItem>
                <SelectItem value="Medium">Medium</SelectItem>
                <SelectItem value="Hard">Hard</SelectItem>
              </SelectContent>
            </Select>
            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger className="w-48"><SelectValue placeholder="Category" /></SelectTrigger>
              <SelectContent>
                {CATEGORIES.map(c => (
                  <SelectItem key={c} value={c}>{c === 'all' ? 'All Categories' : c}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <Tabs value={tab} onValueChange={setTab}>
            <TabsList>
              <TabsTrigger value="all">All ({problems.length})</TabsTrigger>
              <TabsTrigger value="daily">
                <Star className="h-3 w-3 mr-1" />Daily ({problems.filter(p => p.isDaily).length})
              </TabsTrigger>
              <TabsTrigger value="solved">
                <CheckCircle2 className="h-3 w-3 mr-1" />Solved ({totalSolved})
              </TabsTrigger>
              <TabsTrigger value="unsolved">
                <Circle className="h-3 w-3 mr-1" />Unsolved ({totalProblems - totalSolved})
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </CardContent>
      </Card>

      <p className="text-sm text-muted-foreground">Showing {filtered.length} of {problems.length} problems</p>

      {/* Problems List */}
      {isLoading ? (
        <div className="space-y-3">
          {[...Array(6)].map((_, i) => <Skeleton key={i} className="h-20 w-full rounded-xl" />)}
        </div>
      ) : filtered.length === 0 ? (
        <Card><CardContent className="p-12 text-center">
          <BookOpen className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
          <h3 className="text-lg font-semibold mb-2">No problems found</h3>
          <p className="text-muted-foreground">Try adjusting your filters or search query</p>
          <Button variant="outline" className="mt-4" onClick={() => { setSearch(''); setDifficulty('all'); setCategory('all'); setTab('all'); }}>
            Clear Filters
          </Button>
        </CardContent></Card>
      ) : (
        <div className="space-y-2">
          {filtered.map((problem, idx) => {
            const isSolved = solvedIds.has(problem.id);
            const cfg = DIFFICULTY_CONFIG[problem.difficulty] || DIFFICULTY_CONFIG.Easy;
            return (
              <Card key={problem.id}
                className={`cursor-pointer hover:shadow-md transition-all border-l-4 ${
                  isSolved ? 'border-l-green-500' : problem.difficulty === 'Hard' ? 'border-l-red-400' : problem.difficulty === 'Medium' ? 'border-l-yellow-400' : 'border-l-green-400'
                }`}
                onClick={() => openProblem(problem)}>
                <CardContent className="p-4">
                  <div className="flex items-center gap-4">
                    <span className="text-muted-foreground text-sm w-8 shrink-0">{idx + 1}</span>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="font-semibold">{problem.title}</h3>
                        {problem.isDaily && <Badge variant="outline" className="text-xs border-yellow-400 text-yellow-600"><Star className="h-2.5 w-2.5 mr-1" />Daily</Badge>}
                        {isSolved && <CheckCircle2 className="h-4 w-4 text-green-500 shrink-0" />}
                      </div>
                      <div className="flex items-center gap-2 mt-1 flex-wrap">
                        <Badge className={`text-xs ${cfg.bg} ${cfg.color} border-0`}>{problem.difficulty}</Badge>
                        <Badge variant="outline" className="text-xs">{problem.category}</Badge>
                        {problem.tags.slice(0, 2).map(t => (
                          <Badge key={t} variant="secondary" className="text-xs">{t}</Badge>
                        ))}
                      </div>
                    </div>
                    <div className="flex items-center gap-3 shrink-0">
                      <button
                        className={`flex items-center gap-1 text-xs px-2 py-1 rounded-lg transition-all ${
                          upvotedIds.has(problem.id)
                            ? 'bg-primary/20 text-primary font-semibold'
                            : 'text-muted-foreground hover:text-primary hover:bg-primary/10'
                        }`}
                        onClick={e => { e.stopPropagation(); toggleUpvote(problem.id); }}
                        title={upvotedIds.has(problem.id) ? 'Remove upvote' : 'Upvote — helpful!'}
                      >
                        <ThumbsUp className={`h-3.5 w-3.5 ${upvotedIds.has(problem.id) ? 'fill-primary' : ''}`} />
                        <span>{upvotedIds.has(problem.id) ? 'Helpful' : 'Upvote'}</span>
                      </button>
                      <span className="text-sm font-medium text-primary">+{problem.xpReward} XP</span>
                      <ChevronRight className="h-4 w-4 text-muted-foreground" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      {/* Problem Modal */}
      <Dialog open={!!selected} onOpenChange={open => !open && setSelected(null)}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          {selected && (
            <>
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2 flex-wrap">
                  {selected.title}
                  {selected.isDaily && <Badge variant="outline" className="text-xs border-yellow-400 text-yellow-600"><Star className="h-3 w-3 mr-1" />Daily</Badge>}
                  <Badge className={`text-xs ${DIFFICULTY_CONFIG[selected.difficulty]?.bg} ${DIFFICULTY_CONFIG[selected.difficulty]?.color} border-0`}>
                    {selected.difficulty}
                  </Badge>
                  {solvedIds.has(selected.id) && <Badge className="bg-green-500 text-white text-xs border-0"><CheckCircle2 className="h-3 w-3 mr-1" />Solved</Badge>}
                </DialogTitle>
              </DialogHeader>

              <Tabs defaultValue="problem">
                <TabsList className="w-full">
                  <TabsTrigger value="problem" className="flex-1">Problem</TabsTrigger>
                  <TabsTrigger value="submit" className="flex-1">Submit</TabsTrigger>
                  <TabsTrigger value="hints" className="flex-1">Hints ({selected.hints.length})</TabsTrigger>
                </TabsList>

                {/* Problem Tab */}
                <TabsContent value="problem" className="space-y-4 mt-4">
                  <div className="flex gap-2 flex-wrap items-center justify-between">
                    <div className="flex gap-2 flex-wrap">
                      <Badge variant="outline">{selected.category}</Badge>
                      {selected.tags.map(t => <Badge key={t} variant="secondary" className="text-xs">{t}</Badge>)}
                      <Badge className="bg-primary/10 text-primary border-0">+{selected.xpReward} XP</Badge>
                    </div>
                    <button
                      className={`flex items-center gap-1.5 text-sm px-3 py-1.5 rounded-lg border transition-all ${
                        upvotedIds.has(selected.id)
                          ? 'bg-primary/15 border-primary/40 text-primary font-semibold'
                          : 'border-border text-muted-foreground hover:border-primary/40 hover:text-primary'
                      }`}
                      onClick={() => toggleUpvote(selected.id)}
                    >
                      <ThumbsUp className={`h-4 w-4 ${upvotedIds.has(selected.id) ? 'fill-primary' : ''}`} />
                      {upvotedIds.has(selected.id) ? 'Marked Helpful' : 'Upvote if helpful'}
                    </button>
                  </div>
                  <div className="prose prose-sm dark:prose-invert max-w-none">
                    <p className="text-sm leading-relaxed whitespace-pre-wrap">{selected.description}</p>
                  </div>
                </TabsContent>

                {/* Submit Tab */}
                <TabsContent value="submit" className="space-y-4 mt-4">
                  {submitResult ? (
                    <div className={`p-4 rounded-xl text-center ${submitResult === 'correct' ? 'bg-green-500/10 border border-green-500/30' : 'bg-red-500/10 border border-red-500/30'}`}>
                      {submitResult === 'correct' ? (
                        <>
                          <CheckCircle2 className="h-10 w-10 text-green-500 mx-auto mb-2" />
                          <p className="font-bold text-green-600">Correct! +{selected.xpReward} XP earned</p>
                          <p className="text-sm text-muted-foreground mt-1">Great job solving this problem!</p>
                        </>
                      ) : (
                        <>
                          <div className="h-10 w-10 rounded-full bg-red-500/20 flex items-center justify-center mx-auto mb-2">
                            <span className="text-red-500 text-xl font-bold">✗</span>
                          </div>
                          <p className="font-bold text-red-600">Not quite right</p>
                          <p className="text-sm text-muted-foreground mt-1">Review the hints and try again</p>
                        </>
                      )}
                      <Button variant="outline" className="mt-3" onClick={() => setSubmitResult(null)}>Try Again</Button>
                    </div>
                  ) : (
                    <>
                      <div>
                        <label className="text-sm font-medium mb-2 block">Your Solution</label>
                        <textarea
                          className="w-full h-48 p-3 rounded-lg border bg-muted/30 font-mono text-sm resize-none focus:outline-none focus:ring-2 focus:ring-primary"
                          placeholder="Write your solution here..."
                          value={userCode}
                          onChange={e => setUserCode(e.target.value)}
                        />
                      </div>
                      <div className="flex gap-2">
                        <Button className="flex-1" onClick={() => handleSubmit(true)} disabled={!userCode.trim() || submitMutation.isPending}>
                          <CheckCircle2 className="h-4 w-4 mr-2" />Mark as Solved
                        </Button>
                        <Button variant="outline" className="flex-1" onClick={() => handleSubmit(false)} disabled={!userCode.trim() || submitMutation.isPending}>
                          Submit Attempt
                        </Button>
                      </div>
                      <p className="text-xs text-muted-foreground text-center">
                        "Mark as Solved" awards full XP. "Submit Attempt" records your try without XP.
                      </p>
                    </>
                  )}

                  {/* Show solution toggle */}
                  {solvedIds.has(selected.id) && selected.solution && (
                    <div className="border rounded-lg overflow-hidden">
                      {selected.solution.startsWith('http') ? (
                        <a href={selected.solution} target="_blank" rel="noopener noreferrer"
                          className="flex items-center justify-between p-3 text-sm font-medium hover:bg-muted/50 transition-colors text-primary">
                          <span className="flex items-center gap-2">
                            <ExternalLink className="h-4 w-4" />
                            View on LeetCode
                          </span>
                          <ExternalLink className="h-3 w-3" />
                        </a>
                      ) : (
                        <>
                          <button
                            className="w-full p-3 flex items-center justify-between text-sm font-medium hover:bg-muted/50 transition-colors"
                            onClick={() => setShowSolution(s => !s)}>
                            <span className="flex items-center gap-2">
                              {showSolution ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                              {showSolution ? 'Hide Solution' : 'View Solution'}
                            </span>
                            <Lock className="h-3 w-3 text-muted-foreground" />
                          </button>
                          {showSolution && (
                            <div className="p-3 bg-muted/30 border-t">
                              <p className="text-sm font-mono whitespace-pre-wrap">{selected.solution}</p>
                            </div>
                          )}
                        </>
                      )}
                    </div>
                  )}

                  {/* LeetCode link always visible */}
                  {selected.solution?.startsWith('http') && !solvedIds.has(selected.id) && (
                    <div className="border rounded-lg p-3 bg-orange-500/5 border-orange-500/20">
                      <p className="text-xs text-muted-foreground mb-2">Solve this problem on LeetCode, then mark it as solved here to earn XP!</p>
                      <a href={selected.solution} target="_blank" rel="noopener noreferrer">
                        <Button size="sm" variant="outline" className="w-full border-orange-500/30 text-orange-600 hover:bg-orange-500/10">
                          <ExternalLink className="h-3.5 w-3.5 mr-2" />Open on LeetCode
                        </Button>
                      </a>
                    </div>
                  )}
                </TabsContent>

                {/* Hints Tab */}
                <TabsContent value="hints" className="space-y-3 mt-4">
                  {selected.hints.length === 0 ? (
                    <p className="text-muted-foreground text-sm text-center py-4">No hints available for this problem.</p>
                  ) : (
                    <>
                      <p className="text-sm text-muted-foreground">Hints are revealed one at a time. Try to solve it yourself first!</p>
                      {selected.hints.slice(0, hintIndex + 1).map((hint, i) => (
                        <div key={i} className="flex gap-3 p-3 rounded-lg bg-yellow-500/10 border border-yellow-500/20">
                          <Lightbulb className="h-4 w-4 text-yellow-500 shrink-0 mt-0.5" />
                          <p className="text-sm">{hint}</p>
                        </div>
                      ))}
                      {hintIndex < selected.hints.length - 1 && (
                        <Button variant="outline" size="sm" onClick={() => setHintIndex(i => i + 1)}>
                          <Lightbulb className="h-3 w-3 mr-2" />Reveal Next Hint
                        </Button>
                      )}
                    </>
                  )}
                </TabsContent>
              </Tabs>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
