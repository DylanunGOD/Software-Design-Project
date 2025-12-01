import React from 'react';
import Icon from '../ui/Icon';

const SocialLoginButton = ({ provider, onClick, text }) => {
  const icons = {
    google: 'google',
    apple: 'apple',
  };

  const bgColors = {
    google: 'bg-white border-2 border-neutral text-secondary',
    apple: 'bg-black text-white',
  };

  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center justify-center gap-3 px-6 py-3 rounded-lg font-medium transition-all hover:opacity-90 active:scale-95 ${bgColors[provider]}`}
    >
      <Icon name={icons[provider]} size={20} />
      <span>{text}</span>
    </button>
  );
};

export default SocialLoginButton;
