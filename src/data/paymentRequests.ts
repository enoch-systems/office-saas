export interface PaymentRequest {
  id: number;
  name: string;
  email: string;
  phone: string;
  amount: number;
  paymentDate: string;
  imageUrl: string;
  status: 'pending' | 'approved' | 'rejected';
  submittedAt: string;
}

// Mock data for payment requests - this will be replaced with actual data from the upload page


// Data moved to Supabase database
export const mockPaymentRequests: PaymentRequest[] = [];
