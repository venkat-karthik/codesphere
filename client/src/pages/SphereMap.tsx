import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Skeleton } from '@/components/ui/skeleton';
import { Globe, MapPin, Users, Star, TrendingUp, Award, Code, Zap, Target, Brain, Rocket } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';

interface Roadmap {
  id: number;
  title: string;
  description: string;
  category: string;
  difficulty: string;
  estimatedTime: string | null;
  modules: { id: string; title: string; completed: boolean }[];
}

interface UserProgress {
  roadmapId: number;
  progressPercentage: number;
  completedModules: string[];
}

const ICONS: Record<string, any> = {
  'Frontend Developer': Code,
  'Backend Developer': Brain,
  'Full Stack Developer': Rocket,
  'Data Science': Zap,
  'DevOps Engineer': Target,
};

const COLORS: Record<string, string> = {
  'Frontend Developer': 'from-blue-500 to-cyan-500',
  'Backend Developer': 'from-green-500 to-emerald-500',
  'Full Stack Developer': 'from-purple-500 to-pink-500',
  'Data Science': 'from-orange-500 to-red-500',
  'DevOps Engineer': 'from-indigo-500 to-blue-600',
};

const DIFF_COLORS: Record<string, string> = {
  Beginner: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
  Intermediate: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
  Advanced: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
};

export function SphereMap() {
  const { user } = useAuth();
  const [selectedPath, setSelectedPath] = useState<number | null>(null);

  const { data: roadmaps = [], isLoading } = useQuery<Roadmap[]>({
    queryKey: ['/api/roadmaps'],
  });

  // Fetch progress for all roadmaps if logged in
  const { data: allProgress = [] } = useQuery<UserProgress[]>({
    queryKey: [`/api/users/${user?.id}/all-progress`],
    enabled: false, // We'll fetch per-roadmap lazily
  });

  const getProgress = (roadmapId: number) => 0; // Will be populated when user opens a roadmap

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          CodeSphere Learning Map
        </h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Navigate your learning journey through interconnected skill paths
        </p>
      </div>

      {/* Stats from real data */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card><CardContent className="p-4 text-center">
          <Globe className="h-8 w-8 text-blue-500 mx-auto mb-2" />
          <div className="text-2xl font-bold">{(roadmaps as Roadmap[]).length}</div>
          <div className="text-sm text-muted-foreground">Learning Paths</div>
        </CardContent></Card>
        <Card><CardContent className="p-4 text-center">
          <Target className="h-8 w-8 text-green-500 mx-auto mb-2" />
          <div className="text-2xl font-bold">
            {(roadmaps as Roadmap[]).reduce((acc, r) => acc + r.modules.length, 0)}
          </div>
          <div className="text-sm text-muted-foreground">Total Modules</div>
        </CardContent></Card>
        <Card><CardContent className="p-4 text-center">
          <Star className="h-8 w-8 text-yellow-500 mx-auto mb-2" />
          <div className="text-2xl font-bold">
            {(roadmaps as Roadmap[]).filter(r => r.difficulty === 'Beginner').length}
          </div>
          <div className="text-sm text-muted-foreground">Beginner Paths</div>
        </CardContent></Card>
        <Card><CardContent className="p-4 text-center">
          <Award className="h-8 w-8 text-purple-500 mx-auto mb-2" />
          <div className="text-2xl font-bold">
            {(roadmaps as Roadmap[]).filter(r => r.difficulty === 'Advanced').length}
          </div>
          <div className="text-sm text-muted-foreground">Advanced Paths</div>
        </CardContent></Card>
      </div>

      <Tabs defaultValue="paths">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="paths">Learning Paths</TabsTrigger>
          <TabsTrigger value="global">Global Map</TabsTrigger>
        </TabsList>

        <TabsContent value="paths">
          {isLoading ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mt-4">
              {[...Array(5)].map((_, i) => <Card key={i}><CardContent className="p-6"><Skeleton className="h-48 w-full" /></CardContent></Card>)}
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mt-4">
              {(roadmaps as Roadmap[]).map(path => {
                const Icon = ICONS[path.title] || Code;
                const color = COLORS[path.title] || 'from-gray-500 to-gray-600';
                const progress = getProgress(path.id);
                return (
                  <Card key={path.id} className="cursor-pointer hover:shadow-lg transition-all hover:scale-105"
                    onClick={() => setSelectedPath(selectedPath === path.id ? null : path.id)}>
                    <CardContent className="p-6">
                      <div className={`w-12 h-12 rounded-lg bg-gradient-to-r ${color} flex items-center justify-center mb-3`}>
                        <Icon className="h-6 w-6 text-white" />
                      </div>
                      <h3 className="text-lg font-bold mb-1">{path.title}</h3>
                      <Badge className={DIFF_COLORS[path.difficulty] || ''} variant="secondary">
                        {path.difficulty}
                      </Badge>
                      <p className="text-muted-foreground text-sm my-3 line-clamp-2">{path.description}</p>

                      <div className="space-y-2 text-sm mb-4">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Modules</span>
                          <span className="font-medium">{path.modules.length}</span>
                        </div>
                        {path.estimatedTime && (
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Duration</span>
                            <span className="font-medium">{path.estimatedTime}</span>
                          </div>
                        )}
                      </div>

                      {progress > 0 && (
                        <div className="mb-3">
                          <div className="flex justify-between text-xs mb-1">
                            <span>Progress</span><span>{progress}%</span>
                          </div>
                          <Progress value={progress} className="h-2" />
                        </div>
                      )}

                      {selectedPath === path.id && (
                        <div className="mt-3 border-t pt-3 space-y-1">
                          {path.modules.map(m => (
                            <div key={m.id} className="flex items-center gap-2 text-xs text-muted-foreground">
                              <div className="w-1.5 h-1.5 rounded-full bg-primary shrink-0" />
                              {m.title}
                            </div>
                          ))}
                        </div>
                      )}

                      <Button className="w-full mt-4" variant={progress > 0 ? 'default' : 'outline'}>
                        {progress > 0 ? 'Continue Learning' : 'Start Path'}
                      </Button>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </TabsContent>

        <TabsContent value="global">
          <Card className="mt-4">
            <CardHeader><CardTitle className="flex items-center gap-2"><MapPin className="h-5 w-5" />Global Learning Activity</CardTitle></CardHeader>
            <CardContent>
              <div className="h-80 bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-lg flex items-center justify-center">
                <div className="text-center">
                  <Globe className="h-16 w-16 text-blue-500 mx-auto mb-4 animate-pulse" />
                  <h3 className="text-xl font-semibold mb-2">Interactive World Map</h3>
                  <p className="text-muted-foreground max-w-md text-sm">
                    Real-time global learning activity visualization — coming in Phase 4.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
