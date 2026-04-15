import React, { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useUserRole } from '@/contexts/UserRoleContext';
import { LiveClass, VideoCallState } from '@/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar, Clock, Users, Video, Plus, Play, StopCircle, AlertCircle, CheckCircle } from 'lucide-react';
import { VideoCall } from './VideoCall';
import { useToast } from '@/hooks/use-toast';

export function LiveClasses() {
  const { user, isAuthenticated } = useAuth();
  const { isAdmin, isStudent } = useUserRole();
  const { toast } = useToast();
  const [liveClasses, setLiveClasses] = useState<LiveClass[]>([]);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [selectedClass, setSelectedClass] = useState<LiveClass | null>(null);
  const [isVideoCallOpen, setIsVideoCallOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [isCreating, setIsCreating] = useState(false);
  const [isJoinByCodeOpen, setIsJoinByCodeOpen] = useState(false);
  const [joinCode, setJoinCode] = useState('');
  const [joinCodeError, setJoinCodeError] = useState('');
  const [isJoiningByCode, setIsJoiningByCode] = useState(false);

  const [newClass, setNewClass] = useState({
    title: '',
    description: '',
    startTime: '',
    endTime: '',
    maxParticipants: 50,
    tags: ''
  });

  useEffect(() => {
    fetchLiveClasses();
  }, []);

  const fetchLiveClasses = async () => {
    try {
      const response = await fetch('/api/live-classes', { credentials: 'include' });
      const data = await response.json();
      setLiveClasses(data);
    } catch {
      toast({ title: 'Error', description: 'Failed to load live classes', variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  const createLiveClass = async () => {
    if (!newClass.title.trim()) { toast({ title: 'Title required', variant: 'destructive' }); return; }
    if (!newClass.description.trim()) { toast({ title: 'Description required', variant: 'destructive' }); return; }
    if (!newClass.startTime) { toast({ title: 'Start time required', variant: 'destructive' }); return; }
    if (!newClass.endTime) { toast({ title: 'End time required', variant: 'destructive' }); return; }
    if (new Date(newClass.startTime) >= new Date(newClass.endTime)) { toast({ title: 'End time must be after start time', variant: 'destructive' }); return; }
    if (new Date(newClass.startTime) <= new Date()) { toast({ title: 'Start time must be in the future', variant: 'destructive' }); return; }
    if (!user?.id) { toast({ title: 'Not authenticated', variant: 'destructive' }); return; }

    setIsCreating(true);
    try {
      const response = await fetch('/api/live-classes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          ...newClass,
          instructorId: user.id,
          instructorName: `${user.firstName} ${user.lastName}`,
          tags: newClass.tags.split(',').map(tag => tag.trim()).filter(tag => tag),
        }),
      });

      if (response.ok) {
        const createdClass = await response.json();
        setLiveClasses(prev => [...prev, createdClass]);
        setIsCreateDialogOpen(false);
        setNewClass({ title: '', description: '', startTime: '', endTime: '', maxParticipants: 50, tags: '' });
        toast({ title: 'Live class created successfully' });
      } else {
        const errorData = await response.json().catch(() => ({ message: 'Unknown error' }));
        toast({ title: 'Failed to create class', description: errorData.message, variant: 'destructive' });
      }
    } catch {
      toast({ title: 'Failed to create live class', variant: 'destructive' });
    } finally {
      setIsCreating(false);
    }
  };

  const joinLiveClass = async (liveClass: LiveClass) => {
    try {
      const response = await fetch(`/api/live-classes/${liveClass.id}/join`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ userId: user?.id, userName: `${user?.firstName} ${user?.lastName}` }),
      });
      if (response.ok) {
        setSelectedClass(liveClass);
        setIsVideoCallOpen(true);
      } else {
        toast({ title: 'Failed to join class', variant: 'destructive' });
      }
    } catch {
      toast({ title: 'Failed to join live class', variant: 'destructive' });
    }
  };

  const startLiveClass = async (liveClass: LiveClass) => {
    try {
      await fetch(`/api/live-classes/${liveClass.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ status: 'live' }),
      });
      setLiveClasses(prev => prev.map(cls => cls.id === liveClass.id ? { ...cls, status: 'live' as const } : cls));
    } catch {
      toast({ title: 'Failed to start class', variant: 'destructive' });
    }
  };

  const endLiveClass = async (liveClass: LiveClass) => {
    try {
      await fetch(`/api/live-classes/${liveClass.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ status: 'ended' }),
      });
      setLiveClasses(prev => prev.map(cls => cls.id === liveClass.id ? { ...cls, status: 'ended' as const } : cls));
    } catch {
      toast({ title: 'Failed to end class', variant: 'destructive' });
    }
  };

  const deleteLiveClass = async (liveClass: LiveClass) => {
    try {
      await fetch(`/api/live-classes/${liveClass.id}`, {
        method: 'DELETE',
        credentials: 'include',
      });
      setLiveClasses(prev => prev.filter(cls => cls.id !== liveClass.id));
      toast({ title: 'Class deleted' });
    } catch {
      toast({ title: 'Failed to delete class', variant: 'destructive' });
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'scheduled':
        return <Badge variant="secondary" className="flex items-center gap-1"><Clock className="h-3 w-3" />Scheduled</Badge>;
      case 'live':
        return <Badge variant="destructive" className="flex items-center gap-1 animate-pulse"><CheckCircle className="h-3 w-3" />Live</Badge>;
      case 'ended':
        return <Badge variant="outline" className="flex items-center gap-1"><AlertCircle className="h-3 w-3" />Ended</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const isInstructor = (liveClass: LiveClass) => {
    return user?.id === liveClass.instructorId;
  };

  const canJoin = (liveClass: LiveClass) => {
    return liveClass.status === 'live' && !isInstructor(liveClass);
  };

  const filteredClasses = liveClasses.filter(liveClass => {
    const matchesSearch = liveClass.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         liveClass.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         liveClass.instructorName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || liveClass.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4 sm:px-6 lg:px-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-4xl font-extrabold tracking-tight mb-2">Live Classes</h1>
          <p className="text-lg text-muted-foreground">
            {isAdmin 
              ? 'Create and manage live video sessions for your students.'
              : 'Join live video sessions with instructors and fellow students.'
            }
          </p>
        </div>
        
        {/* Only show create button for admins */}
        {isAuthenticated && isAdmin && (
          <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button className="flex items-center gap-2">
                <Plus className="h-4 w-4" />
                Create Live Class
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
              <DialogHeader>
                <DialogTitle>Create New Live Class</DialogTitle>
                <DialogDescription>
                  Schedule a new live video session for your students.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-6 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="title">Title</Label>
                  <Input
                    id="title"
                    value={newClass.title}
                    onChange={(e) => setNewClass(prev => ({ ...prev, title: e.target.value }))}
                    placeholder="Enter class title"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={newClass.description}
                    onChange={(e) => setNewClass(prev => ({ ...prev, description: e.target.value }))}
                    placeholder="Enter class description"
                    rows={3}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="startTime">Start Time</Label>
                    <Input
                      id="startTime"
                      type="datetime-local"
                      value={newClass.startTime}
                      onChange={(e) => setNewClass(prev => ({ ...prev, startTime: e.target.value }))}
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="endTime">End Time</Label>
                    <Input
                      id="endTime"
                      type="datetime-local"
                      value={newClass.endTime}
                      onChange={(e) => setNewClass(prev => ({ ...prev, endTime: e.target.value }))}
                    />
                  </div>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="maxParticipants">Max Participants</Label>
                  <Input
                    id="maxParticipants"
                    type="number"
                    value={newClass.maxParticipants}
                    onChange={(e) => setNewClass(prev => ({ ...prev, maxParticipants: parseInt(e.target.value) }))}
                    min="1"
                    max="100"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="tags">Tags (comma-separated)</Label>
                  <Input
                    id="tags"
                    value={newClass.tags}
                    onChange={(e) => setNewClass(prev => ({ ...prev, tags: e.target.value }))}
                    placeholder="e.g., JavaScript, React, Beginner"
                  />
                </div>
              </div>
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)} disabled={isCreating}>
                  Cancel
                </Button>
                <Button onClick={createLiveClass} disabled={isCreating}>
                  {isCreating ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Creating...
                    </>
                  ) : (
                    'Create Class'
                  )}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        )}
        {/* Only show join by code for students */}
        {isAuthenticated && isStudent && (
          <Dialog open={isJoinByCodeOpen} onOpenChange={setIsJoinByCodeOpen}>
            <DialogTrigger asChild>
              <Button variant="secondary" className="flex items-center gap-2">
                <Video className="h-4 w-4" />
                Join Class by Code
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[400px]">
              <DialogHeader>
                <DialogTitle>Join Class by Code</DialogTitle>
                <DialogDescription>
                  Enter the meeting code provided by your instructor to join a live class.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="joinCode">Meeting Code</Label>
                  <Input
                    id="joinCode"
                    value={joinCode}
                    onChange={e => { setJoinCode(e.target.value); setJoinCodeError(''); }}
                    placeholder="Enter meeting code (room ID)"
                    disabled={isJoiningByCode}
                  />
                  {joinCodeError && <span className="text-red-500 text-xs">{joinCodeError}</span>}
                </div>
              </div>
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setIsJoinByCodeOpen(false)} disabled={isJoiningByCode}>
                  Cancel
                </Button>
                <Button
                  onClick={async () => {
                    if (!joinCode.trim()) {
                      setJoinCodeError('Please enter a meeting code.');
                      return;
                    }
                    setIsJoiningByCode(true);
                    setJoinCodeError('');
                    try {
                      const response = await fetch(`/api/live-classes?roomId=${encodeURIComponent(joinCode.trim())}`, { credentials: 'include' });
                      if (!response.ok) { setJoinCodeError('Class not found. Please check the code.'); setIsJoiningByCode(false); return; }
                      const data = await response.json();
                      if (!data || !data.id) { setJoinCodeError('Class not found. Please check the code.'); setIsJoiningByCode(false); return; }
                      const joinRes = await fetch(`/api/live-classes/${data.id}/join`, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        credentials: 'include',
                        body: JSON.stringify({ userId: user?.id, userName: `${user?.firstName} ${user?.lastName}` }),
                      });
                      if (!joinRes.ok) {
                        setJoinCodeError('Failed to join class.');
                        setIsJoiningByCode(false);
                        return;
                      }
                      setSelectedClass(data);
                      setIsVideoCallOpen(true);
                      setIsJoinByCodeOpen(false);
                      setJoinCode('');
                    } catch (err) {
                      setJoinCodeError('Error joining class.');
                    } finally {
                      setIsJoiningByCode(false);
                    }
                  }}
                  disabled={isJoiningByCode}
                >
                  {isJoiningByCode ? 'Joining...' : 'Join Class'}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        )}
      </div>

      {/* Search and Filters */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8 items-end">
        <Input
          placeholder="Search by title, description, or instructor..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="md:col-span-2"
        />
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger>
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="scheduled">Scheduled</SelectItem>
            <SelectItem value="live">Live</SelectItem>
            <SelectItem value="ended">Ended</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <h2 className="text-2xl font-bold mb-4">
        {isAdmin ? 'Manage Live Sessions' : 'Available Classes'}
      </h2>

      {/* Live Classes Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {filteredClasses.map((liveClass) => (
          <Card
            key={liveClass.id}
            className="relative border border-border bg-card shadow-sm hover:shadow-md transition-all duration-200 rounded-lg overflow-hidden min-h-[240px] h-full flex flex-col"
          >
            <CardHeader className="pb-4 px-6 pt-6 flex-1">
              <div className="flex justify-between items-start">
                <div className="flex-1 pr-4 min-w-0">
                  <CardTitle className="text-xl font-semibold mb-2 leading-tight truncate" title={liveClass.title}>
                    {liveClass.title}
                  </CardTitle>
                  <CardDescription className="text-sm text-muted-foreground leading-relaxed line-clamp-3 break-words">
                    {liveClass.description}
                  </CardDescription>
                </div>
                {getStatusBadge(liveClass.status)}
              </div>
            </CardHeader>
            <CardContent className="px-6 pb-6 space-y-4">
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Calendar className="h-4 w-4 flex-shrink-0" />
                  <span>
                    {new Date(liveClass.startTime).toLocaleDateString()} at {new Date(liveClass.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Clock className="h-4 w-4 flex-shrink-0" />
                  <span>Duration: {((new Date(liveClass.endTime).getTime() - new Date(liveClass.startTime).getTime()) / (1000 * 60)).toFixed(0)} minutes</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Users className="h-4 w-4 flex-shrink-0" />
                  <span>{liveClass.currentParticipants}/{liveClass.maxParticipants} participants</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <span>Instructor: <span className="font-medium text-foreground">{liveClass.instructorName}</span></span>
                </div>
              </div>
              
              {liveClass.tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-2">
                  {liveClass.tags.map((tag, index) => (
                    <Badge key={index} variant="secondary" className="text-xs px-2 py-0.5 rounded-full">
                      {tag}
                    </Badge>
                  ))}
                </div>
              )}

              <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-border mt-4 w-full">
                {/* Admin/Instructor Controls */}
                {isAdmin && isInstructor(liveClass) ? (
                  <>
                    {liveClass.status === 'scheduled' && (
                      <Button 
                        size="sm" 
                        onClick={() => startLiveClass(liveClass)}
                        className="flex-1 w-full"
                      >
                        <Play className="h-4 w-4 mr-1" />
                        Start
                      </Button>
                    )}
                    {liveClass.status === 'live' && (
                      <Button 
                        size="sm" 
                        variant="destructive"
                        onClick={() => endLiveClass(liveClass)}
                        className="flex-1 w-full"
                      >
                        <StopCircle className="h-4 w-4 mr-1" />
                        End
                      </Button>
                    )}
                    {liveClass.status === 'live' && (
                      <Button 
                        size="sm" 
                        onClick={() => {
                          setSelectedClass(liveClass);
                          setIsVideoCallOpen(true);
                        }}
                        className="w-full sm:w-auto"
                      >
                        <Video className="h-4 w-4" />
                      </Button>
                    )}
                    {liveClass.status === 'scheduled' && (
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => deleteLiveClass(liveClass)}
                        className="flex-1 w-full"
                      >
                        Delete
                      </Button>
                    )}
                  </>
                ) : (
                  /* Student/Viewer Controls */
                  <>
                    {canJoin(liveClass) && (
                      <Button 
                        size="sm" 
                        onClick={() => joinLiveClass(liveClass)}
                        className="flex-1 w-full"
                      >
                        <Video className="h-4 w-4 mr-1" />
                        Join
                      </Button>
                    )}
                    {liveClass.status === 'scheduled' && (
                      <Button size="sm" variant="outline" disabled className="flex-1 w-full">
                        Not Started
                      </Button>
                    )}
                    {liveClass.status === 'ended' && (
                      <Button size="sm" variant="outline" disabled className="flex-1 w-full">
                        Ended
                      </Button>
                    )}
                  </>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredClasses.length === 0 && (
        <div className="text-center py-12">
          <Video className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
          <h3 className="text-lg font-semibold mb-2">No Live Classes Available</h3>
          <p className="text-muted-foreground">
            {isAdmin 
              ? 'Create your first live class to start teaching!'
              : 'Check back later for upcoming live classes.'
            }
          </p>
        </div>
      )}

      {isVideoCallOpen && selectedClass && (
        <VideoCall
          roomId={selectedClass.roomId}
          isHost={isAdmin && isInstructor(selectedClass)}
          onClose={() => {
            setIsVideoCallOpen(false);
            setSelectedClass(null);
          }}
        />
      )}
    </div>
  );
} 