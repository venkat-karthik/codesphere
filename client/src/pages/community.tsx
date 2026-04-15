import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { PageError } from '@/components/PageState';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Skeleton } from '@/components/ui/skeleton';
import { Users, MessageCircle, ThumbsUp, Share2, Plus, Eye, TrendingUp } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { apiRequest } from '@/lib/queryClient';

interface Post {
  id: number;
  userId: number;
  title: string;
  content: string;
  category: string;
  tags: string[];
  likes: number;
  replies: number;
  isResolved: boolean;
  createdAt: string;
}

const CATEGORIES = ['all', 'Frontend', 'Backend', 'Career', 'Showcase', 'Help', 'Discussion'];

const CATEGORY_ICONS: Record<string, string> = {
  Frontend: '🎨', Backend: '⚙️', Career: '💼',
  Showcase: '🚀', Help: '❓', Discussion: '💬',
};

export function Community() {
  const { user } = useAuth();
  const qc = useQueryClient();
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [showNewPost, setShowNewPost] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newContent, setNewContent] = useState('');
  const [newCategory, setNewCategory] = useState('Discussion');

  const { data: posts = [], isLoading, isError, refetch } = useQuery<Post[]>({
    queryKey: ['/api/community/posts'],
  });

  const createPost = useMutation({
    mutationFn: async () => {
      await apiRequest('POST', '/api/community/posts', {
        title: newTitle,
        content: newContent,
        category: newCategory,
        tags: [],
        userId: user?.id,
      });
    },
    onSuccess: () => {
      setShowNewPost(false);
      setNewTitle(''); setNewContent(''); setNewCategory('Discussion');
      qc.invalidateQueries({ queryKey: ['/api/community/posts'] });
    },
  });

  const filtered = selectedCategory === 'all'
    ? (posts as Post[])
    : (posts as Post[]).filter(p => p.category === selectedCategory);

  const formatDate = (d: string) => {
    const diff = Math.floor((Date.now() - new Date(d).getTime()) / 60000);
    if (diff < 1) return 'just now';
    if (diff < 60) return `${diff}m ago`;
    if (diff < 1440) return `${Math.floor(diff / 60)}h ago`;
    return `${Math.floor(diff / 1440)}d ago`;
  };

  const communityStats = [
    { label: 'Total Posts', value: posts.length.toString(), icon: MessageCircle, color: 'text-blue-500' },
    { label: 'Active Members', value: '2,847', icon: Users, color: 'text-primary' },
    { label: 'Online Now', value: '156', icon: Eye, color: 'text-green-500' },
    { label: 'Trending', value: 'React', icon: TrendingUp, color: 'text-orange-500' },
  ];

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold mb-2">Community Lounge</h1>
          <p className="text-muted-foreground">Connect with fellow developers and share knowledge</p>
        </div>
        {user && (
          <Button onClick={() => setShowNewPost(true)}>
            <Plus className="mr-2 h-4 w-4" /> New Post
          </Button>
        )}
      </div>

      <div className="grid md:grid-cols-4 gap-6">
        {communityStats.map(stat => (
          <Card key={stat.label}><CardContent className="p-6 text-center">
            <div className="w-12 h-12 bg-primary/20 rounded-lg flex items-center justify-center mx-auto mb-3">
              <stat.icon className={`h-6 w-6 ${stat.color}`} />
            </div>
            <div className={`text-2xl font-bold ${stat.color} mb-1`}>{stat.value}</div>
            <div className="text-muted-foreground text-sm">{stat.label}</div>
          </CardContent></Card>
        ))}
      </div>

      <div className="flex flex-wrap gap-2">
        {CATEGORIES.map(cat => (
          <Button key={cat} variant={selectedCategory === cat ? 'default' : 'outline'} size="sm"
            onClick={() => setSelectedCategory(cat)}>
            {cat === 'all' ? 'All Discussions' : cat}
          </Button>
        ))}
      </div>

      {isError ? (
        <PageError message="Failed to load posts" onRetry={refetch} />
      ) : isLoading ? (
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => <Card key={i}><CardContent className="p-6"><Skeleton className="h-24 w-full" /></CardContent></Card>)}
        </div>
      ) : filtered.length === 0 ? (
        <Card><CardContent className="p-12 text-center">
          <MessageCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <p className="text-muted-foreground">No posts yet. Be the first to start a discussion!</p>
        </CardContent></Card>
      ) : (
        <div className="space-y-6">
          {filtered.map(post => (
            <Card key={post.id} className="card-hover">
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-gradient-to-br from-primary to-purple-500 rounded-full flex items-center justify-center shrink-0">
                    <span className="text-primary-foreground font-semibold text-sm">U</span>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-sm">User #{post.userId}</span>
                        <span className="text-muted-foreground text-xs">• {formatDate(post.createdAt)}</span>
                      </div>
                      <Badge variant="outline">
                        {CATEGORY_ICONS[post.category] || '💭'} {post.category}
                      </Badge>
                    </div>
                    <h3 className="text-lg font-semibold mb-2">{post.title}</h3>
                    <p className="text-muted-foreground mb-4 line-clamp-3">{post.content}</p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1"><ThumbsUp className="h-4 w-4" />{post.likes}</span>
                        <span className="flex items-center gap-1"><MessageCircle className="h-4 w-4" />{post.replies} replies</span>
                        <span className="flex items-center gap-1 cursor-pointer hover:text-primary"><Share2 className="h-4 w-4" />Share</span>
                      </div>
                      <Button size="sm" variant="outline">Join Discussion</Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <Dialog open={showNewPost} onOpenChange={setShowNewPost}>
        <DialogContent>
          <DialogHeader><DialogTitle>New Post</DialogTitle></DialogHeader>
          <div className="space-y-4">
            <Input placeholder="Title" value={newTitle} onChange={e => setNewTitle(e.target.value)} />
            <Textarea placeholder="What's on your mind?" value={newContent}
              onChange={e => setNewContent(e.target.value)} className="min-h-[120px]" />
            <div className="flex flex-wrap gap-2">
              {CATEGORIES.filter(c => c !== 'all').map(cat => (
                <Button key={cat} size="sm" variant={newCategory === cat ? 'default' : 'outline'}
                  onClick={() => setNewCategory(cat)}>{cat}</Button>
              ))}
            </div>
            <Button className="w-full"
              disabled={!newTitle.trim() || !newContent.trim() || createPost.isPending}
              onClick={() => createPost.mutate()}>
              {createPost.isPending ? 'Posting...' : 'Post'}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
