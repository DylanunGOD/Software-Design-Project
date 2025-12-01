import React from 'react';
import ProfileHeader from './ProfileHeader';
import UserInfo from './UserInfo';
import TripHistory from './TripHistory';
import WalletSection from './WalletSection';
import { USER_DATA } from '../../utils/constants';

const ProfileScreen = ({ onClose, onNavigateToPayment }) => {
  return (
    <div className="fixed inset-0 bg-white z-50 overflow-y-auto">
      <ProfileHeader onClose={onClose} />
      
      <div className="p-4 pb-20">
        <UserInfo userData={USER_DATA} />
        <TripHistory />
        <WalletSection 
          userData={USER_DATA}
          onAddPayment={onNavigateToPayment}
        />
      </div>
    </div>
  );
};

export default ProfileScreen;
