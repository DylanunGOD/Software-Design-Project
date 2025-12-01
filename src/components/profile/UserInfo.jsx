import React from 'react';
import Card from '../ui/Card';
import Icon from '../ui/Icon';

const UserInfo = ({ userData }) => {
  return (
    <Card className="mb-4">
      <div className="flex items-center gap-4">
        <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center">
          <Icon name={userData.avatarIconName || 'user'} size={32} className="text-white" />
        </div>
        <div className="flex-1">
          <h3 className="text-lg font-bold text-secondary">{userData.name}</h3>
          <p className="text-neutralDark text-sm">{userData.email}</p>
          <p className="text-neutralDark text-xs mt-1">{userData.memberSince}</p>
        </div>
      </div>
    </Card>
  );
};

export default UserInfo;
