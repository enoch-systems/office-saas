import { NextRequest, NextResponse } from 'next/server';
import {
  getAllPaymentReceipts,
  createPaymentReceipt as createPaymentReceiptDB,
  updatePaymentReceipt as updatePaymentReceiptDB
} from '@/lib/local-database';
import { uploadImageBuffer } from '@/lib/local-storage';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    
    const name = formData.get('name') as string;
    const email = formData.get('email') as string;
    const amountRaw = (formData.get('amount') as string)?.trim();
    const paymentType = formData.get('paymentType') as string || 'proof_submission';
    const proofImage = formData.get('proofImage') as File;
    const amountIsNumeric = /^\d+$/.test(amountRaw || '');
    const amount = Number.parseInt(amountRaw || '', 10);

    // Validate required fields
    if (!name || !email || !amountRaw || !proofImage) {
      return NextResponse.json(
        { error: 'Name, email, amount, and proof image are required' },
        { status: 400 }
      );
    }

    if (!amountIsNumeric || !Number.isFinite(amount) || amount < 0) {
      return NextResponse.json(
        { error: 'Amount must contain numbers only.' },
        { status: 400 }
      );
    }

    // Validate file type
    if (!proofImage.type.startsWith('image/')) {
      return NextResponse.json(
        { error: 'Invalid file type. Please upload an image.' },
        { status: 400 }
      );
    }

    // Upload image to local storage
    const buffer = Buffer.from(await proofImage.arrayBuffer());
    const uploadResult = await uploadImageBuffer(buffer, proofImage.name, 'payment-receipts');

    const normalizedEmail = email.trim().toLowerCase();
    // Create payment receipt record
    const paymentReceipt = {
      student_name: name,
      email: normalizedEmail,
      amount,
      payment_date: new Date().toISOString().split('T')[0],
      payment_type: paymentType,
      status: 'pending' as const,
      image_url: uploadResult.url,
      original_filename: uploadResult.originalFilename,
      submitted_at: new Date().toISOString(),
    };

    const data = await createPaymentReceiptDB(paymentReceipt);

    return NextResponse.json({
      success: true,
      message: 'Payment receipt uploaded successfully',
      data
    });

  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const limit = parseInt(searchParams.get('limit') || '50');
    const offset = parseInt(searchParams.get('offset') || '0');

    const allReceipts = await getAllPaymentReceipts();
    let filtered = allReceipts;

    if (status) {
      filtered = filtered.filter(r => r.status === status);
    }

    // Sort by submitted_at descending
    filtered.sort((a, b) => new Date(b.submitted_at).getTime() - new Date(a.submitted_at).getTime());
  
    // Apply pagination
    const data = filtered.slice(offset, offset + limit);

    return NextResponse.json({
      success: true,
      data
    });

  } catch (error) {
    console.error('Fetch error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}