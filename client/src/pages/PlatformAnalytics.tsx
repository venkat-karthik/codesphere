import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import {
  BarChart3, TrendingUp, TrendingDown, Users, DollarSign,
  ShoppingCart, Activity, Download, Search, Trash2, User, Plus, BookOpen, Code
} from 'lucide-react';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
} from 'recharts';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { apiRequest } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';

interface AdminUser {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
  level: number;
  xp: number;
  streak: number;
  subscriptionType: string;
  totalStudyTime: number;
}

const revenueData = [
  { month: 'Jan', revenue: 4000, expenses: 2400 },
  { month: 'Feb', revenue: 3000, expenses: 1398 },
  { month: 'Mar', revenue: 5000, expenses: 6800 },
  { month: 'Apr', revenue: 4780, expenses: 3908 },
  { month: 'May', revenue: 6890, expenses: 4800 },
  { month: 'Jun', revenue: 7390, expenses: 3800 },
];

const subscriptionData = [
  { name: 'Jan', Pro: 400, Premium: 240 },
  { name: 'Feb', Pro: 300, Premium: 139 },
  { name: 'Mar', Pro: 200, Premium: 480 },
  { name: 'Apr', Pro: 278, Premium: 390 },
  { name: 'May', Pro: 189, Premium: 480 },
  { name: 'Jun', Pro: 239, Premium: 380 },
];

const kpiData = {
    mrr: { value: 7390, change: 12.5, period: "last month" },
    activeSubscriptions: { value: 619, change: 5.2, period: "last month" },
    arpu: { value: 11.94, change: 2.1, period: "last month" },
    churnRate: { value: 2.3, change: -0.5, period: "last month" },
    ltv: { value: 245, change: 15, period: "last year" },
    cac: { value: 42, change: 3, period: "last month" },
}

