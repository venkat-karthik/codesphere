import { useState } from 'react';
import { useLocation } from 'wouter';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Bell, MessageSquare, Target, Bot, Trophy, Clock,
  CheckCircle, Settings, Info, Video, Trash2
} from 'lucide-react';
import { useNotifications } from '@/contexts/NotificationsContext';

export function NotificationsPanel({ className }: { className?: string }) {
  const [, setLocation] = useLocation();
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [showRead, setShowRead] = useState(true);
  const { notifications, unreadCount, highPriorityCount, markAsRead, markAllAsRead, deleteNotification } = useNotifications();

  const filters = [
    { id: 'all', label: 'All', icon: Bell },
    { id: 'assignment', label: 'Assignments', icon: Target },
    { id: 'message', label: 'Messages', icon: MessageSquare },
    { id: 'ai-mentor', label: 'AI Mentor', icon: Bot },
    { id: 'achievement', label: 'Achievements', icon: Trophy },
    { id: 'reminder', label: 'Reminders', icon: Clock },
    { id: 'live-class', label: 'Live Classes', icon: Video },
    { id: 'system', label: 'System', icon: Info },
  ];

  const typeColors: Record<string, string> = {
    assignment: 'bg-blue-500/20 text-blue-500',
    message: 'bg-green-500/20 text-green-500',
    'ai-mentor': 'bg-purple-500/20 text-purple-500',
    achievement: 'bg-yellow-500/20 text-yellow-500',
    reminder: 'bg-orange-500/20 text-orange-500',
    'live-class': 'bg-red-500/20 text-red-500',
    system: 'bg-gray-500/20 text-gray-400',
  };

  const priorityColors: Record<string, string> = {
    high: 'bg-red-500/20 text-red-500',
    medium: 'bg-yellow-500/20 text-yellow-600',
    low: 'bg-green-500/20 text-green-600',
  };

  const typeIcons: Record<string, any> = {
    assignment: Target, message: MessageSquare, 'ai-mentor': Bot,
    achievement: Trophy, reminder: Clock, 'live-class': Video, system: Info,
  };

  const formatTimeAgo = (date: Date) => {
    const diff = Date.now() - new Date(date).getTime();
    const m = Math.floor(diff / 60000);
    const h = Math.floor(diff / 3600000);
    const d = Math.floor(diff / 86400000);
    if (m < 1) return 'Just now';
    if (m < 60) return `${m}m ago`;
    if (h < 24) return `${h}h ago`;
    if (d < 7) return `${d}d ago`;
    return new Date(date).toLocaleDateString();
  };

  const filtered = notifications.filter(n => {
    const matchFilter = selectedFilter === 'all' || n.type === selectedFilter;
    const matchRead = showRead || !n.read;
    return matchFilter && matchRead;
  });

  const handleClick = (n: any) => {
    if (!n.read) markAsRead(n.id);
    if (n.actionUrl) setLocation(n.actionUrl);
  };

  return (
    <div className={`space-y-4 ${className ?? ''}`}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          {unreadCount > 0 && <Badge variant="destructive" className="text-xs">{unreadCount} new</Badge>}
          {highPriorityCount > 0 && <Badge className="bg-red-500/20 text-red-500 text-xs border-0">{highPriorityCount} urgent</Badge>}
        </div>
        <Button variant="ghost" size="sm" onClick={markAllAsRead} disabled={unreadCount === 0}>
          <CheckCircle className="h-4 w-4 mr-1" />Mark all read
        </Button>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-1.5 flex-wrap">
        {filters.map(f => {
          const Icon = f.icon;
          const count = notifications.filter(n => f.id === 'all' ? true : n.type === f.id).length;
          return (
            <Button key={f.id} variant={selectedFilter === f.id ? 'default' : 'outline'}
              size="sm" className="h-7 px-2 text-xs gap-1"
              onClick={() => setSelectedFilter(f.id)}>
              <Icon className="h-3 w-3" />{f.label}
              {count > 0 && <span className="opacity-70">({count})</span>}
            </Button>
          );
        })}
      </div>

      {/* Show read toggle */}
      <label className="flex items-center gap-2 text-sm text-muted-foreground cursor-pointer select-none">
        <input type="checkbox" checked={showRead} onChange={e => setShowRead(e.target.checked)} className="rounded" />
        Show read notifications
      </label>

      {/* List */}
      <div className="space-y-2">
        {filtered.length === 0 ? (
          <div className="text-center py-10">
            <Bell className="h-10 w-10 text-muted-foreground mx-auto mb-3 opacity-30" />
            <p className="text-sm text-muted-foreground">
              {selectedFilter === 'all' ? "You're all caught up!" : `No ${selectedFilter} notifications.`}
            </p>
          </div>
        ) : filtered.map(n => {
          const Icon = typeIcons[n.type] || Bell;
          return (
            <div key={n.id}
              className={`flex items-start gap-3 p-3 rounded-xl border cursor-pointer transition-all hover:shadow-sm ${
                !n.read ? 'border-primary/30 bg-primary/5' : 'border-border bg-card'
              }`}
              onClick={() => handleClick(n)}>
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${typeColors[n.type] || 'bg-gray-500/20 text-gray-400'}`}>
                <Icon className="h-4 w-4" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <p className="text-sm font-semibold leading-tight">{n.title}</p>
                      {!n.read && <span className="w-1.5 h-1.5 bg-primary rounded-full shrink-0" />}
                      <span className={`text-xs px-1.5 py-0.5 rounded-full ${priorityColors[n.priority] || ''}`}>{n.priority}</span>
                    </div>
                    <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2">{n.message}</p>
                    <div className="flex items-center gap-3 mt-1 text-xs text-muted-foreground">
                      <span>{formatTimeAgo(n.timestamp)}</span>
                      {n.sender && <span>From: {n.sender}</span>}
                    </div>
                  </div>
                  <button className="shrink-0 p-1 rounded hover:bg-destructive/10 hover:text-destructive transition-colors"
                    onClick={e => { e.stopPropagation(); deleteNotification(n.id); }}>
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
                {n.actionUrl && (
                  <button className="mt-1.5 text-xs text-primary hover:underline font-medium"
                    onClick={e => { e.stopPropagation(); handleClick(n); }}>
                    View →
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between pt-3 border-t text-xs text-muted-foreground">
        <span>{filtered.length} notification{filtered.length !== 1 ? 's' : ''}</span>
        <Button variant="ghost" size="sm" className="h-7 text-xs" onClick={() => setLocation('/settings')}>
          <Settings className="h-3 w-3 mr-1" />Settings
        </Button>
      </div>
    </div>
  );
}
