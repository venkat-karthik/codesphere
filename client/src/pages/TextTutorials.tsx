import React, { useState } from 'react';
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
import { CheckCircle } from 'lucide-react';

const tutorials = {
  python: pythonTutorial,
  c: cTutorial,
  java: javaTutorial,
};

const TextTutorials = () => {
  const { user, completeCourse } = useAuth();
  const [activeLanguage, setActiveLanguage] = useState('python');
  const [activeTopic, setActiveTopic] = useState(tutorials[activeLanguage].topics[0]);

  const handleLanguageChange = (lang) => {
    setActiveLanguage(lang);
    setActiveTopic(tutorials[lang].topics[0]);
  }

  const currentTutorial = tutorials[activeLanguage];

  const renderContent = (item, index) => {
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
                                {false ? (
                                  <div className="flex items-center justify-center text-lg font-semibold text-green-500">
                                    <CheckCircle className="h-6 w-6 mr-2" />
                                    <span>Course Completed! You've earned 250 XP.</span>
                                  </div>
                                ) : (
                                  <div className="text-center">
                                    <h3 className="text-xl font-bold mb-2">You've reached the end!</h3>
                                    <p className="text-muted-foreground mb-4">Mark this course as complete to earn 250 XP and save your progress.</p>
                                    <Button size="lg" onClick={() => completeCourse(activeLanguage)}>
                                      Mark as Complete
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