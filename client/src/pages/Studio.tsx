import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog';
import { Skeleton } from '@/components/ui/skeleton';
import { Code, Plus, FolderOpen, Clock, Users, GitBranch, Play, Settings, Search, Star, Trash2 } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { apiRequest } from '@/lib/queryClient';

interface Project {
  id: number;
  userId: number;
  name: string;
  description: string | null;
  language: string;
  framework: string | null;
  type: string;
  isPublic: boolean;
  likes: number;
  createdAt: string;
  updatedAt: string;
}

const LANGUAGES = ['JavaScript', 'TypeScript', 'Python', 'Java', 'C++', 'Go', 'Rust'];
const FRAMEWORKS: Record<string, string[]> = {
  JavaScript: ['React', 'Vue.js', 'Node.js', 'Express', 'Next.js'],
  TypeScript: ['React', 'Next.js', 'NestJS', 'Angular'],
  Python: ['FastAPI', 'Flask', 'Django'],
  Java: ['Spring Boot'],
  Go: ['Gin', 'Echo'],
};

const TEMPLATES = [
  { name: 'React Starter', language: 'JavaScript', framework: 'React', icon: '⚛️' },
  { name: 'Next.js App', language: 'TypeScript', framework: 'Next.js', icon: '⚫' },
  { name: 'Node.js API', language: 'JavaScript', framework: 'Node.js', icon: '🟢' },
  { name: 'Python Flask', language: 'Python', framework: 'Flask', icon: '🐍' },
  { name: 'Vue.js App', language: 'JavaScript', framework: 'Vue.js', icon: '💚' },
  { name: 'FastAPI', language: 'Python', framework: 'FastAPI', icon: '⚡' },
];

const STATUS_COLORS: Record<string, string> = {
  active: 'bg-green-500/20 text-green-400',
  completed: 'bg-blue-500/20 text-blue-400',
  paused: 'bg-yellow-500/20 text-yellow-400',
};

const LANG_COLORS: Record<string, string> = {
  JavaScript: 'bg-yellow-500/20 text-yellow-400',
  TypeScript: 'bg-blue-500/20 text-blue-400',
  Python: 'bg-green-500/20 text-green-400',
  Java: 'bg-red-500/20 text-red-400',
};

