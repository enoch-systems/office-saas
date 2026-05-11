"use client";
import React, { useState, useEffect } from "react";
import { fetchStudents, type Student } from "@/data/students";

export function StudentDetails() {
  const [searchTerm, setSearchTerm] = useState("");
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadStudents = async () => {
      try {
        setLoading(true);
        const data = await fetchStudents();
        setStudents(data);
      } catch (err) {
        console.error('Error loading students:', err);
      } finally {
        setLoading(false);
      }
    };
    loadStudents();
  }, []);

  const filteredStudents = students.filter(
    (student) =>
      student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-white dark:bg-gray-900">
        <div className="p-6">
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      <div className="p-6">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl text-gray-900 dark:text-white mb-2">Student Details</h1>
          <p className="text-gray-600 dark:text-gray-400">
            Search and view student information
          </p>
        </div>

        {/* Search Bar */}
        <div className="mb-6">
          <div className="relative max-w-md">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
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
              className="block w-full pl-10 pr-3 py-3 bg-gray-50 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-800 dark:border-gray-600 dark:text-white dark:placeholder-gray-400"
              placeholder="Search by name or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {/* Student List */}
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
          <div className="divide-y divide-gray-200 dark:divide-gray-700">
            {filteredStudents.map((student, index) => (
              <div
                key={student.id}
                className="p-6 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-150"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="w-8 text-sm text-gray-900 dark:text-gray-200 font-medium">
                      {index + 1}
                    </div>
                    <div className="h-10 w-10 flex-shrink-0 ml-4">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-black text-white text-sm font-medium">
                        {student.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")
                          .toUpperCase()}
                      </div>
                    </div>
                    <div className="ml-4">
                      <div className="text-base font-medium text-gray-900 dark:text-white">
                        {student.name}
                      </div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">
                        {student.email}
                      </div>
                    </div>
                  </div>
                  <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors duration-200">
                    View Detail
                  </button>
                </div>
              </div>
            ))}
          </div>

          {filteredStudents.length === 0 && (
            <div className="text-center py-12">
              <div className="text-gray-500 dark:text-gray-400">
                <svg
                  className="mx-auto h-12 w-12 text-gray-400 dark:text-gray-500 mb-3"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <p className="text-gray-900 dark:text-white font-medium">No students found</p>
                <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">
                  Try adjusting your search criteria
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
