import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { 
  Bot, 
  Send, 
  User, 
  Code, 
  Lightbulb,
  BookOpen,
  MessageCircle,
  Zap
} from 'lucide-react';

interface ChatMessage {
  id: string;
  type: 'user' | 'ai';
  content: string;
  timestamp: Date;
}

interface QuickPrompt {
  id: string;
  title: string;
  description: string;
  prompt: string;
  icon: any;
  category: string;
}

export function Mentor() {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      type: 'ai',
      content: "Hello! I'm your AI coding mentor. I'm here to help you with programming questions, code reviews, debugging, and learning new concepts. What would you like to work on today?",
      timestamp: new Date()
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  const quickPrompts: QuickPrompt[] = [
    {
      id: '1',
      title: 'Code Review',
      description: 'Get feedback on your code',
      prompt: 'Can you review this code and suggest improvements?',
      icon: Code,
      category: 'Review'
    },
    {
      id: '2',
      title: 'Debug Help',
      description: 'Fix bugs and errors',
      prompt: 'I\'m getting an error in my code. Can you help me debug it?',
      icon: Zap,
      category: 'Debug'
    },
    {
      id: '3',
      title: 'Learn Concept',
      description: 'Understand programming concepts',
      prompt: 'Can you explain this programming concept with examples?',
      icon: BookOpen,
      category: 'Learn'
    },
    {
      id: '4',
      title: 'Project Ideas',
      description: 'Get project suggestions',
      prompt: 'Can you suggest some project ideas for my skill level?',
      icon: Lightbulb,
      category: 'Ideas'
    }
  ];

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      type: 'user',
      content: inputMessage,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    const currentInput = inputMessage;
    setInputMessage('');
    setIsTyping(true);

    try {
      // Build history for context (last 10 messages)
      const history = messages.slice(-10).map(m => ({
        role: m.type === 'user' ? 'user' : 'assistant',
        content: m.content,
      }));

      const res = await fetch('/api/mentor/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ message: currentInput, history }),
      });

      let reply: string;
      if (res.ok) {
        const data = await res.json();
        reply = data.reply;
      } else if (res.status === 429) {
        reply = "⏳ You've used your 20 free AI messages this hour. Upgrade to Pro for unlimited access, or try again later.";
      } else if (res.status === 402) {
        reply = "🔒 The AI Mentor is available on Pro and Premium plans. Upgrade your subscription to unlock unlimited AI-powered coding help!";
      } else if (res.status === 503) {
        // OpenAI not configured — use local fallback
        reply = await generateLocalResponse(currentInput);
      } else {
        reply = "I'm having trouble right now. Please try again in a moment.";
      }

      setMessages(prev => [...prev, {
        id: (Date.now() + 1).toString(),
        type: 'ai',
        content: reply,
        timestamp: new Date()
      }]);
    } catch {
      const reply = await generateLocalResponse(currentInput);
      setMessages(prev => [...prev, {
        id: (Date.now() + 1).toString(),
        type: 'ai',
        content: reply,
        timestamp: new Date()
      }]);
    } finally {
      setIsTyping(false);
    }
  };

  const generateLocalResponse = async (userInput: string): Promise<string> => {
    // Enhanced AI responses for various types of questions
    const input = userInput.toLowerCase();
    
    // Handle basic math questions
    if (input.includes('what is') && (input.includes('+') || input.includes('-') || input.includes('*') || input.includes('/') || input.includes('='))) {
      try {
        const mathExpression = input.match(/what is (.+?)(\?|$)/)?.[1];
        if (mathExpression) {
          // Safe math evaluation for basic operations
          const cleanExpression = mathExpression.replace(/[^0-9+\-*/.() ]/g, '');
          if (cleanExpression && /^[0-9+\-*/.() ]+$/.test(cleanExpression)) {
            const result = eval(cleanExpression);
            return `The answer is **${result}**! 🧮

I can help with both math and programming questions! Feel free to ask me about:
• JavaScript, React, Node.js concepts
• Code debugging and optimization  
• Programming best practices
• Algorithm explanations
• Project ideas and guidance

What else would you like to know?`;
          }
        }
      } catch (e) {
        return "I'd be happy to help with that calculation! Could you rephrase it? For example: 'What is 2 + 3' or 'What is 10 * 5'?";
      }
    }
    
    if (input.includes('hello') || input.includes('hi') || input.includes('hey')) {
      return "Hello there! 👋 I'm your AI coding mentor and I'm excited to help you learn!\n\nI can assist you with:\n• Programming concepts and explanations\n• Code reviews and debugging\n• Math problems and calculations\n• Best practices and tips\n• Learning new technologies\n\nWhat would you like to explore today?";
    }
    
    if (input.includes('javascript') || input.includes('js')) {
      return "JavaScript is a versatile programming language! Here are some key concepts:\n\n• **Variables**: Use `let` and `const` instead of `var`\n• **Functions**: Arrow functions `() => {}` and regular functions\n• **Arrays**: Use methods like `.map()`, `.filter()`, `.reduce()`\n• **Objects**: Key-value pairs, destructuring\n• **Async/Await**: For handling promises\n\nWhat specific JavaScript topic would you like to explore?";
    }
    
    if (input.includes('react')) {
      return "React is a powerful UI library! Here's what you should know:\n\n• **Components**: Functional components with hooks\n• **State**: Use `useState` for component state\n• **Effects**: Use `useEffect` for side effects\n• **Props**: Pass data between components\n• **JSX**: Write HTML-like syntax in JavaScript\n\nExample:\n```jsx\nfunction MyComponent() {\n  const [count, setCount] = useState(0);\n  return <button onClick={() => setCount(count + 1)}>Count: {count}</button>;\n}\n```\n\nWhat React concept can I help explain?";
    }
    
    if (input.includes('css') || input.includes('styling')) {
      return "CSS is essential for styling! Here are some modern techniques:\n\n• **Flexbox**: For layout and alignment\n• **Grid**: For complex layouts\n• **Variables**: `--main-color: #007bff;`\n• **Responsive**: Use media queries\n• **Animations**: `transition` and `@keyframes`\n\nExample:\n```css\n.container {\n  display: flex;\n  justify-content: center;\n  align-items: center;\n}\n```\n\nWhat styling challenge are you working on?";
    }
    
    if (input.includes('debug') || input.includes('error') || input.includes('bug')) {
      return "Debugging is a crucial skill! Here's my systematic approach:\n\n1. **Read the error message** carefully\n2. **Check the console** for additional info\n3. **Use console.log()** to trace values\n4. **Break down the problem** into smaller parts\n5. **Test assumptions** one by one\n\nCommon debugging tools:\n• Browser DevTools (F12)\n• console.log() statements\n• Breakpoints in debugger\n• Error boundaries in React\n\nShare your specific error and I'll help you debug it!";
    }
    
    if (input.includes('algorithm') || input.includes('data structure')) {
      return "Algorithms and data structures are fundamental! Here are key concepts:\n\n**Data Structures:**\n• Arrays: Linear collection\n• Objects: Key-value pairs\n• Stacks: LIFO (Last In, First Out)\n• Queues: FIFO (First In, First Out)\n\n**Algorithms:**\n• Sorting: bubble, merge, quick sort\n• Searching: linear, binary search\n• Recursion: Function calling itself\n\nExample recursion:\n```javascript\nfunction factorial(n) {\n  if (n <= 1) return 1;\n  return n * factorial(n - 1);\n}\n```\n\nWhat specific algorithm or data structure interests you?";
    }
    
    if (input.includes('project') || input.includes('idea')) {
      return "Great projects to build your skills:\n\n**Beginner Projects:**\n• Todo List with local storage\n• Calculator with multiple operations\n• Weather app using API\n• Simple blog with posts\n\n**Intermediate Projects:**\n• Social media dashboard\n• E-commerce product catalog\n• Real-time chat application\n• Code editor with syntax highlighting\n\n**Advanced Projects:**\n• Full-stack web application\n• Progressive Web App (PWA)\n• Real-time collaboration tool\n• Machine learning integration\n\nWhat's your current skill level? I can suggest more specific projects!";
    }
    
    // Default intelligent response
    return `I understand you're asking about "${userInput}". While I'd love to provide more detailed assistance, I work best when you ask specific programming questions! 

Here are some great ways to get help:

🔧 **Code Review**: Share code snippets you'd like me to analyze
🐛 **Debugging**: Describe errors you're encountering  
📚 **Learning**: Ask about specific programming concepts
💡 **Projects**: Request project ideas for your skill level

Try asking something like:
• "How do I use React hooks?"
• "Help me debug this JavaScript error"
• "Explain CSS Flexbox with examples"
• "What projects should I build to learn Python?"

What programming topic can I help you with today?`;
  };

  const handleQuickPrompt = (prompt: string) => {
    setInputMessage(prompt);
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold mb-2">AI Mentor</h1>
          <p className="text-muted-foreground">
            Get personalized coding help from your AI assistant
          </p>
        </div>
        <Badge className="bg-green-500/20 text-green-400 flex items-center space-x-1">
          <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
          <span>Online</span>
        </Badge>
      </div>

      <div className="grid lg:grid-cols-4 gap-6">
        {/* Quick Prompts */}
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Quick Start</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {quickPrompts.map((prompt) => (
                <Button
                  key={prompt.id}
                  variant="outline"
                  className="w-full justify-start h-auto p-3"
                  onClick={() => handleQuickPrompt(prompt.prompt)}
                >
                  <div className="flex items-start space-x-2">
                    <prompt.icon className="h-4 w-4 mt-0.5 text-primary" />
                    <div className="text-left">
                      <div className="font-medium text-sm">{prompt.title}</div>
                      <div className="text-xs text-muted-foreground">
                        {prompt.description}
                      </div>
                    </div>
                  </div>
                </Button>
              ))}
            </CardContent>
          </Card>

          {/* Mentor Stats */}
          <Card className="mt-6">
            <CardHeader>
              <CardTitle className="text-lg">Session Stats</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Questions Asked</span>
                <span className="font-semibold">{messages.filter(m => m.type === 'user').length}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Responses</span>
                <span className="font-semibold">{messages.filter(m => m.type === 'ai').length}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Session Time</span>
                <span className="font-semibold">12 min</span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Chat Interface */}
        <div className="lg:col-span-3">
          <Card className="h-[600px] flex flex-col">
            <CardHeader className="border-b">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center">
                  <Bot className="h-6 w-6 text-primary-foreground" />
                </div>
                <div>
                  <CardTitle className="text-lg">CodeSphere AI Mentor</CardTitle>
                  <p className="text-sm text-muted-foreground">Always ready to help</p>
                </div>
              </div>
            </CardHeader>

            {/* Messages */}
            <CardContent className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`flex space-x-2 max-w-[75%] ${
                    message.type === 'user' ? 'flex-row-reverse space-x-reverse' : ''
                  }`}>
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                      message.type === 'user' 
                        ? 'bg-primary text-primary-foreground' 
                        : 'bg-muted'
                    }`}>
                      {message.type === 'user' ? (
                        <User className="h-4 w-4" />
                      ) : (
                        <Bot className="h-4 w-4" />
                      )}
                    </div>
                    <div className={`px-3 py-2 rounded-2xl text-sm break-words whitespace-pre-wrap overflow-wrap-anywhere ${
                      message.type === 'user'
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-muted'
                    }`}>
                      <p className="text-sm leading-relaxed break-words">{message.content}</p>
                      <p className={`text-xs mt-1 ${
                        message.type === 'user' 
                          ? 'text-primary-foreground/70' 
                          : 'text-muted-foreground'
                      }`}>
                        {formatTime(message.timestamp)}
                      </p>
                    </div>
                  </div>
                </div>
              ))}

              {isTyping && (
                <div className="flex justify-start">
                  <div className="flex space-x-2 max-w-[80%]">
                    <div className="w-8 h-8 bg-muted rounded-full flex items-center justify-center">
                      <Bot className="h-4 w-4" />
                    </div>
                    <div className="bg-muted rounded-lg p-3">
                      <div className="flex space-x-1">
                        <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce"></div>
                        <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                        <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>

            {/* Input */}
            <div className="border-t p-4">
              <div className="flex space-x-2">
                <Textarea
                  placeholder="Ask me anything about coding..."
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  className="flex-1 min-h-[40px] max-h-[120px]"
                  onKeyPress={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      handleSendMessage();
                    }
                  }}
                />
                <Button 
                  onClick={handleSendMessage}
                  disabled={!inputMessage.trim() || isTyping}
                  size="icon"
                >
                  <Send className="h-4 w-4" />
                </Button>
              </div>
              <p className="text-xs text-muted-foreground mt-2">
                Press Enter to send, Shift+Enter for new line
              </p>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
