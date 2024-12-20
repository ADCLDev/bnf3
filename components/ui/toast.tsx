'use client';

import { Toaster } from 'react-hot-toast';

export function ToastProvider() {
  return <Toaster position="top-center" />;
}

export { toast } from 'react-hot-toast'; 