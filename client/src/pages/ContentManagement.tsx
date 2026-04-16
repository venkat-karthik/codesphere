import { useLocation } from 'wouter';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FileText, Video, Code, BookOpen, ArrowRight } from 'lucide-react';

/**
 * ContentManagement — unified entry point that routes admins to the
 * dedicated management pages (PDF, Video, Problems, Roadmaps).
 * All actual CRUD is handled by those pages which are fully DB-connected.
 */
export function ContentManagement() {
  const [, setLocation] = useLocation();

  const sections = [
    {
      icon: FileText,
      title: 'PDF Resources',
      description: 'Upload, edit and delete PDF study materials. Files stored locally or in cloud storage.',
      path: '/admin/resources',
      color: 'text-red-500 bg-red-500/10',
    },
    {
      icon: Video,
      title: 'Video Resources',
      description: 'Add YouTube/Vimeo links or direct video URLs. Manage thumbnails, categories and tags.',
      path: '/admin/videos',
      color: 'text-blue-500 bg-blue-500/10',
    },
    {
      icon: Code,
      title: 'Coding Problems',
      description: 'Create and manage LeetCode-style problems with hints, solutions and XP rewards.',
      path: '/admin/analytics',
      color: 'text-green-500 bg-green-500/10',
    },
    {
      icon: BookOpen,
      title: 'Learning Roadmaps',
      description: 'Build structured learning paths with modules, difficulty levels and estimated time.',
      path: '/admin/analytics',
      color: 'text-purple-500 bg-purple-500/10',
    },
  ];

  return (
    <div className="max-w-4xl mx-auto py-8 px-4 space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Content Management</h1>
        <p className="text-muted-foreground mt-1">Manage all learning materials across the platform.</p>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        {sections.map(s => (
          <Card key={s.title} className="cursor-pointer hover:shadow-md transition-shadow group"
            onClick={() => setLocation(s.path)}>
            <CardContent className="p-6 flex items-start gap-4">
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${s.color}`}>
                <s.icon className="h-6 w-6" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-lg mb-1">{s.title}</h3>
                <p className="text-sm text-muted-foreground">{s.description}</p>
              </div>
              <ArrowRight className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors shrink-0 mt-1" />
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
