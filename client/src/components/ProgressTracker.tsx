import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { TrendingUp, Flame, Target, Calendar, BarChart3, Activity, Clock, CheckCircle, Code, Star, Trophy } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';

export function ProgressTracker() {
  const { user } = useAuth();
  const [selectedTimeframe, setSelectedTimeframe] = useState('week');

  const { data: solutions = [] } = useQuery<any[]>({
    queryKey: [`/api/users/${user?.id}/solutions`],
    enabled: !!user && user.id > 0,
  });

  const { data: analytics = [] } = useQuery<any[]>({
    queryKey: [`/api/users/${user?.id}/analytics`],
    enabled: !!user && user.id > 0,
  });

  if (!user) return null;

  const solvedCount = (solutions as any[]).filter((s: any) => s.isCorrect).length;
  const nextLevelXP = user.level * 1000;
  const progressPercentage = Math.min((user.xp / nextLevelXP) * 100, 100);
  const totalStudyMinutes = (analytics as any[]).reduce((s: number, r: any) => s + r.studyTimeMinutes, 0);
  const studyHours = Math.floor(totalStudyMinutes / 60);

  const userStats = {
    level: user.level,
    xp: user.xp,
    nextLevelXP,
    streak: user.streak,
    problemsSolved: solvedCount,
    studyTime: studyHours,
    joinDate: new Date('2023-08-15')
  };

  const learningPaths: LearningPath[] = [
    {
      id: '1',
      name: 'JavaScript Fundamentals',
      progress: 100,
      totalLessons: 25,
      completedLessons: 25,
      category: 'Frontend',
      lastAccessed: new Date('2024-01-20')
    },
    {
      id: '2',
      name: 'React Development',
      progress: 85,
      totalLessons: 30,
      completedLessons: 25,
      category: 'Frontend',
      lastAccessed: new Date('2024-01-21')
    },
    {
      id: '3',
      name: 'Node.js Backend',
      progress: 75,
      totalLessons: 20,
      completedLessons: 15,
      category: 'Backend',
      lastAccessed: new Date('2024-01-19')
    },
    {
      id: '4',
      name: 'Database Design',
      progress: 60,
      totalLessons: 15,
      completedLessons: 9,
      category: 'Backend',
      lastAccessed: new Date('2024-01-18')
    },
    {
      id: '5',
      name: 'Advanced Algorithms',
      progress: 40,
      totalLessons: 35,
      completedLessons: 14,
      category: 'Computer Science',
      lastAccessed: new Date('2024-01-17')
    }
  ];

  const projects: Project[] = [
    {
      id: '1',
      name: 'Task Management App',
      status: 'completed',
      completionDate: new Date('2024-01-15'),
      xpEarned: 300,
      technologies: ['React', 'Node.js', 'MongoDB']
    },
    {
      id: '2',
      name: 'Weather Dashboard',
      status: 'completed',
      completionDate: new Date('2023-12-08'),
      xpEarned: 250,
      technologies: ['Vue.js', 'Chart.js', 'API']
    },
    {
      id: '3',
      name: 'E-commerce Platform',
      status: 'in-progress',
      xpEarned: 150,
      technologies: ['Next.js', 'Stripe', 'PostgreSQL']
    },
    {
      id: '4',
      name: 'AI Chat Bot',
      status: 'planned',
      xpEarned: 0,
      technologies: ['Python', 'OpenAI', 'Flask']
    }
  ];

  const streakData: StreakData = {
    currentStreak: 42,
    longestStreak: 89,
    totalDays: 156,
    weeklyData: [5, 7, 6, 7, 7, 6, 4] // last 7 weeks
  };

  const weeklyActivity = [
    { day: 'Mon', hours: 2.5, problems: 3, xp: 150 },
    { day: 'Tue', hours: 3.2, problems: 5, xp: 200 },
    { day: 'Wed', hours: 1.8, problems: 2, xp: 100 },
    { day: 'Thu', hours: 4.1, problems: 6, xp: 250 },
    { day: 'Fri', hours: 2.9, problems: 4, xp: 180 },
    { day: 'Sat', hours: 3.5, problems: 5, xp: 220 },
    { day: 'Sun', hours: 2.1, problems: 3, xp: 140 }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-500/20 text-green-400';
      case 'in-progress': return 'bg-blue-500/20 text-blue-400';
      case 'planned': return 'bg-gray-500/20 text-gray-400';
      default: return 'bg-gray-500/20 text-gray-400';
    }
  };

  const getProgressColor = (progress: number) => {
    if (progress >= 80) return 'bg-green-500';
    if (progress >= 60) return 'bg-yellow-500';
    if (progress >= 40) return 'bg-orange-500';
    return 'bg-red-500';
  };

  const progressPercentage = (userStats.xp / userStats.nextLevelXP) * 100;

  return (
    <div className="space-y-6">
      {/* Level Progress */}
      <Card className="bg-gradient-to-r from-primary/10 to-purple-500/10 border-primary/20">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Trophy className="h-5 w-5" />
            <span>Level Progress</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between mb-4">
            <div>
              <div className="text-3xl font-bold">Level {userStats.level}</div>
              <div className="text-muted-foreground">Coding Warrior</div>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-primary">{userStats.xp}</div>
              <div className="text-sm text-muted-foreground">/ {userStats.nextLevelXP} XP</div>
            </div>
          </div>
          <Progress value={progressPercentage} className="h-3 mb-2" />
          <div className="text-sm text-muted-foreground">
            {userStats.nextLevelXP - userStats.xp} XP needed for next level
          </div>
        </CardContent>
      </Card>

      {/* Stats Grid */}
      <div className="grid md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <div className="w-12 h-12 bg-orange-500/20 rounded-lg flex items-center justify-center mx-auto mb-2">
              <Flame className="h-6 w-6 text-orange-500" />
            </div>
            <div className="text-2xl font-bold">{streakData.currentStreak}</div>
            <div className="text-sm text-muted-foreground">Day Streak</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="w-12 h-12 bg-green-500/20 rounded-lg flex items-center justify-center mx-auto mb-2">
              <Target className="h-6 w-6 text-green-500" />
            </div>
            <div className="text-2xl font-bold">{userStats.problemsSolved}</div>
            <div className="text-sm text-muted-foreground">Problems Solved</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="w-12 h-12 bg-blue-500/20 rounded-lg flex items-center justify-center mx-auto mb-2">
              <BookOpen className="h-6 w-6 text-blue-500" />
            </div>
            <div className="text-2xl font-bold">{userStats.coursesCompleted}</div>
            <div className="text-sm text-muted-foreground">Courses Completed</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="w-12 h-12 bg-purple-500/20 rounded-lg flex items-center justify-center mx-auto mb-2">
              <Clock className="h-6 w-6 text-purple-500" />
            </div>
            <div className="text-2xl font-bold">{userStats.studyTime}h</div>
            <div className="text-sm text-muted-foreground">Study Time</div>
          </CardContent>
        </Card>
      </div>

      {/* Learning Paths Progress */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <BookOpen className="h-5 w-5" />
            <span>Learning Paths Progress</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {learningPaths.map((path) => (
              <div key={path.id} className="p-4 border rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <h4 className="font-semibold">{path.name}</h4>
                    <p className="text-sm text-muted-foreground">{path.category}</p>
                  </div>
                  <div className="text-right">
                    <div className="font-semibold">{path.progress}%</div>
                    <div className="text-sm text-muted-foreground">
                      {path.completedLessons}/{path.totalLessons} lessons
                    </div>
                  </div>
                </div>
                <Progress 
                  value={path.progress} 
                  className="h-2 mb-2"
                  style={{ '--progress-color': getProgressColor(path.progress) } as any}
                />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>Last accessed: {path.lastAccessed.toLocaleDateString()}</span>
                  {path.progress === 100 && (
                    <Badge className="bg-green-500/20 text-green-400">
                      <CheckCircle className="h-3 w-3 mr-1" />
                      Completed
                    </Badge>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Projects Progress */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Code className="h-5 w-5" />
            <span>Projects Progress</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-4">
            {projects.map((project) => (
              <div key={project.id} className="p-4 border rounded-lg">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <h4 className="font-semibold">{project.name}</h4>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {project.technologies.map((tech) => (
                        <Badge key={tech} variant="outline" className="text-xs">
                          {tech}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  <Badge className={getStatusColor(project.status)}>
                    {project.status}
                  </Badge>
                </div>
                <div className="flex justify-between items-center mt-2">
                  <span className="text-sm text-muted-foreground">
                    {project.xpEarned} XP earned
                  </span>
                  {project.completionDate && (
                    <span className="text-xs text-muted-foreground">
                      {project.completionDate.toLocaleDateString()}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Weekly Activity Chart */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center space-x-2">
              <BarChart3 className="h-5 w-5" />
              <span>Weekly Activity</span>
            </CardTitle>
            <div className="flex space-x-2">
              {['week', 'month', 'year'].map((timeframe) => (
                <Button
                  key={timeframe}
                  variant={selectedTimeframe === timeframe ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedTimeframe(timeframe)}
                >
                  {timeframe.charAt(0).toUpperCase() + timeframe.slice(1)}
                </Button>
              ))}
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-end justify-between h-32">
              {weeklyActivity.map((day, index) => (
                <div key={day.day} className="flex flex-col items-center space-y-2">
                  <div className="text-xs text-muted-foreground">{day.xp}</div>
                  <div 
                    className="bg-primary rounded-t w-8 transition-all hover:bg-primary/80"
                    style={{ height: `${(day.hours / 4.1) * 100}%` }}
                  />
                  <div className="text-xs font-medium">{day.day}</div>
                </div>
              ))}
            </div>
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <div className="text-lg font-bold text-green-500">
                  {weeklyActivity.reduce((sum, day) => sum + day.hours, 0).toFixed(1)}h
                </div>
                <div className="text-xs text-muted-foreground">Total Study Time</div>
              </div>
              <div>
                <div className="text-lg font-bold text-blue-500">
                  {weeklyActivity.reduce((sum, day) => sum + day.problems, 0)}
                </div>
                <div className="text-xs text-muted-foreground">Problems Solved</div>
              </div>
              <div>
                <div className="text-lg font-bold text-purple-500">
                  {weeklyActivity.reduce((sum, day) => sum + day.xp, 0)}
                </div>
                <div className="text-xs text-muted-foreground">XP Earned</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Streak Analysis */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Activity className="h-5 w-5" />
            <span>Streak Analysis</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-orange-500">{streakData.currentStreak}</div>
              <div className="text-sm text-muted-foreground">Current Streak</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-500">{streakData.longestStreak}</div>
              <div className="text-sm text-muted-foreground">Longest Streak</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-green-500">{streakData.totalDays}</div>
              <div className="text-sm text-muted-foreground">Total Active Days</div>
            </div>
          </div>
          <div className="mt-6">
            <h4 className="font-semibold mb-3">Weekly Consistency</h4>
            <div className="flex justify-between items-end space-x-1">
              {streakData.weeklyData.map((days, index) => (
                <div key={index} className="flex flex-col items-center">
                  <div 
                    className="bg-primary/60 rounded-t w-6 transition-all"
                    style={{ height: `${(days / 7) * 60}px` }}
                  />
                  <div className="text-xs mt-1">{days}/7</div>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 