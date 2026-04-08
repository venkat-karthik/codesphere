import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { apiRequest } from '@/lib/queryClient';
import { useAuth } from '@/hooks/useAuth';

interface LiveClass {
  id: string;
  title: string;
  description: string;
  startTime: string;
  endTime: string;
  status: 'scheduled' | 'live' | 'ended';
  maxParticipants: number;
  currentParticipants: number;
  instructorName: string;
  tags: string[];
}

export default function AdminLiveClasses() {
  const { user } = useAuth();
  const qc = useQueryClient();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [form, setForm] = useState({ title: '', description: '', startTime: '', endTime: '', maxParticipants: '30' });

  const { data: classes = [], isLoading } = useQuery<LiveClass[]>({
    queryKey: ['/api/live-classes'],
  });

  const saveMutation = useMutation({
    mutationFn: async () => {
      if (editId) {
        const res = await apiRequest('PATCH', `/api/live-classes/${editId}`, form);
        return res.json();
      }
      const res = await apiRequest('POST', '/api/live-classes', {
        ...form,
        maxParticipants: parseInt(form.maxParticipants),
        instructorId: String(user?.id),
        instructorName: `${user?.firstName} ${user?.lastName}`,
        tags: [],
      });
      return res.json();
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['/api/live-classes'] });
      setIsModalOpen(false);
      setForm({ title: '', description: '', startTime: '', endTime: '', maxParticipants: '30' });
      setEditId(null);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      await apiRequest('DELETE', `/api/live-classes/${id}`);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['/api/live-classes'] }),
  });

  const statusMutation = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: string }) => {
      const res = await apiRequest('PATCH', `/api/live-classes/${id}`, { status });
      return res.json();
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['/api/live-classes'] }),
  });

  const openEdit = (cls: LiveClass) => {
    setEditId(cls.id);
    setForm({ title: cls.title, description: cls.description, startTime: cls.startTime.slice(0, 16), endTime: cls.endTime.slice(0, 16), maxParticipants: String(cls.maxParticipants) });
    setIsModalOpen(true);
  };

  const statusColor = (s: string) => s === 'live' ? 'bg-green-500/20 text-green-600' : s === 'ended' ? 'bg-gray-500/20 text-gray-500' : 'bg-blue-500/20 text-blue-500';

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-2">Admin Live Classes</h1>
      <p className="mb-4 text-muted-foreground">Schedule and manage live classes. (Admin only)</p>
      <Button className="mb-4" onClick={() => { setEditId(null); setForm({ title: '', description: '', startTime: '', endTime: '', maxParticipants: '30' }); setIsModalOpen(true); }}>
        Create Live Class
      </Button>

      <div className="border rounded p-4 bg-card">
        <h2 className="text-xl font-semibold mb-4">Scheduled Classes</h2>
        {isLoading ? (
          <div className="space-y-2">{[...Array(3)].map((_, i) => <Skeleton key={i} className="h-12 w-full" />)}</div>
        ) : (classes as LiveClass[]).length === 0 ? (
          <p className="text-muted-foreground">No live classes scheduled yet.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead><tr className="border-b">
                <th className="py-2 pr-4">Title</th>
                <th className="py-2 pr-4">Instructor</th>
                <th className="py-2 pr-4">Start</th>
                <th className="py-2 pr-4">Participants</th>
                <th className="py-2 pr-4">Status</th>
                <th className="py-2 pr-4">Actions</th>
              </tr></thead>
              <tbody>
                {(classes as LiveClass[]).map(cls => (
                  <tr key={cls.id} className="border-b hover:bg-muted/30">
                    <td className="py-2 pr-4 font-semibold">{cls.title}</td>
                    <td className="py-2 pr-4">{cls.instructorName}</td>
                    <td className="py-2 pr-4 text-xs">{new Date(cls.startTime).toLocaleString()}</td>
                    <td className="py-2 pr-4">{cls.currentParticipants}/{cls.maxParticipants}</td>
                    <td className="py-2 pr-4">
                      <span className={`px-2 py-1 rounded text-xs font-semibold ${statusColor(cls.status)}`}>{cls.status}</span>
                    </td>
                    <td className="py-2 pr-4 flex gap-2 flex-wrap">
                      <Button size="sm" variant="outline" onClick={() => openEdit(cls)}>Edit</Button>
                      <Button size="sm" variant="destructive" onClick={() => deleteMutation.mutate(cls.id)}>Delete</Button>
                      {cls.status === 'scheduled' && (
                        <Button size="sm" onClick={() => statusMutation.mutate({ id: cls.id, status: 'live' })}>Start</Button>
                      )}
                      {cls.status === 'live' && (
                        <Button size="sm" variant="secondary" onClick={() => statusMutation.mutate({ id: cls.id, status: 'ended' })}>End</Button>
                      )}
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
          <DialogHeader><DialogTitle>{editId ? 'Edit Live Class' : 'Create Live Class'}</DialogTitle></DialogHeader>
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
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block mb-1 font-medium text-sm">Start Time</label>
                <input type="datetime-local" className="w-full border rounded px-3 py-2 text-sm bg-background"
                  value={form.startTime} onChange={e => setForm(f => ({ ...f, startTime: e.target.value }))} required />
              </div>
              <div>
                <label className="block mb-1 font-medium text-sm">End Time</label>
                <input type="datetime-local" className="w-full border rounded px-3 py-2 text-sm bg-background"
                  value={form.endTime} onChange={e => setForm(f => ({ ...f, endTime: e.target.value }))} required />
              </div>
            </div>
            <div>
              <label className="block mb-1 font-medium text-sm">Max Participants</label>
              <input type="number" className="w-full border rounded px-3 py-2 text-sm bg-background"
                value={form.maxParticipants} onChange={e => setForm(f => ({ ...f, maxParticipants: e.target.value }))} min="1" />
            </div>
            <DialogFooter>
              <Button type="button" variant="ghost" onClick={() => setIsModalOpen(false)}>Cancel</Button>
              <Button type="submit" disabled={saveMutation.isPending}>{saveMutation.isPending ? 'Saving...' : editId ? 'Save' : 'Create'}</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
