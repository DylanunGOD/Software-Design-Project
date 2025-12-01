import React from 'react';
import Icon from '../ui/Icon';

const TripItem = ({ trip }) => {
  return (
    <div className="flex items-center justify-between p-3 bg-neutral rounded-lg">
      <div className="flex items-center gap-3 flex-1">
        <div className="w-8 h-8 flex items-center justify-center">
          <Icon name={trip.iconName} size={24} className="text-primary" />
        </div>
        <div className="flex-1">
          <p className="font-medium text-secondary">{trip.type}</p>
          <p className="text-sm text-neutralDark">{trip.duration} • {trip.date}</p>
          <p className="text-xs text-primary font-medium mt-1">
            {trip.fromCanton} → {trip.toCanton}
          </p>
        </div>
      </div>
      <div className="text-right">
        <p className="font-bold text-secondary">{trip.price}</p>
      </div>
    </div>
  );
};

export default TripItem;
