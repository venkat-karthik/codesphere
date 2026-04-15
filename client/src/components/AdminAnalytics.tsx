import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  LineChart, 
  Line, 
  AreaChart, 
  Area, 
  BarChart, 
  Bar, 
  PieChart, 
  Pie, 
  Cell, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  ScatterChart,
  Scatter
} from 'recharts';
import { useAssignments } from '@/contexts/AssignmentContext';
import { 
  TrendingUp, 
  Users, 
  BookOpen, 
  Target, 
  Clock, 
  DollarSign,
  Download,
  Calendar,
  Award,
  Activity
} from 'lucide-react';

interface AnalyticsData {
  studentEngagement: {
    date: string;
    activeUsers: number;
    newUsers: number;
    sessions: number;
  }[];
  assignmentPerformance: {
    assignment: string;
    submissions: number;
    averageScore: number;
    completionRate: number;
  }[];
  revenueData: {
    month: string;
    revenue: number;
    subscriptions: number;
    churn: number;
  }[];
  skillDistribution: {
    skill: string;
    students: number;
    proficiency: number;
  }[];
  timeOfDayActivity: {
    hour: number;
    activity: number;
  }[];
  studentProgress: {
    level: number;
    count: number;
    avgXP: number;
  }[];
}

export function AdminAnalytics() {
  const { assignments, submissions } = useAssignments();
  const [timeRange, setTimeRange] = useState('30d');
  const [selectedMetric, setSelectedMetric] = useState('engagement');

  // Generate realistic analytics data
  const generateAnalyticsData = (): AnalyticsData => {
    const studentEngagement = Array.from({ length: 30 }, (_, i) => ({
      date: new Date(Date.now() - (29 - i) * 24 * 60 * 60 * 1000).toLocaleDateString(),
      activeUsers: Math.floor(Math.random() * 200) + 300,
      newUsers: Math.floor(Math.random() * 50) + 10,
      sessions: Math.floor(Math.random() * 500) + 800,
    }));

    const assignmentPerformance = assignments.map(assignment => ({
      assignment: assignment.title,
      submissions: submissions.filter(sub => sub.assignmentId === assignment.id).length,
      averageScore: Math.floor(Math.random() * 30) + 70,
      completionRate: Math.floor(Math.random() * 40) + 60,
    }));

    const revenueData = Array.from({ length: 12 }, (_, i) => ({
      month: new Date(2024, i, 1).toLocaleDateString('en-US', { month: 'short' }),
      revenue: Math.floor(Math.random() * 15000) + 20000,
      subscriptions: Math.floor(Math.random() * 100) + 50,
      churn: Math.floor(Math.random() * 10) + 2,
    }));

    const skillDistribution = [
      { skill: 'JavaScript', students: 245, proficiency: 78 },
      { skill: 'Python', students: 189, proficiency: 82 },
      { skill: 'React', students: 156, proficiency: 75 },
      { skill: 'Node.js', students: 134, proficiency: 70 },
      { skill: 'SQL', students: 98, proficiency: 85 },
      { skill: 'TypeScript', students: 87, proficiency: 72 },
    ];

    const timeOfDayActivity = Array.from({ length: 24 }, (_, i) => ({
      hour: i,
      activity: Math.floor(Math.random() * 100) + (i >= 9 && i <= 17 ? 50 : 20),
    }));

    const studentProgress = Array.from({ length: 10 }, (_, i) => ({
      level: i + 1,
      count: Math.floor(Math.random() * 50) + 10,
      avgXP: (i + 1) * 500 + Math.floor(Math.random() * 200),
    }));

    return {
      studentEngagement,
      assignmentPerformance,
      revenueData,
      skillDistribution,
      timeOfDayActivity,
      studentProgress,
    };
  };

  const data = generateAnalyticsData();

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82CA9D'];

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white dark:bg-gray-800 p-3 border rounded-lg shadow-lg">
          <p className="font-semibold">{label}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} style={{ color: entry.color }}>
              {entry.name}: {entry.value}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-6">
      {/* Header with Controls */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Analytics Dashboard</h2>
          <p className="text-muted-foreground">Comprehensive insights into platform performance</p>
        </div>
        <div className="flex items-center space-x-4">
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7d">Last 7 days</SelectItem>
              <SelectItem value="30d">Last 30 days</SelectItem>
              <SelectItem value="90d">Last 90 days</SelectItem>
              <SelectItem value="1y">Last year</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline">
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
        </div>
      </div>

      {/* Key Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Students</p>
                <p className="text-3xl font-bold">1,247</p>
                <p className="text-xs text-green-500 mt-1">+12% from last month</p>
              </div>
              <Users className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Active Assignments</p>
                <p className="text-3xl font-bold">{assignments.length}</p>
                <p className="text-xs text-blue-500 mt-1">+3 new this week</p>
              </div>
              <BookOpen className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Avg Study Time</p>
                <p className="text-3xl font-bold">4.2h</p>
                <p className="text-xs text-green-500 mt-1">+5% improvement</p>
              </div>
              <Clock className="h-8 w-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Monthly Revenue</p>
                <p className="text-3xl font-bold">$35K</p>
                <p className="text-xs text-green-500 mt-1">+27% growth</p>
              </div>
              <DollarSign className="h-8 w-8 text-orange-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Student Engagement Trend */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5" />
              Student Engagement Trend
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={data.studentEngagement}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip content={<CustomTooltip />} />
                <Area 
                  type="monotone" 
                  dataKey="activeUsers" 
                  stackId="1" 
                  stroke="#8884d8" 
                  fill="#8884d8" 
                  fillOpacity={0.6}
                />
                <Area 
                  type="monotone" 
                  dataKey="newUsers" 
                  stackId="1" 
                  stroke="#82ca9d" 
                  fill="#82ca9d" 
                  fillOpacity={0.6}
                />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Assignment Performance */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5" />
              Assignment Performance
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={data.assignmentPerformance}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="assignment" />
                <YAxis />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="averageScore" fill="#8884d8" />
                <Bar dataKey="completionRate" fill="#82ca9d" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Revenue Trends */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Revenue Trends
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={data.revenueData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip content={<CustomTooltip />} />
                <Line 
                  type="monotone" 
                  dataKey="revenue" 
                  stroke="#8884d8" 
                  strokeWidth={3}
                  dot={{ fill: '#8884d8', strokeWidth: 2, r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Skill Distribution Radar */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Award className="h-5 w-5" />
              Skill Proficiency Distribution
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <RadarChart data={data.skillDistribution}>
                <PolarGrid />
                <PolarAngleAxis dataKey="skill" />
                <PolarRadiusAxis angle={90} domain={[0, 100]} />
                <Radar 
                  name="Proficiency" 
                  dataKey="proficiency" 
                  stroke="#8884d8" 
                  fill="#8884d8" 
                  fillOpacity={0.6}
                />
              </RadarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Additional Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Time of Day Activity */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Activity by Hour
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={data.timeOfDayActivity}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="hour" />
                <YAxis />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="activity" fill="#82ca9d" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Student Progress Distribution */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Student Level Distribution
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={data.studentProgress}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ level, count }) => `Level ${level}: ${count}`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="count"
                >
                  {data.studentProgress.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Student Progress Scatter */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5" />
              Level vs XP Correlation
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <ScatterChart>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" dataKey="level" name="Level" />
                <YAxis type="number" dataKey="avgXP" name="Average XP" />
                <Tooltip content={<CustomTooltip />} />
                <Scatter name="Students" data={data.studentProgress} fill="#8884d8" />
              </ScatterChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Summary Stats */}
      <Card>
        <CardHeader>
          <CardTitle>Platform Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-500">89%</div>
              <div className="text-sm text-muted-foreground">Student Satisfaction</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-500">78%</div>
              <div className="text-sm text-muted-foreground">Course Completion</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-500">156</div>
              <div className="text-sm text-muted-foreground">Avg Study Sessions</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-500">4.8/5</div>
              <div className="text-sm text-muted-foreground">Platform Rating</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 