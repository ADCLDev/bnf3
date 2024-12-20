import React from 'react';
import { Loader2 } from 'lucide-react';

interface LoadingProps {
  size?: 'sm' | 'md' | 'lg';
  variant?: 'spinner' | 'dots' | 'pulse';
  color?: 'primary' | 'secondary' | 'white';
  text?: string;
}

const getSpinnerSize = (size: LoadingProps['size']) => {
  switch (size) {
    case 'sm': return 'w-4 h-4';
    case 'lg': return 'w-12 h-12';
    default: return 'w-8 h-8';
  }
};

const getTextSize = (size: LoadingProps['size']) => {
  switch (size) {
    case 'sm': return 'text-xs';
    case 'lg': return 'text-lg';
    default: return 'text-sm';
  }
};

const getSpinnerColor = (color: LoadingProps['color']) => {
  switch (color) {
    case 'secondary': return 'text-gray-600';
    case 'white': return 'text-white';
    default: return 'text-blue-600';
  }
};

export const LoadingSpinner: React.FC<LoadingProps> = ({ 
  size = 'md', 
  color = 'primary',
  variant = 'spinner',
  text
}) => {
  const sizeClass = getSpinnerSize(size);
  const colorClass = getSpinnerColor(color);
  const textSizeClass = getTextSize(size);

  return (
    <div className="flex flex-col items-center justify-center gap-3">
      {variant === 'spinner' && (
        <div className={`relative ${sizeClass}`}>
          <div className="absolute inset-0 rounded-full border-2 border-gray-200 opacity-25"></div>
          <div className={`absolute inset-0 rounded-full border-2 border-t-transparent animate-spin ${colorClass}`}></div>
        </div>
      )}

      {variant === 'dots' && (
        <div className="flex gap-1">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className={`${sizeClass} rounded-full ${colorClass} animate-bounce`}
              style={{ animationDelay: `${i * 0.15}s` }}
            ></div>
          ))}
        </div>
      )}

      {variant === 'pulse' && (
        <div className={`${sizeClass} ${colorClass} animate-pulse`}>
          <Loader2 className="w-full h-full animate-spin" />
        </div>
      )}

      {text && <p className={`${textSizeClass} ${colorClass}`}>{text}</p>}
    </div>
  );
};

export const LoadingPage: React.FC<Omit<LoadingProps, 'size'>> = (props) => (
  <div className="flex items-center justify-center min-h-screen">
    <LoadingSpinner size="lg" {...props} />
  </div>
);

export const LoadingSection: React.FC<LoadingProps> = (props) => (
  <div className="flex items-center justify-center min-h-[400px] p-8">
    <LoadingSpinner {...props} />
  </div>
);

export const LoadingInline: React.FC<LoadingProps> = (props) => (
  <div className="flex items-center justify-center p-2">
    <LoadingSpinner size="sm" {...props} />
  </div>
);

export default LoadingSpinner;