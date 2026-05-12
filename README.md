# Student Offline Database System

A comprehensive offline student management database for handling student registrations, payment verification, email communications, and administrative tasks. This system operates as a **desktop application** with a one-click launcher, providing a complete student information management solution.

## Quick Start (Desktop App)

### 1. First Time Setup

```bash
git clone https://github.com/enoch-systems/office-saas.git
cd offline-saas
npm install
```

### 2. Launch the App

Choose any of these methods:

| Method | How | Result |
|--------|-----|--------|
| **Desktop Shortcut** | Right-click `create-desktop-shortcut.ps1` → Run with PowerShell → then double-click desktop icon | ✅ One-click launch with custom icon |
| **Silent Launcher** | Double-click `launch-app.vbs` | ✅ Opens app directly (no terminal) |
| **Batch Launcher** | Double-click `launch-app.bat` | ✅ Opens app with status messages |
| **Command Line** | `npm run desktop` | ✅ Builds + launches Electron |

> **First launch may take a moment** while the server starts. The app will auto-retry.

### 3. Development Mode

```bash
npm run dev          # Start dev server on http://localhost:3000
npm run electron-dev # Dev server + Electron window (hot reload)
```

### 4. Build for Distribution

```bash
npm run electron-build   # Creates installer in dist/
npm run electron-package # Creates portable .exe
```

## Tech Stack

### Frontend Framework
- **Next.js 16.1.6** - React-based full-stack framework
- **React 19.2.0** - UI library
- **TypeScript 5.9.3** - Type-safe JavaScript

### UI & Styling
- **Tailwind CSS 4.1.17** - Utility-first CSS framework
- **Tailwind Forms** - Form styling utilities
- **Lucide React** - Icon library
- **Swiper** - Carousel/slider component

### Desktop Application
- **Electron 42.0.1** - Cross-platform desktop app framework
- **Electron Builder 26.8.1** - Packaging and distribution
- **VBS Launcher** - Silent one-click desktop launch
- **PowerShell Shortcut** - Desktop icon creator with custom icon

### Database
- **Supabase** - PostgreSQL database with real-time features
- **SQLite** - Local offline database support
- **UUID extension** - For unique identifiers

### Charts & Visualizations
- **ApexCharts 4.7.0** - Chart library
- **React ApexCharts** - React wrapper for ApexCharts
- **React JVectorMap** - Interactive vector maps

### Calendar & Date Handling
- **FullCalendar** - Calendar component suite
- **Flatpickr** - Date picker library

### File Handling
- **React DnD** - Drag and drop functionality
- **React Dropzone** - File upload component

### Email Services
- **Resend** - Email delivery service

### Development Tools
- **ESLint** - Code linting
- **Prettier** - Code formatting
- **PostCSS** - CSS processing
- **Concurrently** - Run multiple scripts simultaneously

## Project Structure

```
offline-saas/
├── src/                      # Application source code
│   ├── app/                  # Next.js pages & API routes
│   ├── components/           # React components
│   ├── context/              # React context providers
│   ├── data/                 # Data handling modules
│   ├── email-sender/         # Email sending functionality
│   ├── hooks/                # Custom React hooks
│   ├── icons/                # SVG/icon components
│   ├── layout/               # Layout components
│   ├── lib/                  # Utilities (Supabase, Database)
│   ├── types/                # TypeScript type definitions
│   └── utils/                # Helper utilities
│
├── public/                   # Static assets & Electron
│   ├── electron.js           # Electron main process (auto-starts server)
│   └── preload.js            # Electron preload script
│
├── assets/                   # App icons
│   ├── icon.ico              # Windows icon (256x256, multi-size)
│   └── icon.png              # Source PNG icon
│
├── database/                 # SQL schemas & scripts
├── data/                     # JSON data files & SQLite DB
├── install/                  # Installer config (Inno Setup)
│
├── launch-app.vbs            # Silent desktop launcher (no terminal)
├── launch-app.bat            # Batch launcher (shows status)
├── create-desktop-shortcut.ps1  # Desktop shortcut creator
├── next.config.ts            # Next.js configuration
├── package.json              # Project dependencies & scripts
└── .gitignore                # Git ignored files
```

