import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { 
  Trophy, 
  Target, 
  Flame, 
  Code, 
  Users, 
  Star, 
  Award,
  Crown,
  Zap,
  Heart,
  BookOpen,
  CheckCircle,
  Lock
} from 'lucide-react';

interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: any;
  category: string;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  progress: number;
  maxProgress: number;
  earned: boolean;
  earnedDate?: Date;
  xpReward: number;
}

interface Badge {
  id: string;
  name: string;
  icon: string;
  unlocked: boolean;
  description: string;
}

export function ProfileAchievements() {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [showUnlockedOnly, setShowUnlockedOnly] = useState(false);

  const achievements: Achievement[] = [
    {
      id: '1',
      title: 'First Steps',
      description: 'Complete your first coding problem',
      icon: Target,
      category: 'Getting Started',
      rarity: 'common',
      progress: 1,
      maxProgress: 1,
      earned: true,
      earnedDate: new Date('2024-01-15'),
      xpReward: 50
    },
    {
      id: '2',
      title: 'Streak Master',
      description: 'Maintain a 30-day learning streak',
      icon: Flame,
      category: 'Consistency',
      rarity: 'rare',
      progress: 25,
      maxProgress: 30,
      earned: false,
      xpReward: 200
    },
    {
      id: '3',
      title: 'Code Warrior',
      description: 'Solve 100 coding problems',
      icon: Code,
      category: 'Problem Solving',
      rarity: 'epic',
      progress: 67,
      maxProgress: 100,
      earned: false,
      xpReward: 500
    },
    {
      id: '4',
      title: 'Full Stack Hero',
      description: 'Complete all full-stack development courses',
      icon: Trophy,
      category: 'Learning',
      rarity: 'legendary',
      progress: 3,
      maxProgress: 8,
      earned: false,
      xpReward: 1000
    },
    {
      id: '5',
      title: 'Community Champion',
      description: 'Help 50 fellow learners in the community',
      icon: Users,
      category: 'Community',
      rarity: 'epic',
      progress: 32,
      maxProgress: 50,
      earned: false,
      xpReward: 300
    },
    {
      id: '6',
      title: 'Project Builder',
      description: 'Deploy 5 live projects',
      icon: Star,
      category: 'Projects',
      rarity: 'rare',
      progress: 2,
      maxProgress: 5,
      earned: false,
      xpReward: 250
    },
    {
      id: '7',
      title: 'Speed Learner',
      description: 'Complete 10 courses in 30 days',
      icon: Zap,
      category: 'Learning',
      rarity: 'epic',
      progress: 7,
      maxProgress: 10,
      earned: false,
      xpReward: 400
    },
    {
      id: '8',
      title: 'Mentor',
      description: 'Become a mentor to 10 students',
      icon: Heart,
      category: 'Community',
      rarity: 'legendary',
      progress: 0,
      maxProgress: 10,
      earned: false,
      xpReward: 800
    }
  ];

  const badges: Badge[] = [
    { id: '1', name: 'Beginner', icon: '🎯', unlocked: true, description: 'Started your coding journey' },
    { id: '2', name: 'Problem Solver', icon: '💻', unlocked: true, description: 'Solved your first problem' },
    { id: '3', name: 'Streak Keeper', icon: '🔥', unlocked: true, description: 'Maintained a 7-day streak' },
    { id: '4', name: 'Course Master', icon: '📚', unlocked: false, description: 'Complete 5 courses' },
    { id: '5', name: 'Community Helper', icon: '🤝', unlocked: false, description: 'Help 25 community members' },
    { id: '6', name: 'Project Creator', icon: '🚀', unlocked: false, description: 'Deploy 3 projects' },
    { id: '7', name: 'Speed Demon', icon: '⚡', unlocked: false, description: 'Complete 5 courses in 15 days' },
    { id: '8', name: 'Legend', icon: '👑', unlocked: false, description: 'Reach level 20' }
  ];

  const categories = ['all', 'Getting Started', 'Consistency', 'Problem Solving', 'Learning', 'Community', 'Projects'];

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case 'common': return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
      case 'rare': return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      case 'epic': return 'bg-purple-500/20 text-purple-400 border-purple-500/30';
      case 'legendary': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      default: return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  const getRarityIcon = (rarity: string) => {
    switch (rarity) {
      case 'common': return '⭐';
      case 'rare': return '⭐⭐';
      case 'epic': return '⭐⭐⭐';
      case 'legendary': return '⭐⭐⭐⭐';
      default: return '⭐';
    }
  };

  const filteredAchievements = achievements.filter(achievement => {
    const matchesCategory = selectedCategory === 'all' || achievement.category === selectedCategory;
    const matchesUnlocked = !showUnlockedOnly || !achievement.earned;
    return matchesCategory && matchesUnlocked;
  });

  const earnedAchievements = achievements.filter(a => a.earned);
  const totalXP = earnedAchievements.reduce((sum, a) => sum + a.xpReward, 0);

  return (
    <div className="space-y-6">
      {/* Stats Overview */}
      <div className="grid md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-primary">{earnedAchievements.length}</div>
            <div className="text-sm text-muted-foreground">Achievements Earned</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-green-500">{totalXP}</div>
            <div className="text-sm text-muted-foreground">Total XP Earned</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-blue-500">{badges.filter(b => b.unlocked).length}</div>
            <div className="text-sm text-muted-foreground">Badges Unlocked</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-purple-500">
              {Math.round((earnedAchievements.length / achievements.length) * 100)}%
            </div>
            <div className="text-sm text-muted-foreground">Completion Rate</div>
          </CardContent>
        </Card>
      </div>

      {/* Badges Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Award className="h-5 w-5" />
            <span>Badges & Recognition</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {badges.map((badge) => (
              <div
                key={badge.id}
                className={`p-4 rounded-lg border-2 text-center transition-all ${
                  badge.unlocked
                    ? 'bg-primary/10 border-primary/30 hover:bg-primary/20'
                    : 'bg-muted/50 border-muted opacity-50'
                }`}
              >
                <div className="text-3xl mb-2">{badge.icon}</div>
                <div className="font-semibold text-sm">{badge.name}</div>
                <div className="text-xs text-muted-foreground mt-1">
                  {badge.unlocked ? 'Unlocked' : 'Locked'}
                </div>
                {!badge.unlocked && (
                  <div className="text-xs text-muted-foreground mt-2">
                    {badge.description}
                  </div>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Achievements Section */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center space-x-2">
              <Trophy className="h-5 w-5" />
              <span>Achievements</span>
            </CardTitle>
            <div className="flex space-x-2">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-3 py-1 border rounded text-sm"
              >
                {categories.map(cat => (
                  <option key={cat} value={cat}>
                    {cat === 'all' ? 'All Categories' : cat}
                  </option>
                ))}
              </select>
              <Button
                variant={showUnlockedOnly ? "default" : "outline"}
                size="sm"
                onClick={() => setShowUnlockedOnly(!showUnlockedOnly)}
              >
                {showUnlockedOnly ? 'Show All' : 'Show Locked Only'}
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-4">
            {filteredAchievements.map((achievement) => {
              const IconComponent = achievement.icon;
              const progressPercentage = (achievement.progress / achievement.maxProgress) * 100;
              
              return (
                <div
                  key={achievement.id}
                  className={`p-4 border-2 rounded-lg transition-all ${
                    achievement.earned
                      ? getRarityColor(achievement.rarity)
                      : 'bg-muted/30 border-muted'
                  }`}
                >
                  <div className="flex items-start space-x-3">
                    <div className="w-12 h-12 bg-primary/20 rounded-lg flex items-center justify-center">
                      <IconComponent className="h-6 w-6 text-primary" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-1">
                        <h4 className="font-semibold">{achievement.title}</h4>
                        <Badge variant="secondary" className="text-xs">
                          {getRarityIcon(achievement.rarity)}
                        </Badge>
                        {achievement.earned && (
                          <CheckCircle className="h-4 w-4 text-green-500" />
                        )}
                      </div>
                      <p className="text-sm opacity-80 mb-2">{achievement.description}</p>
                      
                      {!achievement.earned && (
                        <div className="space-y-2">
                          <div className="flex justify-between text-xs">
                            <span>Progress</span>
                            <span>{achievement.progress}/{achievement.maxProgress}</span>
                          </div>
                          <Progress value={progressPercentage} className="h-2" />
                        </div>
                      )}
                      
                      <div className="flex items-center justify-between mt-2">
                        <span className="text-xs opacity-60">{achievement.category}</span>
                        <div className="flex items-center space-x-2">
                          <span className="text-xs font-semibold">+{achievement.xpReward} XP</span>
                          {achievement.earned && achievement.earnedDate && (
                            <span className="text-xs opacity-60">
                              {achievement.earnedDate.toLocaleDateString()}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 