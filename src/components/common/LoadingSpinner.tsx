import React from 'react';

interface LoadingSpinnerProps {
  fullPage?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

const sizeMap = { sm: 'w-5 h-5', md: 'w-8 h-8', lg: 'w-12 h-12' };

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ fullPage = false, size = 'md' }) => {
  const spinner = (
    <div className={`animate-spin rounded-full border-4 border-gray-200 border-t-primary-600 ${sizeMap[size]}`} />
  );

  if (fullPage) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-white bg-opacity-75 z-50">
        {spinner}
      </div>
    );
  }

  return <div className="flex justify-center py-8">{spinner}</div>;
};

export default LoadingSpinner;
