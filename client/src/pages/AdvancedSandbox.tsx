import React, { useState } from 'react';
import MonacoEditor from '@monaco-editor/react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Plus, Trash, Play, Terminal, FileText, Folder, FolderOpen, ChevronDown, ChevronRight, Edit2 } from 'lucide-react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import JSZip from 'jszip';
import QRCode from 'react-qr-code';
import { Tooltip, TooltipProvider } from '@/components/ui/tooltip';
import DOMPurify from 'dompurify';

// Supported languages and their starter files
const LANGUAGE_STARTERS = {
  javascript: {
    'index.js': `console.log('Hello, JavaScript!');`
  },
  python: {
    'main.py': `print('Hello, Python!')`
  },
  html: {
    'index.html': `<!DOCTYPE html>\n<html>\n  <head>\n    <title>Test</title>\n  </head>\n  <body>\n    <h1>Hello, Preview!</h1>\n  </body>\n</html>` ,
    'style.css': `body { background: #222; color: #fff; }` ,
    'script.js': `document.body.append(' (JS works!)');`
  },
  cpp: {
    'main.cpp': `#include <iostream>\nint main() { std::cout << \"Hello, C++!\" << std::endl; return 0; }`
  },
  java: {
    'Main.java': `public class Main { public static void main(String[] args) { System.out.println(\"Hello, Java!\"); } }`
  }
};

const LANGUAGE_LABELS = {
  javascript: 'JavaScript',
  python: 'Python',
  html: 'HTML/CSS/JS',
  cpp: 'C++',
  java: 'Java'
};

function createFileNode({ name, type = 'file', language = '', content = '', children = [] }) {
  return { id: `${type}-${name}-${Date.now()}`, name, type, language, content, children, isOpen: true };
}

const DEFAULT_TREE = [
  {
    id: 'folder-root',
    name: 'project',
    type: 'folder',
    isOpen: true,
    children: [
      createFileNode({ name: 'index.html', language: 'html', content: LANGUAGE_STARTERS.html['index.html'] }),
      createFileNode({ name: 'style.css', language: 'css', content: LANGUAGE_STARTERS.html['style.css'] }),
      createFileNode({ name: 'script.js', language: 'javascript', content: LANGUAGE_STARTERS.html['script.js'] }),
    ]
  }
];

const FILE_LANGUAGES = [
  { label: 'HTML', value: 'html', ext: 'html' },
  { label: 'CSS', value: 'css', ext: 'css' },
  { label: 'JavaScript', value: 'javascript', ext: 'js' },
  { label: 'Python', value: 'python', ext: 'py' },
  { label: 'C++', value: 'cpp', ext: 'cpp' },
  { label: 'Java', value: 'java', ext: 'java' },
];

