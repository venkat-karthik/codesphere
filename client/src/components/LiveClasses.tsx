import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar, Clock, Users, Info, Plus } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

interface LiveClass {
  id: string;
  title: string;
  instructor: string;
  date: string;
  time: string;
  attendees: number;
  status: 'live' | 'upcoming' | 'completed';
  description: string;
}

export function LiveClasses() {
  const [mockLiveClasses, setMockLiveClasses] = useState<LiveClass[]>([
  {
    id: 'lc-1',
    title: 'Advanced React Hooks',
    instructor: 'Jane Doe',
    date: '2024-03-20',
    time: '10:00 AM PST',
    attendees: 45,
    status: 'live',
    description: 'Dive deep into custom hooks, useContext, and performance optimizations with React.'
  },
  {
    id: 'lc-2',
    title: 'Introduction to Machine Learning with Python',
    instructor: 'John Smith',
    date: '2024-03-25',
    time: '02:00 PM PST',
    attendees: 30,
    status: 'upcoming',
    description: 'Learn the fundamentals of machine learning, from data preprocessing to model evaluation using Python libraries.'
  },
  {
    id: 'lc-3',
    title: 'Web Security Best Practices',
    instructor: 'Alice Brown',
    date: '2024-03-10',
    time: '09:00 AM PST',
    attendees: 60,
    status: 'completed',
    description: 'Understand common web vulnerabilities and how to implement robust security measures in your applications.'
  },
  {
    id: 'lc-4',
    title: 'Full-Stack Development with Next.js and NestJS',
    instructor: 'Bob Johnson',
    date: '2024-04-01',
    time: '04:00 PM PST',
    attendees: 35,
    status: 'upcoming',
    description: 'Build scalable full-stack applications using Next.js for the frontend and NestJS for the backend.'
  },
]);

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [newClass, setNewClass] = useState<Omit<LiveClass, 'id' | 'status' | 'attendees'>>({
    title: '',
    instructor: '',
    date: '',
    time: '',
    description: '',
  });

  const handleInfoClick = (classItem: LiveClass) => {
    alert(`Live Class Details:\nTitle: ${classItem.title}\nInstructor: ${classItem.instructor}\nDate: ${classItem.date}\nTime: ${classItem.time}\nAttendees: ${classItem.attendees}\nStatus: ${classItem.status}\n\nDescription: ${classItem.description}`);
  };

  const handleCreateClass = () => {
    if (!newClass.title || !newClass.instructor || !newClass.date || !newClass.time || !newClass.description) {
      alert('Please fill in all fields.');
      return;
    }

    const createdClass: LiveClass = {
      id: `lc-${mockLiveClasses.length + 1}`,
      status: 'upcoming',
      attendees: 0,
      ...newClass,
    };

    setMockLiveClasses((prevClasses) => [...prevClasses, createdClass]);
    setNewClass({
      title: '',
      instructor: '',
      date: '',
      time: '',
      description: '',
    });
    setIsCreateModalOpen(false);
  };

  return (
    <div className="space-y-6 p-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Live Classes</h2>
        <Button onClick={() => setIsCreateModalOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Create New Class
        </Button>
      </div>
      <p className="text-muted-foreground">Join upcoming sessions or review past ones.</p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {mockLiveClasses.map((classItem) => (
          <Card key={classItem.id} className="flex flex-col justify-between h-full">
            <CardHeader>
              <CardTitle className="text-lg flex items-center justify-between">
                <span>{classItem.title}</span>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleInfoClick(classItem)}
                  className="ml-2"
                >
                  <Info className="h-4 w-4" />
                </Button>
              </CardTitle>
              <p className="text-sm text-muted-foreground">{classItem.instructor}</p>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center text-sm text-muted-foreground">
                <Calendar className="h-4 w-4 mr-2" />
                <span>{classItem.date}</span>
              </div>
              <div className="flex items-center text-sm text-muted-foreground">
                <Clock className="h-4 w-4 mr-2" />
                <span>{classItem.time}</span>
              </div>
              <div className="flex items-center text-sm text-muted-foreground">
                <Users className="h-4 w-4 mr-2" />
                <span>{classItem.attendees} attendees</span>
              </div>
              <div className="mt-2">
                {classItem.status === 'live' && <span className="px-2 py-1 rounded-full text-xs font-semibold bg-green-500/20 text-green-400">Live Now</span>}
                {classItem.status === 'upcoming' && <span className="px-2 py-1 rounded-full text-xs font-semibold bg-blue-500/20 text-blue-400">Upcoming</span>}
                {classItem.status === 'completed' && <span className="px-2 py-1 rounded-full text-xs font-semibold bg-gray-500/20 text-gray-400">Completed</span>}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Create New Class Modal */}
      <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Create New Live Class</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="title">Title</Label>
              <Input id="title" value={newClass.title} onChange={(e) => setNewClass({ ...newClass, title: e.target.value })} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="instructor">Instructor</Label>
              <Input id="instructor" value={newClass.instructor} onChange={(e) => setNewClass({ ...newClass, instructor: e.target.value })} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="date">Date</Label>
                <Input id="date" type="date" value={newClass.date} onChange={(e) => setNewClass({ ...newClass, date: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="time">Time</Label>
                <Input id="time" type="time" value={newClass.time} onChange={(e) => setNewClass({ ...newClass, time: e.target.value })} />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea id="description" value={newClass.description} onChange={(e) => setNewClass({ ...newClass, description: e.target.value })} />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsCreateModalOpen(false)}>Cancel</Button>
            <Button onClick={handleCreateClass}>Create Class</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
} 