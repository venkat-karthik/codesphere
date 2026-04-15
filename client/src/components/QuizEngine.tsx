import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Progress } from '@/components/ui/progress';
import { 
  HelpCircle,
  Clock, 
  CheckCircle, 
  AlertCircle, 
  Plus, 
  Edit, 
  Trash2, 
  Eye,
  Play,
  Pause,
  Settings,
  BarChart3,
  FileText,
  Star,
  Users,
  Target,
  Timer,
  Award,
  MessageSquare,
  Download,
  Upload,
  Search,
  Filter
} from 'lucide-react';

interface Quiz {
  id: string;
  title: string;
  description: string;
  course: string;
  category: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  timeLimit: number; // minutes
  totalQuestions: number;
  totalPoints: number;
  status: 'draft' | 'published' | 'archived';
  attempts: number;
  averageScore: number;
  passingScore: number;
  instructions: string;
  tags: string[];
  createdAt: Date;
  createdBy: string;
}

interface Question {
  id: string;
  quizId: string;
  type: 'multiple-choice' | 'true-false' | 'fill-blank' | 'coding' | 'essay';
  question: string;
  points: number;
  order: number;
  options?: string[];
  correctAnswer?: string | string[];
  explanation?: string;
  difficulty: 'easy' | 'medium' | 'hard';
  category: string;
}

interface QuizAttempt {
  id: string;
  quizId: string;
  studentName: string;
  studentId: string;
  startedAt: Date;
  completedAt?: Date;
  score: number;
  maxScore: number;
  percentage: number;
  status: 'in-progress' | 'completed' | 'abandoned';
  timeSpent: number; // minutes
  answers: Answer[];
}

interface Answer {
  questionId: string;
  answer: string;
  isCorrect: boolean;
  points: number;
  maxPoints: number;
  feedback?: string;
}

interface QuizAnalytics {
  totalAttempts: number;
  averageScore: number;
  passRate: number;
  averageTime: number;
  questionAnalysis: QuestionAnalysis[];
}

interface QuestionAnalysis {
  questionId: string;
  question: string;
  correctAnswers: number;
  totalAttempts: number;
  successRate: number;
  averageTime: number;
}

