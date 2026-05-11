# Office SaaS - Offline Management System

A comprehensive offline office management dashboard for handling student registrations, payment verification, email communications, and administrative tasks. This system operates entirely offline with no external dependencies.

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
- **Offline Authentication**: Secure authentication using local storage
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
- **Database**: Local JSON file storage (offline)
- **File Storage**: Local file system (offline)
- **State Management**: React Context API
- **Icons**: Lucide React

## Installation

1. **Clone repository**
   ```bash
   git clone https://github.com/enoch-systems/office-saas.git
   cd office-saas
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Run development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   Navigate to `http://localhost:3000`

## Available Routes

### Public Routes
- `/register` - Registration form
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
- `POST /api/register` - Submit registration

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
- `AuthPage` - Login page with offline authentication

## Contributing

1. Fork repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is proprietary software for Office SaaS Management.

## Team

- **Development**: Office SaaS Team
- **Project**: Offline Management System

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
1. **Login**: Access `/authpage` with your admin credentials
2. **Review Payments**: Check `/email-portal/payment-checker` for new submissions
3. **Send Emails**: Use `/email-portal` to communicate with students
4. **Manage Students**: View and filter students in the student database

### Student Workflow
1. **Register**: Complete the form at `/register`
2. **Upload Payment**: Submit payment proof at `/paymentupload`
3. **Wait for Verification**: Admin reviews and approves payments

## Offline Architecture

### Database Storage
- **JSON File Storage**: All data stored in local JSON files in `/data` directory
- **Automatic Initialization**: Database files are created automatically on first run
- **Data Persistence**: All changes are persisted to local files

### File Storage
- **Local Upload Directory**: Images and files stored in `/public/uploads`
- **Organized Structure**: Separate folders for different file types
- **Direct Access**: Files served directly from local storage

### Authentication
- **Local Session Management**: Sessions stored in browser localStorage
- **Admin Credentials**: Configured through local authentication system
- **No External Dependencies**: Complete offline operation

## Data Structure

### Student Data
Stored in `/data/students.json`:
- Personal information (name, email, phone, etc.)
- Registration details
- Payment information
- Course and learning track data

### Payment Receipts
Stored in `/data/payment-receipts.json`:
- Payment submission details
- Image file references
- Status tracking
- Review information

### Email Follow-ups
Stored in `/data/email-followups.json`:
- Email communication history
- Template usage tracking
- Delivery status

## Support

For support and questions, please contact: development team.

---

## Key Benefits of Offline Architecture

- **No External Dependencies**: Complete independence from cloud services
- **Data Privacy**: All data stored locally, full control over information
- **Cost Effective**: No subscription fees for database or storage services
- **Fast Performance**: Local data access without network latency
- **Reliability**: No downtime due to external service issues
- **Easy Deployment**: Simple setup without complex configurations
