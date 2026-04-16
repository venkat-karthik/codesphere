import React, { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { pythonTutorial } from '@/data/tutorials/python';
import { cTutorial } from '@/data/tutorials/c';
import { javaTutorial } from '@/data/tutorials/java';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';
import CodeBlock from '@/components/CodeBlock';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { CheckCircle, Trophy } from 'lucide-react';
import { apiRequest } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';

const tutorials = {
  python: pythonTutorial,
  c: cTutorial,
  java: javaTutorial,
};

const TextTutorials = () => {
  const { user, updateUser } = useAuth();
  const { toast } = useToast();
  const qc = useQueryClient();
  const [activeLanguage, setActiveLanguage] = useState('python');
  const [activeTopic, setActiveTopic] = useState(tutorials['python'].topics[0]);
  const [completedCourses, setCompletedCourses] = useState<Set<string>>(() => {
    try { return new Set(JSON.parse(localStorage.getItem(`completed-tutorials-${user?.id}`) || '[]')); }
    catch { return new Set(); }
  });

  const completeMutation = useMutation({
    mutationFn: async (lang: string) => {
      if (!user) throw new Error('Not logged in');
      const xpEarned = 250;
      // Award XP by updating user directly
      const res = await apiRequest('PATCH', `/api/users/${user.id}`, {
        xp: user.xp + xpEarned,
        level: Math.floor((user.xp + xpEarned) / 1000) + 1,
      });
      return { lang, xpEarned, data: await res.json() };
    },
    onSuccess: ({ lang, xpEarned, data }) => {
      updateUser({ xp: data.xp, level: data.level });
      const next = new Set(completedCourses);
      next.add(lang);
      setCompletedCourses(next);
      localStorage.setItem(`completed-tutorials-${user?.id}`, JSON.stringify(Array.from(next)));
      qc.invalidateQueries({ queryKey: [`/api/analytics/users/${user?.id}`] });
      toast({ title: `🎉 Course Complete! +${xpEarned} XP earned` });
    },
    onError: () => toast({ title: 'Failed to record completion', variant: 'destructive' }),
  });

  const handleLanguageChange = (lang: string) => {
    setActiveLanguage(lang);
    setActiveTopic(tutorials[lang].topics[0]);
  };

  const currentTutorial = tutorials[activeLanguage];

  const renderContent = (item: any, index: number) => {
    switch (item.type) {
      case 'header':
        return <h2 key={index} className="text-2xl font-bold mt-6 mb-3">{item.text}</h2>;
      case 'paragraph':
        return <p key={index} className="mb-4 text-base leading-relaxed">{item.text}</p>;
      case 'code':
        return <CodeBlock key={index} language={item.language} code={item.code} />;
      case 'list':
          return (
            <ul key={index} className="list-disc pl-5 mb-4 space-y-2">
                {item.items.map((li, i) => <li key={i} dangerouslySetInnerHTML={{ __html: li }} />)}
            </ul>
          )
      default:
        return null;
    }
  };

  return (
    <div className="flex flex-col h-screen bg-background">
        {/* Language Selection Tabs */}
        <div className="p-4 border-b">
            <Tabs value={activeLanguage} onValueChange={handleLanguageChange} className="w-full">
                <TabsList>
                    <TabsTrigger value="python">Python</TabsTrigger>
                    <TabsTrigger value="c">C</TabsTrigger>
                    <TabsTrigger value="java">Java</TabsTrigger>
                </TabsList>
            </Tabs>
        </div>

        <div className="flex flex-grow overflow-hidden">
            {/* Sidebar */}
            <div className="w-1/4 border-r border-border h-full">
                <ScrollArea className="h-full p-4">
                    <h2 className="text-xl font-bold mb-4">{currentTutorial.title}</h2>
                    <ul>
                        {currentTutorial.topics.map((topic) => (
                        <li key={topic.slug}>
                            <button
                            onClick={() => setActiveTopic(topic)}
                            className={cn(
                                "w-full text-left p-2 rounded-md transition-colors",
                                activeTopic.slug === topic.slug 
                                ? "bg-primary text-primary-foreground" 
                                : "hover:bg-muted"
                            )}
                            >
                            {topic.title}
                            </button>
                        </li>
                        ))}
                    </ul>
                </ScrollArea>
            </div>

            {/* Main Content */}
            <div className="w-3/4 h-full">
                <ScrollArea className="h-full p-8">
                    <Card className='border-none shadow-none'>
                        <CardHeader>
                            <CardTitle className='text-4xl font-extrabold'>{activeTopic.title}</CardTitle>
                        </CardHeader>
                        <CardContent>
                            {activeTopic.content.map(renderContent)}

                            {/* Completion Button */}
                            {activeTopic.slug === tutorials[activeLanguage].topics[tutorials[activeLanguage].topics.length - 1].slug && (
                              <div className="mt-8 pt-6 border-t">
                                {completedCourses.has(activeLanguage) ? (
                                  <div className="flex items-center justify-center gap-2 text-lg font-semibold text-green-500">
                                    <CheckCircle className="h-6 w-6" />
                                    <span>Course Completed! You earned 250 XP.</span>
                                  </div>
                                ) : (
                                  <div className="text-center">
                                    <Trophy className="h-12 w-12 text-yellow-500 mx-auto mb-3" />
                                    <h3 className="text-xl font-bold mb-2">You've reached the end!</h3>
                                    <p className="text-muted-foreground mb-4">Mark this course as complete to earn 250 XP and save your progress.</p>
                                    <Button size="lg"
                                      disabled={!user || completeMutation.isPending}
                                      onClick={() => completeMutation.mutate(activeLanguage)}>
                                      {completeMutation.isPending ? 'Saving...' : 'Mark as Complete — Earn 250 XP'}
                                    </Button>
                                  </div>
                                )}
                              </div>
                            )}
                        </CardContent>
                    </Card>
                </ScrollArea>
            </div>
        </div>
    </div>
  );
};

export default TextTutorials; 