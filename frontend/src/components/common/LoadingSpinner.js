import React from 'react';

const LoadingSpinner = ({ size = 'md', text = '' }) => {
  const sizeClass = size === 'sm' ? 'loading-spinner-sm' : 
                   size === 'lg' ? 'loading-spinner-lg' : 'loading-spinner';

  return (
    <div className="flex flex-col items-center justify-center p-4">
      <div className={sizeClass}></div>
      {text && <p className="mt-2 text-sm text-gray-600">{text}</p>}
    </div>
  );
};

export default LoadingSpinner;