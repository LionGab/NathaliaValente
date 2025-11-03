import React, { useState } from 'react';
import { ImageIcon } from 'lucide-react';

interface ImageWithFallbackProps {
  src: string;
  alt: string;
  className?: string;
  fallbackSrc?: string;
  onError?: () => void;
}

export const ImageWithFallback: React.FC<ImageWithFallbackProps> = ({
  src,
  alt,
  className = '',
  fallbackSrc,
  onError,
}) => {
  const [imageError, setImageError] = useState(false);
  const [currentSrc, setCurrentSrc] = useState(src);

  const handleError = () => {
    if (!imageError && fallbackSrc) {
      setImageError(true);
      setCurrentSrc(fallbackSrc);
    } else {
      onError?.();
    }
  };

  if (imageError && !fallbackSrc) {
    return (
      <div className={`flex items-center justify-center bg-gray-200 dark:bg-gray-700 ${className}`}>
        <ImageIcon className="w-8 h-8 text-gray-400" aria-hidden="true" />
      </div>
    );
  }

  return (
    <img src={currentSrc} alt={alt} className={className} onError={handleError} loading="lazy" />
  );
};
