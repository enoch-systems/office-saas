"use client";

import { useEffect, useMemo, useState } from "react";

const REFRESH_INTERVAL_MS = 2000;

export default function EmailPreviewLivePage() {
  const [emailType, setEmailType] = useState("welcome");
  const [studentName, setStudentName] = useState("John Doe");
  const [courseName, setCourseName] = useState("Tech Trailblazer Scholarship Bootcamp Cohort 1");
  const [startDate, setStartDate] = useState("20th May, 2026");
  const [paymentType, setPaymentType] = useState("Fully Paid");
  const [amountPaid, setAmountPaid] = useState("50000");
  const [scholarshipDate, setScholarshipDate] = useState("May 2026");
  const [refreshTick, setRefreshTick] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setRefreshTick((tick) => tick + 1);
    }, REFRESH_INTERVAL_MS);

    return () => clearInterval(interval);
  }, []);

  const previewUrl = useMemo(() => {
    const params = new URLSearchParams({
      embedded: "1",
      type: emailType,
      studentName,
      courseName,
      startDate,
      paymentType,
      amountPaid,
      scholarshipDate,
      _t: String(refreshTick),
    });

    return `/api/preview-email?${params.toString()}`;
  }, [emailType, studentName, courseName, startDate, paymentType, amountPaid, scholarshipDate, refreshTick]);

  return (
    <main className="min-h-screen bg-gray-100 p-4 sm:p-6">
      <div className="mx-auto max-w-7xl">
        <h1 className="mb-2 text-2xl font-semibold text-gray-900">Live Email Preview</h1>
        <p className="mb-5 text-sm text-gray-600">
          Edit fields and keep this page open while updating templates. Preview auto-refreshes every 2 seconds.
        </p>

        <section className="mb-5 grid grid-cols-1 gap-3 rounded-xl border border-gray-200 bg-white p-4 sm:grid-cols-2 lg:grid-cols-4">
          <label className="text-sm text-gray-700">
            Email Type
            <select
              value={emailType}
              onChange={(e) => setEmailType(e.target.value)}
              className="mt-1 w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm"
            >
              <option value="welcome">Welcome Email</option>
              <option value="payment_confirmation">Payment Confirmation</option>
              <option value="group_redirection">Group Redirection</option>
            </select>
          </label>

          <label className="text-sm text-gray-700">
            Student Name
            <input
              value={studentName}
              onChange={(e) => setStudentName(e.target.value)}
              className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
            />
          </label>

          <label className="text-sm text-gray-700">
            Course Name
            <input
              value={courseName}
              onChange={(e) => setCourseName(e.target.value)}
              className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
            />
          </label>

          <label className="text-sm text-gray-700">
            Start Date
            <input
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
            />
          </label>

          <label className="text-sm text-gray-700">
            Payment Type
            <select
              value={paymentType}
              onChange={(e) => setPaymentType(e.target.value)}
              className="mt-1 w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm"
            >
              <option value="Fully Paid">Fully Paid</option>
              <option value="1st Installment">1st Installment</option>
              <option value="2nd Installment">2nd Installment</option>
            </select>
          </label>

          <label className="text-sm text-gray-700">
            Amount Paid
            <input
              value={amountPaid}
              onChange={(e) => setAmountPaid(e.target.value)}
              className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
            />
          </label>

          <label className="text-sm text-gray-700">
            Scholarship Date
            <input
              value={scholarshipDate}
              onChange={(e) => setScholarshipDate(e.target.value)}
              className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
            />
          </label>
        </section>

        <section className="overflow-hidden rounded-xl border border-gray-200 bg-white">
          <iframe
            title="Live email preview"
            src={previewUrl}
            className="h-[78vh] w-full"
          />
        </section>
      </div>
    </main>
  );
}
