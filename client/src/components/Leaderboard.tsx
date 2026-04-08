import React, { useState, useEffect } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import { Trophy, Flame, Target, Star, Search, Award } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { io } from 'socket.io-client';

interface LeaderboardEntry {
  id: number;
  firstName: string;
  lastName: string;
  level: number;
  xp: number;
  streak: number;
  rank: number;
}

export function Leaderboard({ className }: { className?: string }) {
  const { user } = useAuth();
  const qc = useQueryClient();
  const [selectedCategory, setSelectedCategory] = useState('xp');
  const [searchTerm, setSearchTerm] = useState('');

  const { data: leaderboard = [], isLoading } = useQuery<LeaderboardEntry[]>({
    queryKey: ['/api/leaderboard'],
  });

  // Real-time leaderboard updates via Socket.io
  useEffect(() => {
    const socket = io({ transports: ['websocket', 'polling'] });
    socket.on('leaderboard-updated', () => {
      qc.invalidateQueries({ queryKey: ['/api/leaderboard'] });
    });
    return () => { socket.disconnect(); };
  }, [qc]);

  const categories = [
    { id: 'xp', label: 'Total XP', icon: Star },
    { id: 'streak', label: 'Streak', icon: Flame },
    { id: 'level', label: 'Level', icon: Target },
  ];

  const getValue = (entry: LeaderboardEntry) => {
    if (selectedCategory === 'xp') return entry.xp;
    if (selectedCategory === 'streak') return entry.streak;
    return entry.level;
  };

  const sorted = [...(leaderboard as LeaderboardEntry[])]
    .sort((a, b) => getValue(b) - getValue(a))
    .map((e, i) => ({ ...e, rank: i + 1 }))
    .filter(e => `${e.firstName} ${e.lastName}`.toLowerCase().includes(searchTerm.toLowerCase()));

  const getRankIcon = (rank: number) => {
    if (rank === 1) return '🥇';
    if (rank === 2) return '🥈';
    if (rank === 3) return '🥉';
    return `#${rank}`;
  };

  const getRankColor = (rank: number) => {
    if (rank === 1) return 'bg-yellow-500/20 text-yellow-600 border-yellow-500/30';
    if (rank === 2) return 'bg-gray-400/20 text-gray-600 border-gray-400/30';
    if (rank === 3) return 'bg-orange-500/20 text-orange-600 border-orange-500/30';
    return 'bg-muted/50 border-muted';
  };

  const top3 = sorted.slice(0, 3);
  const currentUserEntry = user ? sorted.find(e => e.id === user.id) : null;

  return (
    <div className="space-y-4">
      {/* Top 3 Podium */}
      {!isLoading && top3.length > 0 && (
        <Card className="bg-gradient-to-r from-yellow-500/10 to-orange-500/10 border-yellow-500/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Trophy className="h-5 w-5 text-yellow-600" />
              Top Performers
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-end justify-center gap-6">
              {top3[1] && (
                <div className="text-center">
                  <div className="w-14 h-14 bg-gray-400/20 rounded-full flex items-center justify-center mx-auto mb-2 border-2 border-gray-400/30 text-2xl">🥈</div>
                  <div className="text-sm font-semibold">{top3[1].firstName}</div>
                  <div className="text-xs text-muted-foreground">{getValue(top3[1]).toLocaleString()}</div>
                </div>
              )}
              {top3[0] && (
                <div className="text-center">
                  <div className="w-18 h-18 bg-yellow-500/20 rounded-full flex items-center justify-center mx-auto mb-2 border-2 border-yellow-500/30 text-3xl p-3">🥇</div>
                  <div className="text-base font-bold">{top3[0].firstName}</div>
                  <div className="text-sm text-muted-foreground">{getValue(top3[0]).toLocaleString()}</div>
                </div>
              )}
              {top3[2] && (
                <div className="text-center">
                  <div className="w-14 h-14 bg-orange-500/20 rounded-full flex items-center justify-center mx-auto mb-2 border-2 border-orange-500/30 text-2xl">🥉</div>
                  <div className="text-sm font-semibold">{top3[2].firstName}</div>
                  <div className="text-xs text-muted-foreground">{getValue(top3[2]).toLocaleString()}</div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Category + Search */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search users..." value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)} className="pl-10" />
        </div>
        <div className="flex gap-2">
          {categories.map(cat => (
            <button key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-3 py-1.5 rounded text-sm border transition-colors ${selectedCategory === cat.id ? 'bg-primary text-primary-foreground border-primary' : 'border-border hover:bg-muted'}`}>
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* List */}
      <Card>
        <CardContent className="p-0">
          {isLoading ? (
            <div className="p-4 space-y-3">
              {[...Array(5)].map((_, i) => <Skeleton key={i} className="h-14 w-full" />)}
            </div>
          ) : sorted.length === 0 ? (
            <div className="p-8 text-center text-muted-foreground text-sm">No users found</div>
          ) : (
            <div className="divide-y">
              {sorted.map(entry => {
                const isMe = user?.id === entry.id;
                return (
                  <div key={entry.id} className={`flex items-center gap-4 p-4 hover:bg-muted/50 transition-colors ${isMe ? 'bg-primary/5' : ''}`}>
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold border-2 shrink-0 ${getRankColor(entry.rank)}`}>
                      {getRankIcon(entry.rank)}
                    </div>
                    <div className="w-9 h-9 bg-primary/20 rounded-full flex items-center justify-center text-primary font-semibold text-sm shrink-0">
                      {entry.firstName[0]}{entry.lastName[0]}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-sm truncate">{entry.firstName} {entry.lastName}</span>
                        {isMe && <Badge className="bg-primary/20 text-primary text-xs">You</Badge>}
                      </div>
                      <span className="text-xs text-muted-foreground">Level {entry.level}</span>
                    </div>
                    <div className="text-right shrink-0">
                      <div className="font-semibold text-sm">{getValue(entry).toLocaleString()}</div>
                      <div className="text-xs text-muted-foreground">{categories.find(c => c.id === selectedCategory)?.label}</div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Your stats */}
      {currentUserEntry && (
        <Card className="bg-primary/5 border-primary/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Award className="h-4 w-4 text-primary" /> Your Standing
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-3 gap-4 text-center">
              <div><div className="text-2xl font-bold text-primary">#{currentUserEntry.rank}</div><div className="text-xs text-muted-foreground">Rank</div></div>
              <div><div className="text-2xl font-bold text-green-500">{currentUserEntry.xp}</div><div className="text-xs text-muted-foreground">XP</div></div>
              <div><div className="text-2xl font-bold text-orange-500">{currentUserEntry.streak}</div><div className="text-xs text-muted-foreground">Streak</div></div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

