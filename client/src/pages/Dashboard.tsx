import { useQuery } from '@tanstack/react-query';
import { useLocation } from 'wouter';
import { useEffect, useRef, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  Flame, Trophy, Zap, Target, BookOpen, Code, Play,
  ArrowRight, Star, TrendingUp, Clock, CheckCircle2,
  Bot, Users, ChevronRight, BarChart2, Puzzle
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useNotifications } from '@/contexts/NotificationsContext';
import Welcome from './Welcome';

interface Problem { id: number; title: string; difficulty: string; category: string; xpReward: number; isDaily: boolean; }
interface Roadmap { id: number; title: string; description: string; category: string; difficulty: string; }
interface LeaderboardEntry { id: number; firstName: string; lastName: string; level: number; xp: number; streak: number; rank: number; }
interface AnalyticsRecord { id: number; date: string; studyTimeMinutes: number; problemsSolved: number; xpEarned: number; }
interface UserSolution { id: number; problemId: number; isCorrect: boolean; xpEarned: number; }

export function Dashboard() {
  const { user, isAuthenticated } = useAuth();
  const [, setLocation] = useLocation();
  const { addNotification } = useNotifications();

  // Live session timer — counts seconds since page load
  const [sessionSecs, setSessionSecs] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setSessionSecs(s => s + 1), 1000);
    return () => clearInterval(t);
  }, []);
  const sessionMins = Math.floor(sessionSecs / 60);
  const sessionSecsDisplay = sessionSecs % 60;

  const { data: problems = [] } = useQuery<Problem[]>({ queryKey: ['/api/content/problems'] });
  const { data: roadmaps = [] } = useQuery<Roadmap[]>({ queryKey: ['/api/roadmaps'] });
  const { data: leaderboard = [] } = useQuery<LeaderboardEntry[]>({ queryKey: ['/api/analytics'] });
  const { data: solutions = [] } = useQuery<UserSolution[]>({
    queryKey: [`/api/users/${user?.id}/solutions`],
    enabled: !!user,
  });
  const { data: analytics = [] } = useQuery<AnalyticsRecord[]>({
    queryKey: [`/api/analytics/users/${user?.id}`],
    enabled: !!user,
  });

  if (!isAuthenticated) return <Welcome onOpenAuth={() => {}} />;
  if (!user) return null;

  const dailyProblem = problems.find(p => p.isDaily);
  const solvedIds = new Set(solutions.filter(s => s.isCorrect).map(s => s.problemId));
  const dailySolved = dailyProblem ? solvedIds.has(dailyProblem.id) : false;
  const totalSolved = solvedIds.size;
  const nextLevelXP = user.level * 1000;
  const xpProgress = Math.min((user.xp / nextLevelXP) * 100, 100);

  const recentActivity = (analytics as AnalyticsRecord[]).slice(-5).reverse();
  const totalStudyMins = (analytics as AnalyticsRecord[]).reduce((s, r) => s + r.studyTimeMinutes, 0);

  const diffColor: Record<string, string> = {
    Easy: 'text-green-600 bg-green-100 dark:bg-green-900/30',
    Medium: 'text-yellow-600 bg-yellow-100 dark:bg-yellow-900/30',
    Hard: 'text-red-600 bg-red-100 dark:bg-red-900/30',
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Welcome Banner */}
      <div className="rounded-2xl bg-gradient-to-br from-primary/20 via-primary/10 to-transparent border border-primary/20 p-6">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold">Welcome back, {user.firstName} 👋</h1>
            <p className="text-muted-foreground mt-1">
              {user.streak > 0 ? `🔥 ${user.streak}-day streak — keep it going!` : 'Start your streak by solving today\'s problem!'}
            </p>
          </div>
          <div className="flex gap-2">
            <Button onClick={() => setLocation('/practice/problems')}>
              <Puzzle className="h-4 w-4 mr-2" />Solve Today's Problem
            </Button>
            <Button variant="outline" onClick={() => setLocation('/mentor')}>
              <Bot className="h-4 w-4 mr-2" />AI Mentor
            </Button>
          </div>
        </div>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => setLocation('/profile')}>
          <CardContent className="p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
              <Zap className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="text-xl font-bold">{user.xp.toLocaleString()}</p>
              <p className="text-xs text-muted-foreground">Total XP</p>
            </div>
          </CardContent>
        </Card>
        <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => setLocation('/practice/problems')}>
          <CardContent className="p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-orange-500/10 flex items-center justify-center shrink-0">
              <Flame className="h-5 w-5 text-orange-500" />
            </div>
            <div>
              <p className="text-xl font-bold">{user.streak}</p>
              <p className="text-xs text-muted-foreground">Day Streak</p>
            </div>
          </CardContent>
        </Card>
        <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => setLocation('/practice/problems')}>
          <CardContent className="p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-green-500/10 flex items-center justify-center shrink-0">
              <CheckCircle2 className="h-5 w-5 text-green-500" />
            </div>
            <div>
              <p className="text-xl font-bold">{totalSolved}</p>
              <p className="text-xs text-muted-foreground">Solved</p>
            </div>
          </CardContent>
        </Card>
        <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => setLocation('/profile')}>
          <CardContent className="p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center shrink-0">
              <Trophy className="h-5 w-5 text-blue-500" />
            </div>
            <div>
              <p className="text-xl font-bold">Lv {user.level}</p>
              <p className="text-xs text-muted-foreground">Level</p>
            </div>
          </CardContent>
        </Card>
        {/* Study Time — live session + total from DB */}
        <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => setLocation('/profile')}>
          <CardContent className="p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-purple-500/10 flex items-center justify-center shrink-0">
              <Clock className="h-5 w-5 text-purple-500" />
            </div>
            <div>
              <p className="text-xl font-bold tabular-nums">
                {sessionMins}:{String(sessionSecsDisplay).padStart(2, '0')}
              </p>
              <p className="text-xs text-muted-foreground">
                Session · {Math.floor(totalStudyMins / 60)}h total
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Level Progress */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium">Level {user.level} → {user.level + 1}</span>
            <span className="text-sm text-muted-foreground">{user.xp} / {nextLevelXP} XP</span>
          </div>
          <Progress value={xpProgress} className="h-2.5" />
          <p className="text-xs text-muted-foreground mt-1">{nextLevelXP - user.xp} XP to next level</p>
        </CardContent>
      </Card>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Left Column */}
        <div className="lg:col-span-2 space-y-6">

          {/* Daily Problem */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center justify-between text-base">
                <span className="flex items-center gap-2"><Star className="h-4 w-4 text-yellow-500" />Daily Problem</span>
                <Button variant="ghost" size="sm" onClick={() => setLocation('/practice/problems')}>
                  All Problems <ArrowRight className="h-3 w-3 ml-1" />
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {!dailyProblem ? (
                <p className="text-sm text-muted-foreground">No daily problem today. Check back soon!</p>
              ) : (
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-semibold">{dailyProblem.title}</h3>
                      {dailySolved && <CheckCircle2 className="h-4 w-4 text-green-500" />}
                    </div>
                    <div className="flex gap-2">
                      <Badge className={`text-xs border-0 ${diffColor[dailyProblem.difficulty]}`}>{dailyProblem.difficulty}</Badge>
                      <Badge variant="outline" className="text-xs">{dailyProblem.category}</Badge>
                      <Badge className="text-xs bg-primary/10 text-primary border-0">+{dailyProblem.xpReward} XP</Badge>
                    </div>
                  </div>
                  <Button size="sm" onClick={() => setLocation('/practice/problems')} disabled={dailySolved}>
                    {dailySolved ? 'Solved ✓' : 'Solve Now'}
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Learning Paths */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center justify-between text-base">
                <span className="flex items-center gap-2"><BookOpen className="h-4 w-4" />Learning Paths</span>
                <Button variant="ghost" size="sm" onClick={() => setLocation('/learning/roadmaps')}>
                  View All <ArrowRight className="h-3 w-3 ml-1" />
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {(roadmaps as Roadmap[]).length === 0 ? (
                <p className="text-sm text-muted-foreground">No roadmaps available yet.</p>
              ) : (
                <div className="space-y-2">
                  {(roadmaps as Roadmap[]).slice(0, 3).map(r => (
                    <div key={r.id}
                      className="flex items-center justify-between p-3 rounded-lg border hover:bg-muted/50 cursor-pointer transition-colors"
                      onClick={() => setLocation('/learning/roadmaps')}>
                      <div>
                        <p className="font-medium text-sm">{r.title}</p>
                        <p className="text-xs text-muted-foreground">{r.category} · {r.difficulty}</p>
                      </div>
                      <ChevronRight className="h-4 w-4 text-muted-foreground" />
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Recent Activity */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center justify-between text-base">
                <span className="flex items-center gap-2"><BarChart2 className="h-4 w-4" />Recent Activity</span>
                <Button variant="ghost" size="sm" onClick={() => setLocation('/profile')}>
                  Full Analytics <ArrowRight className="h-3 w-3 ml-1" />
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {recentActivity.length === 0 ? (
                <div className="text-center py-6">
                  <TrendingUp className="h-8 w-8 text-muted-foreground mx-auto mb-2 opacity-30" />
                  <p className="text-sm text-muted-foreground">No activity yet. Start solving problems!</p>
                  <Button size="sm" className="mt-3" onClick={() => setLocation('/practice/problems')}>
                    Start Now
                  </Button>
                </div>
              ) : (
                <div className="space-y-2">
                  {recentActivity.map(r => (
                    <div key={r.id} className="flex items-center justify-between p-2.5 rounded-lg bg-muted/30 text-sm">
                      <span className="text-muted-foreground">{new Date(r.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
                      <div className="flex gap-4 text-xs">
                        {r.studyTimeMinutes > 0 && <span className="flex items-center gap-1"><Clock className="h-3 w-3" />{Math.floor(r.studyTimeMinutes / 60)}h {r.studyTimeMinutes % 60}m</span>}
                        {r.problemsSolved > 0 && <span className="text-green-500">{r.problemsSolved} solved</span>}
                        {r.xpEarned > 0 && <span className="text-primary font-medium">+{r.xpEarned} XP</span>}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* AI Workspace */}
          <Card className="border-primary/20 bg-gradient-to-br from-primary/5 to-transparent">
            <CardContent className="p-5">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center shrink-0">
                  <Bot className="h-6 w-6 text-primary" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold mb-1">AI Mentor Workspace</h3>
                  <p className="text-sm text-muted-foreground mb-3">
                    Get personalized help, code reviews, and explanations from your AI mentor.
                  </p>
                  <div className="flex gap-2 flex-wrap">
                    <Button size="sm" onClick={() => setLocation('/mentor')}>
                      <Bot className="h-3.5 w-3.5 mr-1.5" />Open AI Mentor
                    </Button>
                    <Button size="sm" variant="outline" onClick={() => setLocation('/studio')}>
                      <Code className="h-3.5 w-3.5 mr-1.5" />Project Studio
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column */}
        <div className="space-y-6">

          {/* User Card */}
          <Card>
            <CardContent className="p-5">
              <div className="flex items-center gap-3 mb-4">
                <Avatar className="h-12 w-12 ring-2 ring-primary/20">
                  <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user.email}`} />
                  <AvatarFallback className="bg-primary/20 text-primary font-bold">{user.firstName[0]}</AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-semibold">{user.firstName} {user.lastName}</p>
                  <p className="text-xs text-muted-foreground capitalize">{user.role} · {user.subscriptionType}</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2 text-center text-sm">
                <div className="p-2 bg-muted/50 rounded-lg">
                  <p className="font-bold text-orange-500">{user.streak}🔥</p>
                  <p className="text-xs text-muted-foreground">Streak</p>
                </div>
                <div className="p-2 bg-muted/50 rounded-lg">
                  <p className="font-bold text-primary">{(user.codeCoins ?? 0).toLocaleString()}</p>
                  <p className="text-xs text-muted-foreground">CodeCoins</p>
                </div>
              </div>
              <Button variant="outline" className="w-full mt-3" size="sm" onClick={() => setLocation('/profile')}>
                View Profile
              </Button>
            </CardContent>
          </Card>

          {/* Quick Links */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">Quick Access</CardTitle>
            </CardHeader>
            <CardContent className="space-y-1 p-3 pt-0">
              {[
                { label: 'Video Library', icon: Play, path: '/learning/videos' },
                { label: 'PDF Resources', icon: BookOpen, path: '/learning/resources' },
                { label: 'Live Classes', icon: Users, path: '/learning/live-classes' },
                { label: 'Community', icon: Users, path: '/community' },
                { label: 'CodeCoin Store', icon: Trophy, path: '/store' },
              ].map(item => (
                <button key={item.path}
                  className="w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-muted/50 transition-colors text-sm text-left"
                  onClick={() => setLocation(item.path)}>
                  <item.icon className="h-4 w-4 text-muted-foreground" />
                  <span>{item.label}</span>
                  <ChevronRight className="h-3 w-3 text-muted-foreground ml-auto" />
                </button>
              ))}
            </CardContent>
          </Card>

          {/* Leaderboard */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center justify-between text-sm">
                <span className="flex items-center gap-2"><Trophy className="h-4 w-4 text-yellow-500" />Top Learners</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-3 pt-0">
              {(leaderboard as LeaderboardEntry[]).length === 0 ? (
                <p className="text-xs text-muted-foreground text-center py-3">No data yet</p>
              ) : (
                <div className="space-y-2">
                  {(leaderboard as LeaderboardEntry[]).slice(0, 5).map((entry, i) => (
                    <div key={entry.id} className={`flex items-center gap-2 p-2 rounded-lg text-sm ${entry.id === user.id ? 'bg-primary/10 border border-primary/20' : ''}`}>
                      <span className={`w-5 text-center font-bold text-xs ${i === 0 ? 'text-yellow-500' : i === 1 ? 'text-gray-400' : i === 2 ? 'text-orange-400' : 'text-muted-foreground'}`}>
                        {i === 0 ? '🥇' : i === 1 ? '🥈' : i === 2 ? '🥉' : `#${i + 1}`}
                      </span>
                      <Avatar className="h-6 w-6">
                        <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${entry.firstName}`} />
                        <AvatarFallback className="text-[10px]">{entry.firstName[0]}</AvatarFallback>
                      </Avatar>
                      <span className="flex-1 truncate font-medium">{entry.firstName} {entry.lastName[0]}.</span>
                      <span className="text-xs text-primary font-semibold">{entry.xp.toLocaleString()} XP</span>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
