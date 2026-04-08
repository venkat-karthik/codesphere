import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';
import { Play, Search, Eye, Heart, Calendar, Upload, Video } from 'lucide-react';
import { useUserRole } from '@/contexts/UserRoleContext';
import { PageError } from '@/components/PageState';

interface VideoResource {
  id: number;
  title: string;
  description: string;
  category: string;
  difficulty: string;
  tags: string[];
  downloadCount: number;
  fileSize: string | null; // used as duration
  url: string | null;
  createdAt: string;
}

const CATEGORIES = ['all', 'react', 'javascript', 'css', 'nodejs', 'typescript', 'python'];
const DIFFICULTIES = ['all', 'beginner', 'intermediate', 'advanced'];

const DIFFICULTY_COLORS: Record<string, string> = {
  beginner: 'bg-green-500',
  intermediate: 'bg-yellow-500',
  advanced: 'bg-red-500',
};

const GRADIENT_COLORS: Record<string, string> = {
  react: 'from-blue-500 to-cyan-500',
  javascript: 'from-yellow-500 to-orange-500',
  css: 'from-purple-500 to-pink-500',
  nodejs: 'from-green-500 to-emerald-500',
  typescript: 'from-blue-600 to-indigo-600',
  python: 'from-blue-400 to-green-400',
};

export function Videos() {
  const { isAdmin } = useUserRole();
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('all');
  const [difficulty, setDifficulty] = useState('all');
  const [sortBy, setSortBy] = useState('newest');

  const { data: videos = [], isLoading, isError, refetch } = useQuery<VideoResource[]>({
    queryKey: ['/api/videos'],
  });

  const filtered = (videos as VideoResource[])
    .filter(v => {
      const matchSearch = v.title.toLowerCase().includes(search.toLowerCase()) ||
        v.description.toLowerCase().includes(search.toLowerCase()) ||
        (v.tags as string[]).some(t => t.toLowerCase().includes(search.toLowerCase()));
      const matchCat = category === 'all' || v.category === category;
      const matchDiff = difficulty === 'all' || v.difficulty === difficulty;
      return matchSearch && matchCat && matchDiff;
    })
    .sort((a, b) => {
      if (sortBy === 'newest') return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      if (sortBy === 'oldest') return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
      if (sortBy === 'mostViewed') return b.downloadCount - a.downloadCount;
      return 0;
    });

  const formatViews = (n: number) => n >= 1000 ? `${(n / 1000).toFixed(1)}K` : n.toString();

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold mb-2">Video Library</h1>
          <p className="text-muted-foreground">
            {isAdmin ? 'Manage and upload educational videos' : 'Learn from expert-created video tutorials'}
          </p>
        </div>
        {isAdmin && (
          <Button>
            <Upload className="h-4 w-4 mr-2" /> Upload Video
          </Button>
        )}
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Search videos..." value={search}
                onChange={e => setSearch(e.target.value)} className="pl-10" />
            </div>
            <div className="flex gap-2 flex-wrap">
              <Select value={category} onValueChange={setCategory}>
                <SelectTrigger className="w-36"><SelectValue placeholder="Category" /></SelectTrigger>
                <SelectContent>
                  {CATEGORIES.map(c => (
                    <SelectItem key={c} value={c}>{c === 'all' ? 'All Categories' : c}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={difficulty} onValueChange={setDifficulty}>
                <SelectTrigger className="w-36"><SelectValue placeholder="Difficulty" /></SelectTrigger>
                <SelectContent>
                  {DIFFICULTIES.map(d => (
                    <SelectItem key={d} value={d}>{d === 'all' ? 'All Levels' : d.charAt(0).toUpperCase() + d.slice(1)}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-36"><SelectValue placeholder="Sort by" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="newest">Newest</SelectItem>
                  <SelectItem value="oldest">Oldest</SelectItem>
                  <SelectItem value="mostViewed">Most Viewed</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {!isLoading && (
        <p className="text-sm text-muted-foreground">Showing {filtered.length} of {videos.length} videos</p>
      )}

      {isError ? (
        <PageError message="Failed to load videos" onRetry={refetch} />
      ) : isLoading ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <Card key={i}><CardContent className="p-0">
              <Skeleton className="aspect-video rounded-t-lg" />
              <div className="p-4 space-y-2">
                <Skeleton className="h-5 w-3/4" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-9 w-full mt-2" />
              </div>
            </CardContent></Card>
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <Card><CardContent className="p-12 text-center">
          <Video className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
          <h3 className="text-lg font-semibold mb-2">No videos found</h3>
          <p className="text-muted-foreground">
            {search || category !== 'all' || difficulty !== 'all'
              ? 'Try adjusting your filters'
              : isAdmin ? 'Upload your first video to get started' : 'Videos will appear here once uploaded'}
          </p>
        </CardContent></Card>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map(video => (
            <Card key={video.id} className="group hover:shadow-lg transition-shadow cursor-pointer">
              <div className="relative">
                <div className={`aspect-video bg-gradient-to-br ${GRADIENT_COLORS[video.category] || 'from-gray-500 to-gray-600'} rounded-t-lg flex items-center justify-center`}>
                  <Play className="h-12 w-12 text-white opacity-80" />
                </div>
                {video.fileSize && (
                  <div className="absolute bottom-2 right-2 bg-black/75 text-white text-xs px-2 py-1 rounded">
                    {video.fileSize}
                  </div>
                )}
                <Badge className={`absolute top-2 left-2 ${DIFFICULTY_COLORS[video.difficulty] || 'bg-gray-500'}`}>
                  {video.difficulty}
                </Badge>
              </div>
              <CardContent className="p-4">
                <h3 className="font-semibold text-lg mb-2 line-clamp-2">{video.title}</h3>
                <p className="text-muted-foreground text-sm mb-3 line-clamp-2">{video.description}</p>
                <div className="flex items-center justify-between text-sm text-muted-foreground mb-3">
                  <Badge variant="outline">{video.category}</Badge>
                  <div className="flex items-center gap-3">
                    <span className="flex items-center gap-1"><Eye className="h-3 w-3" />{formatViews(video.downloadCount)}</span>
                    <span className="flex items-center gap-1"><Calendar className="h-3 w-3" />{new Date(video.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>
                <div className="flex gap-1 flex-wrap mb-3">
                  {(video.tags as string[]).slice(0, 3).map(tag => (
                    <Badge key={tag} variant="secondary" className="text-xs">{tag}</Badge>
                  ))}
                </div>
                <Button className="w-full" onClick={() => video.url && window.open(video.url, '_blank')}
                  disabled={!video.url}>
                  <Play className="mr-2 h-4 w-4" />
                  {video.url ? 'Watch Now' : 'Coming Soon'}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
