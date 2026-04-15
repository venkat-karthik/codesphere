import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';

interface SphereEvent {
  id: string;
  title: string;
  description: string;
  latitude: number;
  longitude: number;
  date: string;
}

export default function AdminSphereMap() {
  const [events, setEvents] = useState<SphereEvent[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [form, setForm] = useState({ title: '', description: '', latitude: '', longitude: '', date: '' });

  const openAddModal = () => {
    setEditId(null);
    setForm({ title: '', description: '', latitude: '', longitude: '', date: '' });
    setIsModalOpen(true);
  };

  const openEditModal = (event: SphereEvent) => {
    setEditId(event.id);
    setForm({ title: event.title, description: event.description, latitude: String(event.latitude), longitude: String(event.longitude), date: event.date });
    setIsModalOpen(true);
  };

  const handleDelete = (id: string) => {
    setEvents(events.filter(event => event.id !== id));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title || !form.latitude || !form.longitude || !form.date) return;
    const latitude = parseFloat(form.latitude);
    const longitude = parseFloat(form.longitude);
    if (isNaN(latitude) || isNaN(longitude)) return;
    if (editId) {
      setEvents(events.map(event => event.id === editId ? { ...event, ...form, latitude, longitude } : event));
    } else {
      setEvents([
        ...events,
        {
          id: Date.now().toString(),
          title: form.title,
          description: form.description,
          latitude,
          longitude,
          date: form.date,
        },
      ]);
    }
    setIsModalOpen(false);
  };

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6">Admin Sphere Map Events</h1>
      <p className="mb-4 text-muted-foreground">Add and manage events on the Sphere Map for students. (Admin only)</p>
      <Button className="mb-4" onClick={openAddModal}>Add Event</Button>
      <div className="border rounded p-4 bg-card">
        <h2 className="text-xl font-semibold mb-2">Sphere Map Events</h2>
        {events.length === 0 ? (
          <div className="text-muted-foreground">No events added yet.</div>
        ) : (
          <table className="w-full text-left mt-2">
            <thead>
              <tr className="border-b">
                <th className="py-2 pr-4">Title</th>
                <th className="py-2 pr-4">Description</th>
                <th className="py-2 pr-4">Latitude</th>
                <th className="py-2 pr-4">Longitude</th>
                <th className="py-2 pr-4">Date</th>
                <th className="py-2 pr-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              {events.map(event => (
                <tr key={event.id} className="border-b hover:bg-muted/30">
                  <td className="py-2 pr-4 font-semibold">{event.title}</td>
                  <td className="py-2 pr-4 max-w-xs truncate">{event.description}</td>
                  <td className="py-2 pr-4">{event.latitude}</td>
                  <td className="py-2 pr-4">{event.longitude}</td>
                  <td className="py-2 pr-4 text-xs">{event.date}</td>
                  <td className="py-2 pr-4 flex gap-2">
                    <Button size="sm" variant="outline" onClick={() => openEditModal(event)}>Edit</Button>
                    <Button size="sm" variant="destructive" onClick={() => handleDelete(event.id)}>Delete</Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editId ? 'Edit Event' : 'Add Event'}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block mb-1 font-medium">Title</label>
              <input
                className="w-full border rounded px-3 py-2"
                value={form.title}
                onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
                required
              />
            </div>
            <div>
              <label className="block mb-1 font-medium">Description</label>
              <textarea
                className="w-full border rounded px-3 py-2"
                value={form.description}
                onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
                rows={2}
              />
            </div>
            <div className="flex gap-4">
              <div className="flex-1">
                <label className="block mb-1 font-medium">Latitude</label>
                <input
                  type="number"
                  step="any"
                  className="w-full border rounded px-3 py-2"
                  value={form.latitude}
                  onChange={e => setForm(f => ({ ...f, latitude: e.target.value }))}
                  required
                />
              </div>
              <div className="flex-1">
                <label className="block mb-1 font-medium">Longitude</label>
                <input
                  type="number"
                  step="any"
                  className="w-full border rounded px-3 py-2"
                  value={form.longitude}
                  onChange={e => setForm(f => ({ ...f, longitude: e.target.value }))}
                  required
                />
              </div>
            </div>
            <div>
              <label className="block mb-1 font-medium">Date</label>
              <input
                type="date"
                className="w-full border rounded px-3 py-2"
                value={form.date}
                onChange={e => setForm(f => ({ ...f, date: e.target.value }))}
                required
              />
            </div>
            <DialogFooter>
              <Button type="button" variant="ghost" onClick={() => setIsModalOpen(false)}>Cancel</Button>
              <Button type="submit">{editId ? 'Save Changes' : 'Add Event'}</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
} 