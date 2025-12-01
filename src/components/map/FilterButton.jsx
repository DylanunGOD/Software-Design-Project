import React from 'react';
import Icon from '../ui/Icon';

const FilterButton = ({ onClick, isActive = false }) => {
  return (
    <button
      onClick={onClick}
      className={`w-12 h-12 rounded-full shadow-lg flex items-center justify-center transition-all ${
        isActive 
          ? 'bg-primary text-white' 
          : 'bg-white text-secondary hover:bg-neutral'
      }`}
    >
      <Icon name="filter" size={24} />
    </button>
  );
};

export default FilterButton;
