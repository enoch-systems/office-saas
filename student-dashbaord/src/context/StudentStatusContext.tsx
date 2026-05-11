"use client";
import React, { createContext, useContext, useState, ReactNode } from "react";

type StudentStatus = "None" | "Awaiting" | "Completed";

interface StudentStatusContextType {
  studentStatuses: { [key: number]: StudentStatus };
  updateStudentStatus: (studentId: number, status: StudentStatus) => void;
  getStudentStatus: (studentId: number) => StudentStatus;
}

const StudentStatusContext = createContext<StudentStatusContextType | undefined>(undefined);

export function StudentStatusProvider({ children }: { children: ReactNode }) {
  const [studentStatuses, setStudentStatuses] = useState<{ [key: number]: StudentStatus }>({});

  const updateStudentStatus = (studentId: number, status: StudentStatus) => {
    setStudentStatuses((prev) => ({
      ...prev,
      [studentId]: status,
    }));
  };

  const getStudentStatus = (studentId: number): StudentStatus => {
    return studentStatuses[studentId] || "None";
  };

  return (
    <StudentStatusContext.Provider value={{ studentStatuses, updateStudentStatus, getStudentStatus }}>
      {children}
    </StudentStatusContext.Provider>
  );
}

export function useStudentStatus() {
  const context = useContext(StudentStatusContext);
  if (context === undefined) {
    throw new Error("useStudentStatus must be used within a StudentStatusProvider");
  }
  return context;
}
