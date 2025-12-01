import React from 'react';
import Icon from '../ui/Icon';

const ProfileHeader = ({ onClose, title = 'Mi Perfil' }) => {
  return (
    <div className="flex items-center justify-between p-4 border-b border-neutral">
      <h2 className="text-xl font-bold text-secondary">{title}</h2>
      <button
        onClick={onClose}
        className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-neutral transition-colors"
      >
        <Icon name="close" size={24} />
      </button>
    </div>
  );
};

export default ProfileHeader;
