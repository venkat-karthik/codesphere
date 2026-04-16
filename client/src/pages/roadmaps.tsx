import { useState, useMemo } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Progress } from '@/components/ui/progress';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { BookOpen, Clock, ChevronRight, Route, CheckCircle2, Circle, Trophy } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { apiRequest } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';

interface RoadmapModule { id: string; title: string; completed: boolean; }
interface Roadmap {
  id: number; title: string; description: string; category: string;
  difficulty: string; estimatedTime: string | null;
  modules: RoadmapModule[];
}
interface UserProgress {
  progressPercentage: number;
  completedModules: string[];
  currentModule: string | null;
}

const diffColor: Record<string, string> = {
  Beginner: 'bg-green-500/20 text-green-600 border-0',
  Intermediate: 'bg-yellow-500/20 text-yellow-600 border-0',
  Advanced: 'bg-red-500/20 text-red-600 border-0',
};

export function Roadmaps() {
  const { user } = useAuth();
  const { toast } = useToast();
  const qc = useQueryClient();
  const [selected, setSelected] = useState<Roadmap | null>(null);

  const { data: roadmaps = [], isLoading } = useQuery<Roadmap[]>({
    queryKey: ['/api/roadmaps'],
  });

  // Fetch progress for all roadmaps
  const progressQueries = useMemo(() =>
    (roadmaps as Roadmap[]).map(r => ({
      roadmapId: r.id,
      queryKey: [`/api/roadmaps/${r.id}/progress/${user?.id}`],
    })), [roadmaps, user?.id]);

  const { data: allProgress = {} } = useQuery<Record<number, UserProgress>>({
    queryKey: [`/api/roadmaps/all-progress/${user?.id}`],
    queryFn: async () => {
      if (!user || !(roadmaps as Roadmap[]).length) return {};
      const results: Record<number, UserProgress> = {};
      await Promise.all((roadmaps as Roadmap[]).map(async r => {
        try {
          const res = await fetch(`/api/roadmaps/${r.id}/progress/${user.id}`, { credentials: 'include' });
          if (res.ok) {
            const data = await res.json();
            if (data) results[r.id] = data;
          }
        } catch {}
      }));
      return results;
    },
    enabled: !!user && (roadmaps as Roadmap[]).length > 0,
  });

  const toggleModuleMutation = useMutation({
    mutationFn: async ({ roadmapId, moduleId, completed }: { roadmapId: number; moduleId: string; completed: boolean }) => {
      if (!user) throw new Error('Not logged in');
      const current = allProgress[roadmapId];
      const completedModules = current?.completedModules || [];
      const updated = completed
        ? [...completedModules, moduleId]
        : completedModules.filter((m: string) => m !== moduleId);
      const pct = Math.round((updated.length / (selected?.modules.length || 1)) * 100);
      const res = await apiRequest('POST', `/api/roadmaps/${roadmapId}/progress/${user.id}`, {
        completedModules: updated,
        progressPercentage: pct,
        currentModule: moduleId,
      });
      return res.json();
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: [`/api/roadmaps/all-progress/${user?.id}`] });
    },
    onError: () => toast({ title: 'Failed to save progress', variant: 'destructive' }),
  });

  const getProgress = (roadmapId: number): number => {
    return allProgress[roadmapId]?.progressPercentage || 0;
  };

  const getCompletedModules = (roadmapId: number): string[] => {
    return allProgress[roadmapId]?.completedModules || [];
  };

  const totalCompleted = Object.values(allProgress).filter(p => p.progressPercentage === 100).length;

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-bold mb-1">Learning Roadmaps</h1>
          <p className="text-muted-foreground">Structured paths to master any technology stack.</p>
        </div>
        {user && (
          <div className="text-right">
            <p className="text-2xl font-bold text-primary">{totalCompleted}</p>
            <p className="text-xs text-muted-foreground">Paths completed</p>
          </div>
        )}
      </div>

      {isLoading ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => <Skeleton key={i} className="h-56 rounded-xl" />)}
        </div>
      ) : (roadmaps as Roadmap[]).length === 0 ? (
        <Card><CardContent className="p-12 text-center">
          <Route className="h-12 w-12 mx-auto mb-4 text-muted-foreground opacity-30" />
          <p className="font-semibold">No roadmaps yet</p>
        </CardContent></Card>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {(roadmaps as Roadmap[]).map(r => {
            const pct = getProgress(r.id);
            const completedMods = getCompletedModules(r.id);
            const total = r.modules?.length || 0;
            return (
              <Card key={r.id} className="hover:shadow-lg transition-shadow cursor-pointer group"
                onClick={() => setSelected(r)}>
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between gap-2">
                    <CardTitle className="text-base leading-tight">{r.title}</CardTitle>
                    <div className="flex items-center gap-1 shrink-0">
                      {pct === 100 && <Trophy className="h-4 w-4 text-yellow-500" />}
                      <Badge className={`text-xs ${diffColor[r.difficulty] || 'bg-gray-500/20 text-gray-500 border-0'}`}>
                        {r.difficulty}
                      </Badge>
                    </div>
                  </div>
                  <Badge variant="outline" className="w-fit text-xs">{r.category}</Badge>
                </CardHeader>
                <CardContent className="space-y-3">
                  <p className="text-sm text-muted-foreground line-clamp-2">{r.description}</p>
                  {r.estimatedTime && (
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Clock className="h-3 w-3" />{r.estimatedTime}
                    </div>
                  )}
                  <div>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-muted-foreground">{completedMods.length}/{total} modules</span>
                      <span className="font-medium text-primary">{pct}%</span>
                    </div>
                    <Progress value={pct} className="h-1.5" />
                  </div>
                  <Button size="sm" className="w-full">
                    {pct === 100 ? <><Trophy className="h-3 w-3 mr-1" />Completed!</>
                      : pct > 0 ? <>Continue Path <ChevronRight className="h-3 w-3 ml-1" /></>
                      : <>Start Path <ChevronRight className="h-3 w-3 ml-1" /></>}
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      {/* Roadmap Detail Modal */}
      <Dialog open={!!selected} onOpenChange={open => !open && setSelected(null)}>
        <DialogContent className="max-w-lg max-h-[80vh] overflow-y-auto">
          {selected && (
            <>
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  {selected.title}
                  <Badge className={`text-xs ${diffColor[selected.difficulty] || ''}`}>{selected.difficulty}</Badge>
                </DialogTitle>
              </DialogHeader>
              <p className="text-sm text-muted-foreground">{selected.description}</p>
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">{getCompletedModules(selected.id).length}/{selected.modules.length} modules</span>
                <span className="font-semibold text-primary">{getProgress(selected.id)}% complete</span>
              </div>
              <Progress value={getProgress(selected.id)} className="h-2" />
              <div className="space-y-2 mt-2">
                {selected.modules.map((mod, idx) => {
                  const isDone = getCompletedModules(selected.id).includes(mod.id);
                  return (
                    <div key={mod.id}
                      className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-all hover:bg-muted/50 ${isDone ? 'border-green-500/30 bg-green-500/5' : 'border-border'}`}
                      onClick={() => user && toggleModuleMutation.mutate({ roadmapId: selected.id, moduleId: mod.id, completed: !isDone })}>
                      {isDone
                        ? <CheckCircle2 className="h-5 w-5 text-green-500 shrink-0" />
                        : <Circle className="h-5 w-5 text-muted-foreground shrink-0" />}
                      <div className="flex-1">
                        <p className={`text-sm font-medium ${isDone ? 'line-through text-muted-foreground' : ''}`}>
                          {idx + 1}. {mod.title}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
              {!user && <p className="text-xs text-muted-foreground text-center mt-2">Sign in to track your progress</p>}
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
