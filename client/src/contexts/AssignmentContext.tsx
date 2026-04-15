import React, { createContext, useContext, useState, ReactNode } from 'react';

export interface Assignment {
  id: number;
  title: string;
  description: string;
  type: 'assignment' | 'test';
  file?: File | null;
  dueDate: string;
  questions?: TestQuestion[];
  createdAt: Date;
  createdBy: string;
}

export interface TestQuestion {
  question: string;
  options: string[];
  correctAnswer: number;
}

export interface StudentSubmission {
  id: number;
  assignmentId: number;
  studentId: string;
  studentName: string;
  submittedAt: Date;
  answers?: number[]; // For tests: array of selected option indices
  file?: File; // For assignments: uploaded file
  score?: number;
  maxScore?: number;
  feedback?: string;
  status: 'submitted' | 'graded' | 'late';
}

interface AssignmentContextType {
  assignments: Assignment[];
  submissions: StudentSubmission[];
  addAssignment: (assignment: Omit<Assignment, 'id' | 'createdAt'>) => void;
  submitAssignment: (submission: Omit<StudentSubmission, 'id' | 'submittedAt'>) => void;
  getAssignmentsForStudent: (studentId: string) => Assignment[];
  getSubmissionsForStudent: (studentId: string) => StudentSubmission[];
  getSubmissionsForAssignment: (assignmentId: number) => StudentSubmission[];
}

const AssignmentContext = createContext<AssignmentContextType | undefined>(undefined);

export function AssignmentProvider({ children }: { children: ReactNode }) {
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [submissions, setSubmissions] = useState<StudentSubmission[]>([]);

  const addAssignment = (assignmentData: Omit<Assignment, 'id' | 'createdAt'>) => {
    const newAssignment: Assignment = {
      ...assignmentData,
      id: Date.now(),
      createdAt: new Date(),
    };
    setAssignments(prev => [...prev, newAssignment]);
  };

  const submitAssignment = (submissionData: Omit<StudentSubmission, 'id' | 'submittedAt'>) => {
    const newSubmission: StudentSubmission = {
      ...submissionData,
      id: Date.now(),
      submittedAt: new Date(),
    };
    setSubmissions(prev => [...prev, newSubmission]);
  };

  const getAssignmentsForStudent = (studentId: string) => {
    return assignments; // For now, all students see all assignments
  };

  const getSubmissionsForStudent = (studentId: string) => {
    return submissions.filter(sub => sub.studentId === studentId);
  };

  const getSubmissionsForAssignment = (assignmentId: number) => {
    return submissions.filter(sub => sub.assignmentId === assignmentId);
  };

  return (
    <AssignmentContext.Provider value={{
      assignments,
      submissions,
      addAssignment,
      submitAssignment,
      getAssignmentsForStudent,
      getSubmissionsForStudent,
      getSubmissionsForAssignment,
    }}>
      {children}
    </AssignmentContext.Provider>
  );
}

export function useAssignments() {
  const context = useContext(AssignmentContext);
  if (context === undefined) {
    throw new Error('useAssignments must be used within an AssignmentProvider');
  }
  return context;
} 