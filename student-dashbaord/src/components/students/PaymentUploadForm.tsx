"use client";
import React, { useState } from "react";

interface PaymentFormData {
  name: string;
  email: string;
  amount: string;
  proofImage: File | null;
}

type SubmissionState =
  | { type: "success"; message: string }
  | { type: "error"; message: string }
  | null;

const inputClassName =
  "w-full rounded-2xl border border-stone-200 bg-white px-4 py-3.5 text-sm text-slate-900 shadow-sm outline-none transition focus:border-[#9f0712] focus:ring-4 focus:ring-[#9f0712]/10";

export function PaymentUploadForm() {
  const [formData, setFormData] = useState<PaymentFormData>({
    name: "",
    email: "",
    amount: "",
    proofImage: null,
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionState, setSubmissionState] = useState<SubmissionState>(null);
  const [fileInputKey, setFileInputKey] = useState(0);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name } = e.target;
    let { value } = e.target;

    if (name === "amount") {
      value = value.replace(/\D/g, "");
    }

    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setFormData(prev => ({
      ...prev,
      proofImage: file
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    window.scrollTo({ top: 0, behavior: "smooth" });
    
    if (!formData.proofImage) {
      setSubmissionState({
        type: "error",
        message: "Please upload your proof of payment before submitting.",
      });
      return;
    }

    setIsSubmitting(true);
    setSubmissionState(null);

    try {
      const formDataToSubmit = new FormData();
      formDataToSubmit.append('name', formData.name);
      formDataToSubmit.append('email', formData.email);
      formDataToSubmit.append('amount', formData.amount);
      formDataToSubmit.append('paymentType', 'proof_submission');
      formDataToSubmit.append('proofImage', formData.proofImage);

      const response = await fetch('/api/payment-receipts', {
        method: 'POST',
        body: formDataToSubmit,
      });

      const result = await response.json().catch(() => null);

      if (response.ok) {
        setSubmissionState({
          type: "success",
          message:
            "Payment proof submitted successfully. Our team will review it in the payment checker.",
        });
        setFormData({
          name: "",
          email: "",
          amount: "",
          proofImage: null,
        });
        setFileInputKey((prev) => prev + 1);
      } else {
        setSubmissionState({
          type: "error",
          message: result?.error || "Failed to submit payment proof. Please try again.",
        });
      }
    } catch {
      setSubmissionState({
        type: "error",
        message: "An error occurred. Please try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f7f0f0] text-white">
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-[linear-gradient(rgba(120,120,120,0.12)_1px,transparent_1px),linear-gradient(90deg,rgba(120,120,120,0.12)_1px,transparent_1px)] bg-[size:72px_72px]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_rgba(159,7,18,0.12),_transparent_28%),radial-gradient(circle_at_bottom_left,_rgba(0,0,0,0.08),_transparent_30%)]" />
        <div className="relative mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8 lg:py-14">
          <div className="grid gap-8 lg:grid-cols-[1.05fr_1fr]">
            <div className="space-y-6 rounded-[30px] border border-[#9f0712]/15 bg-white/85 p-6 text-slate-900 shadow-[0_20px_60px_rgba(159,7,18,0.08)] backdrop-blur sm:p-8">
              <div className="inline-flex items-center rounded-full border border-[#9f0712]/15 bg-[#9f0712] px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.24em] text-white">
                Tech Trailblazer Academy
              </div>

              <div className="space-y-5">
                <div className="inline-flex bg-[#7f000a] px-4 py-2 text-xs font-semibold uppercase tracking-[0.24em] text-white shadow-lg shadow-[#7f000a]/20">
                  Payment Proof Submission
                </div>
                <div className="space-y-3">
                  <h1 className="text-4xl font-black uppercase tracking-tight text-[#9f0712] sm:text-5xl lg:text-6xl">
                    Receipt <span className="text-slate-950">Upload</span>
                  </h1>
                  <div className="inline-flex border-2 border-slate-900 bg-white px-5 py-2 text-lg font-black uppercase tracking-wide text-slate-950">
                    Minimal Form
                  </div>
                </div>
                <p className="max-w-2xl text-sm leading-7 text-slate-700 sm:text-base">
                  Submit your name, your registered email, amount paid, and a clear proof of payment.
                  Your receipt goes directly to our review team.
                </p>
              </div>

              <div className="rounded-[28px] bg-[linear-gradient(135deg,#a30713_0%,#540107_100%)] p-5 text-white shadow-xl shadow-[#9f0712]/20">
                <div className="mb-4 inline-flex rounded-full bg-black px-5 py-2 text-sm font-bold uppercase tracking-wide text-white">
                  Required
                </div>
                <div className="space-y-3 text-sm leading-6 text-white/90 sm:text-base">
                  <p>Use the same email address from registration.</p>
                  <p>Enter the exact amount paid.</p>
                  <p>Upload one clear image screenshot or receipt file.</p>
                  <p>Only these 4 fields are needed for review.</p>
                </div>
              </div>
            </div>

            <div className="rounded-[30px] border border-[#9f0712]/10 bg-white p-5 text-slate-900 shadow-[0_24px_80px_rgba(15,23,42,0.08)] sm:p-8">
              <div className="mb-8 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
                <div>
                  <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#9f0712]">
                    Payment Upload
                  </p>
                  <h2 className="mt-2 text-2xl font-semibold text-slate-950">
                    Submit proof of payment
                  </h2>
                </div>
                <p className="text-sm text-slate-500">
                  All fields are required
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-8">
                <section className="space-y-5">
                  <div>
                    <p className="text-sm font-semibold text-slate-900">Receipt Details</p>
                    <p className="mt-1 text-sm text-slate-500">Only 4 details are required.</p>
                  </div>

                  <div className="grid gap-5">
                    <div>
                      <label className="mb-2 block text-sm font-semibold text-slate-800">
                        Full Name *
                      </label>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        required
                        className={inputClassName}
                        placeholder="Enter your full name"
                      />
                    </div>

                    <div>
                      <label className="mb-2 block text-sm font-semibold text-slate-800">
                        Email Address *
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        required
                        className={inputClassName}
                        placeholder="Enter your registered email"
                      />
                    </div>

                    <div>
                      <label className="mb-2 block text-sm font-semibold text-slate-800">
                        Amount Paid *
                      </label>
                      <input
                        type="text"
                        name="amount"
                        value={formData.amount}
                        onChange={handleInputChange}
                        required
                        inputMode="numeric"
                        pattern="[0-9]*"
                        autoComplete="off"
                        className={inputClassName}
                        placeholder="Enter amount paid (numbers only)"
                      />
                    </div>

                    <div>
                      <label className="mb-2 block text-sm font-semibold text-slate-800">
                        Proof of Payment *
                      </label>
                      <div className="rounded-[24px] border border-dashed border-stone-300 bg-[#faf6f6] p-4">
                        <input
                          key={fileInputKey}
                          type="file"
                          accept="image/*"
                          onChange={handleFileChange}
                          required
                          className="w-full text-sm text-slate-700 file:mr-4 file:rounded-full file:border-0 file:bg-[#9f0712] file:px-4 file:py-2.5 file:text-sm file:font-semibold file:text-white hover:file:bg-[#7f000a]"
                        />
                        <p className="mt-3 text-xs text-slate-500">
                          Upload a clear image screenshot or receipt proof.
                        </p>
                      </div>
                    </div>
                  </div>
                </section>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="inline-flex w-full items-center justify-center rounded-2xl bg-[#9f0712] px-5 py-4 text-sm font-semibold text-white transition hover:bg-[#7f000a] disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {isSubmitting ? "Submitting receipt..." : "Submit Payment Proof"}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
      {submissionState ? (
        <div className="fixed inset-0 z-[120] flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/45"
            onClick={() => setSubmissionState(null)}
          />
          <div
            aria-live="polite"
            className={`relative w-full max-w-md rounded-3xl border p-6 text-center shadow-2xl sm:p-7 ${
              submissionState.type === "success"
                ? "border-emerald-200 bg-white text-emerald-900"
                : "border-rose-200 bg-white text-rose-800"
            }`}
          >
            <p className="text-base font-semibold leading-7">{submissionState.message}</p>
            <button
              type="button"
              onClick={() => setSubmissionState(null)}
              className="mt-5 inline-flex rounded-xl bg-[#9f0712] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#7f000a]"
            >
              Close
            </button>
          </div>
        </div>
      ) : null}
    </div>
  );
}
