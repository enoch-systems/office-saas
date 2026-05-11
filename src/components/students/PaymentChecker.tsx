"use client";
import React, { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { PaymentReceiptData, fetchPaymentReceipts, updatePaymentReceiptStatus } from "@/lib/paymentReceiptService";
import { useNotifications } from "@/context/NotificationContext";

export function PaymentChecker() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [searchTerm, setSearchTerm] = useState("");
  const [paymentReceipts, setPaymentReceipts] = useState<PaymentReceiptData[]>([]);
  const [selectedRequest, setSelectedRequest] = useState<PaymentReceiptData | null>(null);
  const [showImageModal, setShowImageModal] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [sortOption, setSortOption] = useState<"latest" | "name">("latest");
  const [loading, setLoading] = useState(true);
  const { viewedRequests, markAsViewed } = useNotifications();
  const itemsPerPage = 20;

  // Fetch payment receipts from Supabase
  useEffect(() => {
    const fetchReceipts = async () => {
      setLoading(true);
      try {
        const receipts = await fetchPaymentReceipts(undefined, 100); // Fetch more for pagination
        setPaymentReceipts(receipts);
      } catch (error) {
        console.error('Error fetching payment receipts:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchReceipts();
  }, []);

  useEffect(() => {
    const receiptId = searchParams.get("receiptId");
    if (!receiptId || paymentReceipts.length === 0) {
      return;
    }

    const targetReceipt = paymentReceipts.find((receipt) => receipt.id === receiptId);
    if (!targetReceipt) {
      return;
    }

    void handleImageClick(targetReceipt);
  }, [searchParams, paymentReceipts]);

  const filteredRequests = paymentReceipts.filter(
    (request) =>
      request.student_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      request.email.toLowerCase().includes(searchTerm.toLowerCase())
  );
  const unreadPendingCount = paymentReceipts.filter(
    (request) => request.status === "pending" && !viewedRequests.has(request.id),
  ).length;

  // Sort requests by latest submission or by student name
  const sortedRequests = [...filteredRequests].sort((a, b) => {
    if (sortOption === "latest") {
      return new Date(b.submitted_at).getTime() - new Date(a.submitted_at).getTime();
    }

    return a.student_name.localeCompare(b.student_name);
  });

  // Pagination logic
  const totalPages = Math.ceil(sortedRequests.length / itemsPerPage);
  const indexOfLastRequest = currentPage * itemsPerPage;
  const indexOfFirstRequest = indexOfLastRequest - itemsPerPage;
  const currentRequests = sortedRequests.slice(indexOfFirstRequest, indexOfLastRequest);

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
  React.useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, sortOption]);

  const handleStatusChange = async (requestId: string, newStatus: 'approved' | 'rejected') => {
    const success = await updatePaymentReceiptStatus(requestId, newStatus);
    if (success) {
      // Refresh the data
      const receipts = await fetchPaymentReceipts(undefined, 100);
      setPaymentReceipts(receipts);
    }
  };

  const handleImageClick = async (request: PaymentReceiptData) => {
    setSelectedRequest(request);
    setShowImageModal(true);
    await markAsViewed(request.id);
    router.replace("/email-portal/payment-checker");
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'rejected':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      default:
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
    }
  };

  const formatMessageDate = (value: string) =>
    new Date(value).toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });

  const formatMessageTime = (value: string) =>
    new Date(value).toLocaleTimeString("en-GB", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: true,
    });

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      <div className="p-4 sm:p-6">
        {/* Header */}
        <div className="mb-6 sm:mb-8">
          <div className="mb-2 flex flex-wrap items-center gap-3">
            <h1 className="text-2xl sm:text-3xl text-gray-900 dark:text-white">Payment Checker</h1>
            {unreadPendingCount > 0 ? (
              <span className="inline-flex items-center rounded-full bg-red-100 px-3 py-1 text-xs font-semibold text-red-700 dark:bg-red-900/40 dark:text-red-200">
                {unreadPendingCount} new message{unreadPendingCount > 1 ? "s" : ""}
              </span>
            ) : null}
          </div>
          <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400">
            Review and manage payment proof submissions
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
              placeholder="Search by name or email..."
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
              aria-label="Sort payment requests"
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
        </div>

        {/* Payment Requests List */}
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
          <div className="divide-y divide-gray-200 dark:divide-gray-700">
            {currentRequests.map((request, index) => (
              <div
                key={request.id}
                className="p-4 sm:p-6 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-150"
              >
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div className="flex items-start flex-1 w-full sm:w-auto">
                    <div className="w-8 text-sm text-gray-900 dark:text-gray-200 font-medium mt-1 flex-shrink-0">
                      {indexOfFirstRequest + index + 1}
                    </div>
                    <div className="ml-4 flex-1 min-w-0">
                      <div className="text-sm sm:text-base font-medium text-gray-900 dark:text-white mb-2 truncate">
                        {request.student_name}
                      </div>
                      <div className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mb-1 truncate">
                        {request.email}
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col gap-2 w-full sm:w-auto">
                    {!viewedRequests.has(request.id) && (
                      <div className="text-amber-600 dark:text-amber-400 text-xs font-medium animate-bounce text-center sm:text-left">
                        New message!
                      </div>
                    )}
                    <button
                      onClick={() => handleImageClick(request)}
                      className="w-full sm:w-auto px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors duration-200"
                    >
                      View Proof
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {currentRequests.length === 0 && (
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
                <p className="text-gray-900 dark:text-white font-medium">No payment requests found</p>
                <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">
                  Try adjusting your search criteria
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex flex-col sm:flex-row items-center justify-between px-4 sm:px-6 py-4 border-t border-gray-200 dark:border-gray-700 mt-4 gap-4">
            <div className="text-sm text-gray-700 dark:text-gray-300 text-center sm:text-left">
              Showing {indexOfFirstRequest + 1} to {Math.min(indexOfLastRequest, filteredRequests.length)} of {filteredRequests.length} requests
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

      {/* Image Modal */}
      {showImageModal && selectedRequest && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex min-h-screen items-center justify-center p-4 sm:p-6">
            <div className="fixed inset-0 bg-black/50 transition-opacity" onClick={() => setShowImageModal(false)}></div>
            <div className="relative bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden p-4 sm:p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Payment proof sent from {selectedRequest.student_name}
                </h3>
                <button
                  onClick={() => setShowImageModal(false)}
                  className="text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              
              <div className="mb-3 sm:mb-4">
                <div className="grid grid-cols-1 gap-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-500 dark:text-gray-400">Amount Paid:</span>
                    <span className="font-medium text-gray-900 dark:text-white">₦{selectedRequest.amount.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500 dark:text-gray-400">Message Received On:</span>
                    <span className="font-medium text-gray-900 dark:text-white text-right">
                      {formatMessageDate(selectedRequest.submitted_at)}
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-500 dark:text-gray-400">Email:</span>
                    <div className="font-medium text-gray-900 dark:text-white break-all mt-1">{selectedRequest.email}</div>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500 dark:text-gray-400">Message Sending Time:</span>
                    <span className="font-medium text-gray-900 dark:text-white">
                      {formatMessageTime(selectedRequest.submitted_at)}
                    </span>
                  </div>
                </div>
              </div>

              <div className="bg-gray-100 dark:bg-gray-700 rounded-lg p-3 sm:p-4 flex items-center justify-center min-h-[200px] sm:min-h-[400px] max-h-[50vh] sm:max-h-[60vh] overflow-hidden">
                {/* Display the actual uploaded image */}
                {selectedRequest.image_url ? (
                  <img 
                    src={selectedRequest.image_url}
                    alt="Payment Proof"
                    className="max-w-full max-h-full rounded-lg shadow-lg object-contain"
                  />
                ) : (
                  <div className="text-center">
                    <svg
                      className="mx-auto h-12 w-12 sm:h-16 sm:w-16 text-gray-400 dark:text-gray-500 mb-3 sm:mb-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                      />
                    </svg>
                    <p className="text-gray-500 dark:text-gray-400 text-xs sm:text-sm">
                      No image available
                    </p>
                  </div>
                )}
              </div>

              
                          </div>
          </div>
        </div>
      )}
    </div>
  );
}
