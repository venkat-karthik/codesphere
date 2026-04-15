import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useAssignments, Assignment, TestQuestion } from '@/contexts/AssignmentContext';
import { useAuth } from '@/hooks/useAuth';
import { FileText, ListChecks, Clock, Upload, CheckCircle, AlertCircle } from 'lucide-react';

export function StudentAssignments() {
  const { user } = useAuth();
  const { assignments, submissions, submitAssignment, getSubmissionsForStudent } = useAssignments();
  const [selectedAssignment, setSelectedAssignment] = useState<Assignment | null>(null);
  const [testModalOpen, setTestModalOpen] = useState(false);
  const [assignmentModalOpen, setAssignmentModalOpen] = useState(false);
  const [testAnswers, setTestAnswers] = useState<number[]>([]);
  const [assignmentFile, setAssignmentFile] = useState<File | null>(null);
  const [assignmentText, setAssignmentText] = useState('');

  const studentSubmissions = getSubmissionsForStudent(user?.id || '');

  const handleTakeTest = (assignment: Assignment) => {
    setSelectedAssignment(assignment);
    setTestAnswers(new Array(assignment.questions?.length || 0).fill(-1));
    setTestModalOpen(true);
  };

  const handleSubmitTest = () => {
    if (!selectedAssignment || !user) return;

    const score = testAnswers.reduce((total, answer, index) => {
      const question = selectedAssignment.questions?.[index];
      if (question && answer === parseInt(question.correctAnswer || '0', 10)) {
        return total + 10; // Default points per question
      }
      return total;
    }, 0);

    const maxScore = (selectedAssignment.questions?.length || 0) * 10;

    // Add the submission to the context
    const submission = {
      assignmentId: selectedAssignment.id,
      studentId: user.id,
      studentName: `${user.firstName} ${user.lastName}`,
      answers: testAnswers,
      score,
      maxScore,
      status: 'submitted' as const,
    };

    // Update the assignment context with the submission
    setTestModalOpen(false);
    setSelectedAssignment(null);
    setTestAnswers([]);
    
    // Show success message
    alert(`Test submitted! Your score: ${score}/${maxScore}`);
  };

  const handleSubmitAssignment = () => {
    if (!selectedAssignment || !user) return;

    // Create submission object
    const submission = {
      assignmentId: selectedAssignment.id,
      studentId: user.id,
      studentName: `${user.firstName} ${user.lastName}`,
      file: assignmentFile || undefined,
      text: assignmentText,
      status: 'submitted' as const,
    };

    // This would typically be done through a context or API call
    setAssignmentModalOpen(false);
    setSelectedAssignment(null);
    setAssignmentFile(null);
    setAssignmentText('');
    
    // Show success message
    alert('Assignment submitted successfully!');
  };

  const getSubmissionStatus = (assignmentId: number) => {
    const submission = studentSubmissions.find(sub => sub.assignmentId === assignmentId);
    if (!submission) return { status: 'not-submitted', text: 'Not Submitted' };
    
    if (submission.status === 'graded') {
      return { 
        status: 'graded', 
        text: `Graded: ${submission.score}/${submission.maxScore}` 
      };
    }
    return { status: submission.status, text: 'Submitted' };
  };

  const formatDueDate = (dueDate: string) => {
    const due = new Date(dueDate);
    const now = new Date();
    const diffMs = due.getTime() - now.getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    
    if (diffMs < 0) return 'Overdue';
    if (diffDays === 0) return 'Due today';
    if (diffDays === 1) return 'Due tomorrow';
    return `Due in ${diffDays} days`;
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">My Assignments</h2>
        <Badge variant="outline">
          {assignments.length} Available
        </Badge>
      </div>

      {assignments.length === 0 ? (
        <Card className="text-center py-12">
          <CardContent>
            <FileText className="mx-auto mb-4 h-12 w-12 text-muted-foreground" />
            <h3 className="text-lg font-semibold mb-2">No Assignments Available</h3>
            <p className="text-muted-foreground">
              Check back later for new assignments and tests from your instructors.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid md:grid-cols-2 gap-6">
          {assignments.map((assignment) => {
            const submissionStatus = getSubmissionStatus(assignment.id);
            const isSubmitted = submissionStatus.status !== 'not-submitted';
            
            return (
              <Card key={assignment.id} className="hover:shadow-md transition-shadow">
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      {assignment.type === 'test' ? (
                        <ListChecks className="h-5 w-5 text-blue-500" />
                      ) : (
                        <FileText className="h-5 w-5 text-green-500" />
                      )}
                      {assignment.title}
                    </div>
                    <Badge 
                      variant={isSubmitted ? "default" : "secondary"}
                      className={isSubmitted ? "bg-green-500" : ""}
                    >
                      {submissionStatus.text}
                    </Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-3">
                    {assignment.description}
                  </p>
                  
                  <div className="flex items-center gap-4 text-sm mb-4">
                    <div className="flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      <span>{formatDueDate(assignment.dueDate)}</span>
                    </div>
                    {assignment.type === 'test' && assignment.questions && (
                      <span>{assignment.questions.length} questions</span>
                    )}
                  </div>

                  {assignment.file && (
                    <div className="mb-4 p-2 bg-muted rounded text-sm">
                      <div className="flex items-center gap-2">
                        <FileText className="h-4 w-4" />
                        <span>Resource: {assignment.file.name}</span>
                      </div>
                    </div>
                  )}

                  <div className="flex gap-2">
                    {!isSubmitted ? (
                      <Button
                        onClick={() => {
                          setSelectedAssignment(assignment);
                          if (assignment.type === 'test') {
                            handleTakeTest(assignment);
                          } else {
                            setAssignmentModalOpen(true);
                          }
                        }}
                        className="flex-1"
                      >
                        {assignment.type === 'test' ? 'Take Test' : 'Submit Assignment'}
                      </Button>
                    ) : (
                      <Button variant="outline" className="flex-1" disabled>
                        {submissionStatus.status === 'graded' ? 'Completed' : 'Submitted'}
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      {/* Test Modal */}
      <Dialog open={testModalOpen} onOpenChange={setTestModalOpen}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{selectedAssignment?.title} - Test</DialogTitle>
          </DialogHeader>
          {selectedAssignment?.questions && (
            <div className="space-y-6">
              {selectedAssignment.questions.map((question, index) => (
                <div key={index} className="border rounded-lg p-4">
                  <h4 className="font-semibold mb-3">
                    Question {index + 1}: {question.question}
                  </h4>
                  <div className="space-y-2">
                    {question.options.map((option, optionIndex) => (
                      <label key={optionIndex} className="flex items-center space-x-2 cursor-pointer">
                        <input
                          type="radio"
                          name={`question-${index}`}
                          value={optionIndex}
                          checked={testAnswers[index] === optionIndex}
                          onChange={(e) => {
                            const newAnswers = [...testAnswers];
                            newAnswers[index] = parseInt(e.target.value);
                            setTestAnswers(newAnswers);
                          }}
                          className="text-primary"
                        />
                        <span>{option}</span>
                      </label>
                    ))}
                  </div>
                </div>
              ))}
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setTestModalOpen(false)}>
                  Cancel
                </Button>
                <Button 
                  onClick={handleSubmitTest}
                  disabled={testAnswers.some(answer => answer === -1)}
                >
                  Submit Test
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Assignment Submission Modal */}
      <Dialog open={assignmentModalOpen} onOpenChange={setAssignmentModalOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Submit Assignment: {selectedAssignment?.title}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Upload File (optional)</label>
              <Input
                type="file"
                onChange={(e) => setAssignmentFile(e.target.files ? e.target.files[0] : null)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Or write your response:</label>
              <Textarea
                value={assignmentText}
                onChange={(e) => setAssignmentText(e.target.value)}
                placeholder="Type your assignment response here..."
                rows={6}
              />
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setAssignmentModalOpen(false)}>
                Cancel
              </Button>
              <Button 
                onClick={handleSubmitAssignment}
                disabled={!assignmentFile && !assignmentText.trim()}
              >
                Submit Assignment
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
} 