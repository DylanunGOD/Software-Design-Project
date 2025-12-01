import React from 'react';
import Icon from '../ui/Icon';

const LocationButton = ({ onClick }) => {
  return (
    <button
      onClick={onClick}
      className="w-12 h-12 rounded-full bg-white shadow-lg flex items-center justify-center hover:bg-neutral transition-colors"
    >
      <Icon name="location" size={24} />
    </button>
  );
};

export default LocationButton;