export default function AdvancedSandbox() {
  const [tree, setTree] = useState(DEFAULT_TREE);
  const [flatView, setFlatView] = useState(false);
  const [activeFileId, setActiveFileId] = useState(tree[0].children[0].id);
  const [output, setOutput] = useState('');
  const [tabKey, setTabKey] = useState('editor');
  const [showAddModal, setShowAddModal] = useState(false);
  const [addType, setAddType] = useState('file');
  const [addFileLang, setAddFileLang] = useState(FILE_LANGUAGES[0].value);
  const [addFileName, setAddFileName] = useState('');
  const [addParentId, setAddParentId] = useState('folder-root');
  const [showRenameModal, setShowRenameModal] = useState(false);
  const [renameId, setRenameId] = useState(null);
  const [renameValue, setRenameValue] = useState('');
  const [renameError, setRenameError] = useState('');
  const [toastMsg, setToastMsg] = useState('');
  const [showImportModal, setShowImportModal] = useState(false);
  const [importText, setImportText] = useState('');
  const [showQRModal, setShowQRModal] = useState(false);
  const [showProjectInfo, setShowProjectInfo] = useState(false);
  const [projectInfo, setProjectInfo] = useState({ name: 'My Project', description: '', tags: '' });
  const [recentProjects, setRecentProjects] = useState(() => JSON.parse(localStorage.getItem('recentProjects') || '[]'));
  const [theme, setTheme] = useState(() => window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
  const [stdinInput, setStdinInput] = useState('');

  // Theme sync
  React.useEffect(() => {
    const mq = window.matchMedia('(prefers-color-scheme: dark)');
    const handler = (e) => setTheme(e.matches ? 'dark' : 'light');
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);

  // Save to recent projects
  React.useEffect(() => {
    const recents = recentProjects.filter(p => p.name !== projectInfo.name);
    localStorage.setItem('recentProjects', JSON.stringify([{ name: projectInfo.name, tree, projectInfo }, ...recents].slice(0, 5)));
  }, [tree, projectInfo]);

  // Helper: find node by id
  function findNodeById(nodes, id) {
    for (const node of nodes) {
      if (node.id === id) return node;
      if (node.children) {
        const found = findNodeById(node.children, id);
        if (found) return found;
      }
    }
    return null;
  }

  // Helper: update node by id
  function updateNodeById(nodes, id, updater) {
    return nodes.map(node => {
      if (node.id === id) return updater(node);
      if (node.children) {
        return { ...node, children: updateNodeById(node.children, id, updater) };
      }
      return node;
    });
  }

  // Helper: delete node by id
  function deleteNodeById(nodes, id) {
    return nodes.filter(node => {
      if (node.id === id) return false;
      if (node.children) {
        node.children = deleteNodeById(node.children, id);
      }
      return true;
    });
  }

  // Helper: flatten tree
  function flattenTree(nodes) {
    let result = [];
    for (const node of nodes) {
      if (node.type === 'file') result.push(node);
      if (node.children) result = result.concat(flattenTree(node.children));
    }
    return result;
  }

  // Helper: reorder array
  function reorder(list, startIndex, endIndex) {
    const result = Array.from(list);
    const [removed] = result.splice(startIndex, 1);
    result.splice(endIndex, 0, removed);
    return result;
  }

  // Helper: move item in tree
  function moveNodeInTree(nodes, sourceId, destinationId) {
    let nodeToMove = null;
    function removeNode(nodes) {
      return nodes.filter(node => {
        if (node.id === sourceId) {
          nodeToMove = node;
          return false;
        }
        if (node.children) node.children = removeNode(node.children);
        return true;
      });
    }
    let newTree = removeNode([...nodes]);
    if (!nodeToMove) return nodes;
    function addNode(nodes) {
      return nodes.map(node => {
        if (node.id === destinationId && node.type === 'folder') {
          return { ...node, children: [...(node.children || []), nodeToMove], isOpen: true };
        }
        if (node.children) return { ...node, children: addNode(node.children) };
        return node;
      });
    }
    return addNode(newTree);
  }

  // Helper: recursively add files/folders to zip
  async function addToZip(zip, nodes, path = '') {
    for (const node of nodes) {
      if (node.type === 'file') {
        zip.file(path + node.name, node.content || '');
      } else if (node.type === 'folder') {
        const folder = zip.folder(path + node.name);
        await addToZip(folder, node.children || [], '');
      }
    }
  }

  // Export as ZIP
  async function handleExportZip() {
    const zip = new JSZip();
    await addToZip(zip, tree);
    const blob = await zip.generateAsync({ type: 'blob' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'project.zip';
    a.click();
    setToastMsg('Project exported as ZIP!');
  }

  // Share project (copy JSON to clipboard)
  async function handleShare() {
    const data = JSON.stringify(tree);
    await navigator.clipboard.writeText(data);
    setToastMsg('Project JSON copied to clipboard!');
  }

  // Toast message
  React.useEffect(() => {
    if (toastMsg) {
      const t = setTimeout(() => setToastMsg(''), 2000);
      return () => clearTimeout(t);
    }
  }, [toastMsg]);

  function handleShowAddFile(parentId = 'folder-root') {
    setShowAddModal(true);
    setAddType('file');
    setAddParentId(parentId);
    setAddFileLang(FILE_LANGUAGES[0].value);
    setAddFileName('untitled.' + FILE_LANGUAGES[0].ext);
  }

  function handleAddFile() {
    if (!addFileName.trim()) return;
    const langObj = FILE_LANGUAGES.find(l => l.value === addFileLang);
    const ext = langObj?.ext || 'txt';
    let name = addFileName;
    if (!name.endsWith('.' + ext)) name += '.' + ext;
    const newNode = createFileNode({ name, type: 'file', language: addFileLang, content: '' });
    setTree(updateNodeById(tree, addParentId, node => ({ ...node, children: [...(node.children || []), newNode], isOpen: true })));
    setShowAddModal(false);
    setAddFileName('');
  }

  function handleShowRename(node) {
    setShowRenameModal(true);
    setRenameId(node.id);
    setRenameValue(node.name);
    setRenameError('');
  }

  function handleRename() {
    if (!renameValue.trim()) {
      setRenameError('Name cannot be empty');
      return;
    }
    // Prevent duplicate names in the same folder
    function isDuplicate(nodes, id, name) {
      for (const node of nodes) {
        if (node.id === id) return false;
        if (node.name === name) return true;
        if (node.children && isDuplicate(node.children, id, name)) return true;
      }
      return false;
    }
    if (isDuplicate(tree, renameId, renameValue)) {
      setRenameError('Duplicate name in this folder');
      return;
    }
    setTree(updateNodeById(tree, renameId, node => ({ ...node, name: renameValue })));
    setShowRenameModal(false);
    setRenameId(null);
    setRenameValue('');
    setRenameError('');
  }

  // Delete file/folder
  function handleDelete(id) {
    setTree(deleteNodeById(tree, id));
    if (activeFileId === id) setActiveFileId(flattenTree(tree)[0]?.id || null);
  }

  // Tree drag-and-drop handler
  function onTreeDragEnd(result) {
    if (!result.destination) return;
    // Flat view: reorder
    if (flatView) {
      const flat = flattenTree(tree);
      const reordered = reorder(flat, result.source.index, result.destination.index);
      // Rebuild tree as a flat folder
      setTree([{
        ...tree[0],
        children: reordered
      }]);
      return;
    }
    // Tree view: move node
    const sourceId = result.draggableId;
    const destinationId = result.destination.droppableId;
    if (sourceId !== destinationId) {
      setTree(moveNodeInTree(tree, sourceId, destinationId));
    }
  }

  function renderTree(nodes, depth = 0) {
    return (
      <Droppable droppableId={nodes[0]?.id || 'root'} type="NODE">
        {(provided) => (
          <div ref={provided.innerRef} {...provided.droppableProps}>
            {nodes.map((node, idx) => (
              <Draggable key={node.id} draggableId={node.id} index={idx}>
                {(dragProvided, snapshot) => (
                  <div
                    ref={dragProvided.innerRef}
                    {...dragProvided.draggableProps}
                    {...dragProvided.dragHandleProps}
                    style={{
                      marginLeft: depth * 16,
                      background: snapshot.isDragging ? '#ddd' : undefined,
                      ...dragProvided.draggableProps.style
                    }}
                    className="flex items-center py-1 px-2 hover:bg-muted cursor-pointer rounded"
                  >
                    {node.type === 'folder' ? (
                      <>
                        <span onClick={() => setTree(updateNodeById(tree, node.id, n => ({ ...n, isOpen: !n.isOpen })))}>
                          {node.isOpen ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
                        </span>
                        <Folder size={16} className="mx-1" />
                        <span className="font-bold" onClick={() => handleShowAddFile(node.id)}>{node.name}</span>
                        <Button size="icon" variant="ghost" onClick={() => handleShowRename(node)}><Edit2 size={12} /></Button>
                        <Button size="icon" variant="ghost" onClick={() => handleDelete(node.id)}><Trash size={12} /></Button>
                      </>
                    ) : (
                      <>
                        <FileText size={16} className="mx-1" />
                        <span className="flex-1 truncate" onClick={() => setActiveFileId(node.id)}>{node.name}</span>
                        <Button size="icon" variant="ghost" onClick={() => handleShowRename(node)}><Edit2 size={12} /></Button>
                        <Button size="icon" variant="ghost" onClick={() => handleDelete(node.id)}><Trash size={12} /></Button>
                      </>
                    )}
                    {node.children && node.isOpen && renderTree(node.children, depth + 1)}
                  </div>
                )}
              </Draggable>
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    );
  }

  function renderFlatList() {
    const flat = flattenTree(tree);
    return (
      <Droppable droppableId="flat-list" type="NODE">
        {(provided) => (
          <div ref={provided.innerRef} {...provided.droppableProps}>
            {flat.map((node, idx) => (
              <Draggable key={node.id} draggableId={node.id} index={idx}>
                {(dragProvided, snapshot) => (
                  <div
                    ref={dragProvided.innerRef}
                    {...dragProvided.draggableProps}
                    {...dragProvided.dragHandleProps}
                    style={{
                      background: snapshot.isDragging ? '#ddd' : undefined,
                      ...dragProvided.draggableProps.style
                    }}
                    className="flex items-center px-3 py-2 cursor-pointer hover:bg-muted rounded"
                  >
                    <FileText size={16} className="mr-2" />
                    <span className="flex-1 truncate" onClick={() => setActiveFileId(node.id)}>{node.name}</span>
                    <Button size="icon" variant="ghost" onClick={() => handleShowRename(node)}><Edit2 size={12} /></Button>
                    <Button size="icon" variant="ghost" onClick={() => handleDelete(node.id)}><Trash size={12} /></Button>
                  </div>
                )}
              </Draggable>
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    );
  }

  // Get active file
  const activeFile = flattenTree(tree).find(f => f.id === activeFileId);

  // Import logic
  async function handleImport() {
    try {
      let importedTree = null;
      if (importText.trim().startsWith('{')) {
        importedTree = JSON.parse(importText);
      } else {
        // Try to parse as base64 ZIP
        const zip = await JSZip.loadAsync(importText, { base64: true });
        const newTree = [];
        await Promise.all(Object.keys(zip.files).map(async (filename) => {
          const file = zip.files[filename];
          if (!file.dir) {
            newTree.push(createFileNode({ name: filename, content: await file.async('string') }));
          }
        }));
        importedTree = [{ id: 'folder-root', name: 'imported', type: 'folder', isOpen: true, children: newTree }];
      }
      setTree(importedTree);
      setShowImportModal(false);
      setToastMsg('Project imported!');
    } catch (e) {
      setToastMsg('Import failed!');
    }
  }

  // Import from file
  async function handleImportFile(e) {
    const file = e.target.files[0];
    if (!file) return;
    if (file.name.endsWith('.json')) {
      const text = await file.text();
      setImportText(text);
    } else if (file.name.endsWith('.zip')) {
      const zip = await JSZip.loadAsync(await file.arrayBuffer());
      const newTree = [];
      await Promise.all(Object.keys(zip.files).map(async (filename) => {
        const file = zip.files[filename];
        if (!file.dir) {
          newTree.push(createFileNode({ name: filename, content: await file.async('string') }));
        }
      }));
      setTree([{ id: 'folder-root', name: 'imported', type: 'folder', isOpen: true, children: newTree }]);
      setShowImportModal(false);
      setToastMsg('Project imported from ZIP!');
    }
  }

  // Status bar (file info, cursor, language)
  const [cursor, setCursor] = useState({ line: 1, column: 1 });
  function handleEditorChange(val, ev) {
    setTree(updateNodeById(tree, activeFile.id, node => ({ ...node, content: val ?? '' })));
    if (ev?.position) setCursor({ line: ev.position.lineNumber, column: ev.position.column });
  }

  // Keyboard shortcuts
  React.useEffect(() => {
    function handler(e) {
      if (e.ctrlKey && e.key === 'o') { setShowImportModal(true); e.preventDefault(); }
      if (e.ctrlKey && e.key === 'e') { handleExportZip(); e.preventDefault(); }
      if (e.ctrlKey && e.key === 's') { handleShare(); e.preventDefault(); }
      if (e.ctrlKey && e.key === 'i') { setShowProjectInfo(true); e.preventDefault(); }
    }
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, []);

  function getFileByPath(tree, path) {
    // Normalize path (remove leading ./ or /)
    path = path.replace(/^\.\/?/, '').replace(/^\//, '');
    function search(nodes, segments) {
      if (!segments.length) return null;
      const [head, ...rest] = segments;
      for (const node of nodes) {
        if (node.name === head) {
          if (rest.length === 0) return node;
          if (node.children) return search(node.children, rest);
        }
      }
      return null;
    }
    return search(tree, path.split('/'));
  }

  function getAllFiles(tree) {
    let files = [];
    for (const node of tree) {
      if (node.type === 'file') files.push(node);
      if (node.children) files = files.concat(getAllFiles(node.children));
    }
    return files;
  }

  return (
    <div className={`flex h-[calc(100vh-60px)] ${theme === 'dark' ? 'bg-[#18122B]' : 'bg-white'}`}>
      {/* Sidebar/File Explorer */}
      <TooltipProvider>
        <div className="w-64 bg-muted border-r flex flex-col">
          {/* Actions Row */}
          <div className="flex gap-2 px-2 pt-3 pb-2 border-b overflow-x-auto scrollbar-thin scrollbar-thumb-rounded scrollbar-thumb-muted-foreground/30">
            <Tooltip content="Export as ZIP"><Button size="icon" variant="ghost" onClick={handleExportZip}><svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M12 17v-6m0 0l-3 3m3-3l3 3"/><rect x="3" y="3" width="18" height="18" rx="2"/></svg></Button></Tooltip>
            <Tooltip content="Share (Copy JSON)"><Button size="icon" variant="ghost" onClick={handleShare}><svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><path d="M8.59 13.51l6.83 3.98M15.41 6.51l-6.82 3.98"/></svg></Button></Tooltip>
            <Tooltip content="Share via QR Code"><Button size="icon" variant="ghost" onClick={() => setShowQRModal(true)}><svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><rect x="3" y="3" width="7" height="7" rx="1.5"/><rect x="14" y="3" width="7" height="7" rx="1.5"/><rect x="14" y="14" width="7" height="7" rx="1.5"/><rect x="3" y="14" width="7" height="7" rx="1.5"/></svg></Button></Tooltip>
            <Tooltip content="Import Project"><Button size="icon" variant="ghost" onClick={() => setShowImportModal(true)}><svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M12 19V5m0 0l-7 7m7-7l7 7"/></svg></Button></Tooltip>
            <Tooltip content="Project Info"><Button size="icon" variant="ghost" onClick={() => setShowProjectInfo(true)}><svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4M12 8h.01"/></svg></Button></Tooltip>
          </div>
          <div className="border-b my-1" />
          {/* File Explorer Header */}
          <div className="flex items-center justify-between px-2 py-2">
            <span className="font-bold text-sm">Files</span>
            <div className="flex gap-2">
              <Button size="icon" variant="ghost" onClick={() => handleShowAddFile('folder-root')}><Plus size={16} /></Button>
              <Button size="icon" variant="ghost" onClick={() => setFlatView(v => !v)}>{flatView ? <FolderOpen size={16} /> : <FileText size={16} />}</Button>
            </div>
          </div>
          <DragDropContext onDragEnd={onTreeDragEnd}>
            <div className="flex-1 overflow-y-auto">
              {flatView ? renderFlatList() : renderTree(tree)}
            </div>
          </DragDropContext>
          {/* Recent Projects */}
          <div className="p-2 border-t">
            <div className="font-bold text-xs mb-1">Recent Projects</div>
            {recentProjects.map((p, i) => (
              <div key={i} className="text-xs cursor-pointer hover:underline" onClick={() => { setTree(p.tree); setProjectInfo(p.projectInfo); }}>{p.name}</div>
            ))}
          </div>
        </div>
      </TooltipProvider>
      {/* Main Area (Editor, Preview, etc.) */}
      <div className="flex-1 flex flex-col">
        {/* Project Info Bar */}
        <div className="flex items-center justify-between px-4 py-2 border-b bg-background/80 animate-fade-in">
          <div>
            <span className="font-bold text-lg mr-4">{projectInfo.name}</span>
            <span className="text-muted-foreground text-sm">{projectInfo.description}</span>
            <span className="ml-2 text-xs bg-primary/10 px-2 py-1 rounded">{projectInfo.tags}</span>
          </div>
          <Button size="sm" variant="outline" onClick={() => setShowProjectInfo(true)}>Edit Info</Button>
        </div>
        {/* Tabs, Editor, Preview, etc. */}
        <Tabs value={tabKey} onValueChange={setTabKey} className="flex-1 flex flex-col">
          <TabsList className="flex gap-2 p-2 border-b bg-background">
            <TabsTrigger value="editor"><FileText size={16} className="mr-1 animate-bounce" />Editor</TabsTrigger>
            <TabsTrigger value="preview"><Play size={16} className="mr-1 animate-spin" />Preview</TabsTrigger>
            <TabsTrigger value="terminal"><Terminal size={16} className="mr-1 animate-pulse" />Terminal</TabsTrigger>
          </TabsList>
          <TabsContent value="editor" className="flex-1">
            {activeFile && (
              <MonacoEditor
                height="calc(60vh - 40px)"
                language={activeFile.language || 'javascript'}
                value={activeFile.content || ''}
                onChange={handleEditorChange}
                theme={theme === 'dark' ? 'vs-dark' : 'light'}
                options={{ fontSize: 15, minimap: { enabled: true }, wordWrap: 'on' }}
              />
            )}
          </TabsContent>
          <TabsContent value="preview" className="flex-1">
            <div className="p-4 h-full animate-fade-in">
              {/* Enhanced live preview for HTML projects */}
              {activeFile && activeFile.language === 'html' ? (
                (() => {
                  const allFiles = getAllFiles(tree);
                  const htmlFile = activeFile;
                  let srcDoc = htmlFile.content;
                  let warnings = [];
                  // Inline CSS <link rel="stylesheet" href="...">
                  srcDoc = srcDoc.replace(/<link[^>]+rel=["']stylesheet["'][^>]+href=["']([^"']+)["'][^>]*>/gi, (match, href) => {
                    const cssFile = getFileByPath(tree, href);
                    if (cssFile && cssFile.content) {
                      return `<style>\n${cssFile.content}\n</style>`;
                    } else {
                      warnings.push(`Missing CSS: ${href}`);
                      return `<!-- Missing CSS: ${href} -->`;
                    }
                  });
                  // Inline JS <script src="..."></script>
                  srcDoc = srcDoc.replace(/<script[^>]+src=["']([^"']+)["'][^>]*><\/script>/gi, (match, src) => {
                    const jsFile = getFileByPath(tree, src);
                    if (jsFile && jsFile.content) {
                      return `<script>\n${jsFile.content}\n<\/script>`;
                    } else {
                      warnings.push(`Missing JS: ${src}`);
                      return `<!-- Missing JS: ${src} -->`;
                    }
                  });
                  // Replace <img src="..."> with blob URLs if image exists (not implemented, placeholder)
                  // srcDoc = srcDoc.replace(/<img[^>]+src=["']([^"']+)["'][^>]*>/gi, ...)
                  // Sanitize HTML
                  srcDoc = DOMPurify.sanitize(srcDoc, { ADD_TAGS: ["style", "script"] });
                  return (
                    <>
                      {warnings.length > 0 && (
                        <div className="bg-yellow-100 text-yellow-800 p-2 mb-2 rounded text-xs">
                          {warnings.map(w => <div key={w}>{w}</div>)}
                        </div>
                      )}
                      <iframe
                        title="Live Preview"
                        srcDoc={srcDoc}
                        className="w-full h-[60vh] border rounded bg-white"
                      />
                    </>
                  );
                })()
              ) : (
                <pre className="bg-black text-green-400 p-4 rounded h-[60vh] overflow-auto">{output}</pre>
              )}
            </div>
          </TabsContent>
          <TabsContent value="terminal" className="flex-1">
            <div className="p-4 h-full flex flex-col gap-2 animate-fade-in">
              <div className="flex items-center gap-2">
                <Button onClick={async () => {
                  if (!activeFile) return;
                  setOutput('Running...');
                  try {
                    const res = await fetch('/api/execute', {
                      method: 'POST',
                      headers: { 'Content-Type': 'application/json' },
                      credentials: 'include',
                      body: JSON.stringify({ code: activeFile.content, language: activeFile.language, stdin: stdinInput }),
                    });
                    const data = await res.json();
                    if (!res.ok) {
                      setOutput(`Error: ${data.message}`);
                    } else {
                      const parts = [];
                      if (data.output) parts.push(data.output);
                      if (data.error) parts.push(`--- stderr ---\n${data.error}`);
                      if (data.time) parts.push(`\n[${data.status} | ${data.time}s | ${data.memory}KB]`);
                      setOutput(parts.join('\n') || '(no output)');
                    }
                  } catch (e) {
                    setOutput('Failed to connect to execution server.');
                  }
                }} className="w-fit"><Play size={16} className="mr-1" />Run</Button>
                <span className="text-xs text-muted-foreground">stdin:</span>
                <input
                  className="flex-1 bg-muted border rounded px-2 py-1 text-xs font-mono"
                  placeholder="Optional stdin input..."
                  value={stdinInput}
                  onChange={e => setStdinInput(e.target.value)}
                />
              </div>
              <pre className="bg-black text-green-400 p-4 rounded h-[50vh] overflow-auto">{output}</pre>
            </div>
          </TabsContent>
        </Tabs>
        {/* Status Bar */}
        <div className="flex items-center justify-between px-4 py-1 border-t bg-background/80 text-xs animate-fade-in">
          <span>Ln {cursor.line}, Col {cursor.column}</span>
          <span>{activeFile?.name} ({activeFile?.language})</span>
          <span>Theme: {theme}</span>
        </div>
      </div>
      {/* Toast */}
      {toastMsg && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-black text-white px-4 py-2 rounded shadow-lg z-50 animate-fade-in">{toastMsg}</div>
      )}
      {/* Import Modal */}
      {showImportModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 animate-fade-in">
          <div className="bg-background p-6 rounded shadow-lg w-96">
            <h2 className="font-bold mb-2">Import Project</h2>
            <textarea className="w-full border rounded px-2 py-1 mb-2" rows={4} placeholder="Paste JSON or base64 ZIP here" value={importText} onChange={e => setImportText(e.target.value)} />
            <input type="file" accept=".json,.zip" className="mb-2" onChange={handleImportFile} />
            <div className="flex gap-2">
              <Button size="sm" onClick={handleImport}>Import</Button>
              <Button size="sm" variant="outline" onClick={() => setShowImportModal(false)}>Cancel</Button>
            </div>
          </div>
        </div>
      )}
      {/* QR Code Modal */}
      {showQRModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 animate-fade-in">
          <div className="bg-background p-6 rounded shadow-lg w-96 flex flex-col items-center">
            <h2 className="font-bold mb-2">Share via QR Code</h2>
            <QRCode value={JSON.stringify(tree)} size={200} bgColor={theme === 'dark' ? '#18122B' : '#fff'} fgColor={theme === 'dark' ? '#fff' : '#18122B'} />
            <div className="flex gap-2 mt-4">
              <Button size="sm" onClick={() => setShowQRModal(false)}>Close</Button>
            </div>
          </div>
        </div>
      )}
      {/* Project Info Modal */}
      {showProjectInfo && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 animate-fade-in">
          <div className="bg-background p-6 rounded shadow-lg w-96">
            <h2 className="font-bold mb-2">Project Info</h2>
            <input className="w-full border rounded px-2 py-1 mb-2" placeholder="Project Name" value={projectInfo.name} onChange={e => setProjectInfo(p => ({ ...p, name: e.target.value }))} />
            <input className="w-full border rounded px-2 py-1 mb-2" placeholder="Description" value={projectInfo.description} onChange={e => setProjectInfo(p => ({ ...p, description: e.target.value }))} />
            <input className="w-full border rounded px-2 py-1 mb-4" placeholder="Tags (comma separated)" value={projectInfo.tags} onChange={e => setProjectInfo(p => ({ ...p, tags: e.target.value }))} />
            <div className="flex gap-2">
              <Button size="sm" onClick={() => setShowProjectInfo(false)}>Save</Button>
            </div>
          </div>
        </div>
      )}
      {/* Add File Modal */}
      {showAddModal && addType === 'file' && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-background p-6 rounded shadow-lg w-80">
            <h2 className="font-bold mb-2">Add File</h2>
            <div className="mb-2">
              <label className="block text-xs mb-1">Language/Type</label>
              <select
                className="w-full border rounded px-2 py-1"
                value={addFileLang}
                onChange={e => {
                  setAddFileLang(e.target.value);
                  const ext = FILE_LANGUAGES.find(l => l.value === e.target.value)?.ext || 'txt';
                  setAddFileName('untitled.' + ext);
                }}
              >
                {FILE_LANGUAGES.map(lang => (
                  <option key={lang.value} value={lang.value}>{lang.label}</option>
                ))}
              </select>
            </div>
            <div className="mb-4">
              <label className="block text-xs mb-1">File Name</label>
              <input
                className="w-full border rounded px-2 py-1"
                value={addFileName}
                onChange={e => setAddFileName(e.target.value)}
              />
            </div>
            <div className="flex gap-2">
              <Button size="sm" onClick={handleAddFile}>Add</Button>
              <Button size="sm" variant="outline" onClick={() => setShowAddModal(false)}>Cancel</Button>
            </div>
          </div>
        </div>
      )}
      {/* Rename Modal */}
      {showRenameModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-background p-6 rounded shadow-lg w-80">
            <h2 className="font-bold mb-2">Rename</h2>
            <input
              className="w-full border rounded px-2 py-1 mb-2"
              value={renameValue}
              onChange={e => setRenameValue(e.target.value)}
              autoFocus
            />
            {renameError && <div className="text-red-500 text-xs mb-2">{renameError}</div>}
            <div className="flex gap-2">
              <Button size="sm" onClick={handleRename}>Save</Button>
              <Button size="sm" variant="outline" onClick={() => setShowRenameModal(false)}>Cancel</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export { AdvancedSandbox };