## Available Scripts

| Script | Command | Description |
|--------|---------|-------------|
| `dev` | `npm run dev` | Start Next.js dev server on :3000 |
| `build` | `npm run build` | Build Next.js for production |
| `start` | `npm run start` | Start production server |
| `electron` | `npm run electron` | Launch Electron app (requires running server) |
| `electron-dev` | `npm run electron-dev` | Dev server + Electron window with hot reload |
| `electron-build` | `npm run electron-build` | Build + create NSIS installer |
| `electron-package` | `npm run electron-package` | Build + create portable .exe |
| `desktop` | `npm run desktop` | Build + launch Electron app (one command) |
| `dist` | `npm run dist` | Package with electron-builder |
| `lint` | `npm run lint` | Run ESLint |

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

This project is proprietary software for Student Database Management.

## Team

- **Development**: Student Database Team
- **Project**: Offline Student Management System

## Features Breakdown

### Desktop Launcher
- **Double-click to launch** - No terminal, no commands needed
- **Auto-installs dependencies** if missing on first run
- **Auto-builds** the Next.js app if not yet built
- **Custom icon** on the window and desktop shortcut
- **Auto-starts the server** internally on port 3456
- **Auto-retries** on connection failure
- **Graceful shutdown** - server closes when you close the window

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
1. **Launch App**: Double-click the desktop shortcut
2. **Login**: Use your admin credentials
3. **Review Payments**: Check payment checker for new submissions
4. **Send Emails**: Use email portal to communicate with students
5. **Manage Students**: View and filter students in the student database

### Student Workflow
1. **Register**: Complete the form at `/register`
2. **Upload Payment**: Submit payment proof at `/paymentupload`
3. **Wait for Verification**: Admin reviews and approves payments

## Customization

### Styling the App
You can fully customize the look and feel:
- **Global styles**: Edit `src/app/globals.css`
- **Tailwind CSS**: Use utility classes in any component (e.g., `className="bg-blue-500"`)
- **Components**: Modify styles in `src/components/`
- **Layout**: Edit `src/app/layout.tsx` for overall page structure
- **Colors, fonts, animations**: All fully customizable

### Changing the Desktop Icon
Replace `assets/icon.png` with your own image (256x256 recommended), then run:
```bash
python -c "from PIL import Image; img = Image.open('assets/icon.png').resize((256,256)); img.save('assets/icon.ico', format='ICO', sizes=[(256,256),(128,128),(64,64),(48,48),(32,32),(16,16)])"
```

## Offline Architecture

### Database Storage
- **Supabase PostgreSQL**: All data stored in Supabase PostgreSQL database
- **SQLite (Local)**: Local database support for full offline operation
- **Real-time Features**: Live data synchronization
- **UUID Extensions**: Unique identifier generation for records
- **Offline Capable**: Electron app provides offline functionality

### File Storage
- **Supabase Storage**: Images and files stored in Supabase cloud storage
- **Organized Structure**: Separate folders for different file types
- **Direct Access**: Files served through Supabase CDN

### Authentication
- **Local Session Management**: Sessions stored in browser localStorage
- **Admin Credentials**: Configured through local authentication system
- **No External Dependencies**: Complete offline operation

## Data Structure

### Student Data
Stored in Supabase PostgreSQL database:
- Personal information (name, email, phone, etc.)
- Registration details
- Payment information
- Course and learning track data
- UUID-based record identification

### Payment Receipts
Stored in Supabase PostgreSQL database:
- Payment submission details
- Image file references to Supabase Storage
- Status tracking
- Review information

### Email Follow-ups
Stored in Supabase PostgreSQL database:
- Email communication history
- Template usage tracking
- Delivery status via Resend API

## Support

For support and questions, please contact: development team.

---

## Key Benefits of Offline Architecture

- **No External Dependencies**: Complete independence from cloud services
- **Data Privacy**: All data stored locally, full control over information
- **Cost Effective**: No subscription fees for database or storage services
- **Fast Performance**: Local data access without network latency
- **Reliability**: No downtime due to external service issues
- **Easy Deployment**: One-click desktop launcher with custom icon
