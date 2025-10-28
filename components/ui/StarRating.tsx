// components/ui/StarRating.tsx
'use client';

import { useState } from 'react';
import { Star } from 'lucide-react';

interface StarRatingProps {
  rating: number;
  onRatingChange: (rating: number) => void;
  size?: 'sm' | 'md' | 'lg';
  readonly?: boolean;
}

export function StarRating({ 
  rating, 
  onRatingChange, 
  size = 'md', 
  readonly = false 
}: StarRatingProps) {
  const [hoverRating, setHoverRating] = useState(0);

  const sizeClasses = {
    sm: 'w-5 h-5',
    md: 'w-6 h-6',
    lg: 'w-8 h-8'
  };

  const handleStarClick = (starRating: number) => {
    if (!readonly) {
      onRatingChange(starRating);
    }
  };

  const handleStarHover = (starRating: number) => {
    if (!readonly) {
      setHoverRating(starRating);
    }
  };

  const handleStarLeave = () => {
    if (!readonly) {
      setHoverRating(0);
    }
  };

  return (
    <div className="flex items-center space-x-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          onClick={() => handleStarClick(star)}
          onMouseEnter={() => handleStarHover(star)}
          onMouseLeave={handleStarLeave}
          className={`focus:outline-none ${readonly ? 'cursor-default' : 'cursor-pointer'}`}
          disabled={readonly}
        >
          <Star
            className={`${sizeClasses[size]} transition-colors ${
              star <= (hoverRating || rating)
                ? 'fill-yellow-400 text-yellow-400'
                : readonly 
                ? 'text-gray-300'
                : 'text-gray-300 hover:text-yellow-400'
            }`}
          />
        </button>
      ))}
      {!readonly && (
        <span className="ml-2 text-sm font-medium text-gray-700 dark:text-gray-300">
          {rating}.0
        </span>
      )}
    </div>
  );
}