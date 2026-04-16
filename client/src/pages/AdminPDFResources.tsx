import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import { Progress } from '@/components/ui/progress';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Search, Upload, FileText, Eye, Trash2, Edit, Download, ExternalLink } from 'lucide-react';

interface PDFResource {
  id: number;
  title: string;
  description: string;
  category: string;
  difficulty: string;
  fileSize: string | null;
  pageCount: number | null;
  downloadCount: number;
  url: string | null;
  createdAt: string;
}

const CATEGORIES = ['javascript', 'react', 'nodejs', 'css', 'html', 'typescript', 'python', 'general'];
const DIFFICULTIES = ['beginner', 'intermediate', 'advanced'];
const DIFF_COLORS: Record<string, string> = {
  beginner: 'bg-green-500/20 text-green-600',
  intermediate: 'bg-yellow-500/20 text-yellow-600',
  advanced: 'bg-red-500/20 text-red-600',
};

export default function AdminPDFResources() {
  const qc = useQueryClient();
  const { toast } = useToast();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editId, setEditId] = useState<number | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [search, setSearch] = useState('');
  const [filterCat, setFilterCat] = useState('all');
  const [form, setForm] = useState({ title: '', description: '', category: 'javascript', difficulty: 'beginner' });

  const { data: pdfs = [], isLoading } = useQuery<PDFResource[]>({
    queryKey: ['/api/pdfs'],
  });

  const filtered = (pdfs as PDFResource[]).filter(p => {
    const q = search.toLowerCase();
    const matchSearch = !search || p.title.toLowerCase().includes(q) || p.description?.toLowerCase().includes(q);
    const matchCat = filterCat === 'all' || p.category === filterCat;
    return matchSearch && matchCat;
  });

  const saveMutation = useMutation({
    mutationFn: async () => {
      if (editId) {
        const res = await fetch(`/api/pdfs/${editId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify(form),
        });
        if (!res.ok) throw new Error(await res.text());
        return res.json();
      }
      if (!file) throw new Error('No file selected');
      // Simulate upload progress
      setUploadProgress(10);
      const formData = new FormData();
      formData.append('pdf', file);
      formData.append('title', form.title || file.name.replace('.pdf', ''));
      formData.append('description', form.description);
      formData.append('category', form.category);
      formData.append('difficulty', form.difficulty);
      setUploadProgress(40);
      const res = await fetch('/api/pdfs', { method: 'POST', credentials: 'include', body: formData });
      setUploadProgress(90);
      if (!res.ok) throw new Error(await res.text());
      setUploadProgress(100);
      return res.json();
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['/api/pdfs'] });
      qc.invalidateQueries({ queryKey: ['/api/content/resources'] });
      setIsModalOpen(false);
      setForm({ title: '', description: '', category: 'javascript', difficulty: 'beginner' });
      setFile(null);
      setEditId(null);
      setUploadProgress(0);
      toast({ title: editId ? '✅ PDF updated' : '✅ PDF uploaded successfully' });
    },
    onError: (err: any) => {
      setUploadProgress(0);
      toast({ title: 'Error', description: err.message, variant: 'destructive' });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      const res = await fetch(`/api/pdfs/${id}`, { method: 'DELETE', credentials: 'include' });
      if (!res.ok) throw new Error('Delete failed');
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['/api/pdfs'] });
      qc.invalidateQueries({ queryKey: ['/api/content/resources'] });
      toast({ title: 'PDF deleted' });
    },
    onError: () => toast({ title: 'Delete failed', variant: 'destructive' }),
  });

  const openAdd = () => {
    setEditId(null);
    setFile(null);
    setUploadProgress(0);
    setForm({ title: '', description: '', category: 'javascript', difficulty: 'beginner' });
    setIsModalOpen(true);
  };

  const openEdit = (pdf: PDFResource) => {
    setEditId(pdf.id);
    setForm({ title: pdf.title, description: pdf.description || '', category: pdf.category, difficulty: pdf.difficulty });
    setIsModalOpen(true);
  };

  const totalDownloads = (pdfs as PDFResource[]).reduce((s, p) => s + p.downloadCount, 0);

  return (
    <div className="max-w-7xl mx-auto py-8 px-4 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">PDF Resources</h1>
          <p className="text-muted-foreground mt-1">Upload and manage PDF study materials for students.</p>
        </div>
        <Button onClick={openAdd}><Upload className="h-4 w-4 mr-2" />Upload PDF</Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        <Card><CardContent className="p-4 text-center">
          <p className="text-2xl font-bold text-primary">{pdfs.length}</p>
          <p className="text-xs text-muted-foreground">Total PDFs</p>
        </CardContent></Card>
        <Card><CardContent className="p-4 text-center">
          <p className="text-2xl font-bold text-green-500">{totalDownloads.toLocaleString()}</p>
          <p className="text-xs text-muted-foreground">Total Downloads</p>
        </CardContent></Card>
        <Card><CardContent className="p-4 text-center">
          <p className="text-2xl font-bold text-blue-500">{(pdfs as PDFResource[]).filter(p => p.url).length}</p>
          <p className="text-xs text-muted-foreground">With File URL</p>
        </CardContent></Card>
      </div>

      {/* Filters */}
      <Card><CardContent className="p-4 flex gap-3 flex-wrap">
        <div className="flex-1 relative min-w-48">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search PDFs..." value={search} onChange={e => setSearch(e.target.value)} className="pl-10" />
        </div>
        <Select value={filterCat} onValueChange={setFilterCat}>
          <SelectTrigger className="w-40"><SelectValue placeholder="Category" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            {CATEGORIES.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
          </SelectContent>
        </Select>
        <span className="text-sm text-muted-foreground self-center">{filtered.length} of {pdfs.length}</span>
      </CardContent></Card>

      {/* Table */}
      <Card>
        <CardHeader><CardTitle className="flex items-center gap-2"><FileText className="h-4 w-4" />PDF Library</CardTitle></CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-2">{[...Array(4)].map((_, i) => <Skeleton key={i} className="h-14 w-full" />)}</div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-12">
              <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-3 opacity-30" />
              <p className="font-semibold">No PDFs found</p>
              <p className="text-sm text-muted-foreground mt-1">Upload your first PDF or adjust filters</p>
              <Button className="mt-4" onClick={openAdd}><Upload className="h-4 w-4 mr-2" />Upload PDF</Button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead><tr className="border-b text-left">
                  <th className="py-3 pr-4 font-semibold">Title</th>
                  <th className="py-3 pr-4 font-semibold">Category</th>
                  <th className="py-3 pr-4 font-semibold">Difficulty</th>
                  <th className="py-3 pr-4 font-semibold">Size</th>
                  <th className="py-3 pr-4 font-semibold">Downloads</th>
                  <th className="py-3 pr-4 font-semibold">URL</th>
                  <th className="py-3 font-semibold">Actions</th>
                </tr></thead>
                <tbody>
                  {filtered.map(pdf => (
                    <tr key={pdf.id} className="border-b hover:bg-muted/30 transition-colors">
                      <td className="py-3 pr-4">
                        <p className="font-semibold truncate max-w-[200px]">{pdf.title}</p>
                        {pdf.description && <p className="text-xs text-muted-foreground truncate max-w-[200px]">{pdf.description}</p>}
                      </td>
                      <td className="py-3 pr-4"><Badge variant="outline" className="text-xs">{pdf.category}</Badge></td>
                      <td className="py-3 pr-4"><Badge className={`text-xs border-0 ${DIFF_COLORS[pdf.difficulty] || ''}`}>{pdf.difficulty}</Badge></td>
                      <td className="py-3 pr-4 text-xs text-muted-foreground">{pdf.fileSize || '—'}</td>
                      <td className="py-3 pr-4">
                        <span className="flex items-center gap-1 text-xs"><Download className="h-3 w-3" />{pdf.downloadCount.toLocaleString()}</span>
                      </td>
                      <td className="py-3 pr-4">
                        {pdf.url ? (
                          <a href={pdf.url} target="_blank" rel="noopener noreferrer"
                            className="flex items-center gap-1 text-xs text-primary hover:underline">
                            <ExternalLink className="h-3 w-3" />View
                          </a>
                        ) : <span className="text-xs text-muted-foreground">No file</span>}
                      </td>
                      <td className="py-3">
                        <div className="flex gap-1">
                          <Button size="sm" variant="outline" onClick={() => openEdit(pdf)}><Edit className="h-3.5 w-3.5" /></Button>
                          {pdf.url && <Button size="sm" variant="ghost" onClick={() => window.open(pdf.url!, '_blank')}><Eye className="h-3.5 w-3.5" /></Button>}
                          <Button size="sm" variant="ghost" className="text-destructive hover:text-destructive"
                            onClick={() => { if (confirm(`Delete "${pdf.title}"?`)) deleteMutation.mutate(pdf.id); }}>
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

      {/* Upload/Edit Modal */}
      <Dialog open={isModalOpen} onOpenChange={open => { if (!saveMutation.isPending) setIsModalOpen(open); }}>
        <DialogContent className="max-w-lg">
          <DialogHeader><DialogTitle>{editId ? 'Edit PDF Metadata' : 'Upload New PDF'}</DialogTitle></DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="block mb-1 font-medium text-sm">Title *</label>
              <Input value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
                placeholder={file?.name?.replace('.pdf', '') || 'PDF title'} />
            </div>
            <div>
              <label className="block mb-1 font-medium text-sm">Description</label>
              <textarea className="w-full border rounded px-3 py-2 text-sm bg-background resize-none"
                value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} rows={2}
                placeholder="Brief description of this resource..." />
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
            {!editId && (
              <div>
                <label className="block mb-1 font-medium text-sm">PDF File * (max 20MB)</label>
                <div className={`border-2 border-dashed rounded-lg p-4 text-center transition-colors ${file ? 'border-primary/50 bg-primary/5' : 'border-border hover:border-primary/30'}`}>
                  <input type="file" accept=".pdf" className="hidden" id="pdf-upload"
                    onChange={e => {
                      const f = e.target.files?.[0];
                      if (f) {
                        if (f.size > 20 * 1024 * 1024) { toast({ title: 'File too large (max 20MB)', variant: 'destructive' }); return; }
                        setFile(f);
                        if (!form.title) setForm(prev => ({ ...prev, title: f.name.replace('.pdf', '') }));
                      }
                    }} />
                  <label htmlFor="pdf-upload" className="cursor-pointer">
                    {file ? (
                      <div>
                        <FileText className="h-8 w-8 text-primary mx-auto mb-1" />
                        <p className="text-sm font-medium">{file.name}</p>
                        <p className="text-xs text-muted-foreground">{(file.size / 1024 / 1024).toFixed(1)} MB</p>
                      </div>
                    ) : (
                      <div>
                        <Upload className="h-8 w-8 text-muted-foreground mx-auto mb-1" />
                        <p className="text-sm text-muted-foreground">Click to select PDF file</p>
                      </div>
                    )}
                  </label>
                </div>
                {uploadProgress > 0 && uploadProgress < 100 && (
                  <div className="mt-2">
                    <Progress value={uploadProgress} className="h-1.5" />
                    <p className="text-xs text-muted-foreground mt-1">Uploading... {uploadProgress}%</p>
                  </div>
                )}
              </div>
            )}
          </div>
          <DialogFooter>
            <Button variant="ghost" onClick={() => setIsModalOpen(false)} disabled={saveMutation.isPending}>Cancel</Button>
            <Button onClick={() => saveMutation.mutate()}
              disabled={saveMutation.isPending || (!editId && !file) || !form.title.trim()}>
              {saveMutation.isPending ? (editId ? 'Saving...' : 'Uploading...') : editId ? 'Save Changes' : 'Upload PDF'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
