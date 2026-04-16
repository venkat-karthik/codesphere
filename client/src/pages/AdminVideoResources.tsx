import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { apiRequest } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';
import { Search, Plus, Play, Eye, Trash2, Edit, ExternalLink, Video } from 'lucide-react';

interface VideoResource {
  id: number;
  title: string;
  description: string;
  category: string;
  difficulty: string;
  url: string | null;
  fileSize: string | null;
  downloadCount: number;
  tags: string[];
  createdAt: string;
}

const CATEGORIES = ['react', 'javascript', 'css', 'nodejs', 'typescript', 'python', 'java', 'general'];
const DIFFICULTIES = ['beginner', 'intermediate', 'advanced'];
const DIFF_COLORS: Record<string, string> = {
  beginner: 'bg-green-500/20 text-green-600',
  intermediate: 'bg-yellow-500/20 text-yellow-600',
  advanced: 'bg-red-500/20 text-red-600',
};

function isYouTube(url: string) {
  return url.includes('youtube.com') || url.includes('youtu.be');
}

function getYouTubeThumbnail(url: string) {
  const match = url.match(/(?:v=|youtu\.be\/)([^&?/]+)/);
  return match ? `https://img.youtube.com/vi/${match[1]}/mqdefault.jpg` : null;
}

export default function AdminVideoResources() {
  const qc = useQueryClient();
  const { toast } = useToast();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editId, setEditId] = useState<number | null>(null);
  const [search, setSearch] = useState('');
  const [filterCat, setFilterCat] = useState('all');
  const [form, setForm] = useState({ title: '', description: '', url: '', category: 'javascript', difficulty: 'beginner', fileSize: '', tags: '' });

  const { data: videos = [], isLoading } = useQuery<VideoResource[]>({
    queryKey: ['/api/content/videos'],
  });

  const filtered = (videos as VideoResource[]).filter(v => {
    const q = search.toLowerCase();
    const matchSearch = !search || v.title.toLowerCase().includes(q) || v.description?.toLowerCase().includes(q);
    const matchCat = filterCat === 'all' || v.category === filterCat;
    return matchSearch && matchCat;
  });

  const saveMutation = useMutation({
    mutationFn: async () => {
      const payload = {
        title: form.title,
        description: form.description,
        url: form.url || null,
        category: form.category,
        difficulty: form.difficulty,
        fileSize: form.fileSize || null,
        tags: form.tags ? form.tags.split(',').map(t => t.trim()).filter(Boolean) : [form.category],
        type: 'video',
        downloadCount: 0,
      };
      if (editId) {
        const res = await apiRequest('PATCH', `/api/content/videos/${editId}`, payload);
        return res.json();
      }
      const res = await apiRequest('POST', '/api/content/videos', payload);
      return res.json();
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['/api/content/videos'] });
      setIsModalOpen(false);
      setForm({ title: '', description: '', url: '', category: 'javascript', difficulty: 'beginner', fileSize: '', tags: '' });
      setEditId(null);
      toast({ title: editId ? '✅ Video updated' : '✅ Video added' });
    },
    onError: (err: any) => toast({ title: 'Error', description: err.message, variant: 'destructive' }),
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      await apiRequest('DELETE', `/api/content/videos/${id}`);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['/api/content/videos'] });
      toast({ title: 'Video deleted' });
    },
    onError: () => toast({ title: 'Delete failed', variant: 'destructive' }),
  });

  const openAdd = () => {
    setEditId(null);
    setForm({ title: '', description: '', url: '', category: 'javascript', difficulty: 'beginner', fileSize: '', tags: '' });
    setIsModalOpen(true);
  };

  const openEdit = (v: VideoResource) => {
    setEditId(v.id);
    setForm({
      title: v.title, description: v.description || '', url: v.url || '',
      category: v.category, difficulty: v.difficulty, fileSize: v.fileSize || '',
      tags: Array.isArray(v.tags) ? v.tags.join(', ') : '',
    });
    setIsModalOpen(true);
  };

  const totalViews = (videos as VideoResource[]).reduce((s, v) => s + v.downloadCount, 0);

  return (
    <div className="max-w-7xl mx-auto py-8 px-4 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Video Resources</h1>
          <p className="text-muted-foreground mt-1">Add and manage video tutorials for students.</p>
        </div>
        <Button onClick={openAdd}><Plus className="h-4 w-4 mr-2" />Add Video</Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        <Card><CardContent className="p-4 text-center">
          <p className="text-2xl font-bold text-primary">{videos.length}</p>
          <p className="text-xs text-muted-foreground">Total Videos</p>
        </CardContent></Card>
        <Card><CardContent className="p-4 text-center">
          <p className="text-2xl font-bold text-green-500">{totalViews.toLocaleString()}</p>
          <p className="text-xs text-muted-foreground">Total Views</p>
        </CardContent></Card>
        <Card><CardContent className="p-4 text-center">
          <p className="text-2xl font-bold text-blue-500">{(videos as VideoResource[]).filter(v => v.url).length}</p>
          <p className="text-xs text-muted-foreground">With URL</p>
        </CardContent></Card>
      </div>

      {/* Filters */}
      <Card><CardContent className="p-4 flex gap-3 flex-wrap">
        <div className="flex-1 relative min-w-48">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search videos..." value={search} onChange={e => setSearch(e.target.value)} className="pl-10" />
        </div>
        <Select value={filterCat} onValueChange={setFilterCat}>
          <SelectTrigger className="w-40"><SelectValue placeholder="Category" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            {CATEGORIES.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
          </SelectContent>
        </Select>
        <span className="text-sm text-muted-foreground self-center">{filtered.length} of {videos.length}</span>
      </CardContent></Card>

      {/* Video Grid */}
      {isLoading ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(6)].map((_, i) => <Skeleton key={i} className="h-48 rounded-xl" />)}
        </div>
      ) : filtered.length === 0 ? (
        <Card><CardContent className="p-12 text-center">
          <Video className="h-12 w-12 text-muted-foreground mx-auto mb-3 opacity-30" />
          <p className="font-semibold">No videos found</p>
          <Button className="mt-4" onClick={openAdd}><Plus className="h-4 w-4 mr-2" />Add Video</Button>
        </CardContent></Card>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map(v => {
            const thumb = v.url && isYouTube(v.url) ? getYouTubeThumbnail(v.url) : null;
            return (
              <Card key={v.id} className="overflow-hidden hover:shadow-md transition-shadow">
                {/* Thumbnail */}
                <div className="relative aspect-video bg-muted">
                  {thumb ? (
                    <img src={thumb} alt={v.title} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary/20 to-primary/5">
                      <Play className="h-10 w-10 text-primary/40" />
                    </div>
                  )}
                  <Badge className={`absolute top-2 left-2 text-xs border-0 ${DIFF_COLORS[v.difficulty] || ''}`}>{v.difficulty}</Badge>
                  {v.fileSize && <span className="absolute bottom-2 right-2 bg-black/70 text-white text-xs px-1.5 py-0.5 rounded">{v.fileSize}</span>}
                </div>
                <CardContent className="p-4">
                  <h3 className="font-semibold text-sm line-clamp-1 mb-1">{v.title}</h3>
                  <p className="text-xs text-muted-foreground line-clamp-2 mb-3">{v.description}</p>
                  <div className="flex items-center justify-between mb-3">
                    <Badge variant="outline" className="text-xs">{v.category}</Badge>
                    <span className="text-xs text-muted-foreground flex items-center gap-1">
                      <Eye className="h-3 w-3" />{v.downloadCount.toLocaleString()} views
                    </span>
                  </div>
                  <div className="flex gap-1">
                    <Button size="sm" variant="outline" className="flex-1" onClick={() => openEdit(v)}>
                      <Edit className="h-3.5 w-3.5 mr-1" />Edit
                    </Button>
                    {v.url && (
                      <Button size="sm" variant="ghost" onClick={() => window.open(v.url!, '_blank', 'noopener,noreferrer')}>
                        <ExternalLink className="h-3.5 w-3.5" />
                      </Button>
                    )}
                    <Button size="sm" variant="ghost" className="text-destructive hover:text-destructive"
                      onClick={() => { if (confirm(`Delete "${v.title}"?`)) deleteMutation.mutate(v.id); }}>
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      {/* Add/Edit Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader><DialogTitle>{editId ? 'Edit Video' : 'Add Video'}</DialogTitle></DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="block mb-1 font-medium text-sm">Title *</label>
              <Input value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} placeholder="React Hooks Complete Guide" />
            </div>
            <div>
              <label className="block mb-1 font-medium text-sm">Description</label>
              <textarea className="w-full border rounded px-3 py-2 text-sm bg-background resize-none"
                value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} rows={2}
                placeholder="What will students learn?" />
            </div>
            <div>
              <label className="block mb-1 font-medium text-sm">Video URL (YouTube, Vimeo, or direct)</label>
              <Input value={form.url} onChange={e => setForm(f => ({ ...f, url: e.target.value }))}
                placeholder="https://youtube.com/watch?v=..." />
              {form.url && isYouTube(form.url) && getYouTubeThumbnail(form.url) && (
                <img src={getYouTubeThumbnail(form.url)!} alt="thumbnail" className="mt-2 rounded w-full h-24 object-cover" />
              )}
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block mb-1 font-medium text-sm">Category</label>
                <Select value={form.category} onValueChange={v => setForm(f => ({ ...f, category: v }))}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>{CATEGORIES.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              <div>
                <label className="block mb-1 font-medium text-sm">Difficulty</label>
                <Select value={form.difficulty} onValueChange={v => setForm(f => ({ ...f, difficulty: v }))}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>{DIFFICULTIES.map(d => <SelectItem key={d} value={d}>{d}</SelectItem>)}</SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block mb-1 font-medium text-sm">Duration (e.g. 45:30)</label>
                <Input value={form.fileSize} onChange={e => setForm(f => ({ ...f, fileSize: e.target.value }))} placeholder="mm:ss" />
              </div>
              <div>
                <label className="block mb-1 font-medium text-sm">Tags (comma-separated)</label>
                <Input value={form.tags} onChange={e => setForm(f => ({ ...f, tags: e.target.value }))} placeholder="React, Hooks, useState" />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="ghost" onClick={() => setIsModalOpen(false)}>Cancel</Button>
            <Button onClick={() => saveMutation.mutate()} disabled={saveMutation.isPending || !form.title.trim()}>
              {saveMutation.isPending ? 'Saving...' : editId ? 'Save Changes' : 'Add Video'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
