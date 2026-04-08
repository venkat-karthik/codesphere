import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { PageError } from '@/components/PageState';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';
import { FileText, Download, Search, Upload } from 'lucide-react';
import { useUserRole } from '@/contexts/UserRoleContext';

interface Resource {
  id: number;
  title: string;
  description: string;
  category: string;
  type: string;
  difficulty: string;
  tags: string[];
  downloadCount: number;
  fileSize: string | null;
  pageCount: number | null;
  url: string | null;
  createdAt: string;
}

const CATEGORIES = [
  { id: 'all', label: 'All' },
  { id: 'javascript', label: 'JavaScript' },
  { id: 'react', label: 'React' },
  { id: 'nodejs', label: 'Node.js' },
  { id: 'css', label: 'CSS' },
  { id: 'html', label: 'HTML' },
  { id: 'typescript', label: 'TypeScript' },
  { id: 'python', label: 'Python' },
];

const CATEGORY_COLORS: Record<string, string> = {
  javascript: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
  react: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
  nodejs: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
  css: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200',
  html: 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200',
  typescript: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
  python: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
};

const DIFFICULTY_COLORS: Record<string, string> = {
  beginner: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
  intermediate: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
  advanced: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
};

export function Resources() {
  const { isAdmin } = useUserRole();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  // ── Fetch resources from DB ─────────────────────────────────────────────
  const { data: resources = [], isLoading, isError, refetch } = useQuery<Resource[]>({
    queryKey: ['/api/resources'],
  });

  const filtered = resources.filter(r => {
    const matchSearch = r.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchCat = selectedCategory === 'all' || r.category === selectedCategory;
    return matchSearch && matchCat;
  });

  const formatDate = (dateStr: string) => {
    const d = new Date(dateStr);
    const diff = Math.floor((Date.now() - d.getTime()) / 86400000);
    if (diff === 0) return 'Today';
    if (diff === 1) return '1 day ago';
    if (diff < 7) return `${diff} days ago`;
    if (diff < 30) return `${Math.floor(diff / 7)} weeks ago`;
    return `${Math.floor(diff / 30)} months ago`;
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold mb-2">PDF Resources</h1>
          <p className="text-muted-foreground">Browse and download educational documents</p>
        </div>
        {isAdmin && (
          <Button className="bg-primary hover:bg-primary/90">
            <Upload className="mr-2 h-4 w-4" />
            Upload PDF
          </Button>
        )}
      </div>

      {/* Search + Filter */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search resources..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={selectedCategory} onValueChange={setSelectedCategory}>
          <SelectTrigger className="w-full sm:w-48">
            <SelectValue placeholder="All Categories" />
          </SelectTrigger>
          <SelectContent>
            {CATEGORIES.map(c => (
              <SelectItem key={c.id} value={c.id}>{c.label}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Stats bar */}
      {!isLoading && (
        <p className="text-sm text-muted-foreground">
          Showing {filtered.length} of {resources.length} resources
        </p>
      )}

      {/* Grid */}
      {isError ? (
        <PageError message="Failed to load resources" onRetry={refetch} />
      ) : isLoading ? (
        <div className="grid lg:grid-cols-3 md:grid-cols-2 gap-6">
          {[...Array(6)].map((_, i) => (
            <Card key={i}><CardContent className="p-6 space-y-3">
              <Skeleton className="h-12 w-12 rounded-lg" />
              <Skeleton className="h-5 w-3/4" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-9 w-full mt-4" />
            </CardContent></Card>
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <Card><CardContent className="p-12 text-center">
          <FileText className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-xl font-semibold mb-2">No Resources Found</h3>
          <p className="text-muted-foreground">Try adjusting your search or category filter.</p>
        </CardContent></Card>
      ) : (
        <div className="grid lg:grid-cols-3 md:grid-cols-2 gap-6">
          {filtered.map((resource) => (
            <Card key={resource.id} className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="w-12 h-12 bg-red-100 dark:bg-red-900/20 rounded-lg flex items-center justify-center">
                    <FileText className="h-6 w-6 text-red-600 dark:text-red-400" />
                  </div>
                  <div className="flex flex-col items-end gap-1">
                    <Badge className={CATEGORY_COLORS[resource.category] || ''} variant="outline">
                      {resource.category}
                    </Badge>
                    <Badge className={DIFFICULTY_COLORS[resource.difficulty] || ''} variant="outline">
                      {resource.difficulty}
                    </Badge>
                  </div>
                </div>

                <h3 className="text-lg font-semibold mb-2 line-clamp-2">{resource.title}</h3>
                <p className="text-muted-foreground text-sm mb-4 line-clamp-3">{resource.description}</p>

                <div className="flex justify-between text-xs text-muted-foreground mb-4">
                  <span>{resource.pageCount ? `${resource.pageCount} pages` : ''} {resource.fileSize ? `· ${resource.fileSize}` : ''}</span>
                  <span>{formatDate(resource.createdAt)}</span>
                </div>

                <div className="flex justify-between items-center mb-4">
                  <span className="text-xs text-muted-foreground">{resource.downloadCount.toLocaleString()} downloads</span>
                  <div className="flex gap-1 flex-wrap justify-end">
                    {(resource.tags as string[]).slice(0, 2).map(tag => (
                      <Badge key={tag} variant="outline" className="text-xs">{tag}</Badge>
                    ))}
                  </div>
                </div>

                <Button
                  className="w-full"
                  disabled={!resource.url}
                  onClick={() => resource.url && window.open(resource.url, '_blank')}
                >
                  <Download className="mr-2 h-4 w-4" />
                  {resource.url ? 'Download' : 'Coming Soon'}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
