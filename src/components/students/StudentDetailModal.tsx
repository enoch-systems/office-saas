"use client";
import React, { useState, useEffect } from "react";
import { getStudentById, type Student } from "@/data/students";
import { normalizePaymentPlan } from "@/utils/paymentPlanService";

interface StudentDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  studentId: string;
}

function DetailCard({
  label,
  value,
  accent,
}: {
  label: string;
  value: React.ReactNode;
  accent?: string;
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-900/70">
      <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">
        {label}
      </p>
      <p className={`mt-2 text-sm font-semibold ${accent || "text-slate-900 dark:text-white"}`}>
        {value}
      </p>
    </div>
  );
}

function Section({
  title,
  description,
  children,
}: {
  title: string;
  description: string;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-700 dark:bg-slate-800/80">
      <div className="mb-4">
        <h5 className="text-sm font-semibold text-slate-900 dark:text-white">
          {title}
        </h5>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
          {description}
        </p>
      </div>
      {children}
    </section>
  );
}

export function StudentDetailModal({ isOpen, onClose, studentId }: StudentDetailModalProps) {
  const [student, setStudent] = useState<Student | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen && studentId) {
      const loadStudent = async () => {
        try {
          setLoading(true);
          setError(null);
          const data = await getStudentById(studentId.toString());
          setStudent(data);
        } catch (err) {
          console.error('Error loading student:', err);
          setError(err instanceof Error ? err.message : 'Failed to load student details');
        } finally {
          setLoading(false);
        }
      };
      loadStudent();
    }
  }, [isOpen, studentId]);

  if (!isOpen) return null;

  if (loading) {
    return (
      <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/60 backdrop-blur-sm">
        <div className="flex min-h-screen items-center justify-center p-4">
          <div className="rounded-2xl border border-white/10 bg-slate-900/90 p-6">
            <div className="h-12 w-12 animate-spin rounded-full border-b-2 border-blue-400"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/60 backdrop-blur-sm">
        <div className="flex min-h-screen items-center justify-center p-4">
          <div className="w-full max-w-md rounded-2xl bg-white p-5 shadow-2xl dark:bg-slate-800 sm:p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-red-100 dark:bg-red-900/30">
                <svg className="w-5 h-5 text-red-600 dark:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Error</h3>
            </div>
            <p className="text-gray-600 dark:text-gray-400 mb-4">{error}</p>
            <div className="flex justify-end gap-3">
              <button
                onClick={onClose}
                className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-md transition-colors duration-200"
              >
                Close
              </button>
              <button
                onClick={() => {
                  setError(null);
                  // Retry loading the student
                  const loadStudent = async () => {
                    try {
                      setLoading(true);
                      const data = await getStudentById(studentId.toString());
                      setStudent(data);
                      setError(null);
                    } catch (err) {
                      setError(err instanceof Error ? err.message : 'Failed to load student details');
                    } finally {
                      setLoading(false);
                    }
                  };
                  loadStudent();
                }}
                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md transition-colors duration-200"
              >
                Retry
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!student) return null;

  const normalizedPaymentPlan = normalizePaymentPlan(student.paymentPlan);
  const amountPaidDisplay =
    normalizedPaymentPlan === "Fully Paid"
      ? "₦50,000"
      : normalizedPaymentPlan === "1st installment"
      ? "₦30,000"
      : normalizedPaymentPlan === "2nd installment"
      ? "₦20,000"
      : "N/A";
  const balanceRemainingDisplay =
    normalizedPaymentPlan === "Fully Paid"
      ? "₦0"
      : normalizedPaymentPlan === "1st installment"
      ? "₦20,000"
      : normalizedPaymentPlan === "2nd installment"
      ? "₦0"
      : "N/A";

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/60 backdrop-blur-sm">
      <div className="flex min-h-screen items-center justify-center p-3 sm:p-4 lg:p-6">
        <div className="fixed inset-0 transition-opacity" onClick={onClose}></div>
        <div className="relative flex max-h-[90dvh] w-full max-w-[95vw] flex-col overflow-hidden rounded-2xl border border-slate-200 bg-slate-100 shadow-2xl dark:border-slate-700 dark:bg-slate-900 sm:max-w-3xl lg:max-w-4xl">
          <div className="border-b border-slate-200 bg-white px-4 py-4 dark:border-slate-700 dark:bg-slate-900/95 sm:px-5 lg:px-6">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-blue-600 dark:text-blue-400">
                  Student Record
                </p>
                <h3 className="mt-2 text-xl font-semibold text-slate-900 dark:text-white sm:text-2xl">
                  View Details
                </h3>
                <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                  Professional summary of the student application and current payment status.
                </p>
              </div>
            <button
              onClick={onClose}
                className="rounded-full border border-slate-200 p-2 text-slate-500 transition hover:bg-slate-100 hover:text-slate-700 dark:border-slate-700 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-200"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-4 sm:p-5 lg:p-6">
            <div className="space-y-6">
              <div className="overflow-hidden rounded-[28px] bg-slate-950 text-white">
                <div className="bg-[radial-gradient(circle_at_top_left,_rgba(59,130,246,0.35),_transparent_35%),radial-gradient(circle_at_bottom_right,_rgba(14,165,233,0.18),_transparent_35%)] px-5 py-6 lg:px-8">
                  <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
                    <div className="flex items-center gap-4">
                      <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-white/10 text-xl font-semibold text-white">
                {student.name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")
                  .toUpperCase()}
              </div>
                      <div className="min-w-0">
                        <h4 className="text-2xl font-semibold text-white">
                          {student.name}
                        </h4>
                        <p className="mt-1 text-sm text-slate-300">{student.email}</p>
                        <div className="mt-3 inline-flex rounded-full border border-white/10 bg-white/10 px-3 py-1 text-xs font-semibold tracking-[0.2em] text-blue-100">
                          {student.publicStudentId}
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-col gap-3 lg:items-end">
                      <span className={`inline-flex w-fit rounded-full px-3 py-1.5 text-xs font-semibold ${
                        student.status === 'Confirmed' 
                          ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300'
                          : student.status === 'Awaiting'
                          ? 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300'
                          : 'bg-slate-200 text-slate-800 dark:bg-slate-700 dark:text-slate-200'
                      }`}>
                        {student.status}
                      </span>
                      <p className="text-sm text-slate-300">
                        Course: <span className="font-medium text-white">{student.course}</span>
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                <DetailCard label="Student ID" value={student.publicStudentId} accent="text-blue-700 dark:text-blue-300" />
                <DetailCard label="Registration Date" value={student.regDate} />
                <DetailCard label="Payment Plan" value={normalizedPaymentPlan} />
                <DetailCard label="Balance Remaining" value={balanceRemainingDisplay} accent="text-amber-700 dark:text-amber-300" />
              </div>

              <Section
                title="Registration Overview"
                description="Core timeline and enrollment record information."
              >
                <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                  <DetailCard label="Course" value={student.course} />
                  <DetailCard label="Learning Track" value={student.learningTrack} />
                  <DetailCard label="Registration Time" value={student.regTime || "Not recorded"} />
                  <DetailCard label="Amount Paid" value={amountPaidDisplay} accent="text-emerald-700 dark:text-emerald-300" />
                  <DetailCard label="Timestamp" value={student.timestamp} />
                  <DetailCard label="Status" value={student.status} />
                </div>
              </Section>

              <Section
                title="Personal Information"
                description="Identity and location details supplied at registration."
              >
                <div className="grid gap-4 md:grid-cols-2">
                  <DetailCard label="Full Name" value={student.name} />
                  <DetailCard label="Sex" value={student.gender} />
                  <DetailCard label="State of Origin" value={student.stateOfResidence} />
                  <DetailCard label="Scholarship Interest" value={student.wantsScholarship} />
                </div>
              </Section>

              <Section
                title="Contact Information"
                description="Primary channels for communication and follow-up."
              >
                <div className="grid gap-4 md:grid-cols-2">
                  <DetailCard label="Email Address" value={<span className="break-all">{student.email}</span>} />
                  <DetailCard label="Phone / WhatsApp" value={student.phone} />
                  <div className="md:col-span-2">
                    <DetailCard label="How the Student Heard About Us" value={student.howDidYouHear} />
                  </div>
                </div>
              </Section>

              <Section
                title="Readiness & Motivation"
                description="Background context for onboarding and student follow-up."
              >
                <div className="grid gap-4 md:grid-cols-2">
                  <DetailCard label="Employment Status" value={student.currentEmploymentStatus} />
                  <DetailCard label="Laptop Availability" value={student.hasLaptopAndInternet} />
                  <div className="md:col-span-2 rounded-2xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-900/70">
                    <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">
                      Why Learn This Skill
                    </p>
                    <p className="mt-3 text-sm leading-7 text-slate-700 dark:text-slate-300">
                      {student.whyLearnThisSkill}
                    </p>
                  </div>
                  {student.lastProgress ? (
                    <div className="md:col-span-2 rounded-2xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-900/70">
                      <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">
                        Last Progress Update
                      </p>
                      <p className="mt-3 text-sm leading-7 text-slate-700 dark:text-slate-300">
                        {student.lastProgress}
                      </p>
                    </div>
                  ) : null}
                </div>
              </Section>
            </div>
          </div>

          <div className="border-t border-slate-200 bg-white px-4 py-3 dark:border-slate-700 dark:bg-slate-900 sm:px-5 lg:px-6">
            <div className="flex justify-end">
            <button
              onClick={onClose}
                className="inline-flex items-center rounded-xl bg-slate-950 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-700 dark:bg-blue-600 dark:hover:bg-blue-500"
            >
              Close
            </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
