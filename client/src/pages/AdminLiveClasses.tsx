import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { apiRequest } from '@/lib/queryClient';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { Search, Plus, Play, StopCircle, Trash2, Edit, Copy, Users, Clock, Video, Calendar } from 'lucide-react';

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
  roomId: string;
  isRecording: boolean;
  tags: string[];
}

const STATUS_CONFIG = {
  scheduled: { label: 'Scheduled', color: 'bg-blue-500/20 text-blue-600' },
  live: { label: '🔴 Live', color: 'bg-green-500/20 text-green-600 animate-pulse' },
  ended: { label: 'Ended', color: 'bg-gray-500/20 text-gray-500' },
};

export default function AdminLiveClasses() {
  const { user } = useAuth();
  const qc = useQueryClient();
  const { toast } = useToast();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [form, setForm] = useState({
    title: '', description: '', startTime: '', endTime: '',
    maxParticipants: '30', tags: '', isRecording: false,
  });

  const { data: classes = [], isLoading } = useQuery<LiveClass[]>({
    queryKey: ['/api/live-classes'],
  });

  const filtered = (classes as LiveClass[]).filter(c => {
    const q = search.toLowerCase();
    const matchSearch = !search || c.title.toLowerCase().includes(q) || c.instructorName.toLowerCase().includes(q);
    const matchStatus = filterStatus === 'all' || c.status === filterStatus;
    return matchSearch && matchStatus;
  });

  const saveMutation = useMutation({
    mutationFn: async () => {
      const payload = {
        title: form.title,
        description: form.description,
        startTime: form.startTime,
        endTime: form.endTime,
        maxParticipants: parseInt(form.maxParticipants) || 30,
        tags: form.tags ? form.tags.split(',').map(t => t.trim()).filter(Boolean) : [],
        isRecording: form.isRecording,
        ...(editId ? {} : {
          instructorId: String(user?.id),
          instructorName: `${user?.firstName} ${user?.lastName}`,
        }),
      };
      if (editId) {
        const res = await apiRequest('PATCH', `/api/live-classes/${editId}`, payload);
        return res.json();
      }
      const res = await apiRequest('POST', '/api/live-classes', payload);
      return res.json();
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['/api/live-classes'] });
      setIsModalOpen(false);
      resetForm();
      toast({ title: editId ? '✅ Class updated' : '✅ Live class created' });
    },
    onError: (err: any) => toast({ title: 'Error', description: err.message, variant: 'destructive' }),
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => { await apiRequest('DELETE', `/api/live-classes/${id}`); },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['/api/live-classes'] });
      toast({ title: 'Class deleted' });
    },
    onError: () => toast({ title: 'Delete failed', variant: 'destructive' }),
  });

  const statusMutation = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: string }) => {
      const res = await apiRequest('PATCH', `/api/live-classes/${id}`, { status });
      return res.json();
    },
    onSuccess: (_, vars) => {
      qc.invalidateQueries({ queryKey: ['/api/live-classes'] });
      toast({ title: vars.status === 'live' ? '🔴 Class is now live!' : 'Class ended' });
    },
  });

  const resetForm = () => setForm({ title: '', description: '', startTime: '', endTime: '', maxParticipants: '30', tags: '', isRecording: false });

  const openAdd = () => { setEditId(null); resetForm(); setIsModalOpen(true); };

  const openEdit = (cls: LiveClass) => {
    setEditId(cls.id);
    setForm({
      title: cls.title, description: cls.description,
      startTime: cls.startTime.slice(0, 16), endTime: cls.endTime.slice(0, 16),
      maxParticipants: String(cls.maxParticipants),
      tags: Array.isArray(cls.tags) ? cls.tags.join(', ') : '',
      isRecording: cls.isRecording,
    });
    setIsModalOpen(true);
  };

  const copyJoinLink = (cls: LiveClass) => {
    const link = `${window.location.origin}/learning/live-classes?room=${cls.roomId}`;
    navigator.clipboard.writeText(link);
    toast({ title: 'Join link copied!' });
  };

  const liveCount = (classes as LiveClass[]).filter(c => c.status === 'live').length;
  const scheduledCount = (classes as LiveClass[]).filter(c => c.status === 'scheduled').length;
  const totalParticipants = (classes as LiveClass[]).filter(c => c.status === 'live').reduce((s, c) => s + c.currentParticipants, 0);

  return (
    <div className="max-w-7xl mx-auto py-8 px-4 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Live Classes</h1>
          <p className="text-muted-foreground mt-1">Schedule and manage live video sessions.</p>
        </div>
        <Button onClick={openAdd}><Plus className="h-4 w-4 mr-2" />Create Class</Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4">
        <Card><CardContent className="p-4 text-center">
          <p className="text-2xl font-bold text-primary">{classes.length}</p>
          <p className="text-xs text-muted-foreground">Total Classes</p>
        </CardContent></Card>
        <Card><CardContent className="p-4 text-center">
          <p className="text-2xl font-bold text-green-500">{liveCount}</p>
          <p className="text-xs text-muted-foreground">Live Now</p>
        </CardContent></Card>
        <Card><CardContent className="p-4 text-center">
          <p className="text-2xl font-bold text-blue-500">{scheduledCount}</p>
          <p className="text-xs text-muted-foreground">Scheduled</p>
        </CardContent></Card>
        <Card><CardContent className="p-4 text-center">
          <p className="text-2xl font-bold text-orange-500">{totalParticipants}</p>
          <p className="text-xs text-muted-foreground">Active Participants</p>
        </CardContent></Card>
      </div>

      {/* Filters */}
      <Card><CardContent className="p-4 flex gap-3 flex-wrap">
        <div className="flex-1 relative min-w-48">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search classes..." value={search} onChange={e => setSearch(e.target.value)} className="pl-10" />
        </div>
        <div className="flex gap-2">
          {['all', 'scheduled', 'live', 'ended'].map(s => (
            <Button key={s} size="sm" variant={filterStatus === s ? 'default' : 'outline'}
              onClick={() => setFilterStatus(s)} className="capitalize">{s}</Button>
          ))}
        </div>
      </CardContent></Card>

      {/* Classes List */}
      {isLoading ? (
        <div className="space-y-3">{[...Array(3)].map((_, i) => <Skeleton key={i} className="h-24 w-full" />)}</div>
      ) : filtered.length === 0 ? (
        <Card><CardContent className="p-12 text-center">
          <Video className="h-12 w-12 text-muted-foreground mx-auto mb-3 opacity-30" />
          <p className="font-semibold">No classes found</p>
          <Button className="mt-4" onClick={openAdd}><Plus className="h-4 w-4 mr-2" />Create Class</Button>
        </CardContent></Card>
      ) : (
        <div className="space-y-3">
          {filtered.map(cls => {
            const cfg = STATUS_CONFIG[cls.status];
            const duration = Math.round((new Date(cls.endTime).getTime() - new Date(cls.startTime).getTime()) / 60000);
            return (
              <Card key={cls.id} className={`border-l-4 ${cls.status === 'live' ? 'border-l-green-500' : cls.status === 'scheduled' ? 'border-l-blue-400' : 'border-l-gray-300'}`}>
                <CardContent className="p-4">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap mb-1">
                        <h3 className="font-semibold">{cls.title}</h3>
                        <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${cfg.color}`}>{cfg.label}</span>
                        {cls.isRecording && <Badge variant="outline" className="text-xs text-red-500 border-red-300">⏺ Recording</Badge>}
                      </div>
                      <p className="text-sm text-muted-foreground line-clamp-1 mb-2">{cls.description}</p>
                      <div className="flex items-center gap-4 text-xs text-muted-foreground flex-wrap">
                        <span className="flex items-center gap-1"><Calendar className="h-3 w-3" />{new Date(cls.startTime).toLocaleString()}</span>
                        <span className="flex items-center gap-1"><Clock className="h-3 w-3" />{duration} min</span>
                        <span className="flex items-center gap-1"><Users className="h-3 w-3" />{cls.currentParticipants}/{cls.maxParticipants}</span>
                        <span className="font-mono text-[10px] bg-muted px-1.5 py-0.5 rounded">Room: {cls.roomId}</span>
                      </div>
                      {Array.isArray(cls.tags) && cls.tags.length > 0 && (
                        <div className="flex gap-1 mt-2 flex-wrap">
                          {cls.tags.map(t => <Badge key={t} variant="secondary" className="text-xs">{t}</Badge>)}
                        </div>
                      )}
                    </div>
                    <div className="flex gap-1 flex-wrap shrink-0">
                      <Button size="sm" variant="outline" onClick={() => copyJoinLink(cls)} title="Copy join link">
                        <Copy className="h-3.5 w-3.5" />
                      </Button>
                      <Button size="sm" variant="outline" onClick={() => openEdit(cls)}>
                        <Edit className="h-3.5 w-3.5" />
                      </Button>
                      {cls.status === 'scheduled' && (
                        <Button size="sm" className="bg-green-600 hover:bg-green-700"
                          onClick={() => statusMutation.mutate({ id: cls.id, status: 'live' })}>
                          <Play className="h-3.5 w-3.5 mr-1" />Start
                        </Button>
                      )}
                      {cls.status === 'live' && (
                        <Button size="sm" variant="destructive"
                          onClick={() => statusMutation.mutate({ id: cls.id, status: 'ended' })}>
                          <StopCircle className="h-3.5 w-3.5 mr-1" />End
                        </Button>
                      )}
                      <Button size="sm" variant="ghost" className="text-destructive hover:text-destructive"
                        onClick={() => { if (confirm(`Delete "${cls.title}"?`)) deleteMutation.mutate(cls.id); }}>
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      {/* Create/Edit Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader><DialogTitle>{editId ? 'Edit Live Class' : 'Create Live Class'}</DialogTitle></DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="block mb-1 font-medium text-sm">Title *</label>
              <Input value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
                placeholder="JavaScript Fundamentals Live Session" />
            </div>
            <div>
              <label className="block mb-1 font-medium text-sm">Description</label>
              <textarea className="w-full border rounded px-3 py-2 text-sm bg-background resize-none"
                value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} rows={2}
                placeholder="What will be covered in this session?" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block mb-1 font-medium text-sm">Start Time *</label>
                <Input type="datetime-local" value={form.startTime}
                  onChange={e => setForm(f => ({ ...f, startTime: e.target.value }))} />
              </div>
              <div>
                <label className="block mb-1 font-medium text-sm">End Time *</label>
                <Input type="datetime-local" value={form.endTime}
                  onChange={e => setForm(f => ({ ...f, endTime: e.target.value }))} />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block mb-1 font-medium text-sm">Max Participants</label>
                <Input type="number" value={form.maxParticipants} min="1" max="500"
                  onChange={e => setForm(f => ({ ...f, maxParticipants: e.target.value }))} />
              </div>
              <div>
                <label className="block mb-1 font-medium text-sm">Tags (comma-separated)</label>
                <Input value={form.tags} onChange={e => setForm(f => ({ ...f, tags: e.target.value }))}
                  placeholder="JavaScript, Beginner, ES6" />
              </div>
            </div>
            <label className="flex items-center gap-2 cursor-pointer select-none">
              <input type="checkbox" checked={form.isRecording}
                onChange={e => setForm(f => ({ ...f, isRecording: e.target.checked }))}
                className="rounded" />
              <span className="text-sm font-medium">Enable Recording</span>
              <span className="text-xs text-muted-foreground">(session will be recorded)</span>
            </label>
          </div>
          <DialogFooter>
            <Button variant="ghost" onClick={() => setIsModalOpen(false)}>Cancel</Button>
            <Button onClick={() => saveMutation.mutate()}
              disabled={saveMutation.isPending || !form.title.trim() || !form.startTime || !form.endTime}>
              {saveMutation.isPending ? 'Saving...' : editId ? 'Save Changes' : 'Create Class'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
