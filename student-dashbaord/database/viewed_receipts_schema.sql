-- Create table to track viewed payment receipts
CREATE TABLE IF NOT EXISTS viewed_payment_receipts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  receipt_id UUID NOT NULL REFERENCES payment_receipts(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  viewed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Ensure a user can only view a receipt once
  UNIQUE(receipt_id, user_id)
);

-- Enable Row Level Security (RLS)
ALTER TABLE viewed_payment_receipts ENABLE ROW LEVEL SECURITY;

-- Create policies for viewed_payment_receipts table
-- Allow authenticated users to insert their own viewed receipts
CREATE POLICY "Users can insert their own viewed receipts" ON viewed_payment_receipts
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Allow authenticated users to view their own viewed receipts
CREATE POLICY "Users can view their own viewed receipts" ON viewed_payment_receipts
  FOR SELECT USING (auth.uid() = user_id);

-- Allow authenticated users to delete their own viewed receipts
CREATE POLICY "Users can delete their own viewed receipts" ON viewed_payment_receipts
  FOR DELETE USING (auth.uid() = user_id);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_viewed_payment_receipts_user_id ON viewed_payment_receipts(user_id);
CREATE INDEX IF NOT EXISTS idx_viewed_payment_receipts_receipt_id ON viewed_payment_receipts(receipt_id);
CREATE INDEX IF NOT EXISTS idx_viewed_payment_receipts_viewed_at ON viewed_payment_receipts(viewed_at);
