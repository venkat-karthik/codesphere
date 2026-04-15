import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { apiRequest } from '@/lib/queryClient';

interface VideoResource {
  id: number;
  title: string;
  description: string;
  category: string;
  difficulty: string;
  url: string | null;
  fileSize: string | null;
  downloadCount: number;
  createdAt: string;
}

const CATEGORIES = ['react', 'javascript', 'css', 'nodejs', 'typescript', 'python'];
const DIFFICULTIES = ['beginner', 'intermediate', 'advanced'];

export default function AdminVideoResources() {
  const qc = useQueryClient();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editId, setEditId] = useState<number | null>(null);
  const [form, setForm] = useState({ title: '', description: '', url: '', category: 'javascript', difficulty: 'beginner', fileSize: '' });

  const { data: videos = [], isLoading } = useQuery<VideoResource[]>({
    queryKey: ['/api/content/videos'],
  });

  const saveMutation = useMutation({
    mutationFn: async () => {
      const payload = { ...form, type: 'video', tags: [form.category], downloadCount: 0 };
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
      setForm({ title: '', description: '', url: '', category: 'javascript', difficulty: 'beginner', fileSize: '' });
      setEditId(null);
    },
  });

  const openEdit = (v: VideoResource) => {
    setEditId(v.id);
    setForm({ title: v.title, description: v.description, url: v.url || '', category: v.category, difficulty: v.difficulty, fileSize: v.fileSize || '' });
    setIsModalOpen(true);
  };

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-2">Admin Video Resources</h1>
      <p className="mb-4 text-muted-foreground">Manage video resources for students. (Admin only)</p>
      <Button className="mb-4" onClick={() => { setEditId(null); setIsModalOpen(true); }}>Add Video</Button>

      <div className="border rounded p-4 bg-card">
        <h2 className="text-xl font-semibold mb-4">Videos ({(videos as VideoResource[]).length})</h2>
        {isLoading ? (
          <div className="space-y-2">{[...Array(3)].map((_, i) => <Skeleton key={i} className="h-12 w-full" />)}</div>
        ) : (videos as VideoResource[]).length === 0 ? (
          <p className="text-muted-foreground">No videos yet.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead><tr className="border-b">
                <th className="py-2 pr-4">Title</th>
                <th className="py-2 pr-4">Category</th>
                <th className="py-2 pr-4">Difficulty</th>
                <th className="py-2 pr-4">Duration</th>
                <th className="py-2 pr-4">Views</th>
                <th className="py-2 pr-4">Actions</th>
              </tr></thead>
              <tbody>
                {(videos as VideoResource[]).map(v => (
                  <tr key={v.id} className="border-b hover:bg-muted/30">
                    <td className="py-2 pr-4 font-semibold max-w-xs truncate">{v.title}</td>
                    <td className="py-2 pr-4"><Badge variant="outline">{v.category}</Badge></td>
                    <td className="py-2 pr-4"><Badge variant="secondary">{v.difficulty}</Badge></td>
                    <td className="py-2 pr-4 text-xs">{v.fileSize || '—'}</td>
                    <td className="py-2 pr-4">{v.downloadCount.toLocaleString()}</td>
                    <td className="py-2 pr-4 flex gap-2">
                      <Button size="sm" variant="outline" onClick={() => openEdit(v)}>Edit</Button>
                      {v.url && <Button size="sm" variant="ghost" onClick={() => window.open(v.url!, '_blank')}>View</Button>}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle>{editId ? 'Edit Video' : 'Add Video'}</DialogTitle></DialogHeader>
          <form onSubmit={e => { e.preventDefault(); saveMutation.mutate(); }} className="space-y-4">
            <div>
              <label className="block mb-1 font-medium text-sm">Title</label>
              <input className="w-full border rounded px-3 py-2 text-sm bg-background" value={form.title}
                onChange={e => setForm(f => ({ ...f, title: e.target.value }))} required />
            </div>
            <div>
              <label className="block mb-1 font-medium text-sm">Description</label>
              <textarea className="w-full border rounded px-3 py-2 text-sm bg-background" value={form.description}
                onChange={e => setForm(f => ({ ...f, description: e.target.value }))} rows={2} />
            </div>
            <div>
              <label className="block mb-1 font-medium text-sm">Video URL (YouTube or direct)</label>
              <input className="w-full border rounded px-3 py-2 text-sm bg-background" value={form.url}
                onChange={e => setForm(f => ({ ...f, url: e.target.value }))} placeholder="https://..." />
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
            <div>
              <label className="block mb-1 font-medium text-sm">Duration (e.g. 45:30)</label>
              <input className="w-full border rounded px-3 py-2 text-sm bg-background" value={form.fileSize}
                onChange={e => setForm(f => ({ ...f, fileSize: e.target.value }))} placeholder="mm:ss" />
            </div>
            <DialogFooter>
              <Button type="button" variant="ghost" onClick={() => setIsModalOpen(false)}>Cancel</Button>
              <Button type="submit" disabled={saveMutation.isPending}>{saveMutation.isPending ? 'Saving...' : editId ? 'Save' : 'Add'}</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
