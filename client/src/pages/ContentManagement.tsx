import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  BookOpen, 
  Play, 
  Target, 
  Plus, 
  Edit, 
  Trash2, 
  Upload, 
  Download, 
  Eye, 
  Search, 
  Filter,
  FileText,
  Video,
  Code,
  Tag,
  Calendar,
  User,
  Star,
  Clock,
  Folder,
  File,
  Image,
  Music,
  Archive,
  Share2,
  Copy,
  Move,
  Lock,
  Unlock,
  EyeOff,
  Settings,
  BarChart3,
  TrendingUp,
  Users,
  MessageSquare,
  Bookmark,
  Heart,
  ThumbsUp,
  ThumbsDown,
  Flag,
  MoreHorizontal,
  Grid,
  List,
  SortAsc,
  SortDesc,
  RefreshCw,
  Save,
  X
} from 'lucide-react';

interface ContentItem {
  id: string;
  title: string;
  description: string;
  type: 'pdf' | 'video' | 'problem';
  category: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  tags: string[];
  uploadDate: Date;
  lastModified: Date;
  fileSize: number;
  duration?: number; // for videos
  views: number;
  downloads: number;
  rating: number;
  isPublished: boolean;
  isFeatured: boolean;
  author: string;
  thumbnail?: string;
  fileUrl: string;
}

interface ContentMetrics {
  totalContent: number;
  totalViews: number;
  totalDownloads: number;
  averageRating: number;
  publishedContent: number;
  draftContent: number;
}

