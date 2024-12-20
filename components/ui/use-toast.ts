import { toast as hotToast } from 'react-hot-toast';

interface ToastProps {
  title: string;
  description?: string;
  variant?: 'default' | 'destructive';
}

export const toast = ({ title, description, variant }: ToastProps) => {
  if (variant === 'destructive') {
    return hotToast.error(description || title);
  }
  return hotToast.success(description || title);
}; 