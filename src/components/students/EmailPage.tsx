"use client";
import React, { useState, useEffect, useCallback } from "react";
import { fetchStudents, Student } from "@/data/students";
import { SelectEmailType } from "./SelectEmailType";
import { ConfirmEmailType } from "./ConfirmEmailType";
import { PaymentTypeSelection } from "./PaymentTypeSelection";
import { usePaymentPlan } from "@/context/PaymentPlanContext";
import { getPaymentPlanAmounts } from "@/utils/paymentPlanService";
import { getGroupInfoForCourse, normalizeCourseName } from "@/lib/email-templates";
// import { createAndSendFollowup } from "@/lib/emailFollowup";

interface SentEmailHistoryItem {
  id: string;
  studentId: string;
  studentName: string;
  studentEmail: string;
  courseName: string;
  emailType: string;
  subject: string;
  html: string;
  sentAt: string;
}

export function EmailPage() {
  const { getStudentPaymentPlan } = usePaymentPlan();
  const [searchTerm, setSearchTerm] = useState("");
  const [showSelectEmailModal, setShowSelectEmailModal] = useState(false);
  const [showConfirmEmailModal, setShowConfirmEmailModal] = useState(false);
  const [selectedEmailType, setSelectedEmailType] = useState("");
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [sortOption, setSortOption] = useState<"latest" | "name">("latest");
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [emailMessage, setEmailMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [showPaymentTypeModal, setShowPaymentTypeModal] = useState(false);
  const [selectedPaymentType, setSelectedPaymentType] = useState("");
  const [showEmailHistory, setShowEmailHistory] = useState(false);
  const [historyItems, setHistoryItems] = useState<SentEmailHistoryItem[]>([]);
  const [historyLoading, setHistoryLoading] = useState(false);
  const [historyPagination, setHistoryPagination] = useState({
    page: 1,
    totalPages: 1,
    total: 0,
  });
  const [selectedHistoryEmail, setSelectedHistoryEmail] = useState<SentEmailHistoryItem | null>(null);
  const studentItemsPerPage = 20;
  const historyItemsPerPage = 20;

  const loadStudents = useCallback(async () => {
    try {
      setLoading(true);
      const data = await fetchStudents();
      setStudents(data);
    } catch (err) {
      console.error('Error loading students:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadStudents();
  }, [loadStudents]);

  useEffect(() => {
    const handleRefresh = () => {
      loadStudents();
    };

    window.addEventListener('focus', handleRefresh);
    document.addEventListener('visibilitychange', handleRefresh);

    return () => {
      window.removeEventListener('focus', handleRefresh);
      document.removeEventListener('visibilitychange', handleRefresh);
    };
  }, [loadStudents]);

  // Reset to page 1 when search or filter changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, sortOption]);

  const loadEmailHistory = useCallback(
    async (page = 1, query = searchTerm) => {
      try {
        setHistoryLoading(true);
        const response = await fetch(
          `/api/email-history?page=${page}&limit=${historyItemsPerPage}&query=${encodeURIComponent(query)}&_t=${Date.now()}`,
          { cache: "no-store" },
        );
        const result = await response.json().catch(() => null);

        if (!response.ok || !result?.success) {
          throw new Error(result?.error || "Failed to load email history.");
        }

        setHistoryItems(result.data || []);
        setHistoryPagination({
          page: result.pagination?.page || page,
          totalPages: result.pagination?.totalPages || 1,
          total: result.pagination?.total || 0,
        });
      } catch (error) {
        console.error("Error loading email history:", error);
        setEmailMessage({
          type: "error",
          text: "Failed to load sent email history.",
        });
      } finally {
        setHistoryLoading(false);
      }
    },
    [searchTerm],
  );

  useEffect(() => {
    if (!showEmailHistory) {
      return;
    }
    loadEmailHistory(1, searchTerm);
  }, [showEmailHistory, searchTerm, loadEmailHistory]);

  // Auto-clear email messages after 3 seconds
  useEffect(() => {
    if (emailMessage) {
      const timer = setTimeout(() => {
        setEmailMessage(null);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [emailMessage]);

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

  // Sort students by latest join or by name
  const sortedStudents = [...filteredStudents].sort((a, b) => {
    if (sortOption === "latest") {
      return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime();
    }

    return a.name.localeCompare(b.name);
  });

  // Pagination logic
  const totalPages = Math.ceil(sortedStudents.length / studentItemsPerPage);
  const indexOfLastStudent = currentPage * studentItemsPerPage;
  const indexOfFirstStudent = indexOfLastStudent - studentItemsPerPage;
  const currentStudents = sortedStudents.slice(indexOfFirstStudent, indexOfLastStudent);

  const handlePageChange = (pageNumber: number) => {
    if (showEmailHistory) {
      setHistoryPagination((prev) => ({ ...prev, page: pageNumber }));
      void loadEmailHistory(pageNumber, searchTerm);
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    setCurrentPage(pageNumber);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      handlePageChange(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      handlePageChange(currentPage + 1);
    }
  };

  const handleHistoryPrevPage = () => {
    if (historyPagination.page > 1) {
      handlePageChange(historyPagination.page - 1);
    }
  };

  const handleHistoryNextPage = () => {
    if (historyPagination.page < historyPagination.totalPages) {
      handlePageChange(historyPagination.page + 1);
    }
  };

  const handleSendEmailClick = (student: Student) => {
    setSelectedStudent(student);
    setShowSelectEmailModal(true);
  };

  const currentSelectedPlan = selectedStudent
    ? getStudentPaymentPlan(selectedStudent.originalId)
    : "Select a plan";
  const currentSelectedPlanAmounts = getPaymentPlanAmounts(currentSelectedPlan);

  const handleEmailTypeSelect = (emailType: string) => {
    setSelectedEmailType(emailType);
    setShowSelectEmailModal(false);
    if (emailType === 'payment_confirmation') {
      setShowPaymentTypeModal(true);
    } else {
      setShowConfirmEmailModal(true);
    }
  };

  const handlePaymentTypeSelect = (paymentType: string) => {
    setSelectedPaymentType(paymentType);
    setShowPaymentTypeModal(false);
    setShowConfirmEmailModal(true);
  };

  const getPaymentAmount = (paymentType: string): number => {
    switch (paymentType) {
      case 'Fully Paid':
        return 50000;
      case '1st Installment':
        return 30000;
      case '2nd Installment':
        return 20000;
      default:
        return 0;
    }
  };

  const getPaymentPlanBadgeClasses = (plan: string) => {
    if (plan === "Fully Paid") {
      return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400";
    }

    if (plan === "1st installment") {
      return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400";
    }

    if (plan === "2nd installment") {
      return "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400";
    }

    if (plan === "Not Paid Yet") {
      return "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400";
    }

    return "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400";
  };

  const handleConfirmEmail = async () => {
    try {
      const response = await fetch('/api/send-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          to: selectedStudent?.email,
          emailType: selectedEmailType,
          studentId: selectedStudent?.originalId,
          data: {
            studentName: selectedStudent?.name,
            courseName: selectedStudent?.course || 'Course',
            paymentType: selectedPaymentType,
            amountPaid:
              selectedEmailType === 'payment_confirmation'
                ? getPaymentAmount(selectedPaymentType)
                : (currentSelectedPlanAmounts?.amountPaid ?? selectedStudent?.amountPaid ?? 0),
            paymentDate: new Date().toLocaleDateString('en-GB'),
            startDate: '20th May, 2026',
            balanceRemaining: currentSelectedPlanAmounts?.balanceRemaining ?? selectedStudent?.balanceRemaining ?? 0,
            paymentPlan: currentSelectedPlan,
            resumptionDate: '20th May, 2026',
            lastProgress: selectedStudent?.lastProgress || 'Not started',
          },
        }),
      });

      const result = await response.json();

      if (response.ok) {
        setEmailMessage({
          type: "success",
          text: `${selectedEmailType === "welcome" ? "Welcome" : selectedEmailType === "payment_confirmation" ? "Payment confirmation" : "Group redirection"} email sent successfully to ${selectedStudent?.name}.`,
        });
      } else {
        setEmailMessage({
          type: "error",
          text: `Failed to send email: ${result.error || "Unknown error."}`,
        });
      }
    } catch {
      setEmailMessage({
        type: "error",
        text: "Failed to send email. Please try again.",
      });
    }
    
    setShowConfirmEmailModal(false);
    setSelectedEmailType("");
    setSelectedStudent(null);
  };

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      <div className="p-4 sm:p-6">
        {/* Header */}
        <div className="mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl text-gray-900 dark:text-white mb-2">Email Portal</h1>
          <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400">
            {showEmailHistory ? "Review sent email records and prevent duplicates" : "Search and send emails to students"}
          </p>
        </div>

        {/* Search Bar */}
        <div className="mb-6 flex flex-col sm:flex-row items-center gap-4">
          <div className="relative w-full sm:max-w-md flex-1">
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
              placeholder={showEmailHistory ? "Search sent emails by name, email, type..." : "Search by name or email..."}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
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
              onChange={(e) => setSortOption(e.target.value as "latest" | "name")}
              aria-label="Sort students"
              className="w-full appearance-none pl-10 pr-10 py-3 bg-gray-50 border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-800 dark:border-gray-600 dark:text-white"
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
          <button
            type="button"
            onClick={() => {
              const next = !showEmailHistory;
              setShowEmailHistory(next);
              if (next) {
                setCurrentPage(1);
                void loadEmailHistory(1, searchTerm);
              }
            }}
            className="w-full sm:ml-auto sm:w-auto rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm font-semibold text-gray-700 shadow-sm transition hover:bg-gray-50 hover:shadow dark:border-gray-600 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700"
          >
            <span className="inline-flex items-center justify-center gap-2">
              <span>{showEmailHistory ? "Back to Student List" : "Email Sent History"}</span>
              <svg
                className="h-4 w-4 text-gray-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </span>
          </button>
        </div>

        {/* Email Message Display */}
        {emailMessage && (
          <div className={`mb-4 p-4 rounded-md ${
            emailMessage.type === 'success' 
              ? 'bg-green-50 border border-green-200 text-green-800 dark:bg-green-900/30 dark:border-green-800 dark:text-green-400'
              : 'bg-red-50 border border-red-200 text-red-800 dark:bg-red-900/30 dark:border-red-800 dark:text-red-400'
          }`}>
            <div className="flex items-center">
              {emailMessage.type === 'success' ? (
                <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              ) : (
                <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              )}
              <span className="font-medium">{emailMessage.text}</span>
            </div>
          </div>
        )}

        {/* Student List */}
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
          {!showEmailHistory ? (
            <>
              <div className="divide-y divide-gray-200 dark:divide-gray-700">
                {currentStudents.map((student, index) => (
                  (() => {
                    const currentPlan = getStudentPaymentPlan(student.originalId);

                    return (
                  <div
                    key={student.id}
                    className="p-4 sm:p-6 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-150"
                  >
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                      <div className="flex items-center w-full sm:w-auto">
                        <div className="w-8 text-sm text-gray-900 dark:text-gray-200 font-medium flex-shrink-0">
                          {indexOfFirstStudent + index + 1}
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
                        <div className="ml-4 flex-1 min-w-0">
                          <div className="text-sm sm:text-base font-medium text-gray-900 dark:text-white truncate">
                            {student.name}
                          </div>
                          <div className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 truncate">
                            {student.email}
                          </div>
                          <div className="mt-1 flex flex-wrap items-center gap-2">
                            <div className="text-xs text-gray-400 dark:text-gray-500 truncate">
                              {student.course}
                            </div>
                            <span className={`inline-flex rounded-full px-2 py-0.5 text-[11px] font-semibold ${getPaymentPlanBadgeClasses(currentPlan)}`}>
                              {currentPlan}
                            </span>
                          </div>
                        </div>
                      </div>
                      <button 
                        onClick={() => handleSendEmailClick(student)}
                        className="w-full sm:w-auto px-4 py-2 bg-transparent hover:bg-green-50 text-green-600 border border-green-600 hover:border-green-700 text-sm font-medium rounded-lg transition-colors duration-200 flex items-center justify-center gap-2 dark:text-green-400 dark:border-green-400 dark:hover:bg-green-900/20"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                        </svg>
                        Send Email
                      </button>
                    </div>
                  </div>
                    );
                  })()
                ))}
              </div>

              {currentStudents.length === 0 && (
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
            </>
          ) : (
            <div className="max-h-[560px] overflow-y-auto">
              {historyLoading ? (
                <div className="flex items-center justify-center py-16">
                  <div className="h-10 w-10 animate-spin rounded-full border-2 border-blue-600 border-t-transparent" />
                </div>
              ) : historyItems.length ? (
                <div className="divide-y divide-gray-200 dark:divide-gray-700">
                  {historyItems.map((item, index) => (
                    <div
                      key={item.id}
                      className="p-4 sm:p-5 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                    >
                      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                        <div className="min-w-0">
                          <p className="text-xs text-gray-500 dark:text-gray-400">#{Math.max(1, historyPagination.total - ((historyPagination.page - 1) * historyItemsPerPage + index))}</p>
                          <p className="truncate text-sm font-semibold text-gray-900 dark:text-white">{item.studentName}</p>
                          <p className="truncate text-xs text-gray-500 dark:text-gray-400">{item.studentEmail}</p>
                          <div className="mt-1 flex flex-wrap items-center gap-2">
                            <span className="inline-flex rounded-full bg-blue-100 px-2 py-0.5 text-[11px] font-semibold text-blue-700 dark:bg-blue-900/30 dark:text-blue-300">
                              {item.emailType.replace(/_/g, " ")}
                            </span>
                            <span className="text-xs text-gray-500 dark:text-gray-400">
                              {new Date(item.sentAt).toLocaleString()}
                            </span>
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={() => setSelectedHistoryEmail(item)}
                          className="inline-flex items-center justify-center rounded-lg border border-gray-300 px-3 py-2 text-xs font-medium text-gray-700 transition hover:bg-gray-100 dark:border-gray-600 dark:text-gray-200 dark:hover:bg-gray-600"
                        >
                          View Email
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="py-14 text-center text-sm text-gray-500 dark:text-gray-400">
                  No sent email history found for this search.
                </div>
              )}
            </div>
          )}
        </div>

        {/* Pagination */}
        {!showEmailHistory && totalPages > 1 && (
          <div className="flex flex-col sm:flex-row items-center justify-between px-4 sm:px-6 py-4 border-t border-gray-200 dark:border-gray-700 gap-4">
            <div className="text-sm text-gray-700 dark:text-gray-300 text-center sm:text-left">
              Showing {indexOfFirstStudent + 1} to {Math.min(indexOfLastStudent, filteredStudents.length)} of {filteredStudents.length} students
            </div>
            <div className="flex items-center gap-2 flex-wrap justify-center">
              <button
                onClick={handlePrevPage}
                disabled={currentPage === 1}
                className="px-3 py-1 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
              >
                Prev
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNumber) => (
                <button
                  key={pageNumber}
                  onClick={() => handlePageChange(pageNumber)}
                  className={`px-2 sm:px-3 py-1 text-sm font-medium rounded-md transition-colors duration-200 ${
                    currentPage === pageNumber
                      ? 'bg-blue-600 text-white hover:bg-blue-700'
                      : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700'
                  }`}
                >
                  {pageNumber}
                </button>
              ))}
              <button
                onClick={handleNextPage}
                disabled={currentPage === totalPages}
                className="px-3 py-1 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
              >
                Next
              </button>
            </div>
          </div>
        )}

        {showEmailHistory && historyPagination.totalPages > 1 && (
          <div className="flex flex-col sm:flex-row items-center justify-between px-4 sm:px-6 py-4 border-t border-gray-200 dark:border-gray-700 gap-4">
            <div className="text-sm text-gray-700 dark:text-gray-300 text-center sm:text-left">
              Showing {(historyPagination.page - 1) * historyItemsPerPage + 1}
              {" "}to{" "}
              {Math.min(historyPagination.page * historyItemsPerPage, historyPagination.total)}
              {" "}of {historyPagination.total} sent emails
            </div>
            <div className="flex items-center gap-2 flex-wrap justify-center">
              <button
                onClick={handleHistoryPrevPage}
                disabled={historyPagination.page === 1}
                className="px-3 py-1 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
              >
                Prev
              </button>
              {Array.from({ length: historyPagination.totalPages }, (_, i) => i + 1).slice(0, 8).map((pageNumber) => (
                <button
                  key={pageNumber}
                  onClick={() => handlePageChange(pageNumber)}
                  className={`px-2 sm:px-3 py-1 text-sm font-medium rounded-md transition-colors duration-200 ${
                    historyPagination.page === pageNumber
                      ? 'bg-blue-600 text-white hover:bg-blue-700'
                      : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700'
                  }`}
                >
                  {pageNumber}
                </button>
              ))}
              <button
                onClick={handleHistoryNextPage}
                disabled={historyPagination.page === historyPagination.totalPages}
                className="px-3 py-1 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Email Type Selection Modal */}
      <SelectEmailType
        isOpen={showSelectEmailModal}
        onClose={() => setShowSelectEmailModal(false)}
        onEmailTypeSelect={handleEmailTypeSelect}
        studentName={selectedStudent?.name}
        studentEmail={selectedStudent?.email}
      />

      {/* Payment Type Selection Modal */}
      <PaymentTypeSelection
        isOpen={showPaymentTypeModal}
        onClose={() => setShowPaymentTypeModal(false)}
        onPaymentTypeSelect={handlePaymentTypeSelect}
        studentName={selectedStudent?.name}
      />

      {/* Email Confirmation Modal */}
      <ConfirmEmailType
        isOpen={showConfirmEmailModal}
        onClose={() => setShowConfirmEmailModal(false)}
        onConfirm={handleConfirmEmail}
        emailType={selectedEmailType}
        studentName={selectedStudent?.name}
        studentEmail={selectedStudent?.email}
        previewData={{
          courseName: normalizeCourseName(selectedStudent?.course || ""),
          paymentType: selectedPaymentType,
          amountPaid:
            selectedEmailType === "payment_confirmation"
              ? getPaymentAmount(selectedPaymentType)
              : (currentSelectedPlanAmounts?.amountPaid ?? selectedStudent?.amountPaid ?? 0),
          groupName: getGroupInfoForCourse(selectedStudent?.course).groupInfo.name,
          groupLink: getGroupInfoForCourse(selectedStudent?.course).groupInfo.link,
          startDate: "20th May, 2026",
        }}
      />

      {selectedHistoryEmail ? (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex min-h-screen items-center justify-center p-4 sm:p-6">
            <div
              className="fixed inset-0 bg-black/50"
              onClick={() => setSelectedHistoryEmail(null)}
            />
            <div className="relative w-full max-w-4xl overflow-hidden rounded-xl bg-white shadow-xl dark:bg-gray-800">
              <div className="flex items-center justify-between border-b border-gray-200 px-5 py-4 dark:border-gray-700">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    Sent Email Details
                  </h3>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {selectedHistoryEmail.studentName} ({selectedHistoryEmail.studentEmail}) - {new Date(selectedHistoryEmail.sentAt).toLocaleString()}
                  </p>
                </div>
                <button
                  onClick={() => setSelectedHistoryEmail(null)}
                  className="text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300"
                >
                  <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              <div className="max-h-[70vh] overflow-y-auto p-5">
                <p className="mb-3 text-sm font-semibold text-gray-900 dark:text-white">
                  Subject: {selectedHistoryEmail.subject}
                </p>
                <iframe
                  title="Sent email preview"
                  srcDoc={selectedHistoryEmail.html}
                  className="h-[56vh] w-full rounded-lg border border-gray-200 bg-white dark:border-gray-600"
                />
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
