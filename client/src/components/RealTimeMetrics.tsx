import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Users, 
  Activity, 
  Clock, 
  TrendingUp,
  Zap,
  Eye,
  MessageSquare,
  Code
} from 'lucide-react';

interface LiveMetric {
  id: number;
  type: 'user_joined' | 'assignment_submitted' | 'test_completed' | 'message_sent';
  user: string;
  action: string;
  timestamp: Date;
}

export function RealTimeMetrics() {
  const [metrics, setMetrics] = useState({
    activeUsers: 342,
    sessionsToday: 1247,
    assignmentsSubmitted: 89,
    testsCompleted: 156,
  });
  
  const [liveActivity, setLiveActivity] = useState<LiveMetric[]>([]);

  // Simulate real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      // Update metrics
      setMetrics(prev => ({
        activeUsers: prev.activeUsers + Math.floor(Math.random() * 3) - 1,
        sessionsToday: prev.sessionsToday + Math.floor(Math.random() * 5),
        assignmentsSubmitted: prev.assignmentsSubmitted + Math.floor(Math.random() * 2),
        testsCompleted: prev.testsCompleted + Math.floor(Math.random() * 3),
      }));

      // Add live activity
      const activities: LiveMetric['type'][] = [
        'user_joined',
        'assignment_submitted', 
        'test_completed',
        'message_sent'
      ];
      
      const users = [
        'Alex Johnson',
        'Sarah Chen', 
        'Mike Rodriguez',
        'Lisa Thompson',
        'James Brown',
        'Maria Garcia'
      ];

      const newActivity: LiveMetric = {
        id: Date.now(),
        type: activities[Math.floor(Math.random() * activities.length)],
        user: users[Math.floor(Math.random() * users.length)],
        action: '',
        timestamp: new Date(),
      };

      switch (newActivity.type) {
        case 'user_joined':
          newActivity.action = 'joined the platform';
          break;
        case 'assignment_submitted':
          newActivity.action = 'submitted an assignment';
          break;
        case 'test_completed':
          newActivity.action = 'completed a test';
          break;
        case 'message_sent':
          newActivity.action = 'sent a message';
          break;
      }

      setLiveActivity(prev => [newActivity, ...prev.slice(0, 9)]);
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  const getActivityIcon = (type: LiveMetric['type']) => {
    switch (type) {
      case 'user_joined': return <Users className="h-4 w-4 text-green-500" />;
      case 'assignment_submitted': return <Code className="h-4 w-4 text-blue-500" />;
      case 'test_completed': return <TrendingUp className="h-4 w-4 text-purple-500" />;
      case 'message_sent': return <MessageSquare className="h-4 w-4 text-orange-500" />;
    }
  };

  const getActivityColor = (type: LiveMetric['type']) => {
    switch (type) {
      case 'user_joined': return 'bg-green-500/10 text-green-600';
      case 'assignment_submitted': return 'bg-blue-500/10 text-blue-600';
      case 'test_completed': return 'bg-purple-500/10 text-purple-600';
      case 'message_sent': return 'bg-orange-500/10 text-orange-600';
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Real-time Metrics */}
      <div className="lg:col-span-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap className="h-5 w-5 text-yellow-500" />
              Live Metrics
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center p-4 bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 rounded-lg">
                <div className="flex items-center justify-center mb-2">
                  <Users className="h-6 w-6 text-blue-500" />
                </div>
                <div className="text-2xl font-bold text-blue-600">{metrics.activeUsers}</div>
                <div className="text-sm text-muted-foreground">Active Users</div>
                <div className="text-xs text-green-500 mt-1">Live</div>
              </div>

              <div className="text-center p-4 bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 rounded-lg">
                <div className="flex items-center justify-center mb-2">
                  <Activity className="h-6 w-6 text-green-500" />
                </div>
                <div className="text-2xl font-bold text-green-600">{metrics.sessionsToday}</div>
                <div className="text-sm text-muted-foreground">Sessions Today</div>
                <div className="text-xs text-green-500 mt-1">+12%</div>
              </div>

              <div className="text-center p-4 bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 rounded-lg">
                <div className="flex items-center justify-center mb-2">
                  <Code className="h-6 w-6 text-purple-500" />
                </div>
                <div className="text-2xl font-bold text-purple-600">{metrics.assignmentsSubmitted}</div>
                <div className="text-sm text-muted-foreground">Assignments</div>
                <div className="text-xs text-green-500 mt-1">+5 today</div>
              </div>

              <div className="text-center p-4 bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-900/20 dark:to-orange-800/20 rounded-lg">
                <div className="flex items-center justify-center mb-2">
                  <TrendingUp className="h-6 w-6 text-orange-500" />
                </div>
                <div className="text-2xl font-bold text-orange-600">{metrics.testsCompleted}</div>
                <div className="text-sm text-muted-foreground">Tests Completed</div>
                <div className="text-xs text-green-500 mt-1">+8 today</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Live Activity Feed */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Eye className="h-5 w-5 text-blue-500" />
            Live Activity
            <Badge variant="secondary" className="ml-auto">
              <div className="w-2 h-2 bg-green-500 rounded-full mr-1 animate-pulse"></div>
              Live
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3 max-h-80 overflow-y-auto">
            {liveActivity.map((activity) => (
              <div key={activity.id} className="flex items-start space-x-3 p-2 rounded-lg hover:bg-muted/50 transition-colors">
                <div className="flex-shrink-0 mt-1">
                  {getActivityIcon(activity.type)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{activity.user}</p>
                  <p className="text-xs text-muted-foreground">{activity.action}</p>
                  <p className="text-xs text-muted-foreground">
                    {activity.timestamp.toLocaleTimeString()}
                  </p>
                </div>
                <Badge className={`text-xs ${getActivityColor(activity.type)}`}>
                  {activity.type.replace('_', ' ')}
                </Badge>
              </div>
            ))}
            {liveActivity.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                <Activity className="h-8 w-8 mx-auto mb-2" />
                <p className="text-sm">Waiting for activity...</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 