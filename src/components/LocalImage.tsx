import { useState } from 'react';

interface LocalImageProps {
  src: string;
  alt: string;
  className?: string;
  fallbackText?: string;
}

export function LocalImage({ src, alt, className = '', fallbackText }: LocalImageProps) {
  const [error, setError] = useState(false);

  if (error) {
    return (
      <div
        className={`flex items-center justify-center bg-surface2 text-subtle text-[10px] font-bold ${className}`}
        title={alt}
      >
        {fallbackText || '?'}
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      className={className}
      onError={() => setError(true)}
    />
  );
}
