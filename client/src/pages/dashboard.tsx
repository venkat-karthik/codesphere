import { useAuth } from '@/hooks/useAuth';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Flame, ArrowRight, BookOpen, Code, Users, Target, Video, Puzzle, Bot, Sparkles, TrendingUp, Zap, Clock } from 'lucide-react';
import { Leaderboard } from '@/components/Leaderboard';
import { NotificationsPanel } from '@/components/NotificationsPanel';
import { StudentAssignments } from '@/components/StudentAssignments';
import { useEffect, useRef, useState } from 'react';
import { CodeCoinHub } from '@/components/CodeCoinHub';
import { useLocation } from 'wouter';
import { motion, AnimatePresence } from 'framer-motion';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: { type: 'spring', stiffness: 300, damping: 24 },
  },
};

export function Dashboard() {
  const { user, isAuthenticated } = useAuth();
  const [, setLocation] = useLocation();
  const [nextClass, setNextClass] = useState<any>(null);

  useEffect(() => {
    // Fetch upcoming classes
    const fetchClasses = async () => {
      try {
        const res = await fetch('/api/live-classes?status=scheduled');
        const data = await res.json();
        if (data && data.length > 0) {
          setNextClass(data[0]);
        }
      } catch (err) {
        console.error("Failed to fetch next class", err);
      }
    };
    fetchClasses();
  }, []);

  if (!isAuthenticated || !user) return null;

  return (
    <motion.div 
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="space-y-10"
    >
      {/* Dynamic Welcome Header */}
      <section className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <motion.div variants={itemVariants}>
          <h1 className="text-4xl md:text-5xl font-black tracking-tight mb-2 text-gradient">
            Hey, {user.firstName}! <span className="animate-pulse">✨</span>
          </h1>
          <div className="flex items-center gap-4 flex-wrap">
            <Badge variant="secondary" className="bg-primary/10 text-primary border-primary/20 px-3 py-1 rounded-full flex items-center gap-2">
              <Zap className="h-3 w-3 fill-current" />
              Junior Suite Developer
            </Badge>
            <div className="flex items-center gap-2 text-orange-500 font-bold text-sm bg-orange-500/10 px-3 py-1 rounded-full">
              <Flame className="h-4 w-4" />
              {user.streak} Day Streak
            </div>
            <div className="text-muted-foreground text-sm flex items-center gap-2">
              <Clock className="h-4 w-4" />
              Last session 2h ago
            </div>
          </div>
        </motion.div>
        
        <motion.div variants={itemVariants} className="flex items-center gap-3">
          <Button variant="outline" size="lg" className="rounded-2xl border-primary/20 hover:bg-primary/5">
            Path Overview
          </Button>
          <Button size="lg" className="rounded-2xl shadow-xl shadow-primary/20 gap-2 font-bold" onClick={() => setLocation('/learning/roadmaps')}>
            Continue Path <ArrowRight className="h-4 w-4" />
          </Button>
        </motion.div>
      </section>

      {/* Bento Grid Layout */}
      <div className="grid grid-cols-1 md:grid-cols-6 lg:grid-cols-12 gap-6 md:auto-rows-[160px]">
        
        {/* Main Learning Focus - Large Bento Item */}
        <motion.div variants={itemVariants} className="md:col-span-4 lg:col-span-8 md:row-span-2 relative group cursor-pointer" onClick={() => setLocation('/learning/roadmaps')}>
          <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-purple-600/20 rounded-[2.5rem] -z-10 blur-2xl group-hover:opacity-30 transition-opacity" />
          <Card className="h-full rounded-[2.5rem] border-primary/10 glass-card overflow-hidden">
            <CardContent className="p-8 h-full flex flex-col justify-between relative">
              <div className="flex justify-between items-start">
                <div className="space-y-1">
                  <Badge className="bg-primary text-white font-bold mb-2">ACTIVE ROADMAP</Badge>
                  <h2 className="text-3xl font-black">Fullstack Mastery 2024</h2>
                  <p className="text-muted-foreground">Mastering Modern React & Distributed Systems</p>
                </div>
                <div className="p-4 bg-primary/10 rounded-3xl group-hover:scale-110 transition-transform">
                  <BookOpen className="h-8 w-8 text-primary" />
                </div>
              </div>
              
              <div className="space-y-4">
                <div className="flex justify-between text-sm font-bold">
                  <span className="text-primary uppercase tracking-widest">Progress</span>
                  <span>65% Complete</span>
                </div>
                <div className="h-4 w-full bg-muted/30 rounded-full overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: '65%' }}
                    transition={{ duration: 1.5, ease: "easeOut" }}
                    className="h-full bg-gradient-to-r from-primary to-purple-500 rounded-full"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Success Metrics - Mini Bento Items */}
        <motion.div variants={itemVariants} className="md:col-span-2 lg:col-span-4 md:row-span-1">
          <Card className="h-full rounded-[2rem] glass overflow-hidden border-none shadow-none bg-primary/5">
            <CardContent className="p-6 flex flex-col items-center justify-center text-center h-full">
              <Target className="h-10 w-10 text-primary mb-2 animate-bounce" />
              <div className="text-4xl font-black tracking-tighter">1,240</div>
              <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground/60 mt-1">Total XP Earned</p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div variants={itemVariants} className="md:col-span-2 lg:col-span-4 md:row-span-1">
          <Card className="h-full rounded-[2rem] glass overflow-hidden border-none shadow-none bg-orange-500/5">
            <CardContent className="p-6 flex flex-col items-center justify-center text-center h-full">
              <TrendingUp className="h-10 w-10 text-orange-500 mb-2" />
              <div className="text-4xl font-black tracking-tighter">12</div>
              <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground/60 mt-1">Day Global Rank</p>
            </CardContent>
          </Card>
        </motion.div>

        {/* Daily Challenges - Wide Bento Item */}
        <motion.div variants={itemVariants} className="md:col-span-3 lg:col-span-6 md:row-span-2">
          <Card className="h-full rounded-[2.5rem] glass-card group cursor-pointer" onClick={() => setLocation('/practice/problems')}>
            <CardHeader>
              <div className="flex justify-between items-center mb-4">
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-purple-500/20 rounded-2xl">
                    <Puzzle className="h-6 w-6 text-purple-500" />
                  </div>
                  <CardTitle className="text-xl">Daily Logic</CardTitle>
                </div>
                <Badge variant="outline" className="text-purple-500 font-bold">+50 XP</Badge>
              </div>
            </CardHeader>
            <CardContent>
              <h4 className="text-xl font-bold mb-2">Recursive Tree Balancing</h4>
              <p className="text-sm text-muted-foreground mb-6 line-clamp-3">
                Implement an AVL tree rotation logic to maintain balance after insertion...
              </p>
              <Button className="w-full rounded-2xl group-hover:bg-primary transition-colors">Solve Now</Button>
            </CardContent>
          </Card>
        </motion.div>

        {/* Live Status / Upcoming - Square Bento Item */}
        <motion.div variants={itemVariants} className="md:col-span-3 lg:col-span-6 md:row-span-2 relative overflow-hidden group">
          <Card className="h-full rounded-[2.5rem] glass overflow-hidden bg-background/40 backdrop-blur-3xl border-border/40">
            <div className="absolute top-4 right-4 flex items-center gap-2">
              <span className="w-2 h-2 bg-red-500 rounded-full animate-ping" />
              <span className="text-[10px] font-black uppercase text-red-500 tracking-widest">LIVE NOW</span>
            </div>
            <CardContent className="p-8 flex flex-col justify-between h-full">
              <div>
                <h3 className="text-2xl font-bold mb-1">Architecture Review</h3>
                <p className="text-muted-foreground text-sm">Instructor: Sarah Chen</p>
              </div>
              <div className="mt-6 p-4 rounded-[1.5rem] bg-muted/30">
                <div className="text-xs font-bold text-muted-foreground/60 uppercase mb-2">Next Milestone</div>
                <p className="text-sm">Serverless Patterns (Monday, 10:00 AM)</p>
              </div>
              <Button variant="outline" className="mt-auto rounded-2xl border-primary/20 hover:bg-primary hover:text-white transition-all" onClick={() => setLocation('/learning/live-classes')}>
                Access Workshop
              </Button>
            </CardContent>
          </Card>
        </motion.div>
        
        {/* Community & Analytics - Sidebar Style Bento Items */}
        <motion.div variants={itemVariants} className="md:col-span-3 lg:col-span-5 md:row-span-3">
          <NotificationsPanel className="h-full rounded-[2.5rem] glass-card" />
        </motion.div>

        <motion.div variants={itemVariants} className="md:col-span-3 lg:col-span-7 md:row-span-3">
          <Leaderboard className="h-full rounded-[2.5rem] glass-card" />
        </motion.div>
      </div>

      {/* CodeCoin Quick Launcher */}
      <motion.section variants={itemVariants}>
        <div className="relative p-10 rounded-[3rem] overflow-hidden group">
          <div className="absolute inset-0 bg-gradient-to-br from-primary via-purple-600 to-indigo-600 -z-10" />
          <div className="absolute inset-0 bg-[url('/mesh.svg')] opacity-20" />
          
          <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-10">
            <div className="text-center lg:text-left text-white max-w-xl">
              <Badge className="bg-white/20 text-white mb-4">PREMIUM HUB</Badge>
              <h2 className="text-4xl font-black mb-4 tracking-tighter">Your AI Workspace is Ready.</h2>
              <p className="text-white/80 text-lg mb-8">
                Access your personalized mentor, sandbox environment, and exclusive marketplace items.
              </p>
              <div className="flex flex-wrap gap-4 justify-center lg:justify-start">
                <Button size="lg" className="bg-white text-primary hover:bg-white/90 rounded-2xl shadow-2xl shadow-black/20 font-bold px-8" onClick={() => setLocation('/mentor')}>
                  <Bot className="h-4 w-4 mr-2" /> Chat with AI
                </Button>
                <Button size="lg" variant="secondary" className="bg-white/10 hover:bg-white/20 border-white/20 text-white rounded-2xl px-8" onClick={() => setLocation('/sandbox')}>
                  <Code className="h-4 w-4 mr-2" /> Play Sandbox
                </Button>
              </div>
            </div>
            
            <div className="w-full lg:w-96">
              <CodeCoinHub onNavigateToStore={() => setLocation('/store')} className="glass border-white/10 shadow-2xl rounded-3xl p-8" />
            </div>
          </div>
        </div>
      </motion.section>

      {/* Bottom Footer Polish */}
      <footer className="text-center pb-10 opacity-30 text-xs font-bold uppercase tracking-[0.3em] flex items-center justify-center gap-4">
        <span className="w-12 h-px bg-foreground" />
        LEVEL UP YOUR POTENTIAL
        <span className="w-12 h-px bg-foreground" />
      </footer>
    </motion.div>
  );
}