export function QuizEngine() {
  const [activeTab, setActiveTab] = useState('quizzes');
  const [selectedQuiz, setSelectedQuiz] = useState<Quiz | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');

  const quizzes: Quiz[] = [
    {
      id: '1',
      title: 'JavaScript Fundamentals Quiz',
      description: 'Test your knowledge of JavaScript basics including variables, functions, and data types',
      course: 'JavaScript Fundamentals',
      category: 'Frontend Development',
      difficulty: 'beginner',
      timeLimit: 30,
      totalQuestions: 20,
      totalPoints: 100,
      status: 'published',
      attempts: 156,
      averageScore: 78.5,
      passingScore: 70,
      instructions: 'Answer all questions within the time limit. Each question is worth 5 points.',
      tags: ['javascript', 'basics', 'fundamentals'],
      createdAt: new Date('2024-01-15'),
      createdBy: 'Sarah Chen'
    },
    {
      id: '2',
      title: 'React Hooks Assessment',
      description: 'Comprehensive quiz on React hooks including useState, useEffect, and custom hooks',
      course: 'React Development',
      category: 'Frontend Development',
      difficulty: 'intermediate',
      timeLimit: 45,
      totalQuestions: 25,
      totalPoints: 125,
      status: 'published',
      attempts: 89,
      averageScore: 82.3,
      passingScore: 75,
      instructions: 'This quiz covers React hooks concepts. Read each question carefully.',
      tags: ['react', 'hooks', 'frontend'],
      createdAt: new Date('2024-01-10'),
      createdBy: 'Alex Johnson'
    },
    {
      id: '3',
      title: 'Algorithm Complexity Quiz',
      description: 'Test your understanding of Big O notation and algorithm efficiency',
      course: 'Data Structures & Algorithms',
      category: 'Computer Science',
      difficulty: 'advanced',
      timeLimit: 60,
      totalQuestions: 15,
      totalPoints: 75,
      status: 'published',
      attempts: 67,
      averageScore: 71.8,
      passingScore: 65,
      instructions: 'Show your work for calculation questions. Time complexity analysis required.',
      tags: ['algorithms', 'complexity', 'big-o'],
      createdAt: new Date('2024-01-05'),
      createdBy: 'Mike Rodriguez'
    },
    {
      id: '4',
      title: 'Database Design Quiz',
      description: 'Assessment on database normalization, relationships, and SQL queries',
      course: 'Database Design',
      category: 'Backend Development',
      difficulty: 'intermediate',
      timeLimit: 40,
      totalQuestions: 18,
      totalPoints: 90,
      status: 'draft',
      attempts: 0,
      averageScore: 0,
      passingScore: 70,
      instructions: 'Focus on database design principles and SQL best practices.',
      tags: ['database', 'sql', 'normalization'],
      createdAt: new Date('2024-01-20'),
      createdBy: 'Emma Wilson'
    }
  ];

  const questions: Question[] = [
    {
      id: '1',
      quizId: '1',
      type: 'multiple-choice',
      question: 'What is the correct way to declare a variable in JavaScript?',
      points: 5,
      order: 1,
      options: [
        'var x = 5;',
        'let x = 5;',
        'const x = 5;',
        'All of the above'
      ],
      correctAnswer: 'All of the above',
      explanation: 'All three methods are valid ways to declare variables in JavaScript, each with different scoping rules.',
      difficulty: 'easy',
      category: 'Variables'
    },
    {
      id: '2',
      quizId: '1',
      type: 'true-false',
      question: 'JavaScript is a statically typed programming language.',
      points: 5,
      order: 2,
      correctAnswer: 'false',
      explanation: 'JavaScript is a dynamically typed language, meaning variable types are determined at runtime.',
      difficulty: 'easy',
      category: 'Data Types'
    },
    {
      id: '3',
      quizId: '1',
      type: 'fill-blank',
      question: 'Complete the function: function add(a, b) { return _____; }',
      points: 5,
      order: 3,
      correctAnswer: 'a + b',
      explanation: 'The function should return the sum of parameters a and b.',
      difficulty: 'medium',
      category: 'Functions'
    },
    {
      id: '4',
      quizId: '2',
      type: 'multiple-choice',
      question: 'Which hook is used to perform side effects in React?',
      points: 5,
      order: 1,
      options: [
        'useState',
        'useEffect',
        'useContext',
        'useReducer'
      ],
      correctAnswer: 'useEffect',
      explanation: 'useEffect is specifically designed for handling side effects in React components.',
      difficulty: 'medium',
      category: 'React Hooks'
    }
  ];

  const quizAttempts: QuizAttempt[] = [
    {
      id: '1',
      quizId: '1',
      studentName: 'Lisa Thompson',
      studentId: 'ST001',
      startedAt: new Date('2024-01-21T14:30:00'),
      completedAt: new Date('2024-01-21T14:58:00'),
      score: 85,
      maxScore: 100,
      percentage: 85,
      status: 'completed',
      timeSpent: 28,
      answers: [
        {
          questionId: '1',
          answer: 'All of the above',
          isCorrect: true,
          points: 5,
          maxPoints: 5
        },
        {
          questionId: '2',
          answer: 'false',
          isCorrect: true,
          points: 5,
          maxPoints: 5
        }
      ]
    },
    {
      id: '2',
      quizId: '1',
      studentName: 'James Brown',
      studentId: 'ST002',
      startedAt: new Date('2024-01-21T15:00:00'),
      completedAt: new Date('2024-01-21T15:25:00'),
      score: 70,
      maxScore: 100,
      percentage: 70,
      status: 'completed',
      timeSpent: 25,
      answers: [
        {
          questionId: '1',
          answer: 'let x = 5;',
          isCorrect: false,
          points: 0,
          maxPoints: 5,
          feedback: 'While let is valid, the question asked for all correct ways.'
        }
      ]
    }
  ];

  const analytics: QuizAnalytics = {
    totalAttempts: 312,
    averageScore: 78.2,
    passRate: 82.5,
    averageTime: 32.5,
    questionAnalysis: [
      {
        questionId: '1',
        question: 'What is the correct way to declare a variable in JavaScript?',
        correctAnswers: 134,
        totalAttempts: 156,
        successRate: 85.9,
        averageTime: 45
      },
      {
        questionId: '2',
        question: 'JavaScript is a statically typed programming language.',
        correctAnswers: 142,
        totalAttempts: 156,
        successRate: 91.0,
        averageTime: 30
      }
    ]
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'draft': return 'bg-gray-500/20 text-gray-400';
      case 'published': return 'bg-green-500/20 text-green-400';
      case 'archived': return 'bg-red-500/20 text-red-400';
      default: return 'bg-gray-500/20 text-gray-400';
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner': return 'bg-green-500/20 text-green-400';
      case 'intermediate': return 'bg-yellow-500/20 text-yellow-400';
      case 'advanced': return 'bg-red-500/20 text-red-400';
      default: return 'bg-gray-500/20 text-gray-400';
    }
  };

  const getQuestionTypeIcon = (type: string) => {
    switch (type) {
      case 'multiple-choice': return <CheckCircle className="h-4 w-4" />;
      case 'true-false': return <AlertCircle className="h-4 w-4" />;
      case 'fill-blank': return <FileText className="h-4 w-4" />;
      case 'coding': return <Target className="h-4 w-4" />;
      case 'essay': return <MessageSquare className="h-4 w-4" />;
      default: return <HelpCircle className="h-4 w-4" />;
    }
  };

  const getAttemptStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-500/20 text-green-400';
      case 'in-progress': return 'bg-blue-500/20 text-blue-400';
      case 'abandoned': return 'bg-red-500/20 text-red-400';
      default: return 'bg-gray-500/20 text-gray-400';
    }
  };

  const filteredQuizzes = quizzes.filter(quiz => {
    const matchesSearch = quiz.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         quiz.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = filterCategory === 'all' || quiz.category === filterCategory;
    const matchesStatus = filterStatus === 'all' || quiz.status === filterStatus;
    return matchesSearch && matchesCategory && matchesStatus;
  });

  const createQuiz = () => {
    setShowCreateModal(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="bg-gradient-to-r from-purple-500/10 to-pink-500/10 border-purple-500/20">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <HelpCircle className="h-5 w-5 text-purple-500" />
            <span>Quiz Engine</span>
            <Badge className="bg-purple-500/20 text-purple-400">Automated</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            Create, manage, and analyze quizzes with automated grading and detailed analytics.
          </p>
        </CardContent>
      </Card>

      {/* Tabs */}
      <div className="flex space-x-2 border-b">
        {[
          { id: 'quizzes', label: 'Quizzes', icon: HelpCircle },
          { id: 'questions', label: 'Questions', icon: FileText },
          { id: 'attempts', label: 'Attempts', icon: Users },
          { id: 'analytics', label: 'Analytics', icon: BarChart3 }
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

      {/* Quizzes Tab */}
      {activeTab === 'quizzes' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <h3 className="text-lg font-semibold">Quiz Management</h3>
              <Button onClick={() => setShowCreateModal(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Create Quiz
              </Button>
            </div>
            <div className="flex items-center space-x-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search quizzes..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 w-64"
                />
              </div>
              <select
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
                className="px-3 py-2 border rounded text-sm"
              >
                <option value="all">All Categories</option>
                <option value="Frontend Development">Frontend</option>
                <option value="Backend Development">Backend</option>
                <option value="Computer Science">Computer Science</option>
              </select>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="px-3 py-2 border rounded text-sm"
              >
                <option value="all">All Status</option>
                <option value="draft">Draft</option>
                <option value="published">Published</option>
                <option value="archived">Archived</option>
              </select>
            </div>
          </div>
          
          <div className="grid md:grid-cols-2 gap-4">
            {filteredQuizzes.map((quiz) => (
              <Card key={quiz.id} className="hover:shadow-md transition-all">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-1">
                        <h4 className="font-semibold">{quiz.title}</h4>
                        <Badge className={getStatusColor(quiz.status)}>
                          {quiz.status}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mb-2">{quiz.description}</p>
                      <div className="flex items-center space-x-2 text-sm">
                        <Badge className={getDifficultyColor(quiz.difficulty)}>
                          {quiz.difficulty}
                        </Badge>
                        <span className="text-muted-foreground">{quiz.course}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-4 text-sm">
                      <span className="flex items-center space-x-1">
                        <Timer className="h-3 w-3" />
                        <span>{quiz.timeLimit}m</span>
                      </span>
                      <span className="flex items-center space-x-1">
                        <FileText className="h-3 w-3" />
                        <span>{quiz.totalQuestions} questions</span>
                      </span>
                      <span className="flex items-center space-x-1">
                        <Users className="h-3 w-3" />
                        <span>{quiz.attempts} attempts</span>
                      </span>
                    </div>
                    <div className="text-right">
                      <div className="flex items-center space-x-1">
                        <Star className="h-3 w-3 text-yellow-500" />
                        <span className="text-sm font-semibold">{quiz.averageScore}%</span>
                      </div>
                      <div className="text-xs text-muted-foreground">{quiz.totalPoints} pts</div>
                    </div>
                  </div>
                  
                  <div className="flex space-x-2">
                    <Button size="sm" variant="outline">
                      <Eye className="h-4 w-4 mr-1" />
                      View
                    </Button>
                    <Button size="sm" variant="outline">
                      <Edit className="h-4 w-4 mr-1" />
                      Edit
                    </Button>
                    <Button size="sm" variant="outline">
                      <Play className="h-4 w-4 mr-1" />
                      Preview
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Questions Tab */}
      {activeTab === 'questions' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">Question Bank</h3>
            <div className="flex items-center space-x-2">
              <select className="px-3 py-2 border rounded text-sm">
                <option>Select Quiz</option>
                {quizzes.map(quiz => (
                  <option key={quiz.id} value={quiz.id}>{quiz.title}</option>
                ))}
              </select>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Add Question
              </Button>
            </div>
          </div>
          
          <Card>
            <CardContent className="p-0">
              <div className="space-y-1">
                {questions.map((question) => (
                  <div
                    key={question.id}
                    className="p-4 border-b last:border-b-0 hover:bg-muted/50 transition-all"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-start space-x-3 flex-1">
                        <div className="w-8 h-8 bg-primary/20 rounded-lg flex items-center justify-center">
                          {getQuestionTypeIcon(question.type)}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-1">
                            <h4 className="font-semibold">Q{question.order}: {question.question}</h4>
                            <Badge className={getDifficultyColor(question.difficulty)}>
                              {question.difficulty}
                            </Badge>
                            <Badge variant="outline">{question.points} pts</Badge>
                          </div>
                          {question.options && (
                            <div className="text-sm text-muted-foreground mb-2">
                              Options: {question.options.join(', ')}
                            </div>
                          )}
                          {question.explanation && (
                            <div className="text-sm text-muted-foreground">
                              <strong>Explanation:</strong> {question.explanation}
                            </div>
                          )}
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <Button size="sm" variant="outline">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button size="sm" variant="outline">
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button size="sm" variant="outline">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Attempts Tab */}
      {activeTab === 'attempts' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">Quiz Attempts</h3>
            <div className="flex items-center space-x-2">
              <Input placeholder="Search students..." className="w-64" />
              <Button variant="outline" size="sm">
                <Download className="h-4 w-4 mr-2" />
                Export Results
              </Button>
            </div>
          </div>
          
          <Card>
            <CardContent className="p-0">
              <div className="space-y-1">
                {quizAttempts.map((attempt) => (
                  <div
                    key={attempt.id}
                    className="p-4 border-b last:border-b-0 hover:bg-muted/50 transition-all"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-primary/20 rounded-full flex items-center justify-center text-primary font-semibold">
                          {attempt.studentName.split(' ').map(n => n[0]).join('')}
                        </div>
                        <div>
                          <div className="flex items-center space-x-2">
                            <h4 className="font-semibold">{attempt.studentName}</h4>
                            <Badge className={getAttemptStatusColor(attempt.status)}>
                              {attempt.status}
                            </Badge>
                          </div>
                          <div className="text-sm text-muted-foreground">
                            Started: {attempt.startedAt.toLocaleDateString()}
                            {attempt.completedAt && (
                              <span> • Completed: {attempt.completedAt.toLocaleDateString()}</span>
                            )}
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-4">
                        <div className="text-right">
                          <div className="font-semibold">{attempt.score}/{attempt.maxScore}</div>
                          <div className="text-sm text-muted-foreground">
                            {attempt.percentage}% • {attempt.timeSpent}m
                          </div>
                        </div>
                        <div className="flex space-x-2">
                          <Button size="sm" variant="outline">
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button size="sm" variant="outline">
                            <MessageSquare className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Analytics Tab */}
      {activeTab === 'analytics' && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Quiz Analytics</h3>
          
          <div className="grid md:grid-cols-4 gap-4">
            <Card>
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-blue-500">{analytics.totalAttempts}</div>
                <div className="text-sm text-muted-foreground">Total Attempts</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-green-500">{analytics.averageScore}%</div>
                <div className="text-sm text-muted-foreground">Average Score</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-purple-500">{analytics.passRate}%</div>
                <div className="text-sm text-muted-foreground">Pass Rate</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-orange-500">{analytics.averageTime}m</div>
                <div className="text-sm text-muted-foreground">Avg Time</div>
              </CardContent>
            </Card>
          </div>
          
          <Card>
            <CardHeader>
              <CardTitle>Question Performance Analysis</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {analytics.questionAnalysis.map((question) => (
                  <div key={question.questionId} className="p-3 border rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-semibold">{question.question}</h4>
                      <div className="text-right">
                        <div className="font-semibold">{question.successRate}%</div>
                        <div className="text-sm text-muted-foreground">
                          {question.correctAnswers}/{question.totalAttempts} correct
                        </div>
                      </div>
                    </div>
                    <Progress value={question.successRate} className="h-2" />
                    <div className="flex justify-between text-sm text-muted-foreground mt-1">
                      <span>Avg time: {question.averageTime}s</span>
                      <span>Success rate: {question.successRate}%</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
} 