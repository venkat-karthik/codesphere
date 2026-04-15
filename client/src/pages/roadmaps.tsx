import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { PageError } from '@/components/PageState';
import { Progress } from '@/components/ui/progress';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Skeleton } from '@/components/ui/skeleton';
import {
  CheckCircle, Circle, ArrowRight, Search,
  Clock, Target, Star, Sparkles, Route
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { apiRequest } from '@/lib/queryClient';

interface RoadmapModule {
  id: string;
  title: string;
  completed: boolean;
}

interface Roadmap {
  id: number;
  title: string;
  description: string;
  category: string;
  difficulty: string;
  estimatedTime: string | null;
  modules: RoadmapModule[];
}

interface UserProgress {
  completedModules: string[];
  progressPercentage: number;
  currentModule: string | null;
}

const ICONS: Record<string, string> = {
  'Frontend Developer': '🎨',
  'Backend Developer': '⚙️',
  'Full Stack Developer': '🚀',
  'Data Science': '📊',
  'DevOps Engineer': '🔧',
  'Mobile Developer': '📱',
  'AI & Machine Learning': '🤖',
};

const COLORS: Record<string, string> = {
  'Beginner': 'from-orange-500 to-red-500',
  'Intermediate': 'from-blue-500 to-purple-500',
  'Advanced': 'from-green-500 to-emerald-500',
};

const SALARY: Record<string, string> = {
  'Frontend Developer': '$60k–$120k',
  'Backend Developer': '$70k–$140k',
  'Full Stack Developer': '$80k–$150k',
  'Data Science': '$85k–$160k',
  'DevOps Engineer': '$90k–$170k',
};

export function Roadmaps() {
  const { user } = useAuth();
  const qc = useQueryClient();
  const [searchTerm, setSearchTerm] = useState('');
  const [selected, setSelected] = useState<Roadmap | null>(null);
  const [userProgress, setUserProgress] = useState<UserProgress | null>(null);

  // ── Fetch all roadmaps from DB ──────────────────────────────────────────
  const { data: roadmaps = [], isLoading, isError, refetch } = useQuery<Roadmap[]>({
    queryKey: ['/api/roadmaps'],
  });

  // ── Fetch user progress when a roadmap is selected ──────────────────────
  const fetchProgress = async (roadmapId: number) => {
    if (!user) return;
    try {
      const res = await fetch(`/api/users/${user.id}/progress/${roadmapId}`, { credentials: 'include' });
      if (res.ok) {
        const data = await res.json();
        setUserProgress(data);
      } else {
        setUserProgress({ completedModules: [], progressPercentage: 0, currentModule: null });
      }
    } catch {
      setUserProgress({ completedModules: [], progressPercentage: 0, currentModule: null });
    }
  };

  // ── Mark a module complete ───────────────────────────────────────────────
  const completeModule = useMutation({
    mutationFn: async ({ roadmapId, moduleId }: { roadmapId: number; moduleId: string }) => {
      if (!user) return;
      const completed = [...(userProgress?.completedModules || []), moduleId];
      const roadmap = roadmaps.find(r => r.id === roadmapId);
      const pct = roadmap ? Math.round((completed.length / roadmap.modules.length) * 100) : 0;
      await apiRequest('POST', `/api/users/${user.id}/progress/${roadmapId}`, {
        completedModules: completed,
        progressPercentage: pct,
        currentModule: moduleId,
      });
      return { completed, pct };
    },
    onSuccess: (data) => {
      if (data) setUserProgress(prev => ({
        ...prev!,
        completedModules: data.completed,
        progressPercentage: data.pct,
      }));
    },
  });

  const handleOpen = async (roadmap: Roadmap) => {
    setSelected(roadmap);
    await fetchProgress(roadmap.id);
  };

  const filtered = roadmaps.filter(r =>
    r.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    r.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getDifficultyColor = (d: string) => {
    if (d === 'Beginner') return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
    if (d === 'Intermediate') return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
    return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
  };

  const getProgress = (roadmap: Roadmap) => {
    if (!user || !userProgress || selected?.id !== roadmap.id) return 0;
    return userProgress.progressPercentage;
  };

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold mb-2">Learning Roadmaps</h1>
          <p className="text-muted-foreground">Structured paths to your next career milestone</p>
        </div>
        <Badge variant="outline" className="flex items-center gap-1">
          <Sparkles className="h-3 w-3" />
          {roadmaps.length} Paths Available
        </Badge>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search roadmaps..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Grid */}
      {isError ? (
        <PageError message="Failed to load roadmaps" onRetry={refetch} />
      ) : isLoading ? (
        <div className="grid lg:grid-cols-3 md:grid-cols-2 gap-6">
          {[...Array(6)].map((_, i) => (
            <Card key={i}><CardContent className="p-6 space-y-3">
              <Skeleton className="h-12 w-12 rounded-lg" />
              <Skeleton className="h-5 w-3/4" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-9 w-full" />
            </CardContent></Card>
          ))}
        </div>
      ) : (
        <div className="grid lg:grid-cols-3 md:grid-cols-2 gap-6">
          {filtered.map((roadmap) => (
            <Card key={roadmap.id} className="card-hover cursor-pointer" onClick={() => handleOpen(roadmap)}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className={`w-12 h-12 bg-gradient-to-br ${COLORS[roadmap.difficulty] || 'from-gray-500 to-gray-600'} rounded-lg flex items-center justify-center text-2xl`}>
                    {ICONS[roadmap.title] || '📚'}
                  </div>
                  <Badge className={getDifficultyColor(roadmap.difficulty)} variant="outline">
                    {roadmap.difficulty}
                  </Badge>
                </div>

                <h3 className="text-xl font-semibold mb-2">{roadmap.title}</h3>
                <p className="text-muted-foreground text-sm mb-4 line-clamp-2">{roadmap.description}</p>

                <div className="space-y-2 mb-4 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Duration</span>
                    <span className="font-medium">{roadmap.estimatedTime || 'Self-paced'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Modules</span>
                    <span className="font-medium">{roadmap.modules.length}</span>
                  </div>
                  {SALARY[roadmap.title] && (
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Salary Range</span>
                      <span className="font-medium">{SALARY[roadmap.title]}</span>
                    </div>
                  )}
                </div>

                <Button className="w-full" variant="outline" onClick={(e) => { e.stopPropagation(); handleOpen(roadmap); }}>
                  View Roadmap <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Detail Dialog */}
      <Dialog open={!!selected} onOpenChange={(open) => { if (!open) { setSelected(null); setUserProgress(null); } }}>
        <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
          {selected && (
            <>
              <DialogHeader>
                <DialogTitle className="flex items-center gap-3 text-2xl">
                  <span>{ICONS[selected.title] || '📚'}</span>
                  {selected.title}
                </DialogTitle>
                <p className="text-muted-foreground">{selected.description}</p>
              </DialogHeader>

              <div className="grid grid-cols-3 gap-4 my-4">
                <Card><CardContent className="p-4 text-center">
                  <Clock className="h-6 w-6 mx-auto mb-1 text-blue-500" />
                  <p className="text-xs text-muted-foreground">Duration</p>
                  <p className="font-semibold text-sm">{selected.estimatedTime || 'Self-paced'}</p>
                </CardContent></Card>
                <Card><CardContent className="p-4 text-center">
                  <Target className="h-6 w-6 mx-auto mb-1 text-green-500" />
                  <p className="text-xs text-muted-foreground">Modules</p>
                  <p className="font-semibold text-sm">{selected.modules.length}</p>
                </CardContent></Card>
                <Card><CardContent className="p-4 text-center">
                  <Star className="h-6 w-6 mx-auto mb-1 text-yellow-500" />
                  <p className="text-xs text-muted-foreground">Difficulty</p>
                  <p className="font-semibold text-sm">{selected.difficulty}</p>
                </CardContent></Card>
              </div>

              {user && userProgress && (
                <div className="mb-4">
                  <div className="flex justify-between text-sm mb-1">
                    <span>Your Progress</span>
                    <span>{userProgress.progressPercentage}%</span>
                  </div>
                  <Progress value={userProgress.progressPercentage} />
                </div>
              )}

              <div className="space-y-3">
                <h3 className="font-semibold flex items-center gap-2">
                  <Route className="h-4 w-4" /> Learning Path
                </h3>
                {selected.modules.map((mod, idx) => {
                  const done = userProgress?.completedModules?.includes(mod.id) || false;
                  return (
                    <div key={mod.id} className={`flex items-center justify-between p-3 rounded-lg border ${done ? 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800' : 'border-border'}`}>
                      <div className="flex items-center gap-3">
                        {done
                          ? <CheckCircle className="h-5 w-5 text-green-500 shrink-0" />
                          : <Circle className="h-5 w-5 text-muted-foreground shrink-0" />
                        }
                        <span className={`text-sm font-medium ${done ? 'line-through text-muted-foreground' : ''}`}>
                          {mod.title}
                        </span>
                      </div>
                      {user && !done && (
                        <Button
                          size="sm"
                          variant="outline"
                          disabled={completeModule.isPending}
                          onClick={() => completeModule.mutate({ roadmapId: selected.id, moduleId: mod.id })}
                        >
                          Mark Done
                        </Button>
                      )}
                    </div>
                  );
                })}
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
