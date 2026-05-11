# Tech Trailblazer Academy Dashboard

A comprehensive admin dashboard for managing student registrations, payment verification, email communications, and scholarship applications for the Tech Trailblazer Academy program.

## Features

### Student Management
- **Student Database**: View and manage all registered students with advanced filtering and pagination
- **Date/Time Sorting**: Sort students by registration date (Newest First, Oldest First, Default)
- **Search Functionality**: Quick search by name, email, or course
- **Student Details Modal**: View comprehensive student information

### Payment System
- **Payment Checker**: Review and verify payment proof submissions
- **Payment Upload**: Public-facing form for students to submit payment proofs
- **Real-time Notifications**: Amber "New message!" indicators for unviewed payments
- **Notification Sync**: Integrated notification system across admin panel
- **Image Verification**: View uploaded payment proof images in modal

### Email Portal
- **Email Follow-up**: Send various types of emails to students
- **Email Templates**: Pre-built templates for different scenarios:
  - Welcome emails
  - Payment reminders
  - Installment notifications
  - Full payment confirmations
  - Resumption reminders
- **Email Preview**: Preview emails before sending
- **Date/Time Filtering**: Sort students by timestamp for targeted outreach

### Registration System
- **Public Registration Form**: Comprehensive registration form for scholarship applicants
- **Data Collection**: Collects detailed information including:
  - Personal details (name, phone, email, gender, state)
  - Learning track preferences
  - Employment status
  - Scholarship application interest
  - Motivation for learning
- **Form Validation**: Required field validation and error handling

### Authentication
- **Supabase Integration**: Secure authentication using Supabase
- **Admin Login**: Protected admin routes with email/password authentication
- **Session Management**: Automatic session handling

### User Interface
- **Dark Mode**: Full dark mode support
- **Responsive Design**: Mobile-friendly interface
- **Modern UI**: Clean, professional design using Tailwind CSS
- **Sidebar Navigation**: Intuitive navigation with collapsible menu
- **Notification System**: Real-time notification bell with dropdown

## Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS 4
- **Authentication**: Supabase
- **Email**: Resend
- **File Storage**: Cloudinary
- **State Management**: React Context API
- **Icons**: Lucide React

## Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/enoch-systems/dashboard-tt.git
   cd dashboard-tt
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   Create a `.env.local` file in the root directory:
   ```env
   # Supabase Configuration
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

   # Resend API Key (for email functionality)
   RESEND_API_KEY=your_resend_api_key

   # Cloudinary Configuration (for image uploads)
   CLOUDINARY_CLOUD_NAME=your_cloud_name
   CLOUDINARY_API_KEY=your_api_key
   CLOUDINARY_API_SECRET=your_api_secret
   NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET=your_upload_preset
   ```

4. **Run the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to `http://localhost:3000`

## Available Routes

### Public Routes
- `/register` - Scholarship registration form
- `/paymentupload` - Payment proof upload form
- `/authpage` - Admin login page

### Admin Routes (Protected)
- `/` - Main dashboard
- `/email-portal` - Email follow-up system
- `/email-portal/payment-checker` - Payment verification
- `/students` - Student database
- `/profile` - User profile settings

## API Endpoints

### Authentication
- `POST /api/auth/login` - Admin login

### Registration
- `POST /api/register` - Submit scholarship registration

### Payment
- `POST /api/upload-payment` - Upload payment proof

### Email
- `POST /api/send-email` - Send email to students
- `POST /api/preview-email` - Preview email before sending

## Key Components

### Student Management
- `StudentDatabaseTable` - Main student table with filtering and pagination
- `StudentDetailModal` - Detailed student information modal

### Payment System
- `PaymentChecker` - Review payment submissions
- `PaymentUploadForm` - Payment proof upload form

### Email System
- `EmailPage` - Email composition and sending
- `SelectEmailType` - Email type selection
- `ConfirmEmailType` - Email confirmation

### Registration
- `RegistrationForm` - Comprehensive registration form

### Authentication
- `AuthPage` - Login page with Supabase integration

## Configuration

### Supabase Setup
1. Create a Supabase project at https://supabase.com
2. Enable email/password authentication in Auth settings
3. Create an admin user in the Authentication > Users section
4. Copy your project URL and anon key to `.env.local`

### Email Setup (Resend)
1. Create an account at https://resend.com
2. Get your API key from the dashboard
3. Add the API key to `.env.local`

### Cloudinary Setup (Optional)
1. Create an account at https://cloudinary.com
2. Create an upload preset for unsigned uploads
3. Add credentials to `.env.local`

## Features Breakdown

### Date/Time Filters
All main pages (PaymentChecker, EmailPage, StudentDatabaseTable) include:
- **Default**: No sorting (original order)
- **Newest First**: Most recent submissions first
- **Oldest First**: Earliest submissions first

### Notification System
- **Real-time Updates**: New payment requests appear in notification bell
- **Viewed Tracking**: Notifications disappear when viewed
- **Cross-Component Sync**: PaymentChecker and notifications stay synchronized
- **Amber Indicators**: Visual "New message!" indicators for unviewed items

### Pagination
- **Fixed Page Size**: 20 items per page
- **Page Navigation**: Previous, Next, and numbered page buttons
- **Auto-Reset**: Pagination resets when filters or search changes
- **Scroll to Top**: Automatically scrolls to top on page change

## Usage

### Admin Workflow
1. **Login**: Access `/authpage` with your Supabase credentials
2. **Review Payments**: Check `/email-portal/payment-checker` for new submissions
3. **Send Emails**: Use `/email-portal` to communicate with students
4. **Manage Students**: View and filter students in the student database

### Student Workflow
1. **Register**: Complete the form at `/register`
2. **Upload Payment**: Submit payment proof at `/paymentupload`
3. **Wait for Verification**: Admin reviews and approves payments

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is proprietary software for Tech Trailblazer Academy.

## Team

- **Development**: Tech Trailblazer Academy Team
- **Project**: Dashboard Management System

## Support

For support and questions, please contact the development team.

---


