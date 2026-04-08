import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Star, CheckCircle, Circle, Flame, Code, Target, Play, RotateCcw, Lightbulb
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
  xpReward: number;
  isDaily: boolean;
  hints: string[];
  solution: string | null;
}

interface UserSolution {
  problemId: number;
  isCorrect: boolean;
}

const DIFFICULTY_COLOR: Record<string, string> = {
  Easy: 'bg-green-500/20 text-green-400',
  Medium: 'bg-yellow-500/20 text-yellow-400',
  Hard: 'bg-red-500/20 text-red-400',
};

const CATEGORIES = ['all', 'Arrays', 'Strings', 'Dynamic Programming', 'Trees', 'Linked Lists', 'Design'];

export function Problems() {
  const { user, updateUser } = useAuth();
  const qc = useQueryClient();
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [activeProblem, setActiveProblem] = useState<Problem | null>(null);
  const [userCode, setUserCode] = useState('');
  const [showHint, setShowHint] = useState(false);
  const [showSolution, setShowSolution] = useState(false);
  const [submitResult, setSubmitResult] = useState<'correct' | 'wrong' | null>(null);

  const { data: problems = [], isLoading } = useQuery<Problem[]>({
    queryKey: ['/api/problems'],
  });

  const { data: solutions = [] } = useQuery<UserSolution[]>({
    queryKey: [`/api/users/${user?.id}/solutions`],
    enabled: !!user && user.id > 0,
  });

  const solvedIds = new Set(solutions.filter((s: UserSolution) => s.isCorrect).map((s: UserSolution) => s.problemId));

  const submitMutation = useMutation({
    mutationFn: async ({ problem, code }: { problem: Problem; code: string }) => {
      if (!user || user.id <= 0) throw new Error('Must be logged in');
      const isCorrect = code.trim().length > 20; // Simple simulation of correctness
      await apiRequest('POST', `/api/users/${user.id}/solutions`, {
        problemId: problem.id,
        solution: code,
        isCorrect,
        xpEarned: isCorrect ? problem.xpReward : 0,
      });
      return { isCorrect, xpEarned: isCorrect ? problem.xpReward : 0 };
    },
    onSuccess: ({ isCorrect, xpEarned }) => {
      setSubmitResult(isCorrect ? 'correct' : 'wrong');
      if (isCorrect && user) {
        updateUser({ ...user, xp: user.xp + xpEarned });
        qc.invalidateQueries({ queryKey: [`/api/users/${user.id}/solutions`] });
      }
    },
  });

  const dailyProblem = problems.find((p: Problem) => p.isDaily);
  const filtered = problems.filter((p: Problem) =>
    selectedCategory === 'all' || p.category === selectedCategory
  );

  const openProblem = (p: Problem) => {
    setActiveProblem(p);
    setUserCode('');
    setShowHint(false);
    setShowSolution(false);
    setSubmitResult(null);
  };

  const solvedCount = solvedIds.size;
  const successRate = problems.length > 0 ? Math.round((solvedCount / problems.length) * 100) : 0;

  if (activeProblem) {
    return (
      <div className="max-w-4xl mx-auto space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold">{activeProblem.title}</h2>
            <div className="flex gap-2 mt-1">
              <Badge className={DIFFICULTY_COLOR[activeProblem.difficulty] || ''}>{activeProblem.difficulty}</Badge>
              <Badge variant="outline">{activeProblem.category}</Badge>
              <Badge variant="outline" className="text-primary font-semibold">+{activeProblem.xpReward} XP</Badge>
            </div>
          </div>
          <Button variant="outline" onClick={() => setActiveProblem(null)}>Back to List</Button>
        </div>

        <Card>
          <CardContent className="p-6">
            <h4 className="font-semibold mb-2">Problem Description</h4>
            <p className="text-muted-foreground whitespace-pre-wrap">{activeProblem.description}</p>
            <div className="flex gap-2 flex-wrap mt-4">
              {activeProblem.tags.map(tag => (
                <Badge key={tag} variant="outline" className="text-xs">{tag}</Badge>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium uppercase tracking-wider text-muted-foreground">Your Solution</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Textarea
              value={userCode}
              onChange={(e) => setUserCode(e.target.value)}
              placeholder="// Write your code here..."
              className="font-mono text-sm min-h-[300px] bg-muted/50 focus:bg-background transition-colors"
            />
            
            <div className="flex items-center gap-3">
              <Button 
                onClick={() => submitMutation.mutate({ problem: activeProblem, code: userCode })}
                disabled={!userCode.trim() || submitMutation.isPending}
                className="min-w-[120px]"
              >
                {submitMutation.isPending ? 'Submitting...' : 'Submit Code'}
              </Button>
              
              <Button variant="outline" onClick={() => { setUserCode(''); setSubmitResult(null); }}>
                <RotateCcw className="h-4 w-4 mr-2" /> Reset
              </Button>

              {activeProblem.hints.length > 0 && (
                <Button variant="outline" onClick={() => setShowHint(!showHint)}>
                  <Lightbulb className={`h-4 w-4 mr-2 ${showHint ? 'text-yellow-500' : ''}`} />
                  {showHint ? 'Hide Hint' : 'Show Hint'}
                </Button>
              )}

              {activeProblem.solution && (
                <Button variant="ghost" onClick={() => setShowSolution(!showSolution)} className="ml-auto text-primary">
                  {showSolution ? 'Hide Reference Solution' : 'View Reference Solution'}
                </Button>
              )}
            </div>

            {submitResult && (
              <div className={`p-4 rounded-xl border animate-in zoom-in-95 duration-300 ${
                submitResult === 'correct' 
                  ? 'bg-green-500/10 border-green-500/20 text-green-400' 
                  : 'bg-red-500/10 border-red-500/20 text-red-400'
              }`}>
                <div className="flex items-center gap-2 font-bold mb-1">
                  {submitResult === 'correct' ? <CheckCircle className="h-5 w-5" /> : <Star className="h-5 w-5" />}
                  {submitResult === 'correct' ? 'Perfect Solution!' : 'Not quite right'}
                </div>
                <p className="text-sm opacity-90">
                  {submitResult === 'correct' 
                    ? `Great job! You've earned ${activeProblem.xpReward} XP and maintained your streak.` 
                    : 'Check the problem requirements or hints and try again.'}
                </p>
              </div>
            )}

            {showHint && activeProblem.hints.length > 0 && (
              <div className="p-4 rounded-xl bg-yellow-500/10 border border-yellow-500/20 text-yellow-600 dark:text-yellow-400 animate-in fade-in duration-300">
                <h5 className="font-bold text-sm mb-2 flex items-center gap-2">
                  <Lightbulb className="h-4 w-4" /> Useful Hints
                </h5>
                <ul className="list-disc list-inside space-y-1 text-sm">
                  {activeProblem.hints.map((hint, idx) => (
                    <li key={idx} className="opacity-90">{hint}</li>
                  ))}
                </ul>
              </div>
            )}

            {showSolution && activeProblem.solution && (
              <div className="p-4 rounded-xl bg-muted border border-border animate-in fade-in duration-300">
                <h5 className="font-bold text-sm mb-2">Reference Solution</h5>
                <pre className="text-xs font-mono whitespace-pre-wrap bg-background p-4 rounded-lg overflow-auto">
                  {activeProblem.solution}
                </pre>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <header>
        <h1 className="text-3xl font-bold tracking-tight mb-2">Daily Practice</h1>
        <p className="text-muted-foreground">Solve problems daily to earn XP and climb the developer ranks.</p>
      </header>

      {/* Featured Daily Challenge */}
      {isLoading ? (
        <Skeleton className="h-48 w-full rounded-2xl" />
      ) : dailyProblem && (
        <Card className="bg-gradient-to-r from-primary/10 to-purple-500/10 border-primary/20 overflow-hidden relative group">
          <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity">
            <Trophy className="h-32 w-32" />
          </div>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-primary rounded-lg flex items-center justify-center">
                  <Star className="h-6 w-6 text-primary-foreground" />
                </div>
                <div>
                  <CardTitle>Today's Special Challenge</CardTitle>
                  <p className="text-muted-foreground text-sm">
                    {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
                  </p>
                </div>
              </div>
              <Badge className="bg-primary/20 text-primary font-bold px-3 py-1">+{dailyProblem.xpReward} XP BONUS</Badge>
            </div>
          </CardHeader>
          <CardContent>
            <h3 className="text-xl font-bold mb-2">{dailyProblem.title}</h3>
            <p className="text-muted-foreground mb-6 max-w-2xl line-clamp-2">{dailyProblem.description}</p>
            <div className="flex items-center gap-4">
              <Button onClick={() => openProblem(dailyProblem)} disabled={solvedIds.has(dailyProblem.id)} size="lg" className="px-8 shadow-lg shadow-primary/20">
                {solvedIds.has(dailyProblem.id) ? 'Already Completed' : 'Solve Challenge'}
              </Button>
              <div className="flex -space-x-2">
                {[1, 2, 3].map(i => (
                  <div key={i} className="w-8 h-8 rounded-full border-2 border-background bg-muted overflow-hidden">
                    <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${i * 123}`} alt="User" />
                  </div>
                ))}
                <div className="ml-4 text-sm text-muted-foreground flex items-center">
                  +124 others solved this today
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Categories & Filter */}
      <div className="flex items-center justify-between flex-wrap gap-4 bg-muted/30 p-2 rounded-2xl border border-border">
        <div className="flex flex-wrap gap-1">
          {CATEGORIES.map(cat => (
            <Button
              key={cat}
              variant={selectedCategory === cat ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setSelectedCategory(cat)}
              className="capitalize rounded-xl"
            >
              {cat}
            </Button>
          ))}
        </div>
      </div>

      {/* Problems Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <Skeleton key={i} className="h-48 w-full rounded-xl" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((problem) => {
            const solved = solvedIds.has(problem.id);
            return (
              <Card key={problem.id} className={`group card-hover overflow-hidden ${solved ? 'bg-muted/30' : ''}`}>
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-colors ${solved ? 'bg-green-500/20 text-green-500' : 'bg-primary/10 text-primary'}`}>
                        {solved ? <CheckCircle className="h-5 w-5" /> : <Code className="h-5 w-5" />}
                      </div>
                      <div>
                        <h3 className="font-bold group-hover:text-primary transition-colors">{problem.title}</h3>
                        <p className="text-muted-foreground text-xs">{problem.category}</p>
                      </div>
                    </div>
                    <Badge variant="secondary" className={DIFFICULTY_COLOR[problem.difficulty] || ''}>{problem.difficulty}</Badge>
                  </div>
                  <p className="text-muted-foreground text-sm mb-6 line-clamp-2">{problem.description}</p>
                  <div className="flex items-center justify-between mt-auto pt-4 border-t border-border">
                    <div className="flex items-center gap-1 text-sm font-bold text-primary">
                      <Flame className="h-4 w-4" /> {problem.xpReward} XP
                    </div>
                    <Button 
                      size="sm" 
                      variant={solved ? 'outline' : 'default'} 
                      onClick={() => openProblem(problem)}
                      className="rounded-lg px-4"
                    >
                      {solved ? 'Review' : 'Solve Now'}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      {/* Mastery Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: 'Problems Solved', value: solvedCount, icon: CheckCircle, color: 'text-green-500' },
          { label: 'Success Rate', value: `${successRate}%`, icon: Target, color: 'text-blue-500' },
          { label: 'Active Streak', value: `${user?.streak || 0} Days`, icon: Flame, color: 'text-orange-500' },
          { label: 'Current Level', value: user?.level || 1, icon: Trophy, color: 'text-yellow-500' },
        ].map((stat, idx) => (
          <Card key={idx} className="border-none bg-card/50 backdrop-blur-sm">
            <CardContent className="p-6 flex items-center gap-4">
              <div className={`p-3 rounded-2xl bg-background border border-border shadow-sm ${stat.color}`}>
                <stat.icon className="h-6 w-6" />
              </div>
              <div>
                <div className="text-2xl font-black">{stat.value}</div>
                <div className="text-xs text-muted-foreground uppercase tracking-wider">{stat.label}</div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

// Support items used in stats
function Trophy(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6" />
      <path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18" />
      <path d="M4 22h16" />
      <path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22" />
      <path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22" />
      <path d="M18 2H6v7a6 6 0 0 0 12 0V2Z" />
    </svg>
  );
}
