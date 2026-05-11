"use client";
import React, { useState, useEffect, useRef, useCallback } from "react";
import { fetchStudents, type Student } from "@/data/students";
import { StudentDetailModal } from "./StudentDetailModal";
import { usePaymentPlan, PaymentPlan } from "@/context/PaymentPlanContext";
import {
  PAYMENT_PLAN_OPTIONS,
  isLockedPaymentPlan,
} from "@/utils/paymentPlanService";

export function StudentDatabaseTable() {
  const { updateStudentPaymentPlan, getStudentPaymentPlan } = usePaymentPlan();
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [paymentDropdownOpen, setPaymentDropdownOpen] = useState(false);
  const [selectedPaymentFilter, setSelectedPaymentFilter] = useState<string>("All Students");
  const [openPaymentPlanDropdown, setOpenPaymentPlanDropdown] = useState<number | null>(null);
  const [editablePaymentPlans, setEditablePaymentPlans] = useState<{ [key: number]: boolean }>({});
  const [expandedStudentCards, setExpandedStudentCards] = useState<number | null>(null);
  const [editingStudentId, setEditingStudentId] = useState<number | null>(null);
  const [showEditConfirmModal, setShowEditConfirmModal] = useState(false);
  const [editedPaymentPlans, setEditedPaymentPlans] = useState<{ [key: number]: number }>({});
  const [editMessage, setEditMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [showStudentDetailModal, setShowStudentDetailModal] = useState(false);
  const [selectedStudentId, setSelectedStudentId] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [sortOption, setSortOption] = useState<"latest" | "name">("latest");
  const itemsPerPage = 20;
  const paymentDropdownRef = useRef<HTMLDivElement>(null);
  const paymentPlanDropdownRefs = useRef<{ [key: number]: HTMLDivElement | null }>({});

  // Fetch students from Supabase
  useEffect(() => {
    const loadStudents = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await fetchStudents();
        setStudents(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load students');
        console.error('Error loading students:', err);
      } finally {
        setLoading(false);
      }
    };
  
    loadStudents();
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (paymentDropdownRef.current && !paymentDropdownRef.current.contains(event.target as Node)) {
        setPaymentDropdownOpen(false);
      }
    };
    if (paymentDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [paymentDropdownRef, paymentDropdownOpen]);

  // Auto-clear edited payment plans after 4 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      const now = Date.now();
      setEditedPaymentPlans(prev => {
        const filtered = Object.fromEntries(
          Object.entries(prev).filter(([, timestamp]) => now - timestamp < 4000)
        );
        return filtered;
      });
    }, 1000);
  
    return () => clearInterval(timer);
  }, []);

  // Auto-clear edit messages after 3 seconds
  useEffect(() => {
    if (editMessage) {
      const timer = setTimeout(() => {
        setEditMessage(null);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [editMessage]);

  const setPaymentPlanDropdownRef = useCallback((studentId: number) => (el: HTMLDivElement | null) => {
    paymentPlanDropdownRefs.current[studentId] = el;
  }, []);

  const getStudentPlan = useCallback((student: Student): PaymentPlan => {
    return getStudentPaymentPlan(student.originalId);
  }, [getStudentPaymentPlan]);

  const isStudentPlanLocked = useCallback((student: Student) => {
    return isLockedPaymentPlan(getStudentPlan(student)) && !editablePaymentPlans[student.id];
  }, [editablePaymentPlans, getStudentPlan]);

  const getPaymentPlanBadgeClasses = (plan: PaymentPlan) => {
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

  const getAmountPaidDisplay = (plan: PaymentPlan, showInstallmentHint = false) => {
    if (plan === "Fully Paid") return "₦50,000";
    if (plan === "1st installment") return "₦30,000";
    if (plan === "2nd installment" && showInstallmentHint) {
      return (
        <div>
          <div>₦20,000</div>
          <div className="text-[10px] text-gray-500">+₦30,000<br />1st pay</div>
        </div>
      );
    }
    if (plan === "2nd installment") return "₦20,000";
    return "N/A";
  };

  const getBalanceRemainingDisplay = (plan: PaymentPlan) => {
    if (plan === "Fully Paid") return "₦0";
    if (plan === "1st installment") return "₦20,000";
    if (plan === "2nd installment") return "₦0";
    return "N/A";
  };

  const handlePaymentPlanChange = async (studentId: number, plan: PaymentPlan) => {
    const student = students.find(s => s.id === studentId);
    if (student) {
      if (plan === "Select a plan") {
        setEditMessage({ type: 'error', text: 'Please select a valid payment plan' });
        return;
      }

      try {
        const success = await updateStudentPaymentPlan(student.originalId, plan);
        if (success) {
          setEditMessage({ type: 'success', text: `Payment plan updated to "${plan}" for ${student.name}` });
          setEditablePaymentPlans(prev => ({ ...prev, [studentId]: false }));
        } else {
          setEditMessage({ type: 'error', text: 'Failed to update payment plan. Please try again.' });
        }
      } catch {
        setEditMessage({ type: 'error', text: 'Error updating payment plan. Please try again.' });
      }
    }
    setOpenPaymentPlanDropdown(null);
  };

  const handleEditClick = (studentId: number) => {
    const student = students.find((item) => item.id === studentId);
    if (!student || !isStudentPlanLocked(student)) {
      return;
    }

    setEditingStudentId(studentId);
    setShowEditConfirmModal(true);
  };

  const confirmEdit = () => {
    if (editingStudentId !== null) {
      // Unlock payment plan after editing is confirmed
      setEditablePaymentPlans(prev => ({ ...prev, [editingStudentId]: true }));
      // Open dropdown for immediate editing
      setOpenPaymentPlanDropdown(editingStudentId);
      // Track edited payment plan with timestamp for animation
      setEditedPaymentPlans(prev => ({ ...prev, [editingStudentId]: Date.now() }));
    }
    setShowEditConfirmModal(false);
    setEditingStudentId(null);
  };

  const cancelEdit = () => {
    setShowEditConfirmModal(false);
    setEditingStudentId(null);
  };

  const filteredStudents = students.filter(
    (student) => {
      const matchesSearch = 
        student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.course.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.publicStudentId.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesPaymentFilter = 
        selectedPaymentFilter === "All Students" ||
        getStudentPaymentPlan(student.originalId) === selectedPaymentFilter;
      
      return matchesSearch && matchesPaymentFilter;
    }
  );

  // Calculate gender statistics
  const genderStats = filteredStudents.reduce(
    (acc, student) => {
      if (student.gender === "Male") {
        acc.male++;
      } else if (student.gender === "Female") {
        acc.female++;
      }
      return acc;
    },
    { male: 0, female: 0 }
  );

  // Sort students by latest join or by name
  const sortedStudents = [...filteredStudents].sort((a, b) => {
    if (sortOption === "latest") {
      return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime();
    }

    return a.name.localeCompare(b.name);
  });

  // Pagination logic
  const totalPages = Math.ceil(sortedStudents.length / itemsPerPage);
  const indexOfLastStudent = currentPage * itemsPerPage;
  const indexOfFirstStudent = indexOfLastStudent - itemsPerPage;
  const currentStudents = sortedStudents.slice(indexOfFirstStudent, indexOfLastStudent);

  const handlePageChange = (pageNumber: number) => {
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

  // Reset to page 1 when search or filter changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, selectedPaymentFilter, sortOption]);

  
  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      <div className="py-6">
        {/* Header */}
        <div className="mb-8 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <h1 className="text-2xl sm:text-3xl lg:text-4xl text-gray-900 dark:text-white mb-2 sm:mb-3">
              Student Database
            </h1>
            <p className="text-sm sm:text-base lg:text-lg text-gray-600 dark:text-gray-400 max-w-3xl">
              Manage and view all student information and payment details
            </p>
          </div>
        </div>

        {/* Search Bar */}
        <div className="mb-6 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center gap-4">
            <div className="relative w-full sm:max-w-lg lg:max-w-xl">
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
                className="block w-full pl-10 pr-3 py-3 sm:py-4 bg-gray-50 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-800 dark:border-gray-600 dark:text-white dark:placeholder-gray-400 text-sm sm:text-base"
                placeholder="Search by name, email, course, or student ID..."
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
                className="w-full appearance-none pl-10 pr-10 py-3 sm:py-4 bg-gray-50 border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-800 dark:border-gray-600 dark:text-white text-sm sm:text-base"
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

        {/* Loading State */}
        {loading && (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            <span className="ml-3 text-gray-600 dark:text-gray-400">Loading students...</span>
          </div>
        )}

        {/* Error State */}
        {error && !loading && (
          <div className="mx-4 sm:mx-6 lg:mx-8 mb-6 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
            <div className="flex items-center">
              <svg className="h-5 w-5 text-red-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="text-red-700 dark:text-red-400">{error}</span>
            </div>
          </div>
        )}

        {/* Table */}
        {!loading && !error && (
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
          {/* Table Header */}
          <div className="px-4 sm:px-6 py-4 border-b border-gray-200 dark:border-gray-700 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="text-gray-600 dark:text-gray-400 flex items-center gap-2 sm:gap-4 flex-wrap text-sm">
              <span>Total: <span className="font-semibold text-gray-900 dark:text-white">{filteredStudents.length}</span></span>
              <span className="text-gray-400 hidden sm:inline">|</span>
              <span className="hidden sm:inline">Male: <span className="font-semibold text-blue-600 dark:text-blue-400">{genderStats.male}</span></span>
              <span className="text-gray-400 hidden sm:inline">|</span>
              <span className="hidden sm:inline">Female: <span className="font-semibold text-pink-600 dark:text-pink-400">{genderStats.female}</span></span>
            </div>
            <div className="flex items-center gap-3 w-full sm:w-auto">
              {/* Payment Status Dropdown */}
              <div className="relative w-full sm:w-auto" ref={paymentDropdownRef}>
                <button
                  onClick={() => setPaymentDropdownOpen(!paymentDropdownOpen)}
                  className="w-full sm:w-auto px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 dark:bg-gray-700 dark:hover:bg-gray-600 dark:text-gray-300 rounded-md transition-colors duration-200 text-sm font-medium flex items-center justify-center gap-1"
                >
                  Payment Status
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                
                {paymentDropdownOpen && (
                  <div className="absolute top-full left-0 mt-1 w-40 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-lg shadow-lg z-10">
                    <div className="py-1">
                      <button 
                        onClick={() => {
                          setSelectedPaymentFilter("All Students");
                          setPaymentDropdownOpen(false);
                        }}
                        className="block w-full text-left px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                      >
                        All Students
                      </button>
                      <button 
                        onClick={() => {
                          setSelectedPaymentFilter("Not Paid Yet");
                          setPaymentDropdownOpen(false);
                        }}
                        className="block w-full text-left px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                      >
                        Not Paid Yet
                      </button>
                      <button 
                        onClick={() => {
                          setSelectedPaymentFilter("Fully Paid");
                          setPaymentDropdownOpen(false);
                        }}
                        className="block w-full text-left px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                      >
                        Fully Paid
                      </button>
                      <button 
                        onClick={() => {
                          setSelectedPaymentFilter("1st installment");
                          setPaymentDropdownOpen(false);
                        }}
                        className="block w-full text-left px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                      >
                        1st installment
                      </button>
                      <button 
                        onClick={() => {
                          setSelectedPaymentFilter("2nd installment");
                          setPaymentDropdownOpen(false);
                        }}
                        className="block w-full text-left px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                      >
                        2nd installment
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Edit Message Display */}
          {editMessage && (
            <div className={`mb-4 p-4 rounded-md ${
              editMessage.type === 'success' 
                ? 'bg-green-50 border border-green-200 text-green-800 dark:bg-green-900/30 dark:border-green-800 dark:text-green-400'
                : 'bg-red-50 border border-red-200 text-red-800 dark:bg-red-900/30 dark:border-red-800 dark:text-red-400'
            }`}>
              <div className="flex items-center">
                {editMessage.type === 'success' ? (
                  <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                ) : (
                  <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                )}
                <span className="font-medium">{editMessage.text}</span>
              </div>
            </div>
          )}

          {/* Mobile Card View */}
          <div className="lg:hidden">
            <div className="space-y-4">
              {currentStudents.map((student, index) => (
                <div key={student.id} className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                  {/* Header with NO, Student Name, and Actions */}
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-8 text-sm text-gray-900 dark:text-gray-200 font-medium">
                        {indexOfFirstStudent + index + 1}
                      </div>
                      <div>
                        <div className="text-sm font-medium text-gray-900 dark:text-white">
                          {student.name}
                        </div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">
                          {student.email}
                        </div>
                        <div className="mt-1 inline-flex rounded-full bg-blue-50 px-2.5 py-1 text-[11px] font-semibold tracking-wide text-blue-700 dark:bg-blue-500/10 dark:text-blue-300">
                          {student.publicStudentId}
                        </div>
                      </div>
                    </div>
                    <button 
                      onClick={() => {
                        setSelectedStudentId(student.originalId);
                        setShowStudentDetailModal(true);
                      }}
                      className="inline-flex items-center rounded-full border border-blue-200 bg-blue-50 px-3 py-1.5 text-xs font-semibold text-blue-700 transition-colors duration-200 hover:bg-blue-100 dark:border-blue-500/30 dark:bg-blue-500/10 dark:text-blue-300 dark:hover:bg-blue-500/20"
                    >
                      View Details
                    </button>
                  </div>

                  {/* Payment Plan - Always Visible */}
                  <div className="mb-3">
                    <div className="relative" ref={setPaymentPlanDropdownRef(student.id)}>
                      {(() => {
                        const plan = getStudentPlan(student);
                        const isLocked = isStudentPlanLocked(student);

                        return (
                      <button
                        onClick={() => isLocked ? null : setOpenPaymentPlanDropdown(openPaymentPlanDropdown === student.id ? null : student.id)}
                        disabled={isLocked}
                        className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold items-center gap-1 relative ${getPaymentPlanBadgeClasses(plan)} ${isLocked ? 'opacity-60 cursor-not-allowed' : 'hover:opacity-80 cursor-pointer'} transition-opacity duration-200 ${
                          editedPaymentPlans[student.id] ? 'animate-pulse border-2 border-red-500' : ''
                        }`}
                      >
                        {plan}
                        {!isLocked && (
                          <svg 
                            className={`w-3 h-3 ml-1 transition-transform duration-200 ${
                              openPaymentPlanDropdown === student.id ? 'rotate-180' : ''
                            }`} 
                            fill="none" 
                            stroke="currentColor" 
                            viewBox="0 0 24 24"
                          >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                          </svg>
                        )}
                        {editedPaymentPlans[student.id] && (
                          <svg 
                            className="w-3 h-3 ml-1 text-red-500 animate-bounce"
                            fill="none" 
                            stroke="currentColor" 
                            viewBox="0 0 24 24"
                          >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                          </svg>
                        )}
                      </button>
                        );
                      })()}
                      
                      {openPaymentPlanDropdown === student.id && !isStudentPlanLocked(student) && (
                        <div className="absolute top-full left-0 mt-1 w-40 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-lg shadow-lg z-10">
                          <div className="py-1">
                            {PAYMENT_PLAN_OPTIONS.map((plan) => (
                              <button
                                key={plan}
                                onClick={() => handlePaymentPlanChange(student.id, plan)}
                                className="block w-full text-left px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                              >
                                {plan}
                              </button>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Expandable Details */}
                  <div>
                    <button
                      onClick={() => setExpandedStudentCards(expandedStudentCards === student.id ? null : student.id)}
                      className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
                    >
                      <svg 
                        className={`w-4 h-4 transition-transform duration-200 ${
                          expandedStudentCards === student.id ? 'rotate-180' : ''
                        }`} 
                        fill="none" 
                        stroke="currentColor" 
                        viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                      {expandedStudentCards === student.id ? 'Hide Details' : 'Show Details'}
                    </button>
                    
                    {expandedStudentCards === student.id && (
                      <div className="mt-3 space-y-3 border-t border-gray-200 dark:border-gray-700 pt-3">
                        {/* Contact */}
                        <div className="flex justify-between items-center">
                          <span className="text-xs text-gray-500 dark:text-gray-400">CONTACT</span>
                          <span className="text-sm text-gray-900 dark:text-gray-200">{student.phone}</span>
                        </div>
                        
                        {/* Course */}
                        <div className="flex justify-between items-center">
                          <span className="text-xs text-gray-500 dark:text-gray-400">COURSE</span>
                          <span className="text-sm text-gray-900 dark:text-gray-200">{student.course}</span>
                        </div>
                        
                        {/* Registration Date */}
                        <div className="flex justify-between items-center">
                          <span className="text-xs text-gray-500 dark:text-gray-400">REG. DATE</span>
                          <div className="text-right">
                            <div className="text-sm text-gray-900 dark:text-gray-200">{student.regDate}</div>
                            <div className="text-xs text-gray-500 dark:text-gray-400">{student.regTime}</div>
                          </div>
                        </div>
                        
                        {/* Amount Paid */}
                        <div className="flex justify-between items-center">
                          <span className="text-xs text-gray-500 dark:text-gray-400">AMOUNT PAID</span>
                          <span className="text-sm text-gray-900 dark:text-gray-200">
                            {getAmountPaidDisplay(getStudentPlan(student))}
                          </span>
                        </div>
                        
                        {/* Balance Remaining */}
                        <div className="flex justify-between items-center">
                          <span className="text-xs text-gray-500 dark:text-gray-400">BALANCE REMAINING</span>
                          <span className="text-sm text-gray-900 dark:text-gray-200">
                            {getBalanceRemainingDisplay(getStudentPlan(student))}
                          </span>
                        </div>
                        
                        {/* Edit Plan */}
                        <div className="flex justify-between items-center">
                          <span className="text-xs text-gray-500 dark:text-gray-400">EDIT PLAN</span>
                          <button 
                            onClick={() => handleEditClick(student.id)}
                            className={`${
                              isStudentPlanLocked(student) 
                                ? 'text-blue-500 hover:text-blue-600 dark:text-blue-400 dark:hover:text-blue-300' 
                                : 'text-gray-400 dark:text-gray-500 cursor-not-allowed'
                            } transition-colors duration-200`}
                            disabled={!isStudentPlanLocked(student)}
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                            </svg>
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Desktop Table View */}
          <div className="hidden lg:block overflow-x-auto">
            <table className="w-full min-w-[800px]">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    NO.
                  </th>
                  <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    STUDENT
                  </th>
                  <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    CONTACT
                  </th>
                  <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    COURSE
                  </th>
                  <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    REG. DATE
                  </th>
                  <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    PAYMENT PLAN
                  </th>
                  <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    AMOUNT PAID
                  </th>
                  <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    BALANCE REMAINING
                  </th>
                  <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    EDIT PLAN
                  </th>
                  <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    ACTIONS
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {currentStudents.map((student, index) => (
                  <tr key={student.id} className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-150">
                    <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-200">
                      {indexOfFirstStudent + index + 1}
                    </td>
                    <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900 dark:text-white">
                        {student.name}
                      </div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">
                        {student.email}
                      </div>
                      <div className="mt-1 inline-flex rounded-full bg-blue-50 px-2.5 py-1 text-[11px] font-semibold tracking-wide text-blue-700 dark:bg-blue-500/10 dark:text-blue-300">
                        {student.publicStudentId}
                      </div>
                    </td>
                    <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-200">
                      {student.phone}
                    </td>
                    <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-200">
                      {student.course}
                    </td>
                    <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900 dark:text-gray-200">
                        {student.regDate}
                      </div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">
                        {student.regTime}
                      </div>
                    </td>
                    <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                      <div className="relative" ref={setPaymentPlanDropdownRef(student.id)}>
                        {(() => {
                          const plan = getStudentPlan(student);
                          const isLocked = isStudentPlanLocked(student);

                          return (
                        <button
                          onClick={() => isLocked ? null : setOpenPaymentPlanDropdown(openPaymentPlanDropdown === student.id ? null : student.id)}
                          disabled={isLocked}
                          className={`inline-flex rounded-full px-2 sm:px-3 py-1 text-xs font-semibold items-center gap-1 relative ${getPaymentPlanBadgeClasses(plan)} ${isLocked ? 'opacity-60 cursor-not-allowed' : 'hover:opacity-80 cursor-pointer'} transition-opacity duration-200 ${
                            editedPaymentPlans[student.id] ? 'animate-pulse border-2 border-red-500' : ''
                          }`}
                        >
                          {plan}
                          {!isLocked && (
                            <svg 
                              className={`w-3 h-3 sm:w-4 sm:h-4 ml-1 sm:ml-2 transition-transform duration-200 ${
                                openPaymentPlanDropdown === student.id ? 'rotate-180' : ''
                              }`} 
                              fill="none" 
                              stroke="currentColor" 
                              viewBox="0 0 24 24"
                            >
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                            </svg>
                          )}
                          {editedPaymentPlans[student.id] && (
                            <svg 
                              className="w-3 h-3 sm:w-4 sm:h-4 ml-1 text-red-500 animate-bounce"
                              fill="none" 
                              stroke="currentColor" 
                              viewBox="0 0 24 24"
                            >
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                          )}
                        </button>
                          );
                        })()}
                        
                        {openPaymentPlanDropdown === student.id && !isStudentPlanLocked(student) && (
                          <div className="absolute top-full left-0 mt-1 w-40 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-lg shadow-lg z-10">
                            <div className="py-1">
                              {PAYMENT_PLAN_OPTIONS.map((plan) => (
                                <button
                                  key={plan}
                                  onClick={() => handlePaymentPlanChange(student.id, plan)}
                                  className="block w-full text-left px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                                >
                                  {plan}
                                </button>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-4 sm:px-6 py-4 text-sm text-gray-900 dark:text-gray-200">
                      {getAmountPaidDisplay(getStudentPlan(student), true)}
                    </td>
                    <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-200">
                      {getBalanceRemainingDisplay(getStudentPlan(student))}
                    </td>
                    <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-200">
                      <button 
                        onClick={() => handleEditClick(student.id)}
                        className={`${
                          isStudentPlanLocked(student) 
                            ? 'text-blue-500 hover:text-blue-600 dark:text-blue-400 dark:hover:text-blue-300' 
                            : 'text-gray-400 dark:text-gray-500 cursor-not-allowed'
                        } transition-colors duration-200`}
                        disabled={!isStudentPlanLocked(student)}
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                        </svg>
                      </button>
                    </td>
                    <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-200">
                      <button 
                        onClick={() => {
                          setSelectedStudentId(student.originalId);
                          setShowStudentDetailModal(true);
                        }}
                        className="inline-flex items-center rounded-full border border-blue-200 bg-blue-50 px-3 py-1.5 text-xs font-semibold text-blue-700 transition-colors duration-200 hover:bg-blue-100 dark:border-blue-500/30 dark:bg-blue-500/10 dark:text-blue-300 dark:hover:bg-blue-500/20"
                      >
                        View Details
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
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

          {/* Pagination */}
          {totalPages > 1 && (
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
        </div>
      )}

      {/* Edit Confirmation Modal */}
      {showEditConfirmModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex min-h-screen items-center justify-center p-4">
            <div className="fixed inset-0 bg-black/50 transition-opacity" onClick={cancelEdit}></div>
            <div className="relative bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Edit Payment Plan
                </h3>
                <button
                  onClick={cancelEdit}
                  className="text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <div className="mb-4">
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Are you sure you want to edit the payment plan for this student? This will unlock the payment plan selection for modification.
                </p>
              </div>

              <div className="flex justify-end gap-3">
                <button
                  onClick={cancelEdit}
                  className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-md transition-colors duration-200"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmEdit}
                  className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md transition-colors duration-200"
                >
                  Confirm Edit
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Student Detail Modal */}
        <StudentDetailModal
          isOpen={showStudentDetailModal}
          onClose={() => {
            setShowStudentDetailModal(false);
            setSelectedStudentId(null);
          }}
          studentId={selectedStudentId || ''}
        />
      </div>
    </div>
  );
}
