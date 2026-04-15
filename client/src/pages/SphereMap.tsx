import { useState, useRef, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Skeleton } from '@/components/ui/skeleton';
import { Globe, MapPin, Users, Star, TrendingUp, Award, Code, Zap, Target, Brain, Rocket } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import Globe3D from 'react-globe.gl';

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

// Simulated learner locations around the world
const LEARNER_POINTS = [
  { lat: 40.7128, lng: -74.0060, city: 'New York', learners: 1243 },
  { lat: 51.5074, lng: -0.1278, city: 'London', learners: 987 },
  { lat: 35.6762, lng: 139.6503, city: 'Tokyo', learners: 876 },
  { lat: 28.6139, lng: 77.2090, city: 'New Delhi', learners: 1456 },
  { lat: -23.5505, lng: -46.6333, city: 'São Paulo', learners: 654 },
  { lat: 48.8566, lng: 2.3522, city: 'Paris', learners: 743 },
  { lat: 37.7749, lng: -122.4194, city: 'San Francisco', learners: 892 },
  { lat: 1.3521, lng: 103.8198, city: 'Singapore', learners: 567 },
  { lat: -33.8688, lng: 151.2093, city: 'Sydney', learners: 432 },
  { lat: 55.7558, lng: 37.6173, city: 'Moscow', learners: 398 },
  { lat: 31.2304, lng: 121.4737, city: 'Shanghai', learners: 1102 },
  { lat: -26.2041, lng: 28.0473, city: 'Johannesburg', learners: 287 },
  { lat: 19.4326, lng: -99.1332, city: 'Mexico City', learners: 445 },
  { lat: 41.0082, lng: 28.9784, city: 'Istanbul', learners: 334 },
  { lat: 25.2048, lng: 55.2708, city: 'Dubai', learners: 521 },
  { lat: 13.7563, lng: 100.5018, city: 'Bangkok', learners: 389 },
  { lat: 52.5200, lng: 13.4050, city: 'Berlin', learners: 612 },
  { lat: 43.6532, lng: -79.3832, city: 'Toronto', learners: 478 },
  { lat: 6.5244, lng: 3.3792, city: 'Lagos', learners: 356 },
  { lat: 12.9716, lng: 77.5946, city: 'Bangalore', learners: 1678 },
];

function GlobeView() {
  const globeRef = useRef<any>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [width, setWidth] = useState(600);

  useEffect(() => {
    const update = () => {
      if (containerRef.current) setWidth(containerRef.current.offsetWidth);
    };
    update();
    window.addEventListener('resize', update);
    return () => window.removeEventListener('resize', update);
  }, []);

  useEffect(() => {
    if (globeRef.current) {
      globeRef.current.controls().autoRotate = true;
      globeRef.current.controls().autoRotateSpeed = 0.5;
      globeRef.current.pointOfView({ altitude: 2.5 }, 0);
    }
  }, []);

  return (
    <div ref={containerRef} className="relative w-full bg-[#0a0a1a] rounded-b-lg overflow-hidden" style={{ height: 480 }}>
      <Globe3D
        ref={globeRef}
        width={width}
        height={480}
        globeImageUrl="//unpkg.com/three-globe/example/img/earth-night.jpg"
        backgroundImageUrl="//unpkg.com/three-globe/example/img/night-sky.png"
        pointsData={LEARNER_POINTS}
        pointLat="lat"
        pointLng="lng"
        pointColor={() => '#4ade80'}
        pointAltitude={0.02}
        pointRadius={(d: any) => Math.sqrt(d.learners) / 30}
        pointLabel={(d: any) => `<div style="background:#1a1a2e;padding:8px 12px;border-radius:8px;border:1px solid #4ade80;color:#fff;font-size:13px"><b>${d.city}</b><br/>${d.learners.toLocaleString()} learners</div>`}
        atmosphereColor="#4ade80"
        atmosphereAltitude={0.15}
      />
      <div className="absolute bottom-4 left-4 right-4 flex flex-wrap gap-2 justify-center pointer-events-none">
        <div className="bg-black/60 backdrop-blur-sm text-white text-xs px-3 py-1.5 rounded-full border border-green-500/30">
          🌍 {LEARNER_POINTS.reduce((s, p) => s + p.learners, 0).toLocaleString()} active learners worldwide
        </div>
        <div className="bg-black/60 backdrop-blur-sm text-white text-xs px-3 py-1.5 rounded-full border border-green-500/30">
          📍 {LEARNER_POINTS.length} cities
        </div>
      </div>
    </div>
  );
}

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
          <Card className="mt-4 overflow-hidden">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="h-5 w-5" />Global Learning Activity
                <Badge variant="secondary" className="ml-auto text-xs">Live</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <GlobeView />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
