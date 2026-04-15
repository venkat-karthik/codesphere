import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Laptop, 
  Code, 
  Play, 
  Star,
  Clock,
  Users,
  Zap,
  Globe,
  Smartphone,
  Monitor
} from 'lucide-react';

interface SandboxApp {
  id: string;
  name: string;
  description: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  category: string;
  estimatedTime: string;
  technologies: string[];
  isPopular: boolean;
  completions: number;
  icon: any;
}

export function Sandbox() {
  const [selectedCategory, setSelectedCategory] = useState('all');

  const sandboxApps: SandboxApp[] = [
    {
      id: '1',
      name: 'Netflix Clone',
      description: 'Build a streaming platform with movie listings and user authentication',
      difficulty: 'advanced',
      category: 'Entertainment',
      estimatedTime: '8-12 hours',
      technologies: ['React', 'Node.js', 'MongoDB'],
      isPopular: true,
      completions: 2847,
      icon: Monitor
    },
    {
      id: '2',
      name: 'Twitter Clone',
      description: 'Create a social media platform with tweets, followers, and real-time updates',
      difficulty: 'intermediate',
      category: 'Social Media',
      estimatedTime: '6-8 hours',
      technologies: ['React', 'Socket.io', 'Express'],
      isPopular: true,
      completions: 3251,
      icon: Globe
    },
    {
      id: '3',
      name: 'Instagram Clone',
      description: 'Photo sharing app with filters, stories, and social features',
      difficulty: 'advanced',
      category: 'Social Media',
      estimatedTime: '10-15 hours',
      technologies: ['React Native', 'Firebase', 'Node.js'],
      isPopular: true,
      completions: 1923,
      icon: Smartphone
    },
    {
      id: '4',
      name: 'Spotify Clone',
      description: 'Music streaming app with playlists and audio player functionality',
      difficulty: 'intermediate',
      category: 'Entertainment',
      estimatedTime: '5-7 hours',
      technologies: ['Vue.js', 'Express', 'PostgreSQL'],
      isPopular: false,
      completions: 1456,
      icon: Play
    },
    {
      id: '5',
      name: 'WhatsApp Clone',
      description: 'Real-time messaging app with group chats and media sharing',
      difficulty: 'intermediate',
      category: 'Communication',
      estimatedTime: '7-9 hours',
      technologies: ['React', 'Socket.io', 'MongoDB'],
      isPopular: true,
      completions: 2134,
      icon: Zap
    },
    {
      id: '6',
      name: 'Airbnb Clone',
      description: 'Property rental platform with booking system and reviews',
      difficulty: 'beginner',
      category: 'E-commerce',
      estimatedTime: '4-6 hours',
      technologies: ['Next.js', 'Prisma', 'Stripe'],
      isPopular: false,
      completions: 987,
      icon: Globe
    }
  ];

  const categories = ['all', 'Entertainment', 'Social Media', 'Communication', 'E-commerce'];

  const filteredApps = sandboxApps.filter(app => {
    return selectedCategory === 'all' || app.category === selectedCategory;
  });

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner': return 'bg-green-500/20 text-green-400';
      case 'intermediate': return 'bg-yellow-500/20 text-yellow-400';
      case 'advanced': return 'bg-red-500/20 text-red-400';
      default: return 'bg-gray-500/20 text-gray-400';
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold mb-2">App Sandbox</h1>
          <p className="text-muted-foreground">
            Practice building clones of popular apps in a safe environment
          </p>
        </div>
        <Button className="bg-primary hover:bg-primary/90">
          <Code className="mr-2 h-4 w-4" />
          Create Custom
        </Button>
      </div>

      {/* Popular Apps Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Star className="h-5 w-5 text-yellow-400" />
            <span>Most Popular Builds</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-3 gap-4">
            {sandboxApps.filter(app => app.isPopular).slice(0, 3).map((app) => (
              <Card key={app.id} className="card-hover cursor-pointer">
                <CardContent className="p-4">
                  <div className="flex items-center space-x-3 mb-3">
                    <div className="w-10 h-10 bg-primary/20 rounded-lg flex items-center justify-center">
                      <app.icon className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold">{app.name}</h3>
                      <div className="flex items-center space-x-1 text-xs text-muted-foreground">
                        <Users className="h-3 w-3" />
                        <span>{app.completions.toLocaleString()} builds</span>
                      </div>
                    </div>
                  </div>
                  <Badge className={getDifficultyColor(app.difficulty)} size="sm">
                    {app.difficulty}
                  </Badge>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Category Filters */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <Button
                key={category}
                variant={selectedCategory === category ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedCategory(category)}
                className="capitalize"
              >
                {category === 'all' ? 'All Categories' : category}
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Apps Grid */}
      <div className="grid lg:grid-cols-2 gap-6">
        {filteredApps.map((app) => (
          <Card key={app.id} className="card-hover">
            <CardContent className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-primary/20 rounded-lg flex items-center justify-center">
                    <app.icon className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold flex items-center space-x-2">
                      <span>{app.name}</span>
                      {app.isPopular && (
                        <Star className="h-4 w-4 text-yellow-400 fill-current" />
                      )}
                    </h3>
                    <Badge variant="outline" className="text-xs">
                      {app.category}
                    </Badge>
                  </div>
                </div>
                <Badge className={getDifficultyColor(app.difficulty)}>
                  {app.difficulty}
                </Badge>
              </div>
              
              <p className="text-muted-foreground text-sm mb-4">
                {app.description}
              </p>
              
              <div className="flex items-center justify-between text-sm text-muted-foreground mb-4">
                <div className="flex items-center space-x-1">
                  <Clock className="h-3 w-3" />
                  <span>{app.estimatedTime}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Users className="h-3 w-3" />
                  <span>{app.completions.toLocaleString()} completed</span>
                </div>
              </div>
              
              <div className="flex flex-wrap gap-1 mb-4">
                {app.technologies.map((tech) => (
                  <Badge key={tech} variant="secondary" className="text-xs">
                    {tech}
                  </Badge>
                ))}
              </div>
              
              <Button className="w-full">
                <Play className="mr-2 h-4 w-4" />
                Start Building
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Sandbox Stats */}
      <div className="grid md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6 text-center">
            <div className="text-3xl font-bold text-primary mb-2">
              {sandboxApps.length}
            </div>
            <div className="text-muted-foreground">Available Projects</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6 text-center">
            <div className="text-3xl font-bold text-green-500 mb-2">
              {sandboxApps.reduce((acc, app) => acc + app.completions, 0).toLocaleString()}
            </div>
            <div className="text-muted-foreground">Total Builds</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6 text-center">
            <div className="text-3xl font-bold text-blue-500 mb-2">
              {sandboxApps.filter(app => app.isPopular).length}
            </div>
            <div className="text-muted-foreground">Popular Apps</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6 text-center">
            <div className="text-3xl font-bold text-orange-500 mb-2">
              {categories.length - 1}
            </div>
            <div className="text-muted-foreground">Categories</div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
