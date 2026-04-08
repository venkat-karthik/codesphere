import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Progress } from '@/components/ui/progress';
import { 
  BookOpen, 
  Users, 
  Clock, 
  Star, 
  Target, 
  Plus, 
  Edit, 
  Trash2, 
  Eye,
  Download,
  Upload,
  Search,
  Filter,
  Calendar,
  CheckCircle,
  AlertCircle,
  Play,
  Pause,
  Settings,
  MessageSquare,
  BarChart3,
  FileText,
  Video,
  Code,
  HelpCircle
} from 'lucide-react';

interface Course {
  id: string;
  title: string;
  description: string;
  instructor: string;
  category: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  duration: number; // hours
  lessons: number;
  enrolledStudents: number;
  rating: number;
  reviews: number;
  status: 'draft' | 'published' | 'archived';
  price: number;
  thumbnail?: string;
  tags: string[];
  createdAt: Date;
  lastUpdated: Date;
}

interface Lesson {
  id: string;
  courseId: string;
  title: string;
  type: 'video' | 'text' | 'quiz' | 'coding' | 'project';
  duration: number; // minutes
  order: number;
  status: 'draft' | 'published';
  content?: string;
  videoUrl?: string;
  quizQuestions?: number;
  codingProblem?: string;
  isCompleted?: boolean;
}

interface Student {
  id: string;
  name: string;
  email: string;
  enrolledDate: Date;
  progress: number;
  lastAccessed: Date;
  completedLessons: number;
  totalLessons: number;
  status: 'active' | 'inactive' | 'completed';
}

interface CourseAnalytics {
  totalEnrollments: number;
  activeStudents: number;
  completionRate: number;
  averageRating: number;
  averageProgress: number;
  revenue: number;
}

