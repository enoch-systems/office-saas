import { Outfit } from 'next/font/google';
import type { Metadata } from "next";
import './globals.css';
import "flatpickr/dist/flatpickr.css";
import { SidebarProvider } from '@/context/SidebarContext';
import { ThemeProvider } from '@/context/ThemeContext';
import { PaymentPlanProvider } from '@/context/PaymentPlanContext';
import { AuthProvider } from '@/context/AuthContext';
import { NotificationProvider } from '@/context/NotificationContext';

const outfit = Outfit({
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "TT Academy Portal",
    template: "%s | TT Academy",
  },
  description: "Tech Trailblazer Academy student portal and admin workspace.",
  icons: {
    icon: [
      {
        url: "/favicon.ico",
        type: "image/x-icon",
      },
    ],
    shortcut: ["/favicon.ico"],
    apple: ["/favicon.ico"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${outfit.className} dark:bg-gray-900`}>
        <AuthProvider>
          <ThemeProvider>
            <PaymentPlanProvider>
              <NotificationProvider>
                <SidebarProvider>{children}</SidebarProvider>
              </NotificationProvider>
            </PaymentPlanProvider>
          </ThemeProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
