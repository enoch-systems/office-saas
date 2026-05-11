-- Payment Receipts Table
CREATE TABLE IF NOT EXISTS payment_receipts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  student_name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  phone VARCHAR(20),
  amount DECIMAL(10,2) NOT NULL,
  payment_date DATE NOT NULL,
  payment_type VARCHAR(50) DEFAULT 'proof_submission',
  status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  cloudinary_public_id VARCHAR(255),
  cloudinary_url TEXT,
  original_filename VARCHAR(255),
  submitted_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  reviewed_at TIMESTAMP WITH TIME ZONE,
  reviewed_by UUID REFERENCES auth.users(id),
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security (RLS)
ALTER TABLE payment_receipts ENABLE ROW LEVEL SECURITY;

-- Create policies for the payment_receipts table
-- Allow anyone to insert payment receipts (for uploads)
CREATE POLICY "Anyone can insert payment receipts" ON payment_receipts
  FOR INSERT WITH CHECK (true);

-- Allow authenticated users to view all payment receipts (for admin dashboard)
CREATE POLICY "Authenticated users can view all payment receipts" ON payment_receipts
  FOR SELECT USING (auth.role() = 'authenticated');

-- Allow authenticated users to update payment receipts (for admin approval/rejection)
CREATE POLICY "Authenticated users can update payment receipts" ON payment_receipts
  FOR UPDATE USING (auth.role() = 'authenticated');

-- Create updated_at trigger
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_payment_receipts_updated_at 
  BEFORE UPDATE ON payment_receipts 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Create index for better performance
CREATE INDEX IF NOT EXISTS idx_payment_receipts_status ON payment_receipts(status);
CREATE INDEX IF NOT EXISTS idx_payment_receipts_submitted_at ON payment_receipts(submitted_at);
CREATE INDEX IF NOT EXISTS idx_payment_receipts_email ON payment_receipts(email);
