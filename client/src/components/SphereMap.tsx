import React, { useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { GraduationCap, BookOpen, PlayCircle, Code, Lightbulb, Globe as GlobeIcon, Info } from 'lucide-react';
import Globe from 'react-globe.gl';

interface GlobalEvent {
  id: string;
  title: string;
  location: string;
  date: string;
  description: string;
  lat: number;
  lng: number;
  type: 'conference' | 'workshop' | 'hackathon' | 'meetup';
}

const mockGlobalEvents: GlobalEvent[] = [
  {
    id: 'event-1',
    title: 'Global AI Conference',
    location: 'San Francisco',
    date: 'Apr 15, 2024',
    description: 'A leading conference on artificial intelligence and machine learning advancements.',
    lat: 37.7749,
    lng: -122.4194,
    type: 'conference'
  },
  {
    id: 'event-2',
    title: 'International Web Dev Summit',
    location: 'Berlin',
    date: 'May 20, 2024',
    description: 'Bringing together web developers from around the globe to discuss the future of the web.',
    lat: 52.5200,
    lng: 13.4050,
    type: 'conference'
  },
  {
    id: 'event-3',
    title: 'Cybersecurity Forum',
    location: 'London',
    date: 'Jun 10, 2024',
    description: 'Exploring the latest threats and defenses in the world of cybersecurity.',
    lat: 51.5074,
    lng: -0.1278,
    type: 'workshop'
  },
  {
    id: 'event-4',
    title: 'React Native Hackathon',
    location: 'Tokyo',
    date: 'Jul 5, 2024',
    description: 'Build amazing mobile apps with React Native in this 48-hour hackathon.',
    lat: 35.6762,
    lng: 139.6503,
    type: 'hackathon'
  },
  {
    id: 'event-5',
    title: 'DevOps Meetup',
    location: 'Sydney',
    date: 'Aug 12, 2024',
    description: 'Monthly meetup for DevOps professionals to share knowledge and experiences.',
    lat: -33.8688,
    lng: 151.2093,
    type: 'meetup'
  },
  {
    id: 'event-6',
    title: 'Blockchain Development Workshop',
    location: 'Singapore',
    date: 'Sep 8, 2024',
    description: 'Hands-on workshop on building decentralized applications with blockchain technology.',
    lat: 1.3521,
    lng: 103.8198,
    type: 'workshop'
  }
];

export function SphereMap() {
  const globeRef = useRef<any>(null);

  useEffect(() => {
    if (globeRef.current) {
      // Auto-rotate the globe
      globeRef.current.controls().autoRotate = true;
      globeRef.current.controls().autoRotateSpeed = 0.5;
      
      // Set initial camera position
      globeRef.current.pointOfView({
        lat: 20,
        lng: 0,
        altitude: 2.5
      });
    }
  }, []);

  const handleContinueLearning = () => {
    alert('Opening a pathway to new courses! (Future feature)');
  };

  const handleEventInfoClick = (point: any, event: MouseEvent, coords: { lat: number; lng: number; altitude: number }) => {
    const eventData = point as GlobalEvent;
    alert(`Event Details:\nTitle: ${eventData.title}\nLocation: ${eventData.location}\nDate: ${eventData.date}\n\nDescription: ${eventData.description}`);
  };

  const getEventColor = (type: string) => {
    switch (type) {
      case 'conference': return '#ff6b6b';
      case 'workshop': return '#4ecdc4';
      case 'hackathon': return '#45b7d1';
      case 'meetup': return '#96ceb4';
      default: return '#ffa726';
    }
  };

  const getEventIcon = (type: string) => {
    switch (type) {
      case 'conference': return '🎤';
      case 'workshop': return '🔧';
      case 'hackathon': return '💻';
      case 'meetup': return '👥';
      default: return '📅';
    }
  };

  return (
    <div className="space-y-6 p-6">
      <h2 className="text-3xl font-bold mb-4">Your Learning Sphere Map</h2>
      <p className="text-lg text-muted-foreground mb-8">
        Visualize your learning journey and discover new pathways.
      </p>

      <Card className="bg-gradient-to-br from-primary/10 to-purple-500/10 border-primary/20">
        <CardHeader>
          <CardTitle className="text-2xl flex items-center space-x-3">
            <Lightbulb className="h-7 w-7 text-primary" />
            <span>Next Step in Your Journey</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-muted-foreground">
            You've completed the basics of JavaScript. Ready to dive into ReactJS?
            Click below to explore our curated React learning path.
          </p>
          <Button onClick={handleContinueLearning} className="w-full md:w-auto">
            <GraduationCap className="mr-2 h-5 w-5" />
            Continue Learning: ReactJS Fundamentals
          </Button>
        </CardContent>
      </Card>

      {/* Global Coding Insights */}
      <Card className="bg-card/50 backdrop-blur-sm border-border p-6 space-y-6">
        <CardHeader className="p-0">
          <CardTitle className="text-2xl flex items-center space-x-3">
            <GlobeIcon className="h-7 w-7 text-blue-500" />
            <span>Global Coding Insights</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0 grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
          <div className="flex flex-col items-center justify-center space-y-4">
            <div className="relative w-full h-[400px] bg-gradient-to-br from-blue-900/20 to-purple-900/20 rounded-lg border border-blue-200/20">
              <Globe
                ref={globeRef}
                globeImageUrl="//unpkg.com/three-globe/example/img/earth-night.jpg"
                pointsData={mockGlobalEvents}
                pointLabel="title"
                pointColor={(d: any) => getEventColor(d.type)}
                pointAltitude={0.01}
                pointRadius={0.5}
                pointsMerge={false}
                onPointClick={handleEventInfoClick}
                width={400}
                height={400}
                backgroundColor="rgba(0,0,0,0)"
                atmosphereColor="#87CEEB"
                atmosphereAltitude={0.15}
              />
            </div>
            <div className="flex flex-wrap gap-2 justify-center">
              <div className="flex items-center gap-1 text-xs">
                <div className="w-3 h-3 rounded-full bg-red-400"></div>
                <span>Conference</span>
              </div>
              <div className="flex items-center gap-1 text-xs">
                <div className="w-3 h-3 rounded-full bg-teal-400"></div>
                <span>Workshop</span>
              </div>
              <div className="flex items-center gap-1 text-xs">
                <div className="w-3 h-3 rounded-full bg-blue-400"></div>
                <span>Hackathon</span>
              </div>
              <div className="flex items-center gap-1 text-xs">
                <div className="w-3 h-3 rounded-full bg-green-400"></div>
                <span>Meetup</span>
              </div>
            </div>
          </div>
          <div className="space-y-4">
            <h4 className="font-semibold text-lg">Hot Topics & Events</h4>
            <div className="space-y-3 max-h-[400px] overflow-y-auto">
              {mockGlobalEvents.map((event) => (
                <div key={event.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="text-2xl">{getEventIcon(event.type)}</div>
                    <div>
                      <p className="font-medium text-sm">{event.title}</p>
                      <p className="text-xs text-muted-foreground">{event.location} • {event.date}</p>
                      <p className="text-xs text-muted-foreground capitalize">{event.type}</p>
                    </div>
                  </div>
                  <Button variant="outline" size="sm" onClick={() => handleEventInfoClick(event, new MouseEvent('click'), { lat: event.lat, lng: event.lng, altitude: 0 })}>
                    <Info className="h-3 w-3" />
                  </Button>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <BookOpen className="h-5 w-5" />
              <span>Recommended Courses</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="text-muted-foreground">
            <ul className="list-disc list-inside space-y-1">
              <li>Advanced TypeScript</li>
              <li>Node.js Backend Development</li>
              <li>Data Structures & Algorithms</li>
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <PlayCircle className="h-5 w-5" />
              <span>Featured Workshops</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="text-muted-foreground">
            <ul className="list-disc list-inside space-y-1">
              <li>Building RESTful APIs</li>
              <li>Cloud Deployment with AWS</li>
              <li>DevOps Fundamentals</li>
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Code className="h-5 w-5" />
              <span>Challenges & Projects</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="text-muted-foreground">
            <ul className="list-disc list-inside space-y-1">
              <li>E-commerce Platform Project</li>
              <li>Real-time Chat Application</li>
              <li>Portfolio Website Builder</li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 