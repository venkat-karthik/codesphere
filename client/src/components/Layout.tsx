import { useState, ReactNode, useEffect } from 'react';
import { useLocation } from 'wouter';
import { Sidebar } from './Sidebar';
import { AuthModals } from './AuthModals';
import { ErrorBoundary } from './ErrorBoundary';
import { Search, Bell, AlertCircle, X, Menu, Activity, BookOpen, Code, User, ShoppingCart } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useNotifications } from '@/contexts/NotificationsContext';
import { Section } from '@/types';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Footer } from './Footer';
import { Command } from 'cmdk';
import { Dialog, DialogContent } from '@/components/ui/dialog';

interface LayoutProps {
  children: ReactNode;
}

export function Layout({ children }: LayoutProps) {
  const [location, setLocation] = useLocation();
  const { isAuthenticated, user } = useAuth();
  const { unreadCount } = useNotifications();
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');
  const [verifyBannerDismissed, setVerifyBannerDismissed] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [commandOpen, setCommandOpen] = useState(false);

  // Toggle command palette on Cmd+K
  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setCommandOpen((open) => !open);
      }
    };
    document.addEventListener('keydown', down);
    return () => document.removeEventListener('keydown', down);
  }, []);

  const runCommand = (command: () => void) => {
    setCommandOpen(false);
    command();
  };

  // Helper to map route to section ID for Sidebar highlighting
  const getSectionFromPath = (path: string): Section => {
    if (path.startsWith('/admin/analytics')) return 'platform-analytics';
    if (path.startsWith('/admin/resources')) return 'admin-pdf-resources';
    if (path.startsWith('/admin/videos')) return 'admin-video-resources';
    if (path.startsWith('/admin/live-classes')) return 'admin-live-classes';
    if (path.startsWith('/admin/sphere-map')) return 'admin-sphere-map';
    if (path.startsWith('/learning/roadmaps')) return 'roadmaps';
    if (path.startsWith('/learning/resources')) return 'resources';
    if (path.startsWith('/learning/videos')) return 'videos';
    if (path.startsWith('/learning/live-classes')) return 'live-classes';
    if (path.startsWith('/practice/problems')) return 'problems';
    if (path.startsWith('/community')) return 'community';
    if (path.startsWith('/studio')) return 'studio';
    if (path.startsWith('/mentor')) return 'mentor';
    if (path.startsWith('/profile')) return 'profile';
    if (path.startsWith('/settings')) return 'settings';
    if (path.startsWith('/store')) return 'store';
    if (path.startsWith('/privacy')) return 'dashboard'; // Default highlight
    if (path.startsWith('/terms')) return 'dashboard';
    return 'dashboard';
  };

  const currentSection = getSectionFromPath(location);

  const showVerifyBanner = isAuthenticated && user &&
    user.emailVerified === false &&
    user.email !== 'admin@codesphere.com' &&
    user.email !== 'student@codesphere.com' &&
    !verifyBannerDismissed;

  const sendVerification = async () => {
    await fetch('/api/auth/send-verification', { method: 'POST', credentials: 'include' });
    setVerifyBannerDismissed(true);
  };

  const openAuthModal = (mode: 'login' | 'register') => {
    setAuthMode(mode);
    setAuthModalOpen(true);
  };

  const getSectionTitle = (section: Section): string => {
    const titles: Record<Section, string> = {
      dashboard: 'Dashboard',
      roadmaps: 'Learning Roadmaps',
      resources: 'PDF Resources',
      videos: 'Video Library',
      problems: 'Daily Problems',
      community: 'Community Lounge',
      studio: 'Project Studio',
      sandbox: 'App Sandbox',
      mentor: 'AI Mentor',
      'sphere-map': 'Sphere Map',
      analytics: 'Analytics',
      'platform-analytics': 'Platform Analytics',
      'live-classes': 'Live Classes',
      profile: 'Profile',
      settings: 'Settings',
      tutorials: 'Text Tutorials',
      store: 'CodeCoin Store',
      'admin-pdf-resources': 'Admin PDF Resources',
      'admin-video-resources': 'Admin Video Resources',
      'admin-live-classes': 'Admin Live Classes',
      'admin-sphere-map': 'Admin Sphere Map'
    };
    if (location === '/privacy') return 'Privacy Policy';
    if (location === '/terms') return 'Terms of Service';
    return titles[section] || 'Dashboard';
  };

  return (
    <div className="flex min-h-screen bg-background mesh-gradient transition-colors duration-500">
      <Sidebar
        currentSection={currentSection}
        onAuthModalOpen={openAuthModal}
        mobileOpen={sidebarOpen}
        onMobileClose={() => setSidebarOpen(false)}
      />

      <main className="flex-1 lg:ml-72 relative overflow-x-hidden">
        {/* Email verification banner */}
        <AnimatePresence>
          {showVerifyBanner && (
            <motion.div 
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="bg-primary/10 backdrop-blur-md border-b border-primary/20 px-4 py-2 flex items-center justify-between gap-3 overflow-hidden"
            >
              <div className="flex items-center gap-2 text-sm text-primary font-medium">
                <AlertCircle className="h-4 w-4 shrink-0" />
                <span>Verify your email address to unlock premium features.</span>
                <button onClick={sendVerification} className="underline hover:no-underline ml-2">
                  Resend Link
                </button>
              </div>
              <button onClick={() => setVerifyBannerDismissed(true)} className="text-primary hover:opacity-70 transition-opacity">
                <X className="h-4 w-4" />
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Top Navigation */}
        <header className="glass sticky top-0 z-30 p-4 border-b transition-all duration-300">
          <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="icon"
                className="lg:hidden hover:bg-primary/10"
                onClick={() => setSidebarOpen(true)}
              >
                <Menu className="h-6 w-6" />
              </Button>
              <h2 className="text-xl font-bold tracking-tight text-gradient">
                {getSectionTitle(currentSection)}
              </h2>
            </div>

            <div className="flex items-center gap-3">
              {/* Search Bar - Interactive Button */}
              <button 
                onClick={() => setCommandOpen(true)}
                className="hidden md:flex items-center bg-muted/50 rounded-full px-4 py-2 border border-border/50 hover:border-primary/50 hover:ring-2 hover:ring-primary/10 transition-all w-64 lg:w-80 group"
              >
                <Search className="h-4 w-4 text-muted-foreground mr-2 group-hover:text-primary transition-colors" />
                <span className="text-sm text-muted-foreground flex-1 text-left">Quick Search...</span>
                <kbd className="hidden sm:inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-100">
                  <span className="text-xs">⌘</span>K
                </kbd>
              </button>
              
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="icon" className="relative hover:bg-primary/10">
                  <Bell className="h-5 w-5" />
                  {unreadCount > 0 && (
                    <span className="absolute top-2 right-2 w-2 h-2 bg-primary rounded-full border-2 border-background" />
                  )}
                </Button>
                
                {isAuthenticated && user ? (
                  <div className="flex items-center gap-3 pl-3 border-l">
                    <div className="hidden sm:block text-right">
                      <p className="text-sm font-bold truncate max-w-[120px]">{user.firstName}</p>
                      <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-black text-primary">Lvl {user.level}</p>
                    </div>
                    <Avatar className="h-9 w-9 ring-2 ring-primary/20 hover:ring-primary/50 transition-all cursor-pointer" onClick={() => setLocation('/profile')}>
                      <AvatarImage src={(user as any).avatarUrl || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.email}`} />
                      <AvatarFallback className="bg-primary/20 text-primary font-bold">
                        {user.firstName[0]}
                      </AvatarFallback>
                    </Avatar>
                  </div>
                ) : (
                  <Button onClick={() => openAuthModal('login')} className="rounded-full px-6 shadow-lg shadow-primary/20">
                    Sign In
                  </Button>
                )}
              </div>
            </div>
          </div>
        </header>

        {/* Content Area */}
        <div className="flex flex-col min-h-[calc(100vh-64px)]">
          <div className="flex-1 p-4 md:p-8">
            <ErrorBoundary key={location}>
              {children}
            </ErrorBoundary>
          </div>
          <Footer />
        </div>
      </main>

      {/* Command Palette */}
      <Dialog open={commandOpen} onOpenChange={setCommandOpen}>
        <DialogContent className="p-0 overflow-hidden border-none glass max-w-2xl bg-background/80 backdrop-blur-2xl shadow-2xl ring-1 ring-white/10">
          <Command className="rounded-xl border-none">
            <div className="flex items-center border-b px-4 py-4 gap-3 bg-primary/5">
              <Search className="h-5 w-5 text-primary opacity-50" />
              <Command.Input
                placeholder="Search resources, roadmaps, or settings..."
                className="w-full bg-transparent border-none outline-none text-base text-foreground placeholder:text-muted-foreground focus:ring-0"
              />
            </div>
            <Command.List className="max-h-[400px] overflow-y-auto p-2 scrollbar-thin">
              <Command.Empty className="p-8 text-center">
                <div className="flex flex-col items-center gap-2">
                  <Search className="h-8 w-8 text-muted-foreground opacity-20" />
                  <p className="text-sm text-muted-foreground">No matches found for this query.</p>
                </div>
              </Command.Empty>

              <Command.Group heading={<span className="px-3 py-2 text-[10px] font-black uppercase tracking-widest text-primary/50">Navigation</span>}>
                <Command.Item onSelect={() => runCommand(() => setLocation('/dashboard'))} className="flex items-center gap-3 p-3 hover:bg-primary/10 rounded-xl cursor-pointer transition-all aria-selected:bg-primary/10">
                  <div className="w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center">
                    <Activity className="h-4 w-4 text-blue-500" />
                  </div>
                  <span className="font-medium">Dashboard Overview</span>
                </Command.Item>
                <Command.Item onSelect={() => runCommand(() => setLocation('/learning/roadmaps'))} className="flex items-center gap-3 p-3 hover:bg-primary/10 rounded-xl cursor-pointer transition-all aria-selected:bg-primary/10">
                  <div className="w-8 h-8 rounded-lg bg-purple-500/10 flex items-center justify-center">
                    <BookOpen className="h-4 w-4 text-purple-500" />
                  </div>
                  <span className="font-medium">Learning Roadmaps</span>
                </Command.Item>
                <Command.Item onSelect={() => runCommand(() => setLocation('/practice/problems'))} className="flex items-center gap-3 p-3 hover:bg-primary/10 rounded-xl cursor-pointer transition-all aria-selected:bg-primary/10">
                  <div className="w-8 h-8 rounded-lg bg-green-500/10 flex items-center justify-center">
                    <Code className="h-4 w-4 text-green-500" />
                  </div>
                  <span className="font-medium">Daily Logic Problems</span>
                </Command.Item>
              </Command.Group>

              <Command.Group heading={<span className="px-3 py-2 text-[10px] font-black uppercase tracking-widest text-primary/50">User Profile</span>}>
                <Command.Item onSelect={() => runCommand(() => setLocation('/profile'))} className="flex items-center gap-3 p-3 hover:bg-primary/10 rounded-xl cursor-pointer transition-all aria-selected:bg-primary/10">
                  <div className="w-8 h-8 rounded-lg bg-orange-500/10 flex items-center justify-center">
                    <User className="h-4 w-4 text-orange-500" />
                  </div>
                  <span className="font-medium">Account Settings</span>
                </Command.Item>
                <Command.Item onSelect={() => runCommand(() => setLocation('/store'))} className="flex items-center gap-3 p-3 hover:bg-primary/10 rounded-xl cursor-pointer transition-all aria-selected:bg-primary/10">
                  <div className="w-8 h-8 rounded-lg bg-yellow-500/10 flex items-center justify-center">
                    <ShoppingCart className="h-4 w-4 text-yellow-500" />
                  </div>
                  <span className="font-medium">CodeCoin Exchange Store</span>
                </Command.Item>
              </Command.Group>
            </Command.List>

            <div className="p-3 border-t bg-muted/30 flex items-center justify-between text-[10px] text-muted-foreground uppercase tracking-widest font-black">
              <span>Select item</span>
              <div className="flex gap-2">
                <span>↑↓ navigate</span>
                <span>↵ enter</span>
              </div>
            </div>
          </Command>
        </DialogContent>
      </Dialog>

      <AuthModals
        isOpen={authModalOpen}
        mode={authMode}
        onClose={() => setAuthModalOpen(false)}
        onSwitchMode={setAuthMode}
      />
    </div>
  );
}
