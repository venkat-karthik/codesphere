import { useEffect, ReactNode } from 'react';
import { Route, Switch, useLocation } from 'wouter';
import { QueryClientProvider } from '@tanstack/react-query';
import { AnimatePresence } from 'framer-motion';
import { queryClient } from './lib/queryClient';
import { AuthProvider, useAuth } from './hooks/useAuth';
import { useStudyTimer } from './hooks/useStudyTimer';
import { ThemeProvider } from './contexts/ThemeContext';
import { UserRoleProvider, useUserRole } from './contexts/UserRoleContext';
import { NotificationsProvider } from './contexts/NotificationsContext';
import { AssignmentProvider } from './contexts/AssignmentContext';
import { Layout } from './components/Layout';
import { PageTransition } from './components/PageTransition';
import { Dashboard } from './pages/Dashboard';
import { Roadmaps } from './pages/Roadmaps';
import { Resources } from './pages/Resources';
import { Videos } from './pages/Videos';
import TextTutorials from './pages/TextTutorials';
import { Problems } from './pages/Problems';
import { CommunityChannels } from './pages/CommunityChannels';
import { Studio } from './pages/Studio';
import { Mentor } from './pages/Mentor';
import { EnhancedProfile } from './pages/EnhancedProfile';
import { EnhancedSettings } from './pages/EnhancedSettings';
import { PlatformAnalytics } from './pages/PlatformAnalytics';
import { LiveClasses } from './pages/LiveClasses';
import { CodeCoinStore } from './pages/CodeCoinStore';
import { SphereMap } from './pages/SphereMap';
import { VideoCall } from './pages/VideoCall';
import Welcome from './pages/Welcome';
import AdminPDFResources from './pages/AdminPDFResources';
import AdminVideoResources from './pages/AdminVideoResources';
import AdminLiveClasses from './pages/AdminLiveClasses';
import AdminSphereMap from './pages/AdminSphereMap';
import { ResetPassword } from './pages/ResetPassword';
import { Privacy } from './pages/Privacy';
import { Terms } from './pages/Terms';
import { VerifyEmail } from './pages/VerifyEmail';
import { OtpVerification } from './pages/OtpVerification';

