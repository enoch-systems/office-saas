import { NextRequest, NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    
    const name = formData.get('name') as string;
    const email = formData.get('email') as string;
    const proofImage = formData.get('proofImage') as File;

    // Validate required fields
    if (!name || !email || !proofImage) {
      return NextResponse.json(
        { error: 'Name, email, and proof image are required' },
        { status: 400 }
      );
    }

    // Create uploads directory if it doesn't exist
    const uploadsDir = join(process.cwd(), 'public', 'payment-proofs');
    try {
      await mkdir(uploadsDir, { recursive: true });
    } catch (error) {
      // Directory might already exist, that's fine
    }

    // Generate unique filename
    const timestamp = Date.now();
    const fileExtension = proofImage.name.split('.').pop();
    const fileName = `${name.replace(/\s+/g, '_')}_${timestamp}.${fileExtension}`;
    const filePath = join(uploadsDir, fileName);

    // Save the file
    const buffer = Buffer.from(await proofImage.arrayBuffer());
    await writeFile(filePath, buffer);

    // Create payment request data
    const paymentRequest = {
      id: Date.now(), // Simple ID generation
      name,
      email,
      phone: '', // Default empty since not collected
      amount: 0, // Default 0 since not collected
      paymentDate: new Date().toISOString().split('T')[0], // Use current date
      imageUrl: `/payment-proofs/${fileName}`,
      status: 'pending',
      submittedAt: new Date().toISOString().replace('T', ' ').slice(0, 19),
    };

    // Here you would typically save to a database
    // For now, we'll just return success with the data
    console.log('Payment request submitted:', paymentRequest);

    return NextResponse.json({
      success: true,
      message: 'Payment proof submitted successfully',
      data: paymentRequest
    });

  } catch (error) {
    console.error('Error uploading payment proof:', error);
    return NextResponse.json(
      { error: 'Failed to upload payment proof' },
      { status: 500 }
    );
  }
}
