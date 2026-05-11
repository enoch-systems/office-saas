import * as offlineDb from './offline-db';

export interface PaymentRequestData {
  studentId: string;
  name: string;
  email: string;
  phone: string;
  amount: number;
  paymentDate: string;
  imageUrl: string;
}

/**
 * Create a payment request
 */
export async function createPaymentRequest(data: PaymentRequestData) {
  try {
    const request = await offlineDb.createPaymentRequest({
      student_id: data.studentId,
      name: data.name,
      email: data.email,
      phone: data.phone,
      amount: data.amount,
      payment_date: data.paymentDate,
      image_url: data.imageUrl,
      status: 'pending',
      submitted_at: new Date().toISOString(),
    });
    return request;
  } catch (error) {
    console.error('Error creating payment request:', error);
    throw error;
  }
}

/**
 * Get all payment requests for admin
 */
export async function getPaymentRequests(filters?: {
  status?: 'pending' | 'approved' | 'rejected';
  studentId?: string;
}) {
  try {
    const allRequests = await offlineDb.getAllPaymentRequests();
    let filtered = allRequests;

    if (filters?.status) {
      filtered = filtered.filter(r => r.status === filters.status);
    }

    if (filters?.studentId) {
      filtered = filtered.filter(r => r.student_id === filters.studentId);
    }

    // Sort by submitted_at descending
    filtered.sort((a, b) => new Date(b.submitted_at).getTime() - new Date(a.submitted_at).getTime());

    // Attach student info if available
    const students = await offlineDb.getAllStudents();
    return filtered.map(req => {
      const student = students.find(s => s.id === req.student_id);
      return { ...req, students: student || null };
    });
  } catch (error) {
    console.error('Error getting payment requests:', error);
    throw error;
  }
}

/**
 * Get a single payment request by ID
 */
export async function getPaymentRequestById(id: string) {
  try {
    const allRequests = await offlineDb.getAllPaymentRequests();
    const request = allRequests.find(r => r.id === id);
    if (!request) throw new Error('Payment request not found');

    const students = await offlineDb.getAllStudents();
    const student = students.find(s => s.id === request.student_id);
    return { ...request, students: student || null };
  } catch (error) {
    console.error('Error getting payment request:', error);
    throw error;
  }
}

/**
 * Approve a payment request
 */
export async function approvePaymentRequest(
  id: string,
  reviewedBy: string
) {
  try {
    // Get the payment request first
    const payment = await getPaymentRequestById(id);

    // Update payment request status
    const updated = await offlineDb.updatePaymentRequest(id, {
      status: 'approved',
      reviewed_at: new Date().toISOString(),
      reviewed_by: reviewedBy,
    });

    if (!updated) throw new Error('Failed to update payment request');

    // Update student's amount paid and balance
    if (payment.students) {
      const currentAmountPaid = payment.students.amount_paid || 0;
      const currentBalance = payment.students.balance_remaining || 0;
      const paymentAmount = payment.amount;

      await offlineDb.updateStudent(payment.student_id, {
        amount_paid: currentAmountPaid + paymentAmount,
        balance_remaining: Math.max(0, currentBalance - paymentAmount),
        status: 'Confirmed',
      });
    }

    return await getPaymentRequestById(id);
  } catch (error) {
    console.error('Error approving payment request:', error);
    throw error;
  }
}

/**
 * Reject a payment request
 */
export async function rejectPaymentRequest(
  id: string,
  reviewedBy: string,
  rejectionReason?: string
) {
  try {
    const updated = await offlineDb.updatePaymentRequest(id, {
      status: 'rejected',
      reviewed_at: new Date().toISOString(),
      reviewed_by: reviewedBy,
      rejection_reason: rejectionReason,
    });

    if (!updated) throw new Error('Failed to reject payment request');

    return await getPaymentRequestById(id);
  } catch (error) {
    console.error('Error rejecting payment request:', error);
    throw error;
  }
}

/**
 * Get payment statistics
 */
export async function getPaymentStats() {
  try {
    const allRequests = await offlineDb.getAllPaymentRequests();

    const pending = allRequests.filter(r => r.status === 'pending');
    const approved = allRequests.filter(r => r.status === 'approved');
    const rejected = allRequests.filter(r => r.status === 'rejected');

    const pendingAmount = pending.reduce((sum, p) => sum + (p.amount || 0), 0);
    const approvedAmount = approved.reduce((sum, p) => sum + (p.amount || 0), 0);
    const rejectedAmount = rejected.reduce((sum, p) => sum + (p.amount || 0), 0);

    return {
      pending: {
        count: pending.length,
        amount: pendingAmount,
      },
      approved: {
        count: approved.length,
        amount: approvedAmount,
      },
      rejected: {
        count: rejected.length,
        amount: rejectedAmount,
      },
      total: {
        count: pending.length + approved.length + rejected.length,
        amount: pendingAmount + approvedAmount + rejectedAmount,
      },
    };
  } catch (error) {
    console.error('Error getting payment stats:', error);
    throw error;
  }
}

/**
 * Get student payment history
 */
export async function getStudentPaymentHistory(studentId: string) {
  try {
    const allRequests = await offlineDb.getAllPaymentRequests();
    return allRequests
      .filter(r => r.student_id === studentId)
      .sort((a, b) => new Date(b.submitted_at).getTime() - new Date(a.submitted_at).getTime());
  } catch (error) {
    console.error('Error getting student payment history:', error);
    throw error;
  }
}

/**
 * Get students with pending payments
 */
export async function getStudentsWithPendingPayments() {
  try {
    const allStudents = await offlineDb.getAllStudents();
    return allStudents
      .filter(s => s.balance_remaining > 0)
      .sort((a, b) => new Date(b.reg_date).getTime() - new Date(a.reg_date).getTime());
  } catch (error) {
    console.error('Error getting students with pending payments:', error);
    throw error;
  }
}