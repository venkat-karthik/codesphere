import { useState, useEffect } from 'react';
import { useLocation, Link } from 'wouter';
import { 
  Home, 
  Route as RoadmapIcon, 
  FileText, 
  Play, 
  Users, 
  Code, 
  Puzzle, 
  Bot, 
  User, 
  Settings,
  LogOut,
  X,
  Flame,
  Star,
  BarChart3,
  Video,
  Store,
  BookOpen,
  Film,
  Globe2,
  ChevronRight,
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useUserRole } from '@/contexts/UserRoleContext';
import { ThemeToggle } from './ThemeToggle';
import { Section } from '@/types';
import { Button } from '@/components/ui/button';
import { getNarutoRank } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

interface SidebarProps {
  currentSection: Section;
  onAuthModalOpen: (mode: 'login' | 'register') => void;
  mobileOpen?: boolean;
  onMobileClose?: () => void;
}

export function Sidebar({ currentSection, onAuthModalOpen, mobileOpen, onMobileClose }: SidebarProps) {
  const { isAuthenticated, user, logout } = useAuth();
  const { isAdmin, isSubAdmin, isStudent } = useUserRole();
  const [isCollapsed, setIsCollapsed] = useState(true);
  const [location] = useLocation();

  // Sync with parent mobile state
  useEffect(() => {
    if (mobileOpen !== undefined) setIsCollapsed(!mobileOpen);
  }, [mobileOpen]);

  const handleClose = () => {
    setIsCollapsed(true);
    onMobileClose?.();
  };

  const navItemVariants = {
    initial: { x: -20, opacity: 0 },
    animate: { x: 0, opacity: 1 },
    hover: { x: 5, transition: { duration: 0.2 } },
  };

  const sidebarVariants = {
    open: { x: 0, transition: { type: 'spring', stiffness: 300, damping: 30 } },
    closed: { x: '-100%', transition: { type: 'spring', stiffness: 300, damping: 30 } },
  };

  const NavItem = ({ item }: { item: any }) => {
    const isActive = currentSection === item.id || location === item.path;
    return (
      <Link href={item.path}>
        <motion.a
          variants={navItemVariants}
          whileHover="hover"
          onClick={handleClose}
          className={`group flex items-center justify-between px-4 py-2.5 rounded-xl transition-all duration-300 cursor-pointer ${
            isActive
              ? 'bg-primary text-primary-foreground shadow-lg shadow-primary/20 bg-gradient-to-r from-primary to-primary/80'
              : 'text-sidebar-foreground hover:bg-primary/10 hover:text-primary'
          }`}
        >
          <div className="flex items-center gap-3">
            <div className={`p-1.5 rounded-lg transition-colors ${isActive ? 'bg-white/20' : 'bg-primary/5 group-hover:bg-primary/20'}`}>
              <item.icon className="h-4 w-4" />
            </div>
            <span className="font-medium text-sm">{item.label}</span>
          </div>
          {isActive && (
            <motion.div layoutId="active-indicator">
              <ChevronRight className="h-3 w-3 opacity-50" />
            </motion.div>
          )}
        </motion.a>
      </Link>
    );
  };

  if (!isAuthenticated) {
    return (
      <motion.div 
        initial="closed"
        animate="open"
        variants={sidebarVariants}
        className="fixed left-0 top-0 h-full glass border-r z-50 w-72 flex flex-col"
      >
        <div className="p-8">
          <Link href="/">
            <div className="flex items-center space-x-3 cursor-pointer group">
              <motion.div 
                whileHover={{ rotate: 180 }}
                className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center shadow-lg shadow-primary/20"
              >
                <span className="text-primary-foreground font-black text-xl">CS</span>
              </motion.div>
              <h1 className="text-2xl font-black tracking-tighter text-gradient group-hover:opacity-80 transition-opacity">CodeSphere</h1>
            </div>
          </Link>
          
          <div className="mt-12 space-y-4">
            <p className="text-xs font-black uppercase tracking-widest text-muted-foreground/50 px-4">Get Started</p>
            <Button onClick={() => onAuthModalOpen('login')} className="w-full justify-start gap-3 rounded-2xl h-11" variant="ghost">
              <User className="h-4 w-4" /> Login
            </Button>
            <Button onClick={() => onAuthModalOpen('register')} className="w-full justify-start gap-3 rounded-2xl h-11 shadow-lg shadow-primary/10">
              <Star className="h-4 w-4" /> Join Community
            </Button>
          </div>
        </div>
        <div className="mt-auto p-8 border-t border-border/50">
          <p className="text-[10px] uppercase font-black tracking-widest text-muted-foreground/30">© 2024 CodeSphere AI</p>
        </div>
      </motion.div>
    );
  }

  // Navigation data remains same but used with NavItem component
  const sections = [
    { title: 'Home', items: [{ id: 'dashboard' as Section, icon: Home, label: 'Dashboard', path: '/dashboard' }] },
    { title: 'Learn', items: [
      { id: 'roadmaps' as Section, icon: RoadmapIcon, label: 'Roadmaps', path: '/learning/roadmaps' },
      { id: 'videos' as Section, icon: Play, label: 'Video Library', path: '/learning/videos' },
      { id: 'problems' as Section, icon: Puzzle, label: 'Daily Problems', path: '/practice/problems' },
      { id: 'studio' as Section, icon: Code, label: 'Project Studio', path: '/studio' },
    ]},
    { title: 'Engage', items: [
      { id: 'community' as Section, icon: Users, label: 'Community', path: '/community' },
      { id: 'live-classes' as Section, icon: Video, label: 'Live Classes', path: '/learning/live-classes' },
    ]},
    { title: 'Tools', items: [
      { id: 'mentor' as Section, icon: Bot, label: 'AI Mentor', path: '/mentor' },
      { id: 'sandbox' as Section, icon: Code, label: 'App Sandbox', path: '/learning/sandbox' },
    ]},
  ];

  return (
    <>
      <AnimatePresence>
        {!isCollapsed && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-background/80 backdrop-blur-sm z-40 lg:hidden"
            onClick={handleClose}
          />
        )}
      </AnimatePresence>

      <motion.div 
        initial={false}
        animate={isCollapsed ? "closed" : "open"}
        variants={sidebarVariants}
        className="fixed left-0 top-0 h-full glass border-r z-50 w-72 flex flex-col lg:translate-x-0"
      >
        <div className="p-6 h-full flex flex-col overflow-y-auto scrollbar-hide">
          <div className="flex items-center justify-between mb-10">
            <Link href="/">
              <div className="flex items-center space-x-3 cursor-pointer group">
                <motion.div 
                  whileHover={{ rotate: 90 }}
                  className="w-9 h-9 bg-primary rounded-xl flex items-center justify-center shadow-lg shadow-primary/20"
                >
                  <span className="text-primary-foreground font-black text-lg">CS</span>
                </motion.div>
                <h1 className="text-xl font-black tracking-tighter text-gradient overflow-hidden">CodeSphere</h1>
              </div>
            </Link>
            <Button variant="ghost" size="icon" onClick={handleClose} className="lg:hidden">
              <X className="h-4 w-4" />
            </Button>
          </div>

          <div className="space-y-8 flex-1">
            {sections.map((section, idx) => (
              <div key={idx}>
                <h3 className="px-4 text-[10px] font-black uppercase tracking-widest text-muted-foreground/50 mb-3">{section.title}</h3>
                <div className="space-y-1">
                  {section.items.map(item => <NavItem key={item.id} item={item} />)}
                </div>
              </div>
            ))}
            
            {(isAdmin || isSubAdmin) && (
              <div>
                <h3 className="px-4 text-[10px] font-black uppercase tracking-widest text-primary/50 mb-3">Administration</h3>
                <div className="space-y-1">
                  <NavItem item={{ id: 'platform-analytics' as Section, icon: BarChart3, label: 'Analytics', path: '/admin/analytics' }} />
                  <NavItem item={{ id: 'admin-live-classes' as Section, icon: Video, label: 'Class Management', path: '/admin/live-classes' }} />
                </div>
              </div>
            )}
          </div>

          <div className="mt-10 pt-6 border-t border-border/50">
            <div className="flex items-center justify-between px-2">
              <ThemeToggle />
              <Button variant="ghost" size="icon" onClick={() => logout()} className="text-muted-foreground hover:text-destructive">
                <LogOut className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </motion.div>
    </>
  );
}
