// Local File Storage Implementation (replaces Cloudinary)
import { writeFile, mkdir } from 'fs/promises';
import { existsSync } from 'fs';
import { join } from 'path';

const UPLOAD_DIR = join(process.cwd(), 'public', 'uploads');
const PAYMENT_RECEIPTS_DIR = join(UPLOAD_DIR, 'payment-receipts');
const BANNERS_DIR = join(UPLOAD_DIR, 'banners');

// Initialize upload directories
async function initStorage() {
  try {
    const dirs = [UPLOAD_DIR, PAYMENT_RECEIPTS_DIR, BANNERS_DIR];
    for (const dir of dirs) {
      if (!existsSync(dir)) {
        await mkdir(dir, { recursive: true });
      }
    }
  } catch (error) {
    console.error('Error initializing storage:', error);
  }
}

// Generate unique filename
function generateFileName(originalName: string): string {
  const timestamp = Date.now();
  const randomString = Math.random().toString(36).substring(2, 11);
  const extension = originalName.split('.').pop() || 'jpg';
  const nameWithoutExt = originalName.split('.').slice(0, -1).join('.').replace(/[^a-zA-Z0-9]/g, '_');
  return `${nameWithoutExt}_${timestamp}_${randomString}.${extension}`;
}

// Function to get optimized image URL (just returns the path)
export function getOptimizedImageUrl(publicId: string, options?: {
  width?: number;
  height?: number;
  crop?: string;
  format?: string;
  quality?: number;
}) {
  // For local storage, just return the path
  // In a real app, you might use sharp or similar for image optimization
  return publicId;
}

// Banner image constants
export const BANNER_IMAGE_ID = '/banner.jpeg';
export const BOOTCAMP_BANNER_IMAGE_ID = '/banner.jpeg';

// Pre-configured banner URLs
export function getBannerImageUrl() {
  return BANNER_IMAGE_ID;
}

export function getBootcampBannerImageUrl() {
  return BOOTCAMP_BANNER_IMAGE_ID;
}

// Upload image to local storage
export async function uploadImageToCloudinary(file: File, folder: string = 'payment-receipts') {
  try {
    await initStorage();
    
    const buffer = await file.arrayBuffer();
    const fileName = generateFileName(file.name);
    
    let targetDir = UPLOAD_DIR;
    if (folder === 'payment-receipts') {
      targetDir = PAYMENT_RECEIPTS_DIR;
    } else if (folder === 'banners') {
      targetDir = BANNERS_DIR;
    }

    const filePath = join(targetDir, fileName);
    await writeFile(filePath, Buffer.from(buffer));

    // Return URL path relative to public directory
    const publicPath = `/uploads/${folder}/${fileName}`;

    return {
      publicId: publicPath,
      url: publicPath,
      originalFilename: file.name
    };
  } catch (error) {
    console.error('Error uploading to local storage:', error);
    throw error;
  }
}

// Delete image from local storage (kept for compatibility)
export async function deleteImageFromCloudinary(publicId: string) {
  try {
    // For simplicity, we'll just return true
    // In a production app, you might want to actually delete the file
    console.log(`Would delete image: ${publicId}`);
    return true;
  } catch (error) {
    console.error('Error deleting from local storage:', error);
    return false;
  }
}

// Upload image with Buffer (for API routes)
export async function uploadImageBuffer(buffer: Buffer, originalName: string, folder: string = 'payment-receipts') {
  try {
    await initStorage();
    
    const fileName = generateFileName(originalName);
    
    let targetDir = UPLOAD_DIR;
    if (folder === 'payment-receipts') {
      targetDir = PAYMENT_RECEIPTS_DIR;
    } else if (folder === 'banners') {
      targetDir = BANNERS_DIR;
    }

    const filePath = join(targetDir, fileName);
    await writeFile(filePath, buffer);

    // Return URL path relative to public directory
    const publicPath = `/uploads/${folder}/${fileName}`;

    return {
      publicId: publicPath,
      url: publicPath,
      originalFilename: originalName
    };
  } catch (error) {
    console.error('Error uploading buffer to local storage:', error);
    throw error;
  }
}