export function Studio() {
  const { user } = useAuth();
  const qc = useQueryClient();
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('all');
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ name: '', description: '', language: 'JavaScript', framework: 'React' });

  const { data: projects = [], isLoading } = useQuery<Project[]>({
    queryKey: ['/api/projects'],
    enabled: !!user,
  });

  const createMutation = useMutation({
    mutationFn: async () => {
      const res = await apiRequest('POST', '/api/projects', {
        name: form.name.trim(),
        description: form.description,
        language: form.language,
        framework: form.framework || null,
        type: 'custom',
      });
      return res.json();
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['/api/projects'] });
      setShowModal(false);
      setForm({ name: '', description: '', language: 'JavaScript', framework: 'React' });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      await apiRequest('DELETE', `/api/projects/${id}`);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['/api/projects'] }),
  });

  const fromTemplate = (t: typeof TEMPLATES[0]) => {
    setForm({ name: t.name, description: '', language: t.language, framework: t.framework });
    setShowModal(true);
  };

  const filtered = (projects as Project[]).filter(p => {
    const matchSearch = p.name.toLowerCase().includes(search.toLowerCase());
    const matchFilter = filter === 'all' || p.type === filter;
    return matchSearch && matchFilter;
  });

  const formatDate = (d: string) => {
    const diff = Math.floor((Date.now() - new Date(d).getTime()) / 86400000);
    if (diff === 0) return 'Today';
    if (diff === 1) return '1 day ago';
    if (diff < 7) return `${diff} days ago`;
    return `${Math.floor(diff / 7)} weeks ago`;
  };

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold mb-2">Project Studio</h1>
          <p className="text-muted-foreground">Build and manage your coding projects</p>
        </div>
        <Button onClick={() => setShowModal(true)}>
          <Plus className="mr-2 h-4 w-4" /> New Project
        </Button>
      </div>

      {/* Templates */}
      <Card>
        <CardHeader><CardTitle>Quick Start Templates</CardTitle></CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
            {TEMPLATES.map(t => (
              <Button key={t.name} variant="outline" className="h-20 flex-col gap-1"
                onClick={() => fromTemplate(t)}>
                <span className="text-2xl">{t.icon}</span>
                <span className="text-xs font-medium">{t.name}</span>
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Search + Filter */}
      <div className="flex gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search projects..." value={search}
            onChange={e => setSearch(e.target.value)} className="pl-10" />
        </div>
        <div className="flex gap-2">
          {['all', 'custom', 'template'].map(f => (
            <Button key={f} size="sm" variant={filter === f ? 'default' : 'outline'}
              onClick={() => setFilter(f)} className="capitalize">{f}</Button>
          ))}
        </div>
      </div>

      {/* Projects Grid */}
      {!user ? (
        <Card><CardContent className="p-12 text-center text-muted-foreground">
          Sign in to see your projects.
        </CardContent></Card>
      ) : isLoading ? (
        <div className="grid lg:grid-cols-2 gap-6">
          {[...Array(4)].map((_, i) => <Card key={i}><CardContent className="p-6"><Skeleton className="h-40 w-full" /></CardContent></Card>)}
        </div>
      ) : filtered.length === 0 ? (
        <Card><CardContent className="p-12 text-center">
          <Code className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">No projects yet</h3>
          <p className="text-muted-foreground mb-4">Create your first project or use a template above.</p>
          <Button onClick={() => setShowModal(true)}><Plus className="mr-2 h-4 w-4" />New Project</Button>
        </CardContent></Card>
      ) : (
        <div className="grid lg:grid-cols-2 gap-6">
          {filtered.map(project => (
            <Card key={project.id} className="card-hover">
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-primary/20 rounded-lg flex items-center justify-center">
                      <Code className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold">{project.name}</h3>
                      <p className="text-xs text-muted-foreground">Modified {formatDate(project.updatedAt)}</p>
                    </div>
                  </div>
                  <Button variant="ghost" size="icon" onClick={() => deleteMutation.mutate(project.id)}>
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </div>

                {project.description && (
                  <p className="text-muted-foreground text-sm mb-4 line-clamp-2">{project.description}</p>
                )}

                <div className="flex flex-wrap gap-2 mb-4">
                  <Badge className={LANG_COLORS[project.language] || 'bg-gray-500/20 text-gray-400'}>
                    {project.language}
                  </Badge>
                  {project.framework && <Badge variant="outline">{project.framework}</Badge>}
                  <Badge variant="outline">{project.type}</Badge>
                </div>

                <div className="flex gap-2 mt-4">
                  <Button className="flex-1">
                    <Play className="mr-2 h-4 w-4" /> Open Project
                  </Button>
                  <Button variant="outline">
                    <FolderOpen className="mr-2 h-4 w-4" /> Files
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Stats */}
      <div className="grid md:grid-cols-3 gap-6">
        <Card><CardContent className="p-6 text-center">
          <div className="text-3xl font-bold text-primary">{projects.length}</div>
          <div className="text-muted-foreground text-sm">Total Projects</div>
        </CardContent></Card>
        <Card><CardContent className="p-6 text-center">
          <div className="text-3xl font-bold text-green-500">
            {(projects as Project[]).filter(p => p.type === 'custom').length}
          </div>
          <div className="text-muted-foreground text-sm">Custom Projects</div>
        </CardContent></Card>
        <Card><CardContent className="p-6 text-center">
          <div className="text-3xl font-bold text-blue-500">
            {(projects as Project[]).filter(p => p.isPublic).length}
          </div>
          <div className="text-muted-foreground text-sm">Public Projects</div>
        </CardContent></Card>
      </div>

      {/* Create Modal */}
      <Dialog open={showModal} onOpenChange={setShowModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>New Project</DialogTitle>
            <DialogDescription>Give your project a name and pick a language.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div>
              <label className="text-sm font-medium mb-1 block">Project Name</label>
              <Input placeholder="My Awesome Project" value={form.name}
                onChange={e => setForm(f => ({ ...f, name: e.target.value }))} />
            </div>
            <div>
              <label className="text-sm font-medium mb-1 block">Description (optional)</label>
              <Input placeholder="What does this project do?" value={form.description}
                onChange={e => setForm(f => ({ ...f, description: e.target.value }))} />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-sm font-medium mb-1 block">Language</label>
                <Select value={form.language} onValueChange={v => setForm(f => ({ ...f, language: v, framework: '' }))}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {LANGUAGES.map(l => <SelectItem key={l} value={l}>{l}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-sm font-medium mb-1 block">Framework</label>
                <Select value={form.framework} onValueChange={v => setForm(f => ({ ...f, framework: v }))}>
                  <SelectTrigger><SelectValue placeholder="None" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">None</SelectItem>
                    {(FRAMEWORKS[form.language] || []).map(fw => (
                      <SelectItem key={fw} value={fw}>{fw}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="ghost" onClick={() => setShowModal(false)}>Cancel</Button>
            <Button onClick={() => createMutation.mutate()}
              disabled={!form.name.trim() || createMutation.isPending}>
              {createMutation.isPending ? 'Creating...' : 'Create Project'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
