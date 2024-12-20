// src/app/(root)/layout.tsx
import { ReactNode } from 'react';
import '../globals.css';
import Navbar from '@/components/shared/Navbar';
import Footer from '@/components/shared/Footer';

interface LayoutProps {
  children: ReactNode;
}

export default function RootLayout({ children }: LayoutProps) {
  return (
    <>
      <Navbar />
      <main className="min-h-screen">{children}</main>
      <Footer />
    </>
  );
}
