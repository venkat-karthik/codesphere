import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useLocation } from 'wouter';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';
import { Search, FileText, Download, BookOpen, ExternalLink, Upload } from 'lucide-react';
import { apiRequest } from '@/lib/queryClient';
import { useUserRole } from '@/contexts/UserRoleContext';

interface Resource {
  id: number;
  title: string;
  description: string;
  category: string;
  type: string;
  difficulty: string;
  tags: string[];
  downloadCount: number;
  fileSize: string | null;
  pageCount: number | null;
  url: string | null;
  createdAt: string;
}

const CATEGORIES = ['all', 'javascript', 'react', 'css', 'html', 'nodejs', 'typescript', 'python'];
const DIFFICULTIES = ['all', 'beginner', 'intermediate', 'advanced'];

const diffColor: Record<string, string> = {
  beginner: 'bg-green-500/20 text-green-600 border-0',
  intermediate: 'bg-yellow-500/20 text-yellow-600 border-0',
  advanced: 'bg-red-500/20 text-red-600 border-0',
};

export function Resources() {
  const qc = useQueryClient();
  const [, setLocation] = useLocation();
  const { isAdmin } = useUserRole();
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('all');
  const [difficulty, setDifficulty] = useState('all');

  const { data: resources = [], isLoading } = useQuery<Resource[]>({
    queryKey: ['/api/content/resources'],
  });

  const downloadMutation = useMutation({
    mutationFn: (id: number) => apiRequest('PATCH', `/api/content/resources/${id}`, {
      downloadCount: (resources.find(r => r.id === id)?.downloadCount || 0) + 1
    }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['/api/content/resources'] }),
  });

  const pdfs = (resources as Resource[]).filter(r => r.type === 'pdf');

  const filtered = pdfs.filter(r => {
    const q = search.toLowerCase();
    const matchSearch = !search || r.title.toLowerCase().includes(q) || r.description.toLowerCase().includes(q);
    const matchCat = category === 'all' || r.category === category;
    const matchDiff = difficulty === 'all' || r.difficulty === difficulty;
    return matchSearch && matchCat && matchDiff;
  });

  const handleDownload = (r: Resource) => {
    downloadMutation.mutate(r.id);
    if (r.url) window.open(r.url, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold mb-1">PDF Resources</h1>
          <p className="text-muted-foreground">Curated study materials and reference guides.</p>
        </div>
        {isAdmin && (
          <Button onClick={() => setLocation('/admin/resources')}>
            <Upload className="h-4 w-4 mr-2" />Upload PDF
          </Button>
        )}
      </div>

      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col lg:flex-row gap-3">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Search resources..." value={search} onChange={e => setSearch(e.target.value)} className="pl-10" />
            </div>
            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger className="w-40"><SelectValue placeholder="Category" /></SelectTrigger>
              <SelectContent>
                {CATEGORIES.map(c => <SelectItem key={c} value={c}>{c === 'all' ? 'All Categories' : c}</SelectItem>)}
              </SelectContent>
            </Select>
            <Select value={difficulty} onValueChange={setDifficulty}>
              <SelectTrigger className="w-40"><SelectValue placeholder="Difficulty" /></SelectTrigger>
              <SelectContent>
                {DIFFICULTIES.map(d => <SelectItem key={d} value={d}>{d === 'all' ? 'All Levels' : d.charAt(0).toUpperCase() + d.slice(1)}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <p className="text-sm text-muted-foreground">Showing {filtered.length} of {pdfs.length} resources</p>

      {isLoading ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => <Skeleton key={i} className="h-48 rounded-xl" />)}
        </div>
      ) : filtered.length === 0 ? (
        <Card><CardContent className="p-12 text-center">
          <BookOpen className="h-12 w-12 mx-auto mb-4 text-muted-foreground opacity-30" />
          <p className="font-semibold">No resources found</p>
          <p className="text-sm text-muted-foreground mt-1">Try adjusting your filters</p>
        </CardContent></Card>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map(r => (
            <Card key={r.id} className="hover:shadow-lg transition-shadow">
              <CardContent className="p-5 space-y-3">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                    <FileText className="h-5 w-5 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-sm leading-tight line-clamp-2">{r.title}</h3>
                    <Badge className={`text-xs mt-1 ${diffColor[r.difficulty] || ''}`}>{r.difficulty}</Badge>
                  </div>
                </div>
                <p className="text-xs text-muted-foreground line-clamp-2">{r.description}</p>
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <Badge variant="outline" className="text-xs">{r.category}</Badge>
                  <div className="flex gap-3">
                    {r.pageCount && <span>{r.pageCount} pages</span>}
                    {r.fileSize && <span>{r.fileSize}</span>}
                    <span className="flex items-center gap-1"><Download className="h-3 w-3" />{r.downloadCount.toLocaleString()}</span>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button size="sm" className="flex-1" onClick={() => handleDownload(r)} disabled={!r.url}>
                    {r.url
                      ? r.url.endsWith('.pdf')
                        ? <><Download className="h-3.5 w-3.5 mr-1.5" />Download PDF</>
                        : <><ExternalLink className="h-3.5 w-3.5 mr-1.5" />View Resource</>
                      : <><BookOpen className="h-3.5 w-3.5 mr-1.5" />Coming Soon</>
                    }
                  </Button>
                  {r.url && (
                    <Button size="sm" variant="outline" onClick={() => window.open(r.url!, '_blank', 'noopener,noreferrer')}>
                      <ExternalLink className="h-3.5 w-3.5" />
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
