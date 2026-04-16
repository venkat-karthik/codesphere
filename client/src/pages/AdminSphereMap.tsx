import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { apiRequest } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';
import { MapPin, Plus, Edit, Trash2, Globe, Calendar, Search } from 'lucide-react';

interface SphereEvent {
  id: number;
  title: string;
  description: string;
  latitude: number;
  longitude: number;
  date: string;
  category: string;
}

export default function AdminSphereMap() {
  const qc = useQueryClient();
  const { toast } = useToast();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editId, setEditId] = useState<number | null>(null);
  const [search, setSearch] = useState('');
  const [form, setForm] = useState({ title: '', description: '', latitude: '', longitude: '', date: '', category: 'event' });

  // Fetch events from DB via community posts (type=sphere-event) or dedicated endpoint
  const { data: events = [], isLoading } = useQuery<SphereEvent[]>({
    queryKey: ['/api/sphere-events'],
    queryFn: async () => {
      const res = await fetch('/api/sphere-events', { credentials: 'include' });
      if (!res.ok) return [];
      return res.json();
    },
  });

  const saveMutation = useMutation({
    mutationFn: async () => {
      const payload = {
        title: form.title,
        description: form.description,
        latitude: parseFloat(form.latitude),
        longitude: parseFloat(form.longitude),
        date: form.date,
        category: form.category,
      };
      if (editId) {
        const res = await apiRequest('PATCH', `/api/sphere-events/${editId}`, payload);
        return res.json();
      }
      const res = await apiRequest('POST', '/api/sphere-events', payload);
      return res.json();
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['/api/sphere-events'] });
      setIsModalOpen(false);
      resetForm();
      toast({ title: editId ? '✅ Event updated' : '✅ Event added to Sphere Map' });
    },
    onError: (err: any) => toast({ title: 'Error', description: err.message, variant: 'destructive' }),
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: number) => { await apiRequest('DELETE', `/api/sphere-events/${id}`); },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['/api/sphere-events'] });
      toast({ title: 'Event deleted' });
    },
  });

  const resetForm = () => setForm({ title: '', description: '', latitude: '', longitude: '', date: '', category: 'event' });

  const openAdd = () => { setEditId(null); resetForm(); setIsModalOpen(true); };
  const openEdit = (e: SphereEvent) => {
    setEditId(e.id);
    setForm({ title: e.title, description: e.description, latitude: String(e.latitude), longitude: String(e.longitude), date: e.date, category: e.category });
    setIsModalOpen(true);
  };

  const filtered = (events as SphereEvent[]).filter(e =>
    !search || e.title.toLowerCase().includes(search.toLowerCase()) || e.category.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto py-8 px-4 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Sphere Map Events</h1>
          <p className="text-muted-foreground mt-1">Pin events and learning activities on the global map.</p>
        </div>
        <Button onClick={openAdd}><Plus className="h-4 w-4 mr-2" />Add Event</Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        <Card><CardContent className="p-4 text-center">
          <p className="text-2xl font-bold text-primary">{events.length}</p>
          <p className="text-xs text-muted-foreground">Total Events</p>
        </CardContent></Card>
        <Card><CardContent className="p-4 text-center">
          <p className="text-2xl font-bold text-blue-500">{new Set((events as SphereEvent[]).map(e => e.category)).size}</p>
          <p className="text-xs text-muted-foreground">Categories</p>
        </CardContent></Card>
        <Card><CardContent className="p-4 text-center">
          <p className="text-2xl font-bold text-green-500">
            {(events as SphereEvent[]).filter(e => new Date(e.date) >= new Date()).length}
          </p>
          <p className="text-xs text-muted-foreground">Upcoming</p>
        </CardContent></Card>
      </div>

      {/* Search */}
      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input placeholder="Search events..." value={search} onChange={e => setSearch(e.target.value)} className="pl-10" />
      </div>

      {/* Events Table */}
      <Card>
        <CardHeader><CardTitle className="flex items-center gap-2"><Globe className="h-4 w-4" />Map Events</CardTitle></CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-2">{[...Array(3)].map((_, i) => <Skeleton key={i} className="h-14 w-full" />)}</div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-12">
              <MapPin className="h-12 w-12 text-muted-foreground mx-auto mb-3 opacity-30" />
              <p className="font-semibold">No events yet</p>
              <p className="text-sm text-muted-foreground mt-1">Add events to display on the Sphere Map</p>
              <Button className="mt-4" onClick={openAdd}><Plus className="h-4 w-4 mr-2" />Add First Event</Button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead><tr className="border-b text-left">
                  <th className="py-3 pr-4 font-semibold">Title</th>
                  <th className="py-3 pr-4 font-semibold">Category</th>
                  <th className="py-3 pr-4 font-semibold">Coordinates</th>
                  <th className="py-3 pr-4 font-semibold">Date</th>
                  <th className="py-3 font-semibold">Actions</th>
                </tr></thead>
                <tbody>
                  {filtered.map(event => (
                    <tr key={event.id} className="border-b hover:bg-muted/30 transition-colors">
                      <td className="py-3 pr-4">
                        <p className="font-semibold">{event.title}</p>
                        {event.description && <p className="text-xs text-muted-foreground truncate max-w-[200px]">{event.description}</p>}
                      </td>
                      <td className="py-3 pr-4"><Badge variant="outline" className="text-xs">{event.category}</Badge></td>
                      <td className="py-3 pr-4 font-mono text-xs text-muted-foreground">
                        {event.latitude.toFixed(4)}, {event.longitude.toFixed(4)}
                      </td>
                      <td className="py-3 pr-4 text-xs flex items-center gap-1">
                        <Calendar className="h-3 w-3" />{new Date(event.date).toLocaleDateString()}
                      </td>
                      <td className="py-3">
                        <div className="flex gap-1">
                          <Button size="sm" variant="outline" onClick={() => openEdit(event)}><Edit className="h-3.5 w-3.5" /></Button>
                          <Button size="sm" variant="ghost" className="text-destructive hover:text-destructive"
                            onClick={() => { if (confirm(`Delete "${event.title}"?`)) deleteMutation.mutate(event.id); }}>
                            <Trash2 className="h-3.5 w-3.5" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader><DialogTitle>{editId ? 'Edit Event' : 'Add Map Event'}</DialogTitle></DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="block mb-1 font-medium text-sm">Title *</label>
              <Input value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} placeholder="Event title" />
            </div>
            <div>
              <label className="block mb-1 font-medium text-sm">Description</label>
              <textarea className="w-full border rounded px-3 py-2 text-sm bg-background resize-none"
                value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} rows={2} />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block mb-1 font-medium text-sm">Latitude *</label>
                <Input type="number" step="any" value={form.latitude}
                  onChange={e => setForm(f => ({ ...f, latitude: e.target.value }))} placeholder="e.g. 40.7128" />
              </div>
              <div>
                <label className="block mb-1 font-medium text-sm">Longitude *</label>
                <Input type="number" step="any" value={form.longitude}
                  onChange={e => setForm(f => ({ ...f, longitude: e.target.value }))} placeholder="e.g. -74.0060" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block mb-1 font-medium text-sm">Date *</label>
                <Input type="date" value={form.date} onChange={e => setForm(f => ({ ...f, date: e.target.value }))} />
              </div>
              <div>
                <label className="block mb-1 font-medium text-sm">Category</label>
                <select className="w-full border rounded px-3 py-2 text-sm bg-background"
                  value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value }))}>
                  {['event', 'workshop', 'hackathon', 'meetup', 'conference', 'other'].map(c =>
                    <option key={c} value={c}>{c}</option>
                  )}
                </select>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="ghost" onClick={() => setIsModalOpen(false)}>Cancel</Button>
            <Button onClick={() => saveMutation.mutate()}
              disabled={saveMutation.isPending || !form.title.trim() || !form.latitude || !form.longitude || !form.date}>
              {saveMutation.isPending ? 'Saving...' : editId ? 'Save Changes' : 'Add Event'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