export function PlatformAnalytics() {
  const qc = useQueryClient();
  const { toast } = useToast();
  const [selectedTab, setSelectedTab] = useState('overview');
  const [searchTerm, setSearchTerm] = useState('');

  // Problem creation form
  const [showProblemModal, setShowProblemModal] = useState(false);
  const [problemForm, setProblemForm] = useState({ title: '', description: '', difficulty: 'Easy', category: 'Arrays', xpReward: '100', hints: '', solution: '' });

  // Roadmap creation form
  const [showRoadmapModal, setShowRoadmapModal] = useState(false);
  const [roadmapForm, setRoadmapForm] = useState({ title: '', description: '', category: 'Web Development', difficulty: 'Beginner', estimatedTime: '' });

  const { data: users = [], isLoading } = useQuery<AdminUser[]>({
    queryKey: ['/api/admin/users'],
  });

  const { data: problems = [] } = useQuery<any[]>({
    queryKey: ['/api/problems'],
  });

  const { data: roadmaps = [] } = useQuery<any[]>({
    queryKey: ['/api/roadmaps'],
  });

  const deleteUserMutation = useMutation({
    mutationFn: async (id: number) => { await apiRequest('DELETE', `/api/admin/users/${id}`); },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['/api/admin/users'] }),
  });

  const createProblemMutation = useMutation({
    mutationFn: async () => {
      const res = await apiRequest('POST', '/api/admin/problems', {
        title: problemForm.title,
        description: problemForm.description,
        difficulty: problemForm.difficulty,
        category: problemForm.category,
        xpReward: parseInt(problemForm.xpReward) || 100,
        hints: problemForm.hints ? problemForm.hints.split('\n').filter(Boolean) : [],
        solution: problemForm.solution || null,
        tags: [],
        isDaily: false,
      });
      return res.json();
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['/api/problems'] });
      setShowProblemModal(false);
      setProblemForm({ title: '', description: '', difficulty: 'Easy', category: 'Arrays', xpReward: '100', hints: '', solution: '' });
      toast({ title: 'Problem created' });
    },
    onError: () => toast({ title: 'Failed to create problem', variant: 'destructive' }),
  });

  const createRoadmapMutation = useMutation({
    mutationFn: async () => {
      const res = await apiRequest('POST', '/api/admin/roadmaps', {
        title: roadmapForm.title,
        description: roadmapForm.description,
        category: roadmapForm.category,
        difficulty: roadmapForm.difficulty,
        estimatedTime: roadmapForm.estimatedTime || null,
        modules: [],
      });
      return res.json();
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['/api/roadmaps'] });
      setShowRoadmapModal(false);
      setRoadmapForm({ title: '', description: '', category: 'Web Development', difficulty: 'Beginner', estimatedTime: '' });
      toast({ title: 'Roadmap created' });
    },
    onError: () => toast({ title: 'Failed to create roadmap', variant: 'destructive' }),
  });

  const filteredUsers = (users as AdminUser[]).filter(u =>
    `${u.firstName} ${u.lastName}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
    u.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalUsers = users.length;
  const proUsers = (users as AdminUser[]).filter(u => u.subscriptionType === 'pro').length;
  const premiumUsers = (users as AdminUser[]).filter(u => u.subscriptionType === 'premium').length;
  const freeUsers = (users as AdminUser[]).filter(u => u.subscriptionType === 'free').length;

  const formatStudyTime = (minutes: number) => {
    const h = Math.floor(minutes / 60);
    const m = minutes % 60;
    return `${h}h ${m}m`;
  };

  const getSubColor = (type: string) => {
    if (type === 'pro') return 'bg-purple-500/20 text-purple-400';
    if (type === 'premium') return 'bg-yellow-500/20 text-yellow-400';
    return 'bg-gray-500/20 text-gray-400';
  };

  const renderTrend = (change: number) => (
    <span className={`flex items-center text-sm ${change >= 0 ? 'text-green-500' : 'text-red-500'}`}>
      {change >= 0 ? <TrendingUp className="h-4 w-4 mr-1" /> : <TrendingDown className="h-4 w-4 mr-1" />}
      {Math.abs(change)}% vs last month
    </span>
  );

  return (
    <div className="space-y-8 p-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Admin Panel</h1>
          <p className="text-muted-foreground">Manage your platform and users.</p>
        </div>
        <Button><Download className="mr-2 h-4 w-4" />Export Report</Button>
      </div>

      <Tabs value={selectedTab} onValueChange={setSelectedTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="overview">Financial Overview</TabsTrigger>
          <TabsTrigger value="students">User Management ({totalUsers})</TabsTrigger>
          <TabsTrigger value="content">Content ({(problems as any[]).length + (roadmaps as any[]).length})</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="mt-6">
          {/* KPI Cards */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
            <Card><CardContent className="p-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-muted-foreground">Total Users</span>
                <Users className="h-4 w-4 text-muted-foreground" />
              </div>
              <div className="text-2xl font-bold">{totalUsers}</div>
              {renderTrend(12.5)}
            </CardContent></Card>
            <Card><CardContent className="p-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-muted-foreground">Pro Users</span>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </div>
              <div className="text-2xl font-bold">{proUsers}</div>
              {renderTrend(5.2)}
            </CardContent></Card>
            <Card><CardContent className="p-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-muted-foreground">Premium Users</span>
                <Activity className="h-4 w-4 text-muted-foreground" />
              </div>
              <div className="text-2xl font-bold">{premiumUsers}</div>
              {renderTrend(3.1)}
            </CardContent></Card>
            <Card><CardContent className="p-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-muted-foreground">Free Users</span>
                <ShoppingCart className="h-4 w-4 text-muted-foreground" />
              </div>
              <div className="text-2xl font-bold">{freeUsers}</div>
              {renderTrend(-0.5)}
            </CardContent></Card>
          </div>

          <div className="grid lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader><CardTitle>Revenue vs. Expenses</CardTitle></CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={revenueData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" /><YAxis />
                    <Tooltip /><Legend />
                    <Line type="monotone" dataKey="revenue" stroke="#8884d8" activeDot={{ r: 8 }} />
                    <Line type="monotone" dataKey="expenses" stroke="#82ca9d" />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
            <Card>
              <CardHeader><CardTitle>Subscription Growth</CardTitle></CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={subscriptionData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" /><YAxis />
                    <Tooltip /><Legend />
                    <Line type="monotone" dataKey="Pro" stroke="#8884d8" />
                    <Line type="monotone" dataKey="Premium" stroke="#82ca9d" />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="students" className="mt-6 space-y-4">
          <Card><CardContent className="p-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Search users..." value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)} className="pl-10" />
            </div>
          </CardContent></Card>

          <Card>
            <CardHeader><CardTitle>Users ({filteredUsers.length})</CardTitle></CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="space-y-3">
                  {[...Array(3)].map((_, i) => <Skeleton key={i} className="h-16 w-full" />)}
                </div>
              ) : filteredUsers.length === 0 ? (
                <p className="text-muted-foreground text-sm text-center py-8">No users found.</p>
              ) : (
                <div className="space-y-3">
                  {filteredUsers.map(u => (
                    <div key={u.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/30">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-primary/20 rounded-full flex items-center justify-center">
                          <User className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <p className="font-semibold">{u.firstName} {u.lastName}</p>
                          <p className="text-xs text-muted-foreground">{u.email}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-6">
                        <div className="text-center hidden md:block">
                          <p className="text-sm font-semibold">Lv {u.level}</p>
                          <p className="text-xs text-muted-foreground">{u.xp} XP</p>
                        </div>
                        <div className="text-center hidden md:block">
                          <p className="text-sm font-semibold">{u.streak}d</p>
                          <p className="text-xs text-muted-foreground">Streak</p>
                        </div>
                        <div className="text-center hidden lg:block">
                          <p className="text-sm font-semibold">{formatStudyTime(u.totalStudyTime)}</p>
                          <p className="text-xs text-muted-foreground">Study</p>
                        </div>
                        <Badge className={getSubColor(u.subscriptionType)}>{u.subscriptionType}</Badge>
                        <Badge variant="outline">{u.role}</Badge>
                        {u.id > 0 && (
                          <Button size="sm" variant="ghost" className="text-destructive"
                            onClick={() => deleteUserMutation.mutate(u.id)}>
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Content Management Tab */}
        <TabsContent value="content" className="mt-6 space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            {/* Problems */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="flex items-center gap-2 text-base">
                  <Code className="h-4 w-4" />Problems ({(problems as any[]).length})
                </CardTitle>
                <Button size="sm" onClick={() => setShowProblemModal(true)}>
                  <Plus className="h-4 w-4 mr-1" />Add
                </Button>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 max-h-64 overflow-y-auto">
                  {(problems as any[]).map((p: any) => (
                    <div key={p.id} className="flex items-center justify-between p-2 bg-muted/30 rounded text-sm">
                      <span className="truncate flex-1">{p.title}</span>
                      <div className="flex items-center gap-2 ml-2 shrink-0">
                        <Badge variant="outline" className="text-xs">{p.difficulty}</Badge>
                        <span className="text-xs text-muted-foreground">{p.xpReward}xp</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Roadmaps */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="flex items-center gap-2 text-base">
                  <BookOpen className="h-4 w-4" />Roadmaps ({(roadmaps as any[]).length})
                </CardTitle>
                <Button size="sm" onClick={() => setShowRoadmapModal(true)}>
                  <Plus className="h-4 w-4 mr-1" />Add
                </Button>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 max-h-64 overflow-y-auto">
                  {(roadmaps as any[]).map((r: any) => (
                    <div key={r.id} className="flex items-center justify-between p-2 bg-muted/30 rounded text-sm">
                      <span className="truncate flex-1">{r.title}</span>
                      <Badge variant="outline" className="text-xs ml-2 shrink-0">{r.difficulty}</Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {/* Create Problem Modal */}
      <Dialog open={showProblemModal} onOpenChange={setShowProblemModal}>
        <DialogContent className="max-w-lg">
          <DialogHeader><DialogTitle>Create Problem</DialogTitle></DialogHeader>
          <div className="space-y-3 py-2">
            <div><Label>Title</Label><Input value={problemForm.title} onChange={e => setProblemForm(f => ({ ...f, title: e.target.value }))} placeholder="Two Sum" /></div>
            <div><Label>Description</Label><Textarea value={problemForm.description} onChange={e => setProblemForm(f => ({ ...f, description: e.target.value }))} rows={3} placeholder="Given an array..." /></div>
            <div className="grid grid-cols-3 gap-3">
              <div><Label>Difficulty</Label>
                <Select value={problemForm.difficulty} onValueChange={v => setProblemForm(f => ({ ...f, difficulty: v }))}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {['Easy','Medium','Hard'].map(d => <SelectItem key={d} value={d}>{d}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div><Label>Category</Label>
                <Select value={problemForm.category} onValueChange={v => setProblemForm(f => ({ ...f, category: v }))}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {['Arrays','Strings','Dynamic Programming','Trees','Linked Lists','Design','Graphs'].map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div><Label>XP Reward</Label><Input type="number" value={problemForm.xpReward} onChange={e => setProblemForm(f => ({ ...f, xpReward: e.target.value }))} /></div>
            </div>
            <div><Label>Hints (one per line)</Label><Textarea value={problemForm.hints} onChange={e => setProblemForm(f => ({ ...f, hints: e.target.value }))} rows={2} placeholder="Use a hash map&#10;One pass solution" /></div>
            <div><Label>Solution Approach</Label><Textarea value={problemForm.solution} onChange={e => setProblemForm(f => ({ ...f, solution: e.target.value }))} rows={2} placeholder="Use a hash map to store..." /></div>
          </div>
          <DialogFooter>
            <Button variant="ghost" onClick={() => setShowProblemModal(false)}>Cancel</Button>
            <Button onClick={() => createProblemMutation.mutate()} disabled={!problemForm.title.trim() || !problemForm.description.trim() || createProblemMutation.isPending}>
              {createProblemMutation.isPending ? 'Creating...' : 'Create Problem'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Create Roadmap Modal */}
      <Dialog open={showRoadmapModal} onOpenChange={setShowRoadmapModal}>
        <DialogContent className="max-w-lg">
          <DialogHeader><DialogTitle>Create Roadmap</DialogTitle></DialogHeader>
          <div className="space-y-3 py-2">
            <div><Label>Title</Label><Input value={roadmapForm.title} onChange={e => setRoadmapForm(f => ({ ...f, title: e.target.value }))} placeholder="Mobile Developer" /></div>
            <div><Label>Description</Label><Textarea value={roadmapForm.description} onChange={e => setRoadmapForm(f => ({ ...f, description: e.target.value }))} rows={3} placeholder="Learn to build mobile apps..." /></div>
            <div className="grid grid-cols-2 gap-3">
              <div><Label>Category</Label>
                <Select value={roadmapForm.category} onValueChange={v => setRoadmapForm(f => ({ ...f, category: v }))}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {['Web Development','Mobile Development','Data Science','DevOps','Cybersecurity'].map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div><Label>Difficulty</Label>
                <Select value={roadmapForm.difficulty} onValueChange={v => setRoadmapForm(f => ({ ...f, difficulty: v }))}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {['Beginner','Intermediate','Advanced'].map(d => <SelectItem key={d} value={d}>{d}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div><Label>Estimated Time (e.g. 3-4 months)</Label><Input value={roadmapForm.estimatedTime} onChange={e => setRoadmapForm(f => ({ ...f, estimatedTime: e.target.value }))} placeholder="3-4 months" /></div>
          </div>
          <DialogFooter>
            <Button variant="ghost" onClick={() => setShowRoadmapModal(false)}>Cancel</Button>
            <Button onClick={() => createRoadmapMutation.mutate()} disabled={!roadmapForm.title.trim() || !roadmapForm.description.trim() || createRoadmapMutation.isPending}>
              {createRoadmapMutation.isPending ? 'Creating...' : 'Create Roadmap'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
