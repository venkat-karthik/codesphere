import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Route, Gamepad2, Users, Star, TrendingUp, Code, BookOpen } from "lucide-react";

interface WelcomeProps {
  onOpenAuth: (mode: 'login' | 'register') => void;
}

const features = [
  {
    icon: Route,
    title: "Curated Learning Paths",
    description: "Follow structured roadmaps designed by industry experts to master any technology"
  },
  {
    icon: Gamepad2,
    title: "Gamified Learning",
    description: "Earn XP, maintain streaks, level up, and unlock achievements as you learn"
  },
  {
    icon: Users,
    title: "Community Driven",
    description: "Connect with fellow developers, share knowledge, and learn together"
  },
  {
    icon: Code,
    title: "Daily Challenges",
    description: "Sharpen your skills with coding problems tailored to your level"
  },
  {
    icon: BookOpen,
    title: "Rich Resources",
    description: "Access curated PDFs, videos, and documentation for every topic"
  },
  {
    icon: TrendingUp,
    title: "Progress Tracking",
    description: "Monitor your learning journey with detailed analytics and insights"
  }
];

const stats = [
  { label: "Active Learners", value: "15,432", change: "+234 today" },
  { label: "Courses Completed", value: "89,123", change: "+1,247 today" },
  { label: "Problems Solved", value: "2,341", change: "+156 today" },
  { label: "Countries", value: "145", change: "Worldwide reach" }
];

export default function Welcome({ onOpenAuth }: WelcomeProps) {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-background via-card to-muted">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-purple-600/10"></div>
        <div className="relative min-h-screen flex items-center justify-center px-4">
          <div className="max-w-4xl mx-auto text-center space-y-8">
            {/* Logo */}
            <div className="w-24 h-24 bg-primary rounded-3xl mx-auto mb-8 flex items-center justify-center glow animate-pulse-glow">
              <span className="text-3xl font-bold text-primary-foreground">CS</span>
            </div>

            {/* Main Heading */}
            <div className="space-y-4">
              <h1 className="text-5xl md:text-7xl font-bold leading-tight">
                CodeSphere
                <br />
                <span className="gradient-text">The Ultimate Coding Hub</span>
              </h1>
              <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto">
                A comprehensive, user-centric platform designed to revolutionize the way 
                coders and developers learn, collaborate, and grow.
              </p>
            </div>

            {/* Call to Action */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Button 
                size="lg" 
                className="text-lg px-8 py-6 glow"
                onClick={() => onOpenAuth('register')}
              >
                Get Started →
              </Button>
              <Button 
                variant="outline" 
                size="lg" 
                className="text-lg px-8 py-6"
                onClick={() => onOpenAuth('login')}
              >
                Login
              </Button>
            </div>

            {/* Global Stats */}
            <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-6">
              {stats.map((stat, index) => (
                <div key={index} className="text-center">
                  <div className="text-2xl md:text-3xl font-bold text-primary mb-1">
                    {stat.value}
                  </div>
                  <div className="text-sm text-muted-foreground mb-1">
                    {stat.label}
                  </div>
                  <div className="text-xs text-green-400">
                    {stat.change}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Everything You Need to Master Coding
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              CodeSphere combines all the tools and resources you need in one place
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="card-hover">
                <CardContent className="p-6">
                  <div className="w-12 h-12 bg-primary/20 rounded-xl flex items-center justify-center mb-4">
                    <feature.icon className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
                  <p className="text-muted-foreground">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="py-20 px-4 bg-gradient-to-r from-primary/10 to-purple-600/10">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <h2 className="text-3xl md:text-4xl font-bold">
            Ready to Start Your Coding Journey?
          </h2>
          <p className="text-lg text-muted-foreground">
            Join thousands of developers who are already learning and growing with CodeSphere
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg" 
              className="text-lg px-8 py-6"
              onClick={() => onOpenAuth('register')}
            >
              Create Free Account
            </Button>
            <Button 
              variant="outline" 
              size="lg" 
              className="text-lg px-8 py-6"
              onClick={() => onOpenAuth('login')}
            >
              Sign In
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