export function CourseManager() {
  const [activeTab, setActiveTab] = useState('courses');
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');

  const courses: Course[] = [
    {
      id: '1',
      title: 'JavaScript Fundamentals',
      description: 'Learn the basics of JavaScript programming from variables to functions',
      instructor: 'Sarah Chen',
      category: 'Frontend Development',
      difficulty: 'beginner',
      duration: 12,
      lessons: 25,
      enrolledStudents: 456,
      rating: 4.8,
      reviews: 89,
      status: 'published',
      price: 49.99,
      tags: ['javascript', 'beginner', 'programming'],
      createdAt: new Date('2024-01-01'),
      lastUpdated: new Date('2024-01-20')
    },
    {
      id: '2',
      title: 'React Development Masterclass',
      description: 'Master React with hooks, context, and advanced patterns',
      instructor: 'Alex Johnson',
      category: 'Frontend Development',
      difficulty: 'intermediate',
      duration: 18,
      lessons: 35,
      enrolledStudents: 389,
      rating: 4.9,
      reviews: 124,
      status: 'published',
      price: 79.99,
      tags: ['react', 'hooks', 'frontend'],
      createdAt: new Date('2023-12-15'),
      lastUpdated: new Date('2024-01-18')
    },
    {
      id: '3',
      title: 'Node.js Backend Development',
      description: 'Build scalable backend applications with Node.js and Express',
      instructor: 'Mike Rodriguez',
      category: 'Backend Development',
      difficulty: 'intermediate',
      duration: 15,
      lessons: 28,
      enrolledStudents: 234,
      rating: 4.7,
      reviews: 67,
      status: 'published',
      price: 69.99,
      tags: ['nodejs', 'express', 'backend'],
      createdAt: new Date('2023-11-20'),
      lastUpdated: new Date('2024-01-15')
    },
    {
      id: '4',
      title: 'Advanced Algorithms',
      description: 'Deep dive into data structures and algorithm optimization',
      instructor: 'Emma Wilson',
      category: 'Computer Science',
      difficulty: 'advanced',
      duration: 20,
      lessons: 40,
      enrolledStudents: 123,
      rating: 4.6,
      reviews: 45,
      status: 'published',
      price: 99.99,
      tags: ['algorithms', 'data-structures', 'advanced'],
      createdAt: new Date('2023-10-10'),
      lastUpdated: new Date('2024-01-10')
    },
    {
      id: '5',
      title: 'Full-Stack Web Development',
      description: 'Complete web development course from frontend to deployment',
      instructor: 'David Kim',
      category: 'Full-Stack Development',
      difficulty: 'intermediate',
      duration: 25,
      lessons: 50,
      enrolledStudents: 567,
      rating: 4.8,
      reviews: 156,
      status: 'draft',
      price: 129.99,
      tags: ['fullstack', 'web-development', 'deployment'],
      createdAt: new Date('2024-01-05'),
      lastUpdated: new Date('2024-01-21')
    }
  ];

  const lessons: Lesson[] = [
    {
      id: '1',
      courseId: '1',
      title: 'Introduction to JavaScript',
      type: 'video',
      duration: 15,
      order: 1,
      status: 'published',
      videoUrl: 'https://example.com/video1.mp4'
    },
    {
      id: '2',
      courseId: '1',
      title: 'Variables and Data Types',
      type: 'text',
      duration: 10,
      order: 2,
      status: 'published',
      content: 'Learn about variables, strings, numbers, and booleans in JavaScript...'
    },
    {
      id: '3',
      courseId: '1',
      title: 'JavaScript Quiz 1',
      type: 'quiz',
      duration: 5,
      order: 3,
      status: 'published',
      quizQuestions: 10
    },
    {
      id: '4',
      courseId: '1',
      title: 'Functions Practice',
      type: 'coding',
      duration: 20,
      order: 4,
      status: 'published',
      codingProblem: 'Create a function that calculates the factorial of a number'
    }
  ];

  const students: Student[] = [
    {
      id: '1',
      name: 'Lisa Thompson',
      email: 'lisa@example.com',
      enrolledDate: new Date('2024-01-15'),
      progress: 85,
      lastAccessed: new Date('2024-01-21'),
      completedLessons: 21,
      totalLessons: 25,
      status: 'active'
    },
    {
      id: '2',
      name: 'James Brown',
      email: 'james@example.com',
      enrolledDate: new Date('2024-01-10'),
      progress: 60,
      lastAccessed: new Date('2024-01-20'),
      completedLessons: 15,
      totalLessons: 25,
      status: 'active'
    },
    {
      id: '3',
      name: 'Maria Garcia',
      email: 'maria@example.com',
      enrolledDate: new Date('2024-01-05'),
      progress: 100,
      lastAccessed: new Date('2024-01-19'),
      completedLessons: 25,
      totalLessons: 25,
      status: 'completed'
    }
  ];

  const analytics: CourseAnalytics = {
    totalEnrollments: 1769,
    activeStudents: 1247,
    completionRate: 78.5,
    averageRating: 4.8,
    averageProgress: 72.3,
    revenue: 125430.50
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

  const getLessonTypeIcon = (type: string) => {
    switch (type) {
      case 'video': return <Video className="h-4 w-4" />;
      case 'text': return <FileText className="h-4 w-4" />;
      case 'quiz': return <HelpCircle className="h-4 w-4" />;
      case 'coding': return <Code className="h-4 w-4" />;
      case 'project': return <Target className="h-4 w-4" />;
      default: return <FileText className="h-4 w-4" />;
    }
  };

  const getStudentStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-500/20 text-green-400';
      case 'inactive': return 'bg-gray-500/20 text-gray-400';
      case 'completed': return 'bg-blue-500/20 text-blue-400';
      default: return 'bg-gray-500/20 text-gray-400';
    }
  };

  const filteredCourses = courses.filter(course => {
    const matchesSearch = course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         course.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = filterCategory === 'all' || course.category === filterCategory;
    const matchesStatus = filterStatus === 'all' || course.status === filterStatus;
    return matchesSearch && matchesCategory && matchesStatus;
  });

  const createCourse = () => {
    setShowCreateModal(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="bg-gradient-to-r from-blue-500/10 to-green-500/10 border-blue-500/20">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <BookOpen className="h-5 w-5 text-blue-500" />
            <span>Course Manager</span>
            <Badge className="bg-blue-500/20 text-blue-400">Instructor</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            Create, manage, and track your courses. Monitor student progress and engagement.
          </p>
        </CardContent>
      </Card>

      {/* Tabs */}
      <div className="flex space-x-2 border-b">
        {[
          { id: 'courses', label: 'Courses', icon: BookOpen },
          { id: 'lessons', label: 'Lessons', icon: FileText },
          { id: 'students', label: 'Students', icon: Users },
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

      {/* Courses Tab */}
      {activeTab === 'courses' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <h3 className="text-lg font-semibold">My Courses</h3>
              <Button onClick={() => setShowCreateModal(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Create Course
              </Button>
            </div>
            <div className="flex items-center space-x-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search courses..."
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
                <option value="Full-Stack Development">Full-Stack</option>
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
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredCourses.map((course) => (
              <Card key={course.id} className="hover:shadow-md transition-all">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-1">
                        <h4 className="font-semibold">{course.title}</h4>
                        <Badge className={getStatusColor(course.status)}>
                          {course.status}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mb-2">{course.description}</p>
                      <div className="flex items-center space-x-2 text-sm">
                        <Badge className={getDifficultyColor(course.difficulty)}>
                          {course.difficulty}
                        </Badge>
                        <span className="text-muted-foreground">{course.category}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-4 text-sm">
                      <span className="flex items-center space-x-1">
                        <Clock className="h-3 w-3" />
                        <span>{course.duration}h</span>
                      </span>
                      <span className="flex items-center space-x-1">
                        <FileText className="h-3 w-3" />
                        <span>{course.lessons} lessons</span>
                      </span>
                      <span className="flex items-center space-x-1">
                        <Users className="h-3 w-3" />
                        <span>{course.enrolledStudents}</span>
                      </span>
                    </div>
                    <div className="text-right">
                      <div className="flex items-center space-x-1">
                        <Star className="h-3 w-3 text-yellow-500" />
                        <span className="text-sm font-semibold">{course.rating}</span>
                      </div>
                      <div className="text-xs text-muted-foreground">${course.price}</div>
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
                      <Settings className="h-4 w-4 mr-1" />
                      Settings
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Lessons Tab */}
      {activeTab === 'lessons' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">Course Lessons</h3>
            <div className="flex items-center space-x-2">
              <select className="px-3 py-2 border rounded text-sm">
                <option>Select Course</option>
                {courses.map(course => (
                  <option key={course.id} value={course.id}>{course.title}</option>
                ))}
              </select>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Add Lesson
              </Button>
            </div>
          </div>
          
          <Card>
            <CardContent className="p-0">
              <div className="space-y-1">
                {lessons.map((lesson) => (
                  <div
                    key={lesson.id}
                    className="p-4 border-b last:border-b-0 hover:bg-muted/50 transition-all"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-primary/20 rounded-lg flex items-center justify-center">
                          {getLessonTypeIcon(lesson.type)}
                        </div>
                        <div>
                          <div className="flex items-center space-x-2">
                            <h4 className="font-semibold">{lesson.title}</h4>
                            <Badge className={getStatusColor(lesson.status)}>
                              {lesson.status}
                            </Badge>
                          </div>
                          <div className="text-sm text-muted-foreground">
                            Lesson {lesson.order} • {lesson.duration} minutes
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <Button size="sm" variant="outline">
                          <Play className="h-4 w-4" />
                        </Button>
                        <Button size="sm" variant="outline">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button size="sm" variant="outline">
                          <Eye className="h-4 w-4" />
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

      {/* Students Tab */}
      {activeTab === 'students' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">Enrolled Students</h3>
            <div className="flex items-center space-x-2">
              <Input placeholder="Search students..." className="w-64" />
              <Button variant="outline" size="sm">
                <Download className="h-4 w-4 mr-2" />
                Export List
              </Button>
            </div>
          </div>
          
          <Card>
            <CardContent className="p-0">
              <div className="space-y-1">
                {students.map((student) => (
                  <div
                    key={student.id}
                    className="p-4 border-b last:border-b-0 hover:bg-muted/50 transition-all"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-primary/20 rounded-full flex items-center justify-center text-primary font-semibold">
                          {student.name.split(' ').map(n => n[0]).join('')}
                        </div>
                        <div>
                          <div className="flex items-center space-x-2">
                            <h4 className="font-semibold">{student.name}</h4>
                            <Badge className={getStudentStatusColor(student.status)}>
                              {student.status}
                            </Badge>
                          </div>
                          <div className="text-sm text-muted-foreground">
                            {student.email} • Enrolled: {student.enrolledDate.toLocaleDateString()}
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-4">
                        <div className="text-right">
                          <div className="font-semibold">{student.progress}%</div>
                          <div className="text-sm text-muted-foreground">
                            {student.completedLessons}/{student.totalLessons} lessons
                          </div>
                        </div>
                        <Progress value={student.progress} className="w-24 h-2" />
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
          <h3 className="text-lg font-semibold">Course Analytics</h3>
          
          <div className="grid md:grid-cols-3 gap-4">
            <Card>
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-blue-500">{analytics.totalEnrollments}</div>
                <div className="text-sm text-muted-foreground">Total Enrollments</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-green-500">{analytics.completionRate}%</div>
                <div className="text-sm text-muted-foreground">Completion Rate</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-purple-500">${analytics.revenue.toLocaleString()}</div>
                <div className="text-sm text-muted-foreground">Total Revenue</div>
              </CardContent>
            </Card>
          </div>
          
          <div className="grid md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Student Progress Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {[
                    { range: '0-25%', count: 45, percentage: 15 },
                    { range: '26-50%', count: 78, percentage: 26 },
                    { range: '51-75%', count: 89, percentage: 30 },
                    { range: '76-100%', count: 87, percentage: 29 }
                  ].map((item) => (
                    <div key={item.range} className="flex items-center space-x-4">
                      <span className="w-16 text-sm">{item.range}</span>
                      <div className="flex-1">
                        <Progress value={item.percentage} className="h-2" />
                      </div>
                      <span className="w-16 text-right text-sm">{item.count} students</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Course Performance</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {courses.slice(0, 4).map((course) => (
                    <div key={course.id} className="flex items-center justify-between">
                      <span className="font-medium">{course.title}</span>
                      <div className="flex items-center space-x-4">
                        <span className="text-sm text-muted-foreground">
                          {course.enrolledStudents} students
                        </span>
                        <span className="font-semibold">{course.rating}/5</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      )}
    </div>
  );
} 