function AppContent() {
  const { isAdmin, isSubAdmin } = useUserRole();
  const { isLoading, isAuthenticated } = useAuth();
  const [location, setLocation] = useLocation();

  // Track study time for authenticated users
  useStudyTimer();

  // Redirect admin to analytics by default
  useEffect(() => {
    if (isAuthenticated && (isAdmin || isSubAdmin) && location === '/') {
      setLocation('/admin/analytics');
    }
  }, [isAdmin, isSubAdmin, isAuthenticated, location, setLocation]);

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
            <span className="text-primary-foreground font-bold">CS</span>
          </div>
          <p className="text-muted-foreground text-sm">Loading...</p>
        </div>
      </div>
    );
  }

  const Protected = ({ children }: { children: ReactNode }) => {
    if (!isAuthenticated) {
      setLocation('/');
      return null;
    }
    return <>{children}</>;
  };

  return (
    <NotificationsProvider>
      <AssignmentProvider>
        <Layout>
          <AnimatePresence mode="wait">
            <Switch location={location} key={location}>
              {/* Student Routes */}
              <Route path="/" component={() => <PageTransition><Dashboard /></PageTransition>} />
              <Route path="/welcome" component={() => <PageTransition><Welcome onOpenAuth={(mode) => {}} /></PageTransition>} />
              <Route path="/dashboard" component={() => <PageTransition><Protected><Dashboard /></Protected></PageTransition>} />
              <Route path="/learning/roadmaps" component={() => <PageTransition><Protected><Roadmaps /></Protected></PageTransition>} />
              <Route path="/learning/resources" component={() => <PageTransition><Protected><Resources /></Protected></PageTransition>} />
              <Route path="/learning/videos" component={() => <PageTransition><Protected><Videos /></Protected></PageTransition>} />
              <Route path="/learning/tutorials" component={() => <PageTransition><Protected><TextTutorials /></Protected></PageTransition>} />
              <Route path="/learning/live-classes" component={() => <PageTransition><Protected><LiveClasses /></Protected></PageTransition>} />
              <Route path="/practice/problems" component={() => <PageTransition><Protected><Problems /></Protected></PageTransition>} />
              <Route path="/community" component={() => <PageTransition><Protected><CommunityChannels /></Protected></PageTransition>} />
              <Route path="/studio" component={() => <PageTransition><Protected><Studio /></Protected></PageTransition>} />
              <Route path="/mentor" component={() => <PageTransition><Protected><Mentor /></Protected></PageTransition>} />
              <Route path="/profile" component={() => <PageTransition><Protected><EnhancedProfile /></Protected></PageTransition>} />
              <Route path="/settings" component={() => <PageTransition><Protected><EnhancedSettings /></Protected></PageTransition>} />
              <Route path="/store" component={() => <PageTransition><Protected><CodeCoinStore /></Protected></PageTransition>} />
              <Route path="/sphere-map" component={() => <PageTransition><Protected><SphereMap /></Protected></PageTransition>} />
              <Route path="/video-call" component={() => <PageTransition><Protected><VideoCall roomId="lobby" isHost={false} onClose={() => {}} /></Protected></PageTransition>} />
              <Route path="/privacy" component={() => <PageTransition><Privacy /></PageTransition>} />
              <Route path="/terms" component={() => <PageTransition><Terms /></PageTransition>} />
              <Route path="/verify-email" component={() => <PageTransition><VerifyEmail /></PageTransition>} />
              <Route path="/verify-otp" component={() => <PageTransition><OtpVerification /></PageTransition>} />

              {/* Admin Routes */}
              <Route path="/admin/analytics">
                <PageTransition>
                  <Protected>{(isAdmin || isSubAdmin) ? <PlatformAnalytics /> : <Dashboard />}</Protected>
                </PageTransition>
              </Route>
              <Route path="/admin/resources">
                <PageTransition>
                  <Protected>{(isAdmin || isSubAdmin) ? <AdminPDFResources /> : <Dashboard />}</Protected>
                </PageTransition>
              </Route>
              <Route path="/admin/videos">
                <PageTransition>
                  <Protected>{(isAdmin || isSubAdmin) ? <AdminVideoResources /> : <Dashboard />}</Protected>
                </PageTransition>
              </Route>
              <Route path="/admin/live-classes">
                <PageTransition>
                  <Protected>{(isAdmin || isSubAdmin) ? <AdminLiveClasses /> : <Dashboard />}</Protected>
                </PageTransition>
              </Route>
              <Route path="/admin/sphere-map">
                <PageTransition>
                  <Protected>{(isAdmin || isSubAdmin) ? <AdminSphereMap /> : <Dashboard />}</Protected>
                </PageTransition>
              </Route>

              {/* Auth Flows */}
              <Route path="/reset-password">
                {(params) => {
                  const searchParams = new URLSearchParams(window.location.search);
                  const token = searchParams.get('token');
                  return (
                    <PageTransition>
                      {token ? (
                        <ResetPassword 
                          token={token} 
                          onDone={() => {
                            window.history.replaceState({}, '', '/');
                            window.location.reload();
                          }} 
                        />
                      ) : <Dashboard />}
                    </PageTransition>
                  );
                }}
              </Route>

              {/* 404 Fallback */}
              <Route>
                <PageTransition>
                  <Dashboard />
                </PageTransition>
              </Route>
            </Switch>
          </AnimatePresence>
        </Layout>
      </AssignmentProvider>
    </NotificationsProvider>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <AuthProvider>
          <UserRoleProvider>
            <AppContent />
          </UserRoleProvider>
        </AuthProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
