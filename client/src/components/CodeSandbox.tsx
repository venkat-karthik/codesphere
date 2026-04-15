import React, { useState, useRef, useEffect } from 'react';
import Editor from '@monaco-editor/react';
import { PanelGroup, Panel, PanelResizeHandle } from 'react-resizable-panels';
import { Button } from '@/components/ui/button';
import { Play, Terminal, FilePlus2, X, Eye } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface CodeFile {
  id: string;
  name: string;
  language: string;
  content: string;
}

export function CodeSandbox() {
  const initialFiles: CodeFile[] = [
    {
      id: 'file-1',
      name: 'script.js',
      language: 'javascript',
      content: `console.log("Hello, CodeSphere Sandbox!");
// Write your JavaScript code here
`
    },
    {
      id: 'file-2',
      name: 'style.css',
      language: 'css',
      content: `body {
  font-family: sans-serif;
  color: #333;
}`
    },
    {
      id: 'file-3',
      name: 'index.html',
      language: 'html',
      content: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>CodeSphere Sandbox Preview</title>
  <style>
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }
    
    body {
      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 20px;
    }
    
    .container {
      max-width: 800px;
      text-align: center;
      background: rgba(255, 255, 255, 0.1);
      padding: 40px;
      border-radius: 20px;
      backdrop-filter: blur(10px);
      border: 1px solid rgba(255, 255, 255, 0.2);
      box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
    }
    
    h1 {
      font-size: 3.5em;
      margin-bottom: 20px;
      text-shadow: 2px 2px 4px rgba(0,0,0,0.3);
      background: linear-gradient(45deg, #fff, #f0f0f0);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
    }
    
    p {
      font-size: 1.3em;
      line-height: 1.8;
      margin-bottom: 15px;
      text-shadow: 1px 1px 2px rgba(0,0,0,0.2);
    }
    
    .features {
      display: flex;
      justify-content: center;
      gap: 20px;
      margin: 30px 0;
      flex-wrap: wrap;
    }
    
    .feature {
      background: rgba(255, 255, 255, 0.2);
      padding: 15px 25px;
      border-radius: 15px;
      border: 1px solid rgba(255, 255, 255, 0.3);
      backdrop-filter: blur(5px);
    }
    
    .button {
      display: inline-block;
      padding: 15px 30px;
      background: linear-gradient(45deg, #ff6b6b, #ee5a24);
      border: none;
      border-radius: 25px;
      color: white;
      text-decoration: none;
      font-size: 1.1em;
      font-weight: bold;
      margin-top: 20px;
      transition: all 0.3s ease;
      box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
    }
    
    .button:hover {
      transform: translateY(-2px);
      box-shadow: 0 6px 20px rgba(0, 0, 0, 0.3);
      background: linear-gradient(45deg, #ee5a24, #ff6b6b);
    }
    
    .code-demo {
      background: rgba(0, 0, 0, 0.3);
      padding: 20px;
      border-radius: 10px;
      margin: 20px 0;
      font-family: 'Courier New', monospace;
      text-align: left;
      border-left: 4px solid #ff6b6b;
    }
  </style>
</head>
<body>
  <div class="container">
    <h1>🚀 CodeSphere Sandbox</h1>
    <p>Welcome to your live HTML preview!</p>
    <p>Edit the code in the editor and watch the changes happen in real-time.</p>
    
    <div class="features">
      <div class="feature">✨ Live Preview</div>
      <div class="feature">🎨 Beautiful UI</div>
      <div class="feature">⚡ Real-time Updates</div>
    </div>
    
    <div class="code-demo">
      &lt;!-- This is a comment --&gt;<br>
      &lt;h1&gt;Hello World!&lt;/h1&gt;<br>
      &lt;p&gt;Your code here&lt;/p&gt;
    </div>
    
    <a href="#" class="button">Start Coding Now</a>
  </div>
  
  <script>
    // Add some interactivity
    document.querySelector('.button').addEventListener('click', function(e) {
      e.preventDefault();
      this.style.transform = 'scale(0.95)';
      setTimeout(() => {
        this.style.transform = '';
      }, 150);
    });
    
    // Add a simple animation
    const features = document.querySelectorAll('.feature');
    features.forEach((feature, index) => {
      feature.style.animationDelay = index * 0.2 + 's';
      feature.style.animation = 'fadeInUp 0.6s ease forwards';
    });
    
    // Add CSS animation
    const style = document.createElement('style');
    style.textContent = \`
      @keyframes fadeInUp {
        from {
          opacity: 0;
          transform: translateY(20px);
        }
        to {
          opacity: 1;
          transform: translateY(0);
        }
      }
    \`;
    document.head.appendChild(style);
  </script>
</body>
</html>`
    },
    {
      id: 'file-4',
      name: 'main.py',
      language: 'python',
      content: `def greet(name):
    return f"Hello, {name}!"

print(greet("Python User"))`
    }
  ];

  const [files, setFiles] = useState<CodeFile[]>(initialFiles);
  const [activeFileId, setActiveFileId] = useState<string>(initialFiles[0].id);
  const [output, setOutput] = useState('');
  const [showPreview, setShowPreview] = useState(false);
  const outputRef = useRef<HTMLDivElement>(null);
  const [isNewFileModalOpen, setIsNewFileModalOpen] = useState(false);
  const [newFileName, setNewFileName] = useState('');
  const [newFileLanguage, setNewFileLanguage] = useState('javascript');

  const activeFile = files.find(f => f.id === activeFileId);

  const handleEditorChange = (value: string | undefined) => {
    if (activeFile) {
      setFiles(files.map(file =>
        file.id === activeFile.id ? { ...file, content: value || '' } : file
      ));
    }
  };

  const getLanguageFromExtension = (filename: string): string => {
    const ext = filename.split('.').pop()?.toLowerCase();
    switch (ext) {
      case 'js': return 'javascript';
      case 'ts': return 'typescript';
      case 'py': return 'python';
      case 'java': return 'java';
      case 'c': return 'c';
      case 'cpp': return 'cpp';
      case 'html': return 'html';
      case 'css': return 'css';
      case 'json': return 'json';
      case 'xml': return 'xml';
      case 'md': return 'markdown';
      default: return 'plaintext';
    }
  };

  const handleCreateNewFile = () => {
    if (!newFileName.trim()) {
      alert('File name cannot be empty.');
      return;
    }
    if (files.some(f => f.name === newFileName)) {
      alert(`File with name "${newFileName}" already exists.`);
      return;
    }

    const newFile: CodeFile = {
      id: `file-${Date.now()}`,
      name: newFileName,
      language: newFileLanguage,
      content: ''
    };
    setFiles([...files, newFile]);
    setActiveFileId(newFile.id);
    setNewFileName('');
    setNewFileLanguage('javascript');
    setIsNewFileModalOpen(false);
  };

  const handleRemoveFile = (id: string) => {
    setFiles(files.filter(file => file.id !== id));
    if (activeFileId === id) {
      setActiveFileId(files[0]?.id || ''); // Fallback to first file or empty
    }
  };

  const runCode = () => {
    if (!activeFile) {
      setOutput('No file selected.');
      return;
    }

    if (activeFile.language !== 'javascript') {
      setOutput(`Execution for ${activeFile.language} is not supported in this client-side sandbox.`);
      return;
    }

    setOutput('Running code...');
    try {
      const originalConsoleLog = console.log;
      const consoleOutput: string[] = [];
      console.log = (...args: any[]) => {
        consoleOutput.push(args.map(arg => String(arg)).join(' '));
      };

      new Function(activeFile.content)();

      console.log = originalConsoleLog;

      setOutput(consoleOutput.join('\n') || 'Code executed successfully. No output.');
    } catch (error: any) {
      setOutput(`Error: ${error.message}`);
      console.error(error);
    }
  };

  useEffect(() => {
    if (outputRef.current) {
      outputRef.current.scrollTop = outputRef.current.scrollHeight;
    }
  }, [output]);

  // Auto-show preview for HTML files
  useEffect(() => {
    if (activeFile?.language === 'html') {
      setShowPreview(true);
    }
  }, [activeFile?.language]);

  if (!activeFile) {
    return (
      <div className="h-[calc(100vh-120px)] flex flex-col items-center justify-center space-y-4 p-6">
        <h2 className="text-2xl font-bold">Code Sandbox</h2>
        <p className="text-muted-foreground">No files open. Create a new file to start coding!</p>
        <Button onClick={() => setIsNewFileModalOpen(true)}>
          <FilePlus2 className="mr-2 h-4 w-4" />
          Create New File
        </Button>
        <Dialog open={isNewFileModalOpen} onOpenChange={setIsNewFileModalOpen}>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Create New File</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="new-file-name">File Name</Label>
                <Input id="new-file-name" value={newFileName} onChange={(e) => setNewFileName(e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="new-file-language">Language</Label>
                <Select value={newFileLanguage} onValueChange={setNewFileLanguage}>
                  <SelectTrigger id="new-file-language">
                    <SelectValue placeholder="Select a language" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="javascript">JavaScript</SelectItem>
                    <SelectItem value="typescript">TypeScript</SelectItem>
                    <SelectItem value="python">Python</SelectItem>
                    <SelectItem value="java">Java</SelectItem>
                    <SelectItem value="html">HTML</SelectItem>
                    <SelectItem value="css">CSS</SelectItem>
                    <SelectItem value="json">JSON</SelectItem>
                    <SelectItem value="xml">XML</SelectItem>
                    <SelectItem value="markdown">Markdown</SelectItem>
                    <SelectItem value="plaintext">Plain Text</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsNewFileModalOpen(false)}>Cancel</Button>
              <Button onClick={handleCreateNewFile}>Create</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    );
  }

  const isHtmlFile = activeFile.language === 'html';

  return (
    <div className="h-[calc(100vh-120px)] flex flex-col p-6 space-y-4">
      <h2 className="text-2xl font-bold">Code Sandbox</h2>
      <p className="text-muted-foreground">Experiment with code in an isolated environment.</p>

      <div className="flex flex-wrap gap-2 mb-4">
        {files.map((file) => (
          <div
            key={file.id}
            className={`flex items-center space-x-2 px-3 py-1 rounded-md text-sm cursor-pointer transition-colors
              ${activeFileId === file.id ? 'bg-primary text-primary-foreground' : 'bg-muted hover:bg-muted-foreground/10'}`}
            onClick={() => setActiveFileId(file.id)}
          >
            <span>{file.name}</span>
            <Button
              variant="ghost"
              size="icon"
              className="h-5 w-5 hover:bg-transparent text-primary-foreground/70 hover:text-primary-foreground"
              onClick={(e) => {
                e.stopPropagation(); // Prevent switching file when closing
                handleRemoveFile(file.id);
              }}
            >
              <X className="h-3 w-3" />
            </Button>
          </div>
        ))}
        <Button size="sm" variant="outline" onClick={() => setIsNewFileModalOpen(true)}>
          <FilePlus2 className="mr-2 h-4 w-4" />
          New File
        </Button>
      </div>

      <PanelGroup direction="vertical">
        <Panel defaultSize={55} minSize={30}>
          <div className="border rounded-lg overflow-hidden h-full flex flex-col">
            <div className="flex items-center justify-between p-2 bg-muted/50 border-b">
              <span className="text-sm font-medium">Editor ({activeFile.language})</span>
              <div className="flex items-center gap-2">
                {isHtmlFile && (
                  <Button 
                    size="sm" 
                    variant={showPreview ? "default" : "outline"}
                    onClick={() => setShowPreview(!showPreview)}
                  >
                    <Eye className="mr-2 h-4 w-4" />
                    {showPreview ? 'Hide' : 'Show'} Preview
                  </Button>
                )}
                <Button size="sm" onClick={runCode}>
                  <Play className="mr-2 h-4 w-4" />
                  Run Code
                </Button>
              </div>
            </div>
            <Editor
              height="100%"
              language={activeFile.language}
              theme="vs-dark"
              value={activeFile.content}
              onChange={handleEditorChange}
              options={{
                minimap: { enabled: false },
                fontSize: 14,
                wordWrap: 'on',
                scrollBeyondLastLine: false,
                overviewRulerLanes: 0,
              }}
            />
          </div>
        </Panel>
        <PanelResizeHandle className="h-2 bg-border flex items-center justify-center cursor-row-resize">
          <div className="w-10 h-1 bg-gray-400 rounded-full"></div>
        </PanelResizeHandle>
        <Panel defaultSize={45} minSize={25}>
          <div className="border rounded-lg overflow-hidden h-full flex flex-col">
            <div className="flex items-center p-2 bg-muted/50 border-b">
              <Terminal className="mr-2 h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-medium">
                {isHtmlFile && showPreview ? 'Preview' : 'Output'}
              </span>
            </div>
            <div
              ref={outputRef}
              className={`flex-1 overflow-auto ${
                isHtmlFile && showPreview 
                  ? 'bg-white' 
                  : 'p-4 font-mono text-sm bg-black text-white whitespace-pre-wrap'
              }`}
            >
              {isHtmlFile && showPreview ? (
                <iframe
                  srcDoc={activeFile.content}
                  className="w-full h-full border-0"
                  title="HTML Preview"
                  sandbox="allow-scripts allow-same-origin"
                  style={{ minHeight: '100%' }}
                />
              ) : (
                output
              )}
            </div>
          </div>
        </Panel>
      </PanelGroup>

      <Dialog open={isNewFileModalOpen} onOpenChange={setIsNewFileModalOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Create New File</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="new-file-name">File Name</Label>
              <Input id="new-file-name" value={newFileName} onChange={(e) => setNewFileName(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="new-file-language">Language</Label>
              <Select value={newFileLanguage} onValueChange={setNewFileLanguage}>
                <SelectTrigger id="new-file-language">
                  <SelectValue placeholder="Select a language" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="javascript">JavaScript</SelectItem>
                  <SelectItem value="typescript">TypeScript</SelectItem>
                  <SelectItem value="python">Python</SelectItem>
                  <SelectItem value="java">Java</SelectItem>
                  <SelectItem value="html">HTML</SelectItem>
                  <SelectItem value="css">CSS</SelectItem>
                  <SelectItem value="json">JSON</SelectItem>
                  <SelectItem value="xml">XML</SelectItem>
                  <SelectItem value="markdown">Markdown</SelectItem>
                  <SelectItem value="plaintext">Plain Text</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsNewFileModalOpen(false)}>Cancel</Button>
            <Button onClick={handleCreateNewFile}>Create</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
} 