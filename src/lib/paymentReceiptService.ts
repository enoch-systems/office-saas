import * as offlineDb from './offline-db';

export interface PaymentReceiptData {
  id: string;
  student_name: string;
  email: string;
  phone?: string;
  amount: number;
  payment_date: string;
  payment_type: string;
  status: 'pending' | 'approved' | 'rejected';
  image_url?: string;
  original_filename?: string;
  submitted_at: string;
  reviewed_at?: string;
  reviewed_by?: string;
  notes?: string;
  created_at: string;
  updated_at: string;
}

export async function fetchPaymentReceipts(
  status?: string,
  limit: number = 50,
  offset: number = 0
): Promise<PaymentReceiptData[]> {
  try {
    const allReceipts = await offlineDb.getAllPaymentReceipts();
    let filtered = allReceipts;

    if (status) {
      filtered = filtered.filter(r => r.status === status);
    }

    // Sort by submitted_at descending
    filtered.sort((a, b) => new Date(b.submitted_at).getTime() - new Date(a.submitted_at).getTime());

    // Apply pagination
    return filtered.slice(offset, offset + limit);
  } catch (error) {
    console.error('Error in fetchPaymentReceipts:', error);
    return [];
  }
}

export async function updatePaymentReceiptStatus(
  id: string,
  status: 'approved' | 'rejected',
  notes?: string
): Promise<boolean> {
  try {
    const updates: Partial<offlineDb.PaymentReceiptData> = {
      status,
      reviewed_at: new Date().toISOString(),
    };

    if (notes) {
      updates.notes = notes;
    }

    return await offlineDb.updatePaymentReceipt(id, updates);
  } catch (error) {
    console.error('Error in updatePaymentReceiptStatus:', error);
    return false;
  }
}

export async function getPendingPaymentReceiptsCount(): Promise<number> {
  try {
    const allReceipts = await offlineDb.getAllPaymentReceipts();
    return allReceipts.filter(r => r.status === 'pending').length;
  } catch (error) {
    console.error('Error in getPendingPaymentReceiptsCount:', error);
    return 0;
  }
}

export async function markReceiptAsViewed(receiptId: string, userId: string): Promise<boolean> {
  try {
    if (!receiptId || !userId) {
      return false;
    }
    return await offlineDb.markReceiptViewed(receiptId, userId);
  } catch (error) {
    console.error('Error in markReceiptAsViewed:', error);
    return false;
  }
}

export async function getViewedReceipts(userId: string): Promise<Set<string>> {
  try {
    if (!userId) {
      return new Set();
    }
    const viewed = await offlineDb.getViewedReceiptsByUser(userId);
    return new Set(viewed);
  } catch (error) {
    console.error('Error in getViewedReceipts:', error);
    return new Set();
  }
}
