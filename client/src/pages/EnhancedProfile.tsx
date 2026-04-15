import { useState, useRef } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { Skeleton } from '@/components/ui/skeleton';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  User, Flame, Trophy, Target, Code, BookOpen,
  TrendingUp, Clock, CheckCircle, BarChart3, Award,
  Zap, Star, Users, Camera, Loader2
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { apiRequest } from '@/lib/queryClient';

interface AnalyticsRecord {
  id: number;
  date: string;
  studyTimeMinutes: number;
  problemsAttempted: number;
  problemsSolved: number;
  xpEarned: number;
}

interface UserSolution {
  id: number;
  problemId: number;
  isCorrect: boolean;
  xpEarned: number;
  submittedAt: string;
}

interface UserProject {
  id: number;
  name: string;
  description: string | null;
  language: string;
  framework: string | null;
  createdAt: string;
}

export function EnhancedProfile() {
  const { user, updateUser } = useAuth();
  const { toast } = useToast();
  const qc = useQueryClient();
  const [activeTab, setActiveTab] = useState('overview');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const avatarMutation = useMutation({
    mutationFn: async (file: File) => {
      // Convert to base64
      const base64 = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => {
          const result = reader.result as string;
          // Strip the data URL prefix to get pure base64
          resolve(result.split(',')[1]);
        };
        reader.onerror = reject;
        reader.readAsDataURL(file);
      });

      const res = await apiRequest('POST', `/api/users/${user!.id}/avatar`, {
        imageData: base64,
        mimeType: file.type,
      });
      return res.json();
    },
    onSuccess: (data) => {
      updateUser({ profileImage: data.profileImage });
      toast({ title: 'Avatar updated!' });
    },
    onError: (err: any) => {
      toast({ title: 'Upload failed', description: err.message, variant: 'destructive' });
    },
  });

  const { data: solutions = [], isLoading: solutionsLoading } = useQuery<UserSolution[]>({
    queryKey: [`/api/users/${user?.id}/solutions`],
    enabled: !!user && user.id > 0,
  });

  const { data: analytics = [], isLoading: analyticsLoading } = useQuery<AnalyticsRecord[]>({
    queryKey: [`/api/analytics/users/${user?.id}`],
    enabled: !!user && user.id > 0,
  });

  const { data: projects = [], isLoading: projectsLoading } = useQuery<UserProject[]>({
    queryKey: ['/api/projects'],
    enabled: !!user,
  });

  if (!user) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-muted-foreground">Sign in to view your profile.</p>
      </div>
    );
  }

  const solvedCount = (solutions as UserSolution[]).filter(s => s.isCorrect).length;
  const totalAttempts = (solutions as UserSolution[]).length;
  const successRate = totalAttempts > 0 ? Math.round((solvedCount / totalAttempts) * 100) : 0;
  const nextLevelXP = user.level * 1000;
  const xpProgress = Math.min((user.xp / nextLevelXP) * 100, 100);

  // Aggregate analytics
  const totalStudyMinutes = (analytics as AnalyticsRecord[]).reduce((s, r) => s + r.studyTimeMinutes, 0);
  const totalXpFromAnalytics = (analytics as AnalyticsRecord[]).reduce((s, r) => s + r.xpEarned, 0);
  const studyHours = Math.floor(totalStudyMinutes / 60);
  const studyMins = totalStudyMinutes % 60;

  // Last 7 days activity
  const last7 = (analytics as AnalyticsRecord[]).slice(-7);

  const formatDate = (d: string) => new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });

  // Achievements based on real data
  const achievements = [
    { id: 'first-solve', title: 'First Steps', desc: 'Solve your first problem', icon: Target, earned: solvedCount >= 1, rarity: 'common' },
    { id: 'ten-solves', title: 'Problem Solver', desc: 'Solve 10 problems', icon: Code, earned: solvedCount >= 10, rarity: 'rare' },
    { id: 'fifty-solves', title: 'Code Warrior', desc: 'Solve 50 problems', icon: Trophy, earned: solvedCount >= 50, rarity: 'epic' },
    { id: 'streak-7', title: 'Week Warrior', desc: 'Maintain a 7-day streak', icon: Flame, earned: user.streak >= 7, rarity: 'rare' },
    { id: 'streak-30', title: 'Streak Master', desc: 'Maintain a 30-day streak', icon: Flame, earned: user.streak >= 30, rarity: 'epic' },
    { id: 'level-5', title: 'Rising Star', desc: 'Reach Level 5', icon: Star, earned: user.level >= 5, rarity: 'rare' },
    { id: 'level-10', title: 'Expert Coder', desc: 'Reach Level 10', icon: Award, earned: user.level >= 10, rarity: 'legendary' },
    { id: 'first-project', title: 'Builder', desc: 'Create your first project', icon: Zap, earned: (projects as UserProject[]).length >= 1, rarity: 'common' },
    { id: 'study-hour', title: 'Dedicated', desc: 'Study for 60+ minutes', icon: Clock, earned: totalStudyMinutes >= 60, rarity: 'common' },
    { id: 'community', title: 'Community Member', desc: 'Join CodeSphere', icon: Users, earned: true, rarity: 'common' },
  ];

  const earnedAchievements = achievements.filter(a => a.earned);

  const rarityColor: Record<string, string> = {
    common: 'bg-gray-500/20 text-gray-400 border-gray-500/30',
    rare: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
    epic: 'bg-purple-500/20 text-purple-400 border-purple-500/30',
    legendary: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">

      {/* Profile Header */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-6">
            <div className="flex flex-col items-center md:items-start gap-3">
              {/* Clickable avatar with upload overlay */}
              <div className="relative group cursor-pointer" onClick={() => fileInputRef.current?.click()}>
                <Avatar className="w-20 h-20 ring-2 ring-primary/20 group-hover:ring-primary/60 transition-all">
                  <AvatarImage src={user.profileImage || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.email}`} />
                  <AvatarFallback className="bg-primary text-primary-foreground text-2xl font-bold">
                    {user.firstName[0]}{user.lastName[0]}
                  </AvatarFallback>
                </Avatar>
                <div className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  {avatarMutation.isPending
                    ? <Loader2 className="h-5 w-5 text-white animate-spin" />
                    : <Camera className="h-5 w-5 text-white" />
                  }
                </div>
              </div>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/png,image/webp,image/gif"
                className="hidden"
                onChange={e => {
                  const file = e.target.files?.[0];
                  if (file) avatarMutation.mutate(file);
                  e.target.value = '';
                }}
              />
              <p className="text-xs text-muted-foreground">Click avatar to change</p>
              <div className="text-center md:text-left">
                <h1 className="text-2xl font-bold">{user.firstName} {user.lastName}</h1>
                <p className="text-muted-foreground text-sm">{user.email}</p>
                <div className="flex items-center gap-2 mt-1">
                  <Badge variant="outline">{user.role}</Badge>
                  <Badge className={user.subscriptionType === 'free' ? 'bg-gray-500/20 text-gray-400' : 'bg-purple-500/20 text-purple-400'}>
                    {user.subscriptionType}
                  </Badge>
                </div>
              </div>
            </div>

            <div className="flex-1 grid grid-cols-2 md:grid-cols-4 gap-3">
              <div className="text-center p-3 bg-muted/50 rounded-lg">
                <div className="text-2xl font-bold text-primary">Lv {user.level}</div>
                <div className="text-xs text-muted-foreground">Level</div>
              </div>
              <div className="text-center p-3 bg-muted/50 rounded-lg">
                <div className="text-2xl font-bold text-orange-500">{user.streak}</div>
                <div className="text-xs text-muted-foreground">Day Streak</div>
              </div>
              <div className="text-center p-3 bg-muted/50 rounded-lg">
                <div className="text-2xl font-bold text-green-500">{solvedCount}</div>
                <div className="text-xs text-muted-foreground">Solved</div>
              </div>
              <div className="text-center p-3 bg-muted/50 rounded-lg">
                <div className="text-2xl font-bold text-blue-500">{(projects as UserProject[]).length}</div>
                <div className="text-xs text-muted-foreground">Projects</div>
              </div>
            </div>
          </div>

          {/* XP Bar */}
          <div className="mt-5">
            <div className="flex justify-between text-sm mb-1">
              <span className="font-medium">Level {user.level} Progress</span>
              <span className="text-muted-foreground">{user.xp} / {nextLevelXP} XP</span>
            </div>
            <Progress value={xpProgress} className="h-2" />
            <p className="text-xs text-muted-foreground mt-1">{nextLevelXP - user.xp} XP to Level {user.level + 1}</p>
          </div>
        </CardContent>
      </Card>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="achievements">Achievements</TabsTrigger>
          <TabsTrigger value="projects">Projects</TabsTrigger>
        </TabsList>

        {/* Overview */}
        <TabsContent value="overview" className="space-y-6 mt-4">
          <div className="grid md:grid-cols-2 gap-6">
            <Card>
              <CardHeader><CardTitle className="flex items-center gap-2 text-base"><BarChart3 className="h-4 w-4" />Quick Stats</CardTitle></CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between text-sm"><span className="text-muted-foreground">Total XP</span><span className="font-semibold">{user.xp.toLocaleString()}</span></div>
                <div className="flex justify-between text-sm"><span className="text-muted-foreground">Problems Attempted</span><span className="font-semibold">{totalAttempts}</span></div>
                <div className="flex justify-between text-sm"><span className="text-muted-foreground">Success Rate</span><span className="font-semibold text-green-500">{successRate}%</span></div>
                <div className="flex justify-between text-sm"><span className="text-muted-foreground">Study Time</span><span className="font-semibold">{studyHours}h {studyMins}m</span></div>
                <div className="flex justify-between text-sm"><span className="text-muted-foreground">Achievements</span><span className="font-semibold">{earnedAchievements.length}/{achievements.length}</span></div>
                <div className="flex justify-between text-sm"><span className="text-muted-foreground">Current Streak</span><span className="font-semibold text-orange-500">{user.streak} days 🔥</span></div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader><CardTitle className="flex items-center gap-2 text-base"><Award className="h-4 w-4" />Recent Achievements</CardTitle></CardHeader>
              <CardContent>
                {earnedAchievements.length === 0 ? (
                  <p className="text-sm text-muted-foreground">Solve problems and stay active to earn achievements!</p>
                ) : (
                  <div className="space-y-2">
                    {earnedAchievements.slice(0, 5).map(a => {
                      const Icon = a.icon;
                      return (
                        <div key={a.id} className={`flex items-center gap-3 p-2 rounded border ${rarityColor[a.rarity]}`}>
                          <Icon className="h-4 w-4 shrink-0" />
                          <div>
                            <p className="text-xs font-semibold">{a.title}</p>
                            <p className="text-xs opacity-70">{a.desc}</p>
                          </div>
                          <CheckCircle className="h-4 w-4 ml-auto shrink-0" />
                        </div>
                      );
                    })}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Analytics */}
        <TabsContent value="analytics" className="space-y-6 mt-4">
          {analyticsLoading ? (
            <div className="space-y-3">{[...Array(3)].map((_, i) => <Skeleton key={i} className="h-20 w-full" />)}</div>
          ) : (analytics as AnalyticsRecord[]).length === 0 ? (
            <Card><CardContent className="p-12 text-center">
              <TrendingUp className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
              <p className="font-semibold">No activity yet</p>
              <p className="text-sm text-muted-foreground mt-1">Solve problems and study to see your analytics here.</p>
            </CardContent></Card>
          ) : (
            <>
              <div className="grid md:grid-cols-3 gap-4">
                <Card><CardContent className="p-5 text-center">
                  <div className="text-3xl font-bold text-primary">{studyHours}h {studyMins}m</div>
                  <div className="text-sm text-muted-foreground mt-1">Total Study Time</div>
                </CardContent></Card>
                <Card><CardContent className="p-5 text-center">
                  <div className="text-3xl font-bold text-green-500">{solvedCount}</div>
                  <div className="text-sm text-muted-foreground mt-1">Problems Solved</div>
                </CardContent></Card>
                <Card><CardContent className="p-5 text-center">
                  <div className="text-3xl font-bold text-purple-500">{totalXpFromAnalytics.toLocaleString()}</div>
                  <div className="text-sm text-muted-foreground mt-1">XP Earned (tracked)</div>
                </CardContent></Card>
              </div>

              <Card>
                <CardHeader><CardTitle className="text-base">Last 7 Days Activity</CardTitle></CardHeader>
                <CardContent>
                  {last7.length === 0 ? (
                    <p className="text-sm text-muted-foreground">No activity in the last 7 days.</p>
                  ) : (
                    <div className="space-y-3">
                      {last7.map(r => (
                        <div key={r.id} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg text-sm">
                          <span className="text-muted-foreground">{formatDate(r.date)}</span>
                          <div className="flex gap-4">
                            <span>{Math.floor(r.studyTimeMinutes / 60)}h {r.studyTimeMinutes % 60}m study</span>
                            <span className="text-green-500">{r.problemsSolved} solved</span>
                            <span className="text-primary">+{r.xpEarned} XP</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </>
          )}
        </TabsContent>

        {/* Achievements */}
        <TabsContent value="achievements" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span className="flex items-center gap-2"><Trophy className="h-5 w-5" />All Achievements</span>
                <Badge variant="secondary">{earnedAchievements.length}/{achievements.length} Earned</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-3">
                {achievements.map(a => {
                  const Icon = a.icon;
                  return (
                    <div key={a.id} className={`flex items-start gap-3 p-4 border-2 rounded-lg ${a.earned ? rarityColor[a.rarity] : 'bg-muted/20 text-muted-foreground border-muted opacity-50'}`}>
                      <Icon className="h-6 w-6 mt-0.5 shrink-0" />
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <p className="font-semibold text-sm">{a.title}</p>
                          <Badge variant="outline" className="text-xs">{a.rarity}</Badge>
                        </div>
                        <p className="text-xs opacity-80 mt-0.5">{a.desc}</p>
                      </div>
                      {a.earned && <CheckCircle className="h-5 w-5 text-green-500 shrink-0" />}
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Projects */}
        <TabsContent value="projects" className="mt-4">
          {projectsLoading ? (
            <div className="space-y-3">{[...Array(3)].map((_, i) => <Skeleton key={i} className="h-24 w-full" />)}</div>
          ) : (projects as UserProject[]).length === 0 ? (
            <Card><CardContent className="p-12 text-center">
              <Code className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
              <p className="font-semibold">No projects yet</p>
              <p className="text-sm text-muted-foreground mt-1">Create projects in the Studio to see them here.</p>
            </CardContent></Card>
          ) : (
            <div className="grid md:grid-cols-2 gap-4">
              {(projects as UserProject[]).map(p => (
                <Card key={p.id}>
                  <CardContent className="p-5">
                    <h3 className="font-semibold mb-1">{p.name}</h3>
                    {p.description && <p className="text-sm text-muted-foreground mb-3">{p.description}</p>}
                    <div className="flex gap-2 flex-wrap">
                      <Badge variant="outline">{p.language}</Badge>
                      {p.framework && <Badge variant="secondary">{p.framework}</Badge>}
                    </div>
                    <p className="text-xs text-muted-foreground mt-2">
                      Created {new Date(p.createdAt).toLocaleDateString()}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
