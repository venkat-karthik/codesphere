import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Plus, Upload, FileText, ListChecks } from 'lucide-react';
import { useAssignments, Assignment, TestQuestion } from '@/contexts/AssignmentContext';

export function AssignmentManager() {
  const { assignments, addAssignment } = useAssignments();
  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState<{
    title: string;
    description: string;
    type: 'assignment' | 'test';
    file: File | null;
    dueDate: string;
    questions: TestQuestion[];
  }>({
    title: '',
    description: '',
    type: 'assignment',
    file: null,
    dueDate: '',
    questions: [],
  });
  const [questionDraft, setQuestionDraft] = useState<{
    question: string;
    options: string[];
    correctAnswer: number;
  }>({ question: '', options: ['', '', '', ''], correctAnswer: 0 });

  const handleAddAssignment = () => {
    addAssignment({
      title: form.title,
      description: form.description,
      type: form.type,
      file: form.file,
      dueDate: form.dueDate,
      questions: form.type === 'test' ? form.questions : undefined,
      createdBy: 'Admin', // You can replace this with actual user info
    });
    setForm({ title: '', description: '', type: 'assignment', file: null, dueDate: '', questions: [] });
    setModalOpen(false);
    setQuestionDraft({ question: '', options: ['', '', '', ''], correctAnswer: 0 });
  };

  const handleAddQuestion = () => {
    setForm(f => ({ ...f, questions: [...f.questions, { ...questionDraft }] }));
    setQuestionDraft({ question: '', options: ['', '', '', ''], correctAnswer: 0 });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Assignment Management</h2>
        <Button onClick={() => setModalOpen(true)}>
          <Plus className="mr-2 h-4 w-4" /> Add Assignment
        </Button>
      </div>
      <div className="grid md:grid-cols-2 gap-6">
        {assignments.length === 0 && (
          <Card className="col-span-2 text-center py-12">
            <CardContent>
              <FileText className="mx-auto mb-2 h-8 w-8 text-muted-foreground" />
              <div className="text-muted-foreground">No assignments or tests yet.</div>
            </CardContent>
          </Card>
        )}
        {assignments.map(a => (
          <Card key={a.id}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                {a.type === 'test' ? <ListChecks className="h-5 w-5 text-blue-500" /> : <FileText className="h-5 w-5 text-green-500" />}
                {a.title}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="mb-2 text-sm text-muted-foreground">{a.description}</div>
              <div className="mb-2 text-xs">Due: {a.dueDate || 'N/A'}</div>
              {a.file && <div className="mb-2 text-xs">File: {a.file.name}</div>}
              {a.type === 'test' && a.questions && (
                <div className="mt-2">
                  <div className="font-semibold mb-1">Questions:</div>
                  <ol className="list-decimal ml-5 space-y-1">
                    {a.questions.map((q, i) => (
                      <li key={i}>
                        <div>{q.question}</div>
                        <ul className="list-disc ml-5">
                          {q.options.map((opt, j) => (
                            <li key={j} className={q.correctAnswer === j ? 'font-bold text-green-600' : ''}>{opt}</li>
                          ))}
                        </ul>
                      </li>
                    ))}
                  </ol>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Add New {form.type === 'test' ? 'Test' : 'Assignment'}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Title</label>
              <Input value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Description</label>
              <Textarea value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Type</label>
              <select className="w-full border rounded px-2 py-1" value={form.type} onChange={e => setForm(f => ({ ...f, type: e.target.value as 'assignment' | 'test' }))}>
                <option value="assignment">Assignment</option>
                <option value="test">Test</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Due Date</label>
              <Input type="date" value={form.dueDate} onChange={e => setForm(f => ({ ...f, dueDate: e.target.value }))} />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Upload File (optional)</label>
              <Input type="file" onChange={e => setForm(f => ({ ...f, file: e.target.files ? e.target.files[0] : null }))} />
            </div>
            {form.type === 'test' && (
              <div className="border-t pt-4 mt-4">
                <div className="font-semibold mb-2">Add Questions</div>
                <div className="space-y-2">
                  <Input placeholder="Question" value={questionDraft.question} onChange={e => setQuestionDraft(q => ({ ...q, question: e.target.value }))} />
                  {questionDraft.options.map((opt, idx) => (
                    <Input
                      key={idx}
                      placeholder={`Option ${idx + 1}`}
                      value={opt}
                      onChange={e => setQuestionDraft(q => {
                        const newOpts = [...q.options];
                        newOpts[idx] = e.target.value;
                        return { ...q, options: newOpts };
                      })}
                    />
                  ))}
                  <div>
                    <label className="block text-xs mb-1">Correct Answer</label>
                    <select
                      className="w-full border rounded px-2 py-1"
                      value={questionDraft.correctAnswer}
                      onChange={e => setQuestionDraft(q => ({ ...q, correctAnswer: Number(e.target.value) }))}
                    >
                      {questionDraft.options.map((_, idx) => (
                        <option key={idx} value={idx}>{`Option ${idx + 1}`}</option>
                      ))}
                    </select>
                  </div>
                  <Button type="button" variant="outline" onClick={handleAddQuestion}>
                    Add Question
                  </Button>
                </div>
                {form.questions.length > 0 && (
                  <div className="mt-2">
                    <div className="font-semibold">Questions Added:</div>
                    <ol className="list-decimal ml-5">
                      {form.questions.map((q, i) => (
                        <li key={i}>{q.question}</li>
                      ))}
                    </ol>
                  </div>
                )}
              </div>
            )}
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setModalOpen(false)}>Cancel</Button>
              <Button onClick={handleAddAssignment} disabled={!form.title || !form.description || (form.type === 'test' && form.questions.length === 0)}>
                Add {form.type === 'test' ? 'Test' : 'Assignment'}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
} 