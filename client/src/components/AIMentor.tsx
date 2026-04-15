import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Textarea } from '@/components/ui/textarea';
import { 
  Bot, 
  MessageSquare, 
  Lightbulb, 
  Target, 
  BookOpen, 
  Code, 
  TrendingUp,
  Clock,
  Star,
  CheckCircle,
  AlertCircle,
  Send,
  Brain,
  Zap,
  Users,
  Calendar
} from 'lucide-react';

interface Recommendation {
  id: string;
  type: 'course' | 'problem' | 'project' | 'concept';
  title: string;
  description: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  estimatedTime: number; // minutes
  xpReward: number;
  reason: string;
  priority: 'high' | 'medium' | 'low';
}

interface CodeReview {
  id: string;
  code: string;
  language: string;
  feedback: string;
  suggestions: string[];
  score: number;
  timestamp: Date;
}

interface LearningPath {
  id: string;
  name: string;
  description: string;
  steps: string[];
  estimatedDuration: number; // days
  currentStep: number;
  progress: number;
}

interface ChatMessage {
  id: string;
  sender: 'user' | 'ai';
  message: string;
  timestamp: Date;
  type: 'text' | 'code' | 'recommendation';
}

export function AIMentor() {
  const [activeTab, setActiveTab] = useState('recommendations');
  const [chatMessage, setChatMessage] = useState('');
  const [selectedRecommendation, setSelectedRecommendation] = useState<string | null>(null);

  const recommendations: Recommendation[] = [
    {
      id: '1',
      type: 'course',
      title: 'Advanced React Patterns',
      description: 'Learn advanced React concepts like HOCs, Render Props, and Custom Hooks',
      difficulty: 'intermediate',
      estimatedTime: 180,
      xpReward: 300,
      reason: 'Based on your React fundamentals completion and current skill level',
      priority: 'high'
    },
    {
      id: '2',
      type: 'problem',
      title: 'Binary Search Implementation',
      description: 'Practice implementing binary search algorithm with various edge cases',
      difficulty: 'intermediate',
      estimatedTime: 45,
      xpReward: 150,
      reason: 'Will strengthen your algorithmic thinking skills',
      priority: 'high'
    },
    {
      id: '3',
      type: 'project',
      title: 'Full-Stack Task Manager',
      description: 'Build a complete task management application with authentication and real-time updates',
      difficulty: 'advanced',
      estimatedTime: 480,
      xpReward: 500,
      reason: 'Perfect opportunity to apply your full-stack knowledge',
      priority: 'medium'
    },
    {
      id: '4',
      type: 'concept',
      title: 'State Management Patterns',
      description: 'Deep dive into Redux, Context API, and modern state management solutions',
      difficulty: 'intermediate',
      estimatedTime: 120,
      xpReward: 250,
      reason: 'Essential for building scalable React applications',
      priority: 'medium'
    }
  ];

  const codeReviews: CodeReview[] = [
    {
      id: '1',
      code: `function fibonacci(n) {
  if (n <= 1) return n;
  return fibonacci(n-1) + fibonacci(n-2);
}`,
      language: 'javascript',
      feedback: 'Good basic implementation, but consider memoization for better performance',
      suggestions: [
        'Add memoization to avoid recalculating values',
        'Consider using an iterative approach for large numbers',
        'Add input validation for negative numbers'
      ],
      score: 7.5,
      timestamp: new Date('2024-01-20')
    },
    {
      id: '2',
      code: `const TodoList = () => {
  const [todos, setTodos] = useState([]);
  
  const addTodo = (text) => {
    setTodos([...todos, { id: Date.now(), text, completed: false }]);
  };
  
  return (
    <div>
      {todos.map(todo => (
        <div key={todo.id}>{todo.text}</div>
      ))}
    </div>
  );
};`,
      language: 'jsx',
      feedback: 'Good structure, but missing some important features',
      suggestions: [
        'Add delete functionality',
        'Implement toggle completion',
        'Add input validation',
        'Consider using a more robust ID generation'
      ],
      score: 6.8,
      timestamp: new Date('2024-01-19')
    }
  ];

  const learningPaths: LearningPath[] = [
    {
      id: '1',
      name: 'Frontend Mastery Path',
      description: 'Complete path to become a frontend expert',
      steps: [
        'Complete React Fundamentals',
        'Learn State Management',
        'Master Advanced Patterns',
        'Build Portfolio Projects',
        'Learn Testing Strategies'
      ],
      estimatedDuration: 45,
      currentStep: 2,
      progress: 40
    },
    {
      id: '2',
      name: 'Full-Stack Developer Path',
      description: 'End-to-end development skills',
      steps: [
        'Frontend Fundamentals',
        'Backend Development',
        'Database Design',
        'API Development',
        'Deployment & DevOps'
      ],
      estimatedDuration: 60,
      currentStep: 3,
      progress: 50
    }
  ];

  const chatHistory: ChatMessage[] = [
    {
      id: '1',
      sender: 'ai',
      message: 'Hello! I\'m your AI mentor. I\'ve analyzed your progress and have some personalized recommendations for you.',
      timestamp: new Date('2024-01-21T09:00:00'),
      type: 'text'
    },
    {
      id: '2',
      sender: 'user',
      message: 'I\'m struggling with React hooks. Can you help me understand useEffect better?',
      timestamp: new Date('2024-01-21T09:05:00'),
      type: 'text'
    },
    {
      id: '3',
      sender: 'ai',
      message: 'Of course! useEffect is a powerful hook for handling side effects. Here\'s a simple example:\n\n```javascript\nuseEffect(() => {\n  // This runs after every render\n  document.title = `Count: ${count}`;\n  \n  // Cleanup function (optional)\n  return () => {\n    document.title = "React App";\n  };\n}, [count]); // Dependency array\n```\n\nThe dependency array `[count]` means this effect only runs when `count` changes.',
      timestamp: new Date('2024-01-21T09:06:00'),
      type: 'code'
    }
  ];

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner': return 'bg-green-500/20 text-green-400';
      case 'intermediate': return 'bg-yellow-500/20 text-yellow-400';
      case 'advanced': return 'bg-red-500/20 text-red-400';
      default: return 'bg-gray-500/20 text-gray-400';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-500/20 text-red-400';
      case 'medium': return 'bg-yellow-500/20 text-yellow-400';
      case 'low': return 'bg-green-500/20 text-green-400';
      default: return 'bg-gray-500/20 text-gray-400';
    }
  };

  const sendMessage = () => {
    if (chatMessage.trim()) {
      setChatMessage('');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="bg-gradient-to-r from-purple-500/10 to-blue-500/10 border-purple-500/20">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Bot className="h-5 w-5 text-purple-500" />
            <span>AI Mentor</span>
            <Badge className="bg-purple-500/20 text-purple-400">Beta</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            Your personalized AI mentor is here to guide your learning journey with tailored recommendations, 
            code reviews, and interactive support.
          </p>
        </CardContent>
      </Card>

      {/* Tabs */}
      <div className="flex space-x-2 border-b">
        {[
          { id: 'recommendations', label: 'Recommendations', icon: Lightbulb },
          { id: 'code-review', label: 'Code Review', icon: Code },
          { id: 'learning-paths', label: 'Learning Paths', icon: Target },
          { id: 'chat', label: 'Chat', icon: MessageSquare }
        ].map((tab) => {
          const IconComponent = tab.icon;
          return (
            <Button
              key={tab.id}
              variant={activeTab === tab.id ? "default" : "ghost"}
              onClick={() => setActiveTab(tab.id)}
              className="flex items-center space-x-2"
            >
              <IconComponent className="h-4 w-4" />
              <span>{tab.label}</span>
            </Button>
          );
        })}
      </div>

      {/* Recommendations Tab */}
      {activeTab === 'recommendations' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">Personalized Recommendations</h3>
            <Badge className="bg-green-500/20 text-green-400">
              {recommendations.length} suggestions
            </Badge>
          </div>
          
          <div className="grid md:grid-cols-2 gap-4">
            {recommendations.map((rec) => (
              <Card key={rec.id} className="hover:shadow-md transition-all">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center space-x-2">
                      {rec.type === 'course' && <BookOpen className="h-5 w-5 text-blue-500" />}
                      {rec.type === 'problem' && <Target className="h-5 w-5 text-green-500" />}
                      {rec.type === 'project' && <Code className="h-5 w-5 text-purple-500" />}
                      {rec.type === 'concept' && <Brain className="h-5 w-5 text-orange-500" />}
                      <h4 className="font-semibold">{rec.title}</h4>
                    </div>
                    <Badge className={getPriorityColor(rec.priority)}>
                      {rec.priority}
                    </Badge>
                  </div>
                  
                  <p className="text-sm text-muted-foreground mb-3">{rec.description}</p>
                  
                  <div className="flex items-center justify-between mb-3">
                    <Badge className={getDifficultyColor(rec.difficulty)}>
                      {rec.difficulty}
                    </Badge>
                    <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                      <span className="flex items-center space-x-1">
                        <Clock className="h-3 w-3" />
                        <span>{rec.estimatedTime}m</span>
                      </span>
                      <span className="flex items-center space-x-1">
                        <Star className="h-3 w-3" />
                        <span>{rec.xpReward} XP</span>
                      </span>
                    </div>
                  </div>
                  
                  <div className="bg-muted/50 p-3 rounded-lg mb-3">
                    <p className="text-sm">
                      <strong>Why this?</strong> {rec.reason}
                    </p>
                  </div>
                  
                  <div className="flex space-x-2">
                    <Button size="sm" className="flex-1">
                      Start Learning
                    </Button>
                    <Button size="sm" variant="outline">
                      Learn More
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Code Review Tab */}
      {activeTab === 'code-review' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">Code Reviews</h3>
            <Button size="sm" variant="outline">
              Submit New Code
            </Button>
          </div>
          
          <div className="space-y-4">
            {codeReviews.map((review) => (
              <Card key={review.id}>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-2">
                      <Code className="h-5 w-5 text-primary" />
                      <span className="font-semibold">Code Review</span>
                      <Badge variant="outline">{review.language}</Badge>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="text-sm text-muted-foreground">
                        {review.timestamp.toLocaleDateString()}
                      </span>
                      <Badge className="bg-green-500/20 text-green-400">
                        Score: {review.score}/10
                      </Badge>
                    </div>
                  </div>
                  
                  <div className="bg-muted p-3 rounded-lg mb-3 font-mono text-sm">
                    <pre>{review.code}</pre>
                  </div>
                  
                  <div className="mb-3">
                    <h5 className="font-semibold mb-2">Feedback:</h5>
                    <p className="text-sm text-muted-foreground">{review.feedback}</p>
                  </div>
                  
                  <div>
                    <h5 className="font-semibold mb-2">Suggestions:</h5>
                    <ul className="space-y-1">
                      {review.suggestions.map((suggestion, index) => (
                        <li key={index} className="text-sm flex items-start space-x-2">
                          <CheckCircle className="h-3 w-3 text-green-500 mt-0.5 flex-shrink-0" />
                          <span>{suggestion}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Learning Paths Tab */}
      {activeTab === 'learning-paths' && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Recommended Learning Paths</h3>
          
          <div className="space-y-4">
            {learningPaths.map((path) => (
              <Card key={path.id}>
                <CardContent className="p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h4 className="font-semibold">{path.name}</h4>
                      <p className="text-sm text-muted-foreground">{path.description}</p>
                    </div>
                    <Badge className="bg-blue-500/20 text-blue-400">
                      {path.estimatedDuration} days
                    </Badge>
                  </div>
                  
                  <div className="mb-3">
                    <div className="flex justify-between text-sm mb-1">
                      <span>Progress</span>
                      <span>{path.progress}%</span>
                    </div>
                    <Progress value={path.progress} className="h-2" />
                  </div>
                  
                  <div className="space-y-2">
                    {path.steps.map((step, index) => (
                      <div
                        key={index}
                        className={`flex items-center space-x-2 text-sm ${
                          index < path.currentStep ? 'text-green-600' :
                          index === path.currentStep ? 'text-primary font-semibold' :
                          'text-muted-foreground'
                        }`}
                      >
                        {index < path.currentStep ? (
                          <CheckCircle className="h-4 w-4 text-green-500" />
                        ) : index === path.currentStep ? (
                          <Target className="h-4 w-4 text-primary" />
                        ) : (
                          <div className="h-4 w-4 rounded-full border-2 border-muted-foreground" />
                        )}
                        <span>{step}</span>
                      </div>
                    ))}
                  </div>
                  
                  <div className="mt-4 flex space-x-2">
                    <Button size="sm" className="flex-1">
                      Continue Path
                    </Button>
                    <Button size="sm" variant="outline">
                      View Details
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Chat Tab */}
      {activeTab === 'chat' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">Chat with AI Mentor</h3>
            <Badge className="bg-green-500/20 text-green-400">
              Online
            </Badge>
          </div>
          
          {/* Chat Messages */}
          <div className="h-96 overflow-y-auto space-y-4 border rounded-lg p-4 bg-muted/20">
            {chatHistory.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-xs lg:max-w-md p-3 rounded-lg ${
                    message.sender === 'user'
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-muted'
                  }`}
                >
                  {message.type === 'code' ? (
                    <div>
                      <p className="mb-2">{message.message.split('\n\n')[0]}</p>
                      <pre className="bg-background/50 p-2 rounded text-xs overflow-x-auto">
                        {message.message.split('\n\n')[1]}
                      </pre>
                    </div>
                  ) : (
                    <p className="text-sm">{message.message}</p>
                  )}
                  <div className="text-xs opacity-70 mt-1">
                    {message.timestamp.toLocaleTimeString()}
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          {/* Message Input */}
          <div className="flex space-x-2">
            <Textarea
              placeholder="Ask your AI mentor anything..."
              value={chatMessage}
              onChange={(e) => setChatMessage(e.target.value)}
              className="flex-1"
              rows={2}
              onKeyPress={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  sendMessage();
                }
              }}
            />
            <Button onClick={sendMessage} disabled={!chatMessage.trim()}>
              <Send className="h-4 w-4" />
            </Button>
          </div>
          
          {/* Quick Actions */}
          <div className="grid grid-cols-2 gap-2">
            <Button variant="outline" size="sm">
              <Code className="h-4 w-4 mr-2" />
              Review My Code
            </Button>
            <Button variant="outline" size="sm">
              <Target className="h-4 w-4 mr-2" />
              Get Recommendations
            </Button>
          </div>
        </div>
      )}
    </div>
  );
} 