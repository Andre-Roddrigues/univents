'use client';

import React from 'react';

export interface Category {
  key: string;
  label: string;
  count: number;
}

interface EventCategoryProps {
  categories: Category[];
  activeFilter: string;
  onFilterChange: (filter: string) => void;
}

const EventCategory: React.FC<EventCategoryProps> = ({ 
  categories, 
  activeFilter, 
  onFilterChange 
}) => {
  return (
    <div className="flex flex-wrap gap-2 mb-8">
      {categories.map((category) => (
        <button
          key={category.key}
          onClick={() => onFilterChange(category.key)}
          className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
            activeFilter === category.key
              ? 'bg-primary text-primary-foreground shadow-sm'
              : 'bg-muted text-muted-foreground hover:bg-muted/80'
          }`}
        >
          {category.label}
          <span className="ml-2 text-xs opacity-75">({category.count})</span>
        </button>
      ))}
    </div>
  );
};

export default EventCategory;