export function ContentManagement() {
  const [content, setContent] = useState<ContentItem[]>([
    {
      id: '1',
      title: 'Introduction to Data Structures',
      description: 'Comprehensive guide to fundamental data structures including arrays, linked lists, stacks, and queues.',
      type: 'pdf',
      category: 'Computer Science',
      difficulty: 'beginner',
      tags: ['data structures', 'algorithms', 'programming'],
      uploadDate: new Date('2024-01-15'),
      lastModified: new Date('2024-01-20'),
      fileSize: 2.5,
      views: 1240,
      downloads: 890,
      rating: 4.8,
      isPublished: true,
      isFeatured: true,
      author: 'Dr. Sarah Johnson',
      fileUrl: '/content/ds-intro.pdf'
    },
    {
      id: '2',
      title: 'Advanced Algorithm Design',
      description: 'Deep dive into algorithm design patterns and optimization techniques.',
      type: 'video',
      category: 'Computer Science',
      difficulty: 'advanced',
      tags: ['algorithms', 'optimization', 'design patterns'],
      uploadDate: new Date('2024-01-10'),
      lastModified: new Date('2024-01-18'),
      fileSize: 45.2,
      duration: 1800, // 30 minutes
      views: 890,
      downloads: 234,
      rating: 4.9,
      isPublished: true,
      isFeatured: false,
      author: 'Prof. Michael Chen',
      thumbnail: '/thumbnails/algo-design.jpg',
      fileUrl: '/content/algo-design.mp4'
    },
    {
      id: '3',
      title: 'Binary Tree Traversal Problem',
      description: 'Practice problem implementing various binary tree traversal algorithms.',
      type: 'problem',
      category: 'Data Structures',
      difficulty: 'intermediate',
      tags: ['binary trees', 'traversal', 'recursion'],
      uploadDate: new Date('2024-01-12'),
      lastModified: new Date('2024-01-19'),
      fileSize: 0.1,
      views: 567,
      downloads: 123,
      rating: 4.6,
      isPublished: true,
      isFeatured: false,
      author: 'CodeMaster AI',
      fileUrl: '/problems/binary-tree-traversal'
    }
  ]);

  const [selectedContent, setSelectedContent] = useState<ContentItem | null>(null);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState('all');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedDifficulty, setSelectedDifficulty] = useState('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [sortBy, setSortBy] = useState('date');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  // Create Content Form State
  const [createForm, setCreateForm] = useState({
    title: '',
    description: '',
    type: 'pdf' as 'pdf' | 'video' | 'problem',
    category: '',
    difficulty: 'beginner' as 'beginner' | 'intermediate' | 'advanced',
    tags: [''],
    isPublished: true,
    isFeatured: false,
    author: '',
    file: null as File | null
  });

  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  const metrics: ContentMetrics = {
    totalContent: content.length,
    totalViews: content.reduce((sum, item) => sum + item.views, 0),
    totalDownloads: content.reduce((sum, item) => sum + item.downloads, 0),
    averageRating: content.reduce((sum, item) => sum + item.rating, 0) / content.length,
    publishedContent: content.filter(item => item.isPublished).length,
    draftContent: content.filter(item => !item.isPublished).length
  };

  const filteredContent = content.filter(item => {
    const matchesSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesType = selectedType === 'all' || item.type === selectedType;
    const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
    const matchesDifficulty = selectedDifficulty === 'all' || item.difficulty === selectedDifficulty;
    return matchesSearch && matchesType && matchesCategory && matchesDifficulty;
  });

  const sortedContent = [...filteredContent].sort((a, b) => {
    let comparison = 0;
    switch (sortBy) {
      case 'title':
        comparison = a.title.localeCompare(b.title);
        break;
      case 'date':
        comparison = a.uploadDate.getTime() - b.uploadDate.getTime();
        break;
      case 'views':
        comparison = a.views - b.views;
        break;
      case 'rating':
        comparison = a.rating - b.rating;
        break;
      case 'size':
        comparison = a.fileSize - b.fileSize;
        break;
      default:
        comparison = 0;
    }
    return sortOrder === 'asc' ? comparison : -comparison;
  });

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'pdf': return <FileText className="h-5 w-5" />;
      case 'video': return <Video className="h-5 w-5" />;
      case 'problem': return <Code className="h-5 w-5" />;
      default: return <File className="h-5 w-5" />;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'pdf': return 'bg-red-500/20 text-red-600';
      case 'video': return 'bg-blue-500/20 text-blue-600';
      case 'problem': return 'bg-green-500/20 text-green-600';
      default: return 'bg-gray-500/20 text-gray-600';
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner': return 'bg-green-500/20 text-green-600';
      case 'intermediate': return 'bg-yellow-500/20 text-yellow-600';
      case 'advanced': return 'bg-red-500/20 text-red-600';
      default: return 'bg-gray-500/20 text-gray-600';
    }
  };

  const formatFileSize = (size: number) => {
    if (size < 1) return `${(size * 1024).toFixed(0)} KB`;
    if (size < 1024) return `${size.toFixed(1)} MB`;
    return `${(size / 1024).toFixed(1)} GB`;
  };

  const formatDuration = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  // Form validation
  const validateForm = () => {
    const errors: Record<string, string> = {};
    
    if (!createForm.title.trim()) {
      errors.title = 'Title is required';
    }
    
    if (!createForm.description.trim()) {
      errors.description = 'Description is required';
    }
    
    if (!createForm.category.trim()) {
      errors.category = 'Category is required';
    }
    
    if (!createForm.author.trim()) {
      errors.author = 'Author is required';
    }
    
    if (createForm.tags.length === 0 || createForm.tags.some(tag => !tag.trim())) {
      errors.tags = 'At least one tag is required';
    }
    
    if (!createForm.file && createForm.type !== 'problem') {
      errors.file = 'File is required';
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleCreateContent = () => {
    if (!validateForm()) return;

    const newContent: ContentItem = {
      id: Date.now().toString(),
      title: createForm.title,
      description: createForm.description,
      type: createForm.type,
      category: createForm.category,
      difficulty: createForm.difficulty,
      tags: createForm.tags.filter(tag => tag.trim()),
      uploadDate: new Date(),
      lastModified: new Date(),
      fileSize: createForm.file ? createForm.file.size / (1024 * 1024) : 0.1,
      views: 0,
      downloads: 0,
      rating: 0,
      isPublished: createForm.isPublished,
      isFeatured: createForm.isFeatured,
      author: createForm.author,
      fileUrl: createForm.file ? URL.createObjectURL(createForm.file) : `/content/${createForm.title.toLowerCase().replace(/\s+/g, '-')}`
    };

    setContent(prev => [...prev, newContent]);
    
    // Reset form
    setCreateForm({
      title: '',
      description: '',
      type: 'pdf',
      category: '',
      difficulty: 'beginner',
      tags: [''],
      isPublished: true,
      isFeatured: false,
      author: '',
      file: null
    });
    
    setFormErrors({});
    setIsCreateDialogOpen(false);
  };

  const handleEditContent = (contentItem: ContentItem) => {
    setSelectedContent(contentItem);
    setIsEditDialogOpen(true);
  };

  const handleDeleteContent = (contentId: string) => {
    if (confirm('Are you sure you want to delete this content?')) {
      setContent(prev => prev.filter(item => item.id !== contentId));
    }
  };

  const handleTogglePublish = (contentId: string) => {
    setContent(prev => 
      prev.map(item => 
        item.id === contentId ? { ...item, isPublished: !item.isPublished } : item
      )
    );
  };

  const handleToggleFeatured = (contentId: string) => {
    setContent(prev => 
      prev.map(item => 
        item.id === contentId ? { ...item, isFeatured: !item.isFeatured } : item
      )
    );
  };

  const addTag = () => {
    setCreateForm(prev => ({
      ...prev,
      tags: [...prev.tags, '']
    }));
  };

  const removeTag = (index: number) => {
    setCreateForm(prev => ({
      ...prev,
      tags: prev.tags.filter((_, i) => i !== index)
    }));
  };

  const updateTag = (index: number, value: string) => {
    setCreateForm(prev => ({
      ...prev,
      tags: prev.tags.map((tag, i) => i === index ? value : tag)
    }));
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setCreateForm(prev => ({ ...prev, file }));
    }
  };

  return (
    <div className="space-y-8 p-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold mb-2">Content Management</h1>
          <p className="text-muted-foreground">
            Manage learning materials, videos, and practice problems
          </p>
        </div>
        <Button onClick={() => setIsCreateDialogOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Add Content
        </Button>
      </div>

      {/* Metrics Overview */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Content</p>
                <p className="text-3xl font-bold">{metrics.totalContent}</p>
              </div>
              <BookOpen className="h-8 w-8 text-blue-500" />
            </div>
            <p className="text-xs text-green-500 mt-2">+3 this week</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Views</p>
                <p className="text-3xl font-bold">{metrics.totalViews.toLocaleString()}</p>
              </div>
              <Eye className="h-8 w-8 text-green-500" />
            </div>
            <p className="text-xs text-green-500 mt-2">+12% this month</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Downloads</p>
                <p className="text-3xl font-bold">{metrics.totalDownloads.toLocaleString()}</p>
              </div>
              <Download className="h-8 w-8 text-purple-500" />
            </div>
            <p className="text-xs text-green-500 mt-2">+8% this week</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Avg Rating</p>
                <p className="text-3xl font-bold">{metrics.averageRating.toFixed(1)}/5</p>
              </div>
              <Star className="h-8 w-8 text-yellow-500" />
            </div>
            <p className="text-xs text-green-500 mt-2">+0.2 this month</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Published</p>
                <p className="text-3xl font-bold">{metrics.publishedContent}</p>
              </div>
              <Eye className="h-8 w-8 text-green-500" />
            </div>
            <p className="text-xs text-muted-foreground mt-2">Ready for students</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Drafts</p>
                <p className="text-3xl font-bold">{metrics.draftContent}</p>
              </div>
              <EyeOff className="h-8 w-8 text-gray-500" />
            </div>
            <p className="text-xs text-muted-foreground mt-2">In progress</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs defaultValue="all" className="space-y-6">
        <TabsList>
          <TabsTrigger value="all">All Content</TabsTrigger>
          <TabsTrigger value="pdfs">PDFs</TabsTrigger>
          <TabsTrigger value="videos">Videos</TabsTrigger>
          <TabsTrigger value="problems">Problems</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-6">
          {/* Search and Filters */}
          <Card>
            <CardContent className="p-6">
              <div className="flex flex-col lg:flex-row gap-4">
                <div className="flex-1 relative">
                  <Input
                    placeholder="Search content..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                </div>
                
                <Select value={selectedType} onValueChange={setSelectedType}>
                  <SelectTrigger className="w-[150px]">
                    <SelectValue placeholder="Type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    <SelectItem value="pdf">PDFs</SelectItem>
                    <SelectItem value="video">Videos</SelectItem>
                    <SelectItem value="problem">Problems</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    <SelectItem value="Computer Science">Computer Science</SelectItem>
                    <SelectItem value="Data Structures">Data Structures</SelectItem>
                    <SelectItem value="Algorithms">Algorithms</SelectItem>
                    <SelectItem value="Web Development">Web Development</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={selectedDifficulty} onValueChange={setSelectedDifficulty}>
                  <SelectTrigger className="w-[150px]">
                    <SelectValue placeholder="Difficulty" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Levels</SelectItem>
                    <SelectItem value="beginner">Beginner</SelectItem>
                    <SelectItem value="intermediate">Intermediate</SelectItem>
                    <SelectItem value="advanced">Advanced</SelectItem>
                  </SelectContent>
                </Select>

                <div className="flex items-center space-x-2">
                  <Button
                    variant={viewMode === 'grid' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setViewMode('grid')}
                  >
                    <Grid className="h-4 w-4" />
                  </Button>
                  <Button
                    variant={viewMode === 'list' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setViewMode('list')}
                  >
                    <List className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Sort Controls */}
          <div className="flex justify-between items-center">
            <p className="text-sm text-muted-foreground">
              Showing {sortedContent.length} of {content.length} items
            </p>
            <div className="flex items-center space-x-2">
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-[120px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="date">Date</SelectItem>
                  <SelectItem value="title">Title</SelectItem>
                  <SelectItem value="views">Views</SelectItem>
                  <SelectItem value="rating">Rating</SelectItem>
                  <SelectItem value="size">Size</SelectItem>
                </SelectContent>
              </Select>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
              >
                {sortOrder === 'asc' ? <SortAsc className="h-4 w-4" /> : <SortDesc className="h-4 w-4" />}
              </Button>
            </div>
          </div>

          {/* Content Grid/List */}
          {viewMode === 'grid' ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {sortedContent.map((item) => (
                <Card key={item.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center space-x-2">
                        <div className={`p-2 rounded-lg ${getTypeColor(item.type)}`}>
                          {getTypeIcon(item.type)}
                        </div>
                        <Badge className={getDifficultyColor(item.difficulty)}>
                          {item.difficulty}
                        </Badge>
                      </div>
                      <div className="flex items-center space-x-1">
                        {item.isFeatured && <Star className="h-4 w-4 text-yellow-500 fill-current" />}
                        {item.isPublished ? (
                          <Eye className="h-4 w-4 text-green-500" />
                        ) : (
                          <EyeOff className="h-4 w-4 text-gray-500" />
                        )}
                      </div>
                    </div>

                    <h3 className="font-semibold text-lg mb-2 line-clamp-2">{item.title}</h3>
                    <p className="text-sm text-muted-foreground mb-4 line-clamp-3">{item.description}</p>

                    <div className="space-y-2 mb-4">
                      <div className="flex items-center justify-between text-sm">
                        <span>Category:</span>
                        <span className="font-medium">{item.category}</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span>Author:</span>
                        <span className="font-medium">{item.author}</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span>Size:</span>
                        <span className="font-medium">{formatFileSize(item.fileSize)}</span>
                      </div>
                      {item.type === 'video' && item.duration && (
                        <div className="flex items-center justify-between text-sm">
                          <span>Duration:</span>
                          <span className="font-medium">{formatDuration(item.duration)}</span>
                        </div>
                      )}
                    </div>

                    <div className="flex items-center justify-between text-sm mb-4">
                      <div className="flex items-center space-x-4">
                        <span className="flex items-center space-x-1">
                          <Eye className="h-3 w-3" />
                          <span>{item.views}</span>
                        </span>
                        <span className="flex items-center space-x-1">
                          <Download className="h-3 w-3" />
                          <span>{item.downloads}</span>
                        </span>
                        <span className="flex items-center space-x-1">
                          <Star className="h-3 w-3" />
                          <span>{item.rating}</span>
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center space-x-2">
                      <Button size="sm" variant="outline" className="flex-1">
                        <Eye className="h-4 w-4 mr-1" />
                        View
                      </Button>
                      <Button size="sm" variant="outline" onClick={() => handleEditContent(item)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button size="sm" variant="outline" onClick={() => handleDeleteContent(item.id)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="space-y-4">
              {sortedContent.map((item) => (
                <Card key={item.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className={`p-3 rounded-lg ${getTypeColor(item.type)}`}>
                          {getTypeIcon(item.type)}
                        </div>
                        <div>
                          <div className="flex items-center space-x-2 mb-1">
                            <h3 className="font-semibold text-lg">{item.title}</h3>
                            <Badge className={getDifficultyColor(item.difficulty)}>
                              {item.difficulty}
                            </Badge>
                            {item.isFeatured && <Star className="h-4 w-4 text-yellow-500 fill-current" />}
                          </div>
                          <p className="text-muted-foreground mb-2">{item.description}</p>
                          <div className="flex items-center space-x-4 text-sm">
                            <span>Category: {item.category}</span>
                            <span>Author: {item.author}</span>
                            <span>Size: {formatFileSize(item.fileSize)}</span>
                            {item.type === 'video' && item.duration && (
                              <span>Duration: {formatDuration(item.duration)}</span>
                            )}
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-6">
                        <div className="text-center">
                          <p className="text-sm font-semibold">{item.views}</p>
                          <p className="text-xs text-muted-foreground">Views</p>
                        </div>
                        
                        <div className="text-center">
                          <p className="text-sm font-semibold">{item.downloads}</p>
                          <p className="text-xs text-muted-foreground">Downloads</p>
                        </div>
                        
                        <div className="text-center">
                          <p className="text-sm font-semibold">{item.rating}/5</p>
                          <p className="text-xs text-muted-foreground">Rating</p>
                        </div>
                        
                        <div className="flex items-center space-x-2">
                          <Button size="sm" variant="outline">
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button size="sm" variant="outline" onClick={() => handleEditContent(item)}>
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button size="sm" variant="outline" onClick={() => handleDeleteContent(item.id)}>
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="pdfs" className="space-y-6">
          <div className="text-center py-12">
            <BookOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">PDF Resources</h3>
            <p className="text-muted-foreground mb-4">
              Manage educational PDFs and learning materials
            </p>
            <Button onClick={() => setIsCreateDialogOpen(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Upload PDF
            </Button>
          </div>
        </TabsContent>

        <TabsContent value="videos" className="space-y-6">
          <div className="text-center py-12">
            <Video className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">Video Content</h3>
            <p className="text-muted-foreground mb-4">
              Manage educational videos and tutorials
            </p>
            <Button onClick={() => setIsCreateDialogOpen(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Upload Video
            </Button>
          </div>
        </TabsContent>

        <TabsContent value="problems" className="space-y-6">
          <div className="text-center py-12">
            <Code className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">Practice Problems</h3>
            <p className="text-muted-foreground mb-4">
              Manage coding challenges and exercises
            </p>
            <Button onClick={() => setIsCreateDialogOpen(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Create Problem
            </Button>
          </div>
        </TabsContent>
      </Tabs>

      {/* Create Content Dialog */}
      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent className="sm:max-w-[700px] max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Add New Content</DialogTitle>
          </DialogHeader>
          <div className="space-y-6">
            {/* Basic Information */}
            <div className="space-y-4">
              <h4 className="font-semibold text-lg">Basic Information</h4>
              
              <div>
                <Label htmlFor="create-title">Content Title *</Label>
                <Input 
                  id="create-title"
                  value={createForm.title}
                  onChange={(e) => setCreateForm(prev => ({ ...prev, title: e.target.value }))}
                  placeholder="Enter content title"
                />
                {formErrors.title && <p className="text-red-500 text-sm mt-1">{formErrors.title}</p>}
              </div>

              <div>
                <Label htmlFor="create-description">Description *</Label>
                <Textarea 
                  id="create-description"
                  value={createForm.description}
                  onChange={(e) => setCreateForm(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Describe the content"
                  rows={3}
                />
                {formErrors.description && <p className="text-red-500 text-sm mt-1">{formErrors.description}</p>}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="create-type">Content Type *</Label>
                  <Select 
                    value={createForm.type} 
                    onValueChange={(value) => setCreateForm(prev => ({ ...prev, type: value as any }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pdf">PDF Document</SelectItem>
                      <SelectItem value="video">Video</SelectItem>
                      <SelectItem value="problem">Practice Problem</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="create-category">Category *</Label>
                  <Input 
                    id="create-category"
                    value={createForm.category}
                    onChange={(e) => setCreateForm(prev => ({ ...prev, category: e.target.value }))}
                    placeholder="e.g., Computer Science"
                  />
                  {formErrors.category && <p className="text-red-500 text-sm mt-1">{formErrors.category}</p>}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="create-difficulty">Difficulty Level</Label>
                  <Select 
                    value={createForm.difficulty} 
                    onValueChange={(value) => setCreateForm(prev => ({ ...prev, difficulty: value as any }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="beginner">Beginner</SelectItem>
                      <SelectItem value="intermediate">Intermediate</SelectItem>
                      <SelectItem value="advanced">Advanced</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="create-author">Author *</Label>
                  <Input 
                    id="create-author"
                    value={createForm.author}
                    onChange={(e) => setCreateForm(prev => ({ ...prev, author: e.target.value }))}
                    placeholder="Enter author name"
                  />
                  {formErrors.author && <p className="text-red-500 text-sm mt-1">{formErrors.author}</p>}
                </div>
              </div>
            </div>

            {/* File Upload */}
            {createForm.type !== 'problem' && (
              <div className="space-y-4">
                <h4 className="font-semibold text-lg">File Upload</h4>
                
                <div>
                  <Label htmlFor="create-file">Upload File *</Label>
                  <Input 
                    id="create-file"
                    type="file"
                    accept={createForm.type === 'pdf' ? '.pdf' : 'video/*'}
                    onChange={handleFileChange}
                    className="mt-1"
                  />
                  {formErrors.file && <p className="text-red-500 text-sm mt-1">{formErrors.file}</p>}
                </div>
              </div>
            )}

            {/* Tags */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="font-semibold text-lg">Tags *</h4>
                <Button type="button" variant="outline" size="sm" onClick={addTag}>
                  <Plus className="h-4 w-4 mr-1" />
                  Add Tag
                </Button>
              </div>
              
              <div className="space-y-3">
                {createForm.tags.map((tag, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <Input
                      value={tag}
                      onChange={(e) => updateTag(index, e.target.value)}
                      placeholder="Enter tag (e.g., algorithms, data structures)"
                      className="flex-1"
                    />
                    {createForm.tags.length > 1 && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => removeTag(index)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                ))}
              </div>
              {formErrors.tags && <p className="text-red-500 text-sm">{formErrors.tags}</p>}
            </div>

            {/* Settings */}
            <div className="space-y-4">
              <h4 className="font-semibold text-lg">Publishing Settings</h4>
              
              <div className="space-y-4">
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="create-published"
                    checked={createForm.isPublished}
                    onChange={(e) => setCreateForm(prev => ({ ...prev, isPublished: e.target.checked }))}
                    className="rounded"
                  />
                  <Label htmlFor="create-published">Publish immediately</Label>
                </div>

                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="create-featured"
                    checked={createForm.isFeatured}
                    onChange={(e) => setCreateForm(prev => ({ ...prev, isFeatured: e.target.checked }))}
                    className="rounded"
                  />
                  <Label htmlFor="create-featured">Mark as featured content</Label>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end gap-2 pt-4">
              <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleCreateContent}>
                <Plus className="mr-2 h-4 w-4" />
                Create Content
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Edit Content Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Edit Content</DialogTitle>
          </DialogHeader>
          {selectedContent && (
            <div className="space-y-4">
              <div>
                <Label htmlFor="edit-title">Title</Label>
                <Input id="edit-title" defaultValue={selectedContent.title} />
              </div>
              <div>
                <Label htmlFor="edit-description">Description</Label>
                <Textarea id="edit-description" defaultValue={selectedContent.description} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="edit-category">Category</Label>
                  <Input id="edit-category" defaultValue={selectedContent.category} />
                </div>
                <div>
                  <Label htmlFor="edit-difficulty">Difficulty</Label>
                  <Select defaultValue={selectedContent.difficulty}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="beginner">Beginner</SelectItem>
                      <SelectItem value="intermediate">Intermediate</SelectItem>
                      <SelectItem value="advanced">Advanced</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                  Cancel
                </Button>
                <Button>Save Changes</Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
} 