import React from 'react';
import Card from '../ui/Card';
import Button from '../ui/Button';
import Icon from '../ui/Icon';

const WalletSection = ({ onAddPayment, userData }) => {
  return (
    <Card>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-bold text-secondary">Mi Billetera</h3>
        <Icon name="wallet" size={24} />
      </div>
      
      <div className="bg-gradient-to-r from-primary to-success rounded-lg p-4 text-white mb-4">
        <p className="text-sm opacity-90 mb-1">Saldo disponible</p>
        <p className="text-3xl font-bold">{userData.balance}</p>
      </div>

      <Button
        variant="primary"
        className="w-full"
        onClick={onAddPayment}
      >
        Agregar Método de Pago
      </Button>
    </Card>
  );
};

export default WalletSection;
