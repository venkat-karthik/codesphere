import { useQuery } from '@tanstack/react-query';
import { useLocation } from 'wouter';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Progress } from '@/components/ui/progress';
import { BookOpen, Clock, ChevronRight, Route } from 'lucide-react';

interface Roadmap {
  id: number;
  title: string;
  description: string;
  category: string;
  difficulty: string;
  estimatedTime: string | null;
  modules: { id: string; title: string; completed: boolean }[];
}

const diffColor: Record<string, string> = {
  Beginner: 'bg-green-500/20 text-green-600 border-0',
  Intermediate: 'bg-yellow-500/20 text-yellow-600 border-0',
  Advanced: 'bg-red-500/20 text-red-600 border-0',
};

export function Roadmaps() {
  const [, setLocation] = useLocation();
  const { data: roadmaps = [], isLoading } = useQuery<Roadmap[]>({
    queryKey: ['/api/roadmaps'],
  });

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-1">Learning Roadmaps</h1>
        <p className="text-muted-foreground">Structured paths to master any technology stack.</p>
      </div>

      {isLoading ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => <Skeleton key={i} className="h-48 rounded-xl" />)}
        </div>
      ) : (roadmaps as Roadmap[]).length === 0 ? (
        <Card><CardContent className="p-12 text-center">
          <Route className="h-12 w-12 mx-auto mb-4 text-muted-foreground opacity-30" />
          <p className="font-semibold">No roadmaps yet</p>
        </CardContent></Card>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {(roadmaps as Roadmap[]).map(r => {
            const total = r.modules?.length || 0;
            const done = r.modules?.filter(m => m.completed).length || 0;
            const pct = total > 0 ? Math.round((done / total) * 100) : 0;
            return (
              <Card key={r.id} className="hover:shadow-lg transition-shadow cursor-pointer group"
                onClick={() => setLocation('/learning/roadmaps')}>
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between gap-2">
                    <CardTitle className="text-base leading-tight">{r.title}</CardTitle>
                    <Badge className={`text-xs shrink-0 ${diffColor[r.difficulty] || 'bg-gray-500/20 text-gray-500 border-0'}`}>
                      {r.difficulty}
                    </Badge>
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
                      <span className="text-muted-foreground">{total} modules</span>
                      <span className="font-medium">{pct}%</span>
                    </div>
                    <Progress value={pct} className="h-1.5" />
                  </div>
                  <Button size="sm" className="w-full group-hover:bg-primary/90">
                    {pct > 0 ? 'Continue' : 'Start'} Path <ChevronRight className="h-3 w-3 ml-1" />
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
