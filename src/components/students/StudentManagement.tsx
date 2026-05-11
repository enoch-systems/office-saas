"use client";

import React, { useEffect, useMemo, useState } from "react";
import { fetchStudents, type Student } from "@/data/students";
import { Modal } from "@/components/ui/modal";

type FeedbackState =
  | { type: "success"; message: string }
  | { type: "error"; message: string }
  | null;

export function StudentManagement() {
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortOption, setSortOption] = useState<"latest" | "name">("latest");
  const [feedback, setFeedback] = useState<FeedbackState>(null);
  const [studentToDelete, setStudentToDelete] = useState<Student | null>(null);
  const [deletingStudentId, setDeletingStudentId] = useState<string | null>(null);

  useEffect(() => {
    const loadStudents = async () => {
      try {
        setLoading(true);
        const data = await fetchStudents();
        setStudents(data);
      } catch (error) {
        console.error("Error loading students for management:", error);
        setFeedback({
          type: "error",
          message: "Failed to load students. Please refresh and try again.",
        });
      } finally {
        setLoading(false);
      }
    };

    loadStudents();
  }, []);

  const filteredStudents = useMemo(() => {
    const normalizedSearch = searchTerm.trim().toLowerCase();

    const result = students.filter((student) => {
      if (!normalizedSearch) {
        return true;
      }

      return (
        student.name.toLowerCase().includes(normalizedSearch) ||
        student.email.toLowerCase().includes(normalizedSearch) ||
        student.course.toLowerCase().includes(normalizedSearch) ||
        student.publicStudentId.toLowerCase().includes(normalizedSearch)
      );
    });

    return result.sort((firstStudent, secondStudent) => {
      if (sortOption === "latest") {
        return (
          new Date(secondStudent.timestamp).getTime() -
          new Date(firstStudent.timestamp).getTime()
        );
      }

      return firstStudent.name.localeCompare(secondStudent.name);
    });
  }, [searchTerm, sortOption, students]);

  const handleDeleteStudent = async () => {
    if (!studentToDelete) {
      return;
    }

    setDeletingStudentId(studentToDelete.originalId);
    setFeedback(null);

    try {
      const response = await fetch(`/api/students/${studentToDelete.originalId}`, {
        method: "DELETE",
      });

      const result = await response.json().catch(() => null);

      if (!response.ok) {
        throw new Error(result?.error || "Failed to delete student.");
      }

      setStudents((previousStudents) =>
        previousStudents.filter(
          (student) => student.originalId !== studentToDelete.originalId,
        ),
      );
      setFeedback({
        type: "success",
        message: `${studentToDelete.name} was deleted successfully.`,
      });
      setStudentToDelete(null);
    } catch (error) {
      setFeedback({
        type: "error",
        message:
          error instanceof Error
            ? error.message
            : "Failed to delete student. Please try again.",
      });
    } finally {
      setDeletingStudentId(null);
    }
  };

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      <div className="py-6">
        <div className="mb-8 px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-7xl">
            <div className="rounded-3xl border border-red-200 bg-red-50 p-6 shadow-sm dark:border-red-900/40 dark:bg-red-950/20">
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-red-700 dark:text-red-300">
                Sensitive Data
              </p>
              <h1 className="mt-3 text-2xl font-semibold text-gray-900 dark:text-white sm:text-3xl">
                Student Management
              </h1>
              <p className="mt-3 max-w-3xl text-sm leading-6 text-red-700 dark:text-red-200/90 sm:text-base">
                This page allows permanent student deletion. Please confirm
                details carefully before removing any record from Database.
              </p>
            </div>
          </div>
        </div>

        <div className="mb-6 px-4 sm:px-6 lg:px-8">
          <div className="mx-auto flex max-w-7xl flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="relative w-full sm:max-w-lg lg:max-w-xl">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                <svg
                  className="h-5 w-5 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </div>
              <input
                type="text"
                className="block w-full rounded-lg border border-gray-300 bg-gray-50 py-3 pl-10 pr-3 text-sm text-gray-900 placeholder-gray-500 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-red-500 dark:border-gray-600 dark:bg-gray-800 dark:text-white dark:placeholder-gray-400"
                placeholder="Search by name, email, course, or student ID..."
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}
              />
            </div>

            <div className="relative w-full sm:w-auto">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                <svg
                  className="h-4 w-4 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 4h18M7 12h10m-7 8h4"
                  />
                </svg>
              </div>
              <select
                value={sortOption}
                onChange={(event) =>
                  setSortOption(event.target.value as "latest" | "name")
                }
                className="w-full appearance-none rounded-lg border border-gray-300 bg-gray-50 py-3 pl-10 pr-10 text-sm text-gray-900 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-red-500 dark:border-gray-600 dark:bg-gray-800 dark:text-white"
              >
                <option value="latest">Last to join</option>
                <option value="name">By name</option>
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
                <svg
                  className="h-4 w-4 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </div>
            </div>
          </div>
        </div>

        <div className="mb-6 px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-7xl">
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
              <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-900">
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Total Students
                </p>
                <p className="mt-2 text-3xl font-semibold text-gray-900 dark:text-white">
                  {students.length}
                </p>
              </div>
              <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-900">
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Filtered Results
                </p>
                <p className="mt-2 text-3xl font-semibold text-gray-900 dark:text-white">
                  {filteredStudents.length}
                </p>
              </div>
            </div>
          </div>
        </div>

        {feedback ? (
          <div className="mb-6 px-4 sm:px-6 lg:px-8">
            <div
              className={`mx-auto max-w-7xl rounded-2xl border px-4 py-3 text-sm font-medium ${
                feedback.type === "success"
                  ? "border-emerald-200 bg-emerald-50 text-emerald-800"
                  : "border-red-200 bg-red-50 text-red-700"
              }`}
            >
              {feedback.message}
            </div>
          </div>
        ) : null}

        <div className="px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-7xl overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-900">
            {loading ? (
              <div className="flex items-center justify-center py-16">
                <div className="h-12 w-12 animate-spin rounded-full border-b-2 border-red-600" />
                <span className="ml-3 text-gray-600 dark:text-gray-400">
                  Loading students...
                </span>
              </div>
            ) : filteredStudents.length === 0 ? (
              <div className="py-16 text-center">
                <p className="text-lg font-semibold text-gray-900 dark:text-white">
                  No students found
                </p>
                <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                  Try a different search term or sorting option.
                </p>
              </div>
            ) : (
              <div className="divide-y divide-gray-200 dark:divide-gray-800">
                {filteredStudents.map((student, index) => (
                  <div
                    key={student.originalId}
                    className="flex flex-col gap-5 p-5 sm:p-6 lg:flex-row lg:items-center lg:justify-between"
                  >
                    <div className="flex items-start gap-4">
                      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-gray-900 text-sm font-semibold text-white dark:bg-gray-100 dark:text-gray-900">
                        {index + 1}
                      </div>
                      <div className="min-w-0">
                        <div className="flex flex-wrap items-center gap-2">
                          <h3 className="text-base font-semibold text-gray-900 dark:text-white">
                            {student.name}
                          </h3>
                          <span className="rounded-full bg-gray-100 px-2.5 py-1 text-xs font-medium text-gray-600 dark:bg-gray-800 dark:text-gray-300">
                            {student.publicStudentId}
                          </span>
                        </div>
                        <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                          {student.email}
                        </p>
                        <div className="mt-3 flex flex-wrap gap-3 text-xs text-gray-500 dark:text-gray-400">
                          <span>Phone: {student.phone}</span>
                          <span>Course: {student.course}</span>
                          <span>
                            Joined: {new Date(student.timestamp).toLocaleString()}
                          </span>
                        </div>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => setStudentToDelete(student)}
                      disabled={deletingStudentId === student.originalId}
                      className="inline-flex items-center justify-center rounded-xl bg-red-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      {deletingStudentId === student.originalId
                        ? "Deleting..."
                        : "Delete Student"}
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      <Modal
        isOpen={Boolean(studentToDelete)}
        onClose={() => {
          if (!deletingStudentId) {
            setStudentToDelete(null);
          }
        }}
        className="mx-4 max-w-lg p-6 sm:p-7"
      >
        <div className="pr-10">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-red-600">
            Confirm Delete
          </p>
          <h3 className="mt-3 text-xl font-semibold text-gray-900 dark:text-white">
            Delete this student permanently?
          </h3>
          <p className="mt-3 text-sm leading-6 text-gray-600 dark:text-gray-400">
            This action cannot be undone. The student record and linked data that
            depends on the student ID will be removed from Database forever
          </p>

          {studentToDelete ? (
            <div className="mt-5 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700 dark:border-red-900/40 dark:bg-red-950/20 dark:text-red-200">
              <p className="font-semibold">{studentToDelete.name}</p>
              <p className="mt-1">{studentToDelete.email}</p>
              <p className="mt-1">{studentToDelete.phone}</p>
            </div>
          ) : null}

          <div className="mt-6 flex flex-col gap-3 sm:flex-row">
            <button
              type="button"
              onClick={handleDeleteStudent}
              disabled={Boolean(deletingStudentId)}
              className="inline-flex items-center justify-center rounded-xl bg-red-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {deletingStudentId ? "Deleting student..." : "Yes, Delete Student"}
            </button>
            <button
              type="button"
              onClick={() => setStudentToDelete(null)}
              disabled={Boolean(deletingStudentId)}
              className="inline-flex items-center justify-center rounded-xl border border-gray-300 px-4 py-3 text-sm font-semibold text-gray-700 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-60 dark:border-gray-700 dark:text-gray-200 dark:hover:bg-gray-800"
            >
              Cancel
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}