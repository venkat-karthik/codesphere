import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Bell, 
  MessageSquare, 
  Target, 
  Bot, 
  Trophy, 
  Calendar,
  Clock,
  CheckCircle,
  X,
  Filter,
  Settings,
  BookOpen,
  Users,
  Star,
  AlertCircle,
  Info,
  Video,
  Trash2
} from 'lucide-react';
import { useNotifications } from '@/contexts/NotificationsContext';

export function NotificationsPanel({ className }: { className?: string }) {
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [showRead, setShowRead] = useState(true);
  const { 
    notifications, 
    unreadCount, 
    highPriorityCount, 
    markAsRead, 
    markAllAsRead, 
    deleteNotification 
  } = useNotifications();

  const filters = [
    { id: 'all', label: 'All', icon: Bell },
    { id: 'assignment', label: 'Assignments', icon: Target },
    { id: 'message', label: 'Messages', icon: MessageSquare },
    { id: 'ai-mentor', label: 'AI Mentor', icon: Bot },
    { id: 'achievement', label: 'Achievements', icon: Trophy },
    { id: 'reminder', label: 'Reminders', icon: Clock },
    { id: 'live-class', label: 'Live Classes', icon: Video },
    { id: 'system', label: 'System', icon: Info }
  ];

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'assignment': return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      case 'message': return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'ai-mentor': return 'bg-purple-500/20 text-purple-400 border-purple-500/30';
      case 'achievement': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      case 'reminder': return 'bg-orange-500/20 text-orange-400 border-orange-500/30';
      case 'live-class': return 'bg-red-500/20 text-red-400 border-red-500/30';
      case 'system': return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
      default: return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
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

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'assignment': return Target;
      case 'message': return MessageSquare;
      case 'ai-mentor': return Bot;
      case 'achievement': return Trophy;
      case 'reminder': return Clock;
      case 'live-class': return Video;
      case 'system': return Info;
      default: return Bell;
    }
  };

  const formatTimeAgo = (date: Date) => {
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString();
  };

  const filteredNotifications = notifications.filter(notification => {
    const matchesFilter = selectedFilter === 'all' || notification.type === selectedFilter;
    const matchesRead = showRead || !notification.read;
    return matchesFilter && matchesRead;
  });

  const handleNotificationClick = (notification: any) => {
    if (!notification.read) {
      markAsRead(notification.id);
    }
    
    if (notification.actionUrl) {
      // Navigate to the action URL
      window.location.href = notification.actionUrl;
    }
  };

  const handleDeleteNotification = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    deleteNotification(id);
  };

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Header with Stats */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Bell className="h-5 w-5" />
          <span className="font-semibold">Notifications</span>
          {unreadCount > 0 && (
            <Badge variant="destructive" className="text-xs">
              {unreadCount} new
            </Badge>
          )}
          {highPriorityCount > 0 && (
            <Badge variant="destructive" className="text-xs">
              {highPriorityCount} urgent
            </Badge>
          )}
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={markAllAsRead}
            disabled={unreadCount === 0}
          >
            <CheckCircle className="h-4 w-4 mr-1" />
            Mark all read
          </Button>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap gap-2">
        {filters.map((filter) => {
          const IconComponent = filter.icon;
          const count = notifications.filter(n => 
            filter.id === 'all' ? true : n.type === filter.id
          ).length;
          
          return (
            <Button
              key={filter.id}
              variant={selectedFilter === filter.id ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedFilter(filter.id)}
              className="flex items-center space-x-1"
            >
              <IconComponent className="h-3 w-3" />
              <span>{filter.label}</span>
              {count > 0 && (
                <Badge variant="secondary" className="ml-1 text-xs">
                  {count}
                </Badge>
              )}
            </Button>
          );
        })}
      </div>

      {/* Show Read Toggle */}
      <div className="flex items-center space-x-2">
        <input
          type="checkbox"
          id="showRead"
          checked={showRead}
          onChange={(e) => setShowRead(e.target.checked)}
          className="rounded"
        />
        <label htmlFor="showRead" className="text-sm text-muted-foreground">
          Show read notifications
        </label>
      </div>

      {/* Notifications List */}
      <div className="space-y-3 max-h-96 overflow-y-auto">
        {filteredNotifications.length === 0 ? (
          <div className="text-center py-8">
            <Bell className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">No Notifications</h3>
            <p className="text-muted-foreground">
              {selectedFilter === 'all' 
                ? 'You\'re all caught up!'
                : `No ${selectedFilter} notifications found.`
              }
            </p>
          </div>
        ) : (
          filteredNotifications.map((notification) => {
            const IconComponent = getTypeIcon(notification.type);
            
            return (
              <Card
                key={notification.id}
                className={`cursor-pointer transition-all duration-200 hover:shadow-md ${
                  !notification.read ? 'border-primary/30 bg-primary/5' : ''
                }`}
                onClick={() => handleNotificationClick(notification)}
              >
                <CardContent className="p-4">
                  <div className="flex items-start space-x-3">
                    <div className={`p-2 rounded-lg ${getTypeColor(notification.type)}`}>
                      <IconComponent className="h-4 w-4" />
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-1">
                            <h4 className="font-semibold text-sm">{notification.title}</h4>
                            {!notification.read && (
                              <div className="w-2 h-2 bg-primary rounded-full"></div>
                            )}
                            <Badge className={`text-xs ${getPriorityColor(notification.priority)}`}>
                              {notification.priority}
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground mb-2">
                            {notification.message}
                          </p>
                          <div className="flex items-center space-x-4 text-xs text-muted-foreground">
                            <span>{formatTimeAgo(notification.timestamp)}</span>
                            {notification.sender && (
                              <span>From: {notification.sender}</span>
                            )}
                          </div>
                        </div>
                        
                        <div className="flex items-center space-x-1">
                          {notification.actionUrl && (
                            <Button size="sm" variant="ghost">
                              <CheckCircle className="h-3 w-3" />
                            </Button>
                          )}
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={(e) => handleDeleteNotification(e, notification.id)}
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })
        )}
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between pt-4 border-t">
        <span className="text-sm text-muted-foreground">
          {filteredNotifications.length} notifications
        </span>
        <Button variant="ghost" size="sm">
          <Settings className="h-4 w-4 mr-1" />
          <span>Notification Settings</span>
        </Button>
      </div>
    </div>
  );
} 