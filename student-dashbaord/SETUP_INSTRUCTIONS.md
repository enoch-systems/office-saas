# Payment Receipt System Setup Instructions

This document provides the complete setup instructions for the integrated Supabase + Cloudinary payment receipt system.

## Environment Variables Required

Create a `.env.local` file in your project root with the following variables:

### Supabase Configuration
```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
```

### Cloudinary Configuration
```env
# Cloudinary Configuration
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
```

## Step-by-Step Setup

### 1. Supabase Database Setup

1. **Create a Supabase Project**
   - Go to [supabase.com](https://supabase.com)
   - Create a new project
   - Note your project URL and API keys

2. **Run the Database Schema**
   - Copy the SQL code from `database/payment_receipts_schema.sql`
   - Run it in your Supabase SQL Editor
   - This will create the `payment_receipts` table with proper RLS policies

3. **Get Your Keys**
   - Go to Project Settings > API
   - Copy the Project URL, Anon Key, and Service Role Key
   - Add them to your `.env.local` file

### 2. Cloudinary Setup

1. **Create a Cloudinary Account**
   - Go to [cloudinary.com](https://cloudinary.com)
   - Sign up for a free account

2. **Get Your Credentials**
   - Go to Dashboard > Account Details
   - Note your Cloud Name, API Key, and API Secret
   - Add them to your `.env.local` file

3. **Create Upload Folder (Optional)**
   - The system will automatically create a `payment-receipts` folder
   - You can organize your uploads in the Cloudinary dashboard

### 3. Install Dependencies

The required dependencies are already in your `package.json`:
- `@supabase/supabase-js`
- `cloudinary`

If needed, install them:
```bash
npm install @supabase/supabase-js cloudinary
```

### 4. Update Your Layout

Make sure your `app/layout.tsx` includes the `NotificationProvider`:

```tsx
import { NotificationProvider } from '@/context/NotificationContext';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <NotificationProvider>
          {children}
        </NotificationProvider>
      </body>
    </html>
  );
}
```

## How It Works

### Payment Upload Flow
1. User fills out the payment form (name, email, phone, amount, date, image)
2. Image is uploaded to Cloudinary
3. Payment details are saved to Supabase with Cloudinary URL
4. Admin receives notification in real-time

### Admin Notification System
1. Notification bell shows count of pending receipts
2. Clicking notification redirects to payment checker page
3. Auto-refreshes every 30 seconds
4. Shows "New message!" indicator for unviewed receipts

### Payment Review Process
1. Admin views payment details and receipt image
2. Can approve or reject payments
3. Status updates are saved to Supabase
4. Notification count updates automatically

## File Structure

```
src/
├── app/api/payment-receipts/
│   └── route.ts                 # API endpoints for upload/fetch
├── components/
│   ├── students/
│   │   ├── PaymentUploadForm.tsx    # Upload form component
│   │   └── PaymentChecker.tsx       # Admin dashboard
│   ├── header/
│   │   └── NotificationDropdown.tsx # Notification system
│   └── common/
│       └── NotificationBell.tsx     # Alternative notification component
├── context/
│   └── NotificationContext.tsx      # Notification state management
├── lib/
│   ├── supabase.ts              # Supabase client
│   ├── cloudinary.ts            # Cloudinary utilities
│   └── paymentReceiptService.ts # Business logic
└── types/
    └── database.ts              # TypeScript definitions
```

## Testing the System

1. **Upload Test**
   - Navigate to your payment upload page
   - Fill in all required fields
   - Upload an image
   - Submit and check for success message

2. **Admin Dashboard Test**
   - Navigate to payment checker page
   - Verify the uploaded receipt appears
   - Click "View Proof" to see the image
   - Test approve/reject functionality

3. **Notification Test**
   - Check the notification bell shows count
   - Click notification to redirect
   - Verify count updates after approval

## Security Notes

- Row Level Security (RLS) is enabled on the payment_receipts table
- Service Role Key should only be used on the server-side
- Anon Key is safe for client-side use
- Cloudinary uploads are secured with your API credentials

## Troubleshooting

### Common Issues

1. **Supabase Connection Error**
   - Verify your environment variables are correct
   - Check your Supabase project is active
   - Ensure RLS policies are properly set

2. **Cloudinary Upload Error**
   - Verify Cloudinary credentials
   - Check your Cloudinary account has upload permissions
   - Ensure image file size is within limits

3. **Notifications Not Working**
   - Verify NotificationProvider is in your layout
   - Check browser console for errors
   - Ensure API endpoints are accessible

### Debug Mode

Add this to your `.env.local` for debugging:
```env
DEBUG=true
```

## Production Deployment

1. **Environment Variables**
   - Add all environment variables to your hosting platform
   - Never commit `.env.local` to version control

2. **Database Migrations**
   - Use Supabase migrations for production database setup
   - Test migrations in staging first

3. **CORS Settings**
   - Configure CORS in both Supabase and Cloudinary
   - Add your production domain to allowed origins

## Support

For issues with:
- **Supabase**: Check [Supabase Docs](https://supabase.com/docs)
- **Cloudinary**: Check [Cloudinary Docs](https://cloudinary.com/documentation)
- **This Integration**: Review the code comments and error messages
