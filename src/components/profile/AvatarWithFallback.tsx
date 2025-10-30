'use client';

import React from 'react';

interface AvatarWithFallbackProps {
  src: string;
  alt: string;
  username: string;
  width?: number;
  height?: number;
  className?: string;
}

export default function AvatarWithFallback({ src, alt, username, width = 32, height = 32, className = "w-8 h-8 rounded-full" }: AvatarWithFallbackProps) {
  const handleError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    e.currentTarget.src = 'https://ui-avatars.com/api/?name=' +
                          encodeURIComponent(username || 'User');
  };

  return (
    <img
      src={src || '/placeholder-user.jpg'}
      alt={alt}
      width={width}
      height={height}
      className={className}
      onError={handleError}
    />
  );
}
