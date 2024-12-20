import { ReactNode } from 'react';
import './globals.css'
import { AuthProvider } from '@/components/providers/AuthProvider'
import { ToastProvider } from '@/components/ui/toast';

interface RootLayoutProps {
  children: ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>
          {children}
          <ToastProvider />
        </AuthProvider>
      </body>
    </html>
  );
} 