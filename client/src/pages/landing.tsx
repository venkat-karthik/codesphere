import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Route, Users, Gamepad2, Code } from 'lucide-react';

interface LandingProps {
  onAuthModalOpen: (mode: 'login' | 'register') => void;
}

export function Landing({ onAuthModalOpen }: LandingProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-violet-900 flex items-center justify-center p-8">
      <div className="text-center max-w-4xl">
        <div className="mb-8">
          <div className="w-20 h-20 bg-violet-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-2xl shadow-violet-600/30">
            <span className="text-white font-bold text-2xl">CS</span>
          </div>
          <h1 className="text-6xl font-bold mb-6 text-white">
            CodeSphere
            <br />
            <span className="bg-gradient-to-r from-violet-400 to-purple-400 bg-clip-text text-transparent">
              The Ultimate Coding Hub
            </span>
          </h1>
          <p className="text-xl text-slate-300 mb-8 max-w-2xl mx-auto">
            A comprehensive, user-centric platform designed to revolutionize the way coders and developers learn, collaborate, and grow.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              onClick={() => onAuthModalOpen('register')}
              size="lg"
              className="bg-violet-600 hover:bg-violet-700 text-white px-8 py-4 text-lg shadow-lg shadow-violet-600/30"
            >
              Get Started →
            </Button>
            <Button 
              onClick={() => onAuthModalOpen('login')}
              variant="outline"
              size="lg"
              className="border-violet-400 text-violet-400 hover:bg-violet-600 hover:text-white px-8 py-4 text-lg"
            >
              Login
            </Button>
          </div>
        </div>

        {/* Feature Highlights */}
        <div className="grid md:grid-cols-3 gap-8 mt-16">
          <Card className="bg-white/5 backdrop-blur-sm border-white/10 hover:bg-white/10 transition-all duration-300">
            <CardContent className="p-6">
              <div className="w-12 h-12 bg-violet-600 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Route className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-2 text-white">Curated Learning Paths</h3>
              <p className="text-slate-300">Follow structured roadmaps designed by industry experts</p>
            </CardContent>
          </Card>
          
          <Card className="bg-white/5 backdrop-blur-sm border-white/10 hover:bg-white/10 transition-all duration-300">
            <CardContent className="p-6">
              <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Gamepad2 className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-2 text-white">Gamified Learning</h3>
              <p className="text-slate-300">Earn XP, maintain streaks, and level up your skills</p>
            </CardContent>
          </Card>
          
          <Card className="bg-white/5 backdrop-blur-sm border-white/10 hover:bg-white/10 transition-all duration-300">
            <CardContent className="p-6">
              <div className="w-12 h-12 bg-emerald-600 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Users className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-2 text-white">Community Driven</h3>
              <p className="text-slate-300">Connect with peers and learn from experts</p>
            </CardContent>
          </Card>
        </div>

        {/* Additional Features */}
        <div className="mt-16 text-left max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold mb-8 text-center text-white">Everything You Need to Master Coding</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="flex items-start space-x-4">
              <div className="w-8 h-8 bg-violet-600 rounded-full flex items-center justify-center mt-1">
                <Code className="h-4 w-4 text-white" />
              </div>
              <div>
                <h4 className="font-semibold text-white mb-1">Daily Challenges</h4>
                <p className="text-slate-400 text-sm">Solve coding problems and earn XP to level up</p>
              </div>
            </div>
            <div className="flex items-start space-x-4">
              <div className="w-8 h-8 bg-emerald-600 rounded-full flex items-center justify-center mt-1">
                <Route className="h-4 w-4 text-white" />
              </div>
              <div>
                <h4 className="font-semibold text-white mb-1">Structured Roadmaps</h4>
                <p className="text-slate-400 text-sm">Follow proven learning paths to master technologies</p>
              </div>
            </div>
            <div className="flex items-start space-x-4">
              <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center mt-1">
                <Users className="h-4 w-4 text-white" />
              </div>
              <div>
                <h4 className="font-semibold text-white mb-1">Community Support</h4>
                <p className="text-slate-400 text-sm">Get help and share knowledge with fellow developers</p>
              </div>
            </div>
            <div className="flex items-start space-x-4">
              <div className="w-8 h-8 bg-orange-600 rounded-full flex items-center justify-center mt-1">
                <Gamepad2 className="h-4 w-4 text-white" />
              </div>
              <div>
                <h4 className="font-semibold text-white mb-1">Progress Tracking</h4>
                <p className="text-slate-400 text-sm">Monitor your learning journey with detailed analytics</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
