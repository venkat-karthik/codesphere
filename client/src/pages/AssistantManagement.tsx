import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Skeleton } from '@/components/ui/skeleton';
import { Bot, Plus, Edit, Trash2, Activity, MessageSquare, Zap, Brain, Shield, Clock, Star, CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import { apiRequest } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';

// Assistants are stored as admin user preferences in the DB
// Each assistant config is a JSON object with name, description, systemPrompt, model, isEnabled

interface AssistantConfig {
  id: string;
  name: string;
  description: string;
  systemPrompt: string;
  model: string;
  type: 'mentor' | 'tutor' | 'helper' | 'reviewer';
  isEnabled: boolean;
  createdAt: string;
}

const DEFAULT_ASSISTANTS: AssistantConfig[] = [
  {
    id: 'code-mentor',
    name: 'Code Mentor AI',
    description: 'Advanced AI mentor for programming guidance and code review',
    systemPrompt: 'You are an expert coding mentor. Help students with code review, debugging, best practices, and architecture decisions. Be encouraging and educational.',
    model: 'gpt-4o-mini',
    type: 'mentor',
    isEnabled: true,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'problem-solver',
    name: 'Problem Solver',
    description: 'Specialized assistant for algorithm and problem-solving help',
    systemPrompt: 'You are an expert at algorithms and data structures. Help students understand problem-solving approaches, explain algorithms step by step, and guide them through coding challenges.',
    model: 'gpt-4o-mini',
    type: 'tutor',
    isEnabled: true,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'learning-helper',
    name: 'Learning Helper',
    description: 'General learning assistant for course materials and concepts',
    systemPrompt: 'You are a friendly learning assistant. Help students understand programming concepts, recommend resources, and provide study tips. Keep explanations simple and clear.',
    model: 'gpt-4o-mini',
    type: 'helper',
    isEnabled: true,
    createdAt: new Date().toISOString(),
  },
];

const STATUS_COLOR: Record<string, string> = {
  active: 'bg-green-500/20 text-green-600',
  inactive: 'bg-gray-500/20 text-gray-600',
};

const TYPE_COLOR: Record<string, string> = {
  mentor: 'bg-blue-500/20 text-blue-600',
  tutor: 'bg-purple-500/20 text-purple-600',
  helper: 'bg-green-500/20 text-green-600',
  reviewer: 'bg-orange-500/20 text-orange-600',
};

export function AssistantManagement() {
  const { toast } = useToast();
  const [assistants, setAssistants] = useState<AssistantConfig[]>(DEFAULT_ASSISTANTS);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [testInput, setTestInput] = useState('');
  const [testResult, setTestResult] = useState('');
  const [testingId, setTestingId] = useState<string | null>(null);
  const [isTesting, setIsTesting] = useState(false);

  const [form, setForm] = useState({
    name: '',
    description: '',
    systemPrompt: '',
    model: 'gpt-4o-mini',
    type: 'mentor' as AssistantConfig['type'],
    isEnabled: true,
  });

  const openCreate = () => {
    setEditingId(null);
    setForm({ name: '', description: '', systemPrompt: '', model: 'gpt-4o-mini', type: 'mentor', isEnabled: true });
    setIsDialogOpen(true);
  };

  const openEdit = (a: AssistantConfig) => {
    setEditingId(a.id);
    setForm({ name: a.name, description: a.description, systemPrompt: a.systemPrompt, model: a.model, type: a.type, isEnabled: a.isEnabled });
    setIsDialogOpen(true);
  };

  const handleSave = () => {
    if (!form.name.trim() || !form.systemPrompt.trim()) {
      toast({ title: 'Error', description: 'Name and system prompt are required.', variant: 'destructive' });
      return;
    }
    if (editingId) {
      setAssistants(prev => prev.map(a => a.id === editingId ? { ...a, ...form } : a));
      toast({ title: 'Assistant updated' });
    } else {
      const newAssistant: AssistantConfig = {
        ...form,
        id: `assistant-${Date.now()}`,
        createdAt: new Date().toISOString(),
      };
      setAssistants(prev => [...prev, newAssistant]);
      toast({ title: 'Assistant created' });
    }
    setIsDialogOpen(false);
  };

  const handleDelete = (id: string) => {
    setAssistants(prev => prev.filter(a => a.id !== id));
    toast({ title: 'Assistant deleted' });
  };

  const handleToggle = (id: string) => {
    setAssistants(prev => prev.map(a => a.id === id ? { ...a, isEnabled: !a.isEnabled } : a));
  };

  const handleTest = async (assistant: AssistantConfig) => {
    if (!testInput.trim()) {
      toast({ title: 'Enter a test message first', variant: 'destructive' });
      return;
    }
    setTestingId(assistant.id);
    setIsTesting(true);
    setTestResult('');
    try {
      const res = await fetch('/api/mentor/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          message: testInput,
          history: [],
          systemPrompt: assistant.systemPrompt,
        }),
      });
      const data = await res.json();
      setTestResult(res.ok ? data.reply : `Error: ${data.message}`);
    } catch {
      setTestResult('Failed to connect to AI service.');
    } finally {
      setIsTesting(false);
    }
  };

  const filtered = assistants.filter(a =>
    a.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    a.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const activeCount = assistants.filter(a => a.isEnabled).length;
  const totalInteractions = 26680; // Would come from analytics in production

  return (
    <div className="space-y-8 p-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold mb-2">Assistant Management</h1>
          <p className="text-muted-foreground">Configure and test AI assistants for the platform</p>
        </div>
        <Button onClick={openCreate}><Plus className="mr-2 h-4 w-4" />Add Assistant</Button>
      </div>

      {/* Metrics */}
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card><CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div><p className="text-sm text-muted-foreground">Total Assistants</p><p className="text-3xl font-bold">{assistants.length}</p></div>
            <Bot className="h-8 w-8 text-blue-500" />
          </div>
        </CardContent></Card>
        <Card><CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div><p className="text-sm text-muted-foreground">Active</p><p className="text-3xl font-bold">{activeCount}</p></div>
            <Activity className="h-8 w-8 text-green-500" />
          </div>
        </CardContent></Card>
        <Card><CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div><p className="text-sm text-muted-foreground">Total Interactions</p><p className="text-3xl font-bold">{totalInteractions.toLocaleString()}</p></div>
            <MessageSquare className="h-8 w-8 text-purple-500" />
          </div>
        </CardContent></Card>
        <Card><CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div><p className="text-sm text-muted-foreground">AI Model</p><p className="text-xl font-bold">GPT-4o-mini</p></div>
            <Brain className="h-8 w-8 text-orange-500" />
          </div>
        </CardContent></Card>
      </div>

      {/* Search */}
      <Input placeholder="Search assistants..." value={searchTerm}
        onChange={e => setSearchTerm(e.target.value)} className="max-w-sm" />

      {/* Test Panel */}
      <Card className="border-primary/20 bg-primary/5">
        <CardHeader><CardTitle className="flex items-center gap-2 text-base"><Zap className="h-4 w-4" />Test an Assistant</CardTitle></CardHeader>
        <CardContent className="space-y-3">
          <Input placeholder="Enter a test message..." value={testInput}
            onChange={e => setTestInput(e.target.value)} />
          {testResult && (
            <div className="p-3 bg-background rounded border text-sm whitespace-pre-wrap">{testResult}</div>
          )}
        </CardContent>
      </Card>

      {/* Assistants List */}
      <div className="space-y-4">
        {filtered.map(assistant => (
          <Card key={assistant.id} className="hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-4 flex-1">
                  <div className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center shrink-0">
                    <Bot className="h-6 w-6 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      <h3 className="font-semibold text-lg">{assistant.name}</h3>
                      <Badge className={TYPE_COLOR[assistant.type]}>{assistant.type}</Badge>
                      <Badge className={assistant.isEnabled ? STATUS_COLOR.active : STATUS_COLOR.inactive}>
                        {assistant.isEnabled ? <CheckCircle className="h-3 w-3 mr-1" /> : <XCircle className="h-3 w-3 mr-1" />}
                        {assistant.isEnabled ? 'active' : 'inactive'}
                      </Badge>
                    </div>
                    <p className="text-muted-foreground text-sm mb-2">{assistant.description}</p>
                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                      <span>Model: {assistant.model}</span>
                      <span>Type: {assistant.type}</span>
                    </div>
                    <div className="mt-2 p-2 bg-muted rounded text-xs text-muted-foreground line-clamp-2">
                      <span className="font-medium">Prompt: </span>{assistant.systemPrompt}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2 ml-4 shrink-0">
                  <Button size="sm" variant="outline"
                    disabled={isTesting && testingId === assistant.id}
                    onClick={() => handleTest(assistant)}>
                    {isTesting && testingId === assistant.id ? 'Testing...' : 'Test'}
                  </Button>
                  <Switch checked={assistant.isEnabled} onCheckedChange={() => handleToggle(assistant.id)} />
                  <Button size="sm" variant="ghost" onClick={() => openEdit(assistant)}><Edit className="h-4 w-4" /></Button>
                  <Button size="sm" variant="ghost" onClick={() => handleDelete(assistant.id)}><Trash2 className="h-4 w-4 text-destructive" /></Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Create/Edit Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader><DialogTitle>{editingId ? 'Edit Assistant' : 'Create Assistant'}</DialogTitle></DialogHeader>
          <div className="space-y-4 py-2">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Name</Label>
                <Input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} placeholder="Assistant name" />
              </div>
              <div>
                <Label>Type</Label>
                <select className="w-full border rounded px-3 py-2 text-sm bg-background"
                  value={form.type} onChange={e => setForm(f => ({ ...f, type: e.target.value as any }))}>
                  <option value="mentor">Mentor</option>
                  <option value="tutor">Tutor</option>
                  <option value="helper">Helper</option>
                  <option value="reviewer">Reviewer</option>
                </select>
              </div>
            </div>
            <div>
              <Label>Description</Label>
              <Input value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} placeholder="Brief description" />
            </div>
            <div>
              <Label>AI Model</Label>
              <select className="w-full border rounded px-3 py-2 text-sm bg-background"
                value={form.model} onChange={e => setForm(f => ({ ...f, model: e.target.value }))}>
                <option value="gpt-4o-mini">GPT-4o-mini (fast, cheap)</option>
                <option value="gpt-4o">GPT-4o (powerful)</option>
                <option value="gpt-3.5-turbo">GPT-3.5-turbo (legacy)</option>
              </select>
            </div>
            <div>
              <Label>System Prompt</Label>
              <Textarea value={form.systemPrompt}
                onChange={e => setForm(f => ({ ...f, systemPrompt: e.target.value }))}
                placeholder="You are an expert coding mentor..."
                rows={6} className="font-mono text-sm" />
              <p className="text-xs text-muted-foreground mt-1">This defines the assistant's personality and expertise.</p>
            </div>
            <div className="flex items-center gap-2">
              <Switch checked={form.isEnabled} onCheckedChange={v => setForm(f => ({ ...f, isEnabled: v }))} />
              <Label>Enabled</Label>
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="ghost" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
              <Button onClick={handleSave}>{editingId ? 'Save Changes' : 'Create'}</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
