import React, { useState } from 'react';
import ProfileHeader from './ProfileHeader';
import Input from '../ui/Input';
import Button from '../ui/Button';
import Card from '../ui/Card';
import { 
  validateCardNumber, 
  validateExpiry, 
  validateCVC,
  formatCardNumber,
  formatExpiry
} from '../../utils/helpers';

const PaymentScreen = ({ onBack, onSave }) => {
  const [cardNumber, setCardNumber] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvc, setCvc] = useState('');
  const [cardName, setCardName] = useState('');
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const handleCardNumberChange = (e) => {
    const formatted = formatCardNumber(e.target.value);
    if (formatted.length <= 19) { // 16 digits + 3 spaces
      setCardNumber(formatted);
      setErrors({ ...errors, cardNumber: '' });
    }
  };

  const handleExpiryChange = (e) => {
    const formatted = formatExpiry(e.target.value);
    if (formatted.length <= 5) { // MM/YY
      setExpiry(formatted);
      setErrors({ ...errors, expiry: '' });
    }
  };

  const handleCvcChange = (e) => {
    const value = e.target.value.replace(/\D/g, '');
    if (value.length <= 4) {
      setCvc(value);
      setErrors({ ...errors, cvc: '' });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const newErrors = {};
    if (!validateCardNumber(cardNumber)) {
      newErrors.cardNumber = 'Número de tarjeta inválido';
    }
    if (!validateExpiry(expiry)) {
      newErrors.expiry = 'Fecha inválida (MM/YY)';
    }
    if (!validateCVC(cvc)) {
      newErrors.cvc = 'CVC inválido';
    }
    if (!cardName.trim()) {
      newErrors.cardName = 'Nombre requerido';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setLoading(true);
    // Simular guardado
    setTimeout(() => {
      onSave({
        cardNumber: cardNumber.slice(-4),
        cardName,
      });
      setLoading(false);
    }, 1000);
  };

  return (
    <div className="fixed inset-0 bg-white z-50 overflow-y-auto">
      <ProfileHeader onClose={onBack} title="Agregar Tarjeta" />
      
      <div className="p-4">
        <Card className="mb-6">
          <div className="bg-gradient-to-r from-secondary to-neutralDark rounded-lg p-6 text-white mb-4">
            <div className="w-10 h-10 mb-8">
              <Icon name="wallet" size={40} />
            </div>
            <div className="font-mono text-lg mb-4 tracking-wider">
              {cardNumber || '•••• •••• •••• ••••'}
            </div>
            <div className="flex justify-between items-end">
              <div>
                <p className="text-xs opacity-70 mb-1">TITULAR</p>
                <p className="font-medium">{cardName || 'NOMBRE COMPLETO'}</p>
              </div>
              <div>
                <p className="text-xs opacity-70 mb-1">VENCE</p>
                <p className="font-medium">{expiry || 'MM/YY'}</p>
              </div>
            </div>
          </div>
        </Card>

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            type="text"
            placeholder="Número de tarjeta"
            value={cardNumber}
            onChange={handleCardNumberChange}
            error={errors.cardNumber}
          />

          <Input
            type="text"
            placeholder="Nombre en la tarjeta"
            value={cardName}
            onChange={(e) => {
              setCardName(e.target.value);
              setErrors({ ...errors, cardName: '' });
            }}
            error={errors.cardName}
          />

          <div className="grid grid-cols-2 gap-4">
            <Input
              type="text"
              placeholder="MM/YY"
              value={expiry}
              onChange={handleExpiryChange}
              error={errors.expiry}
            />

            <Input
              type="text"
              placeholder="CVC"
              value={cvc}
              onChange={handleCvcChange}
              error={errors.cvc}
            />
          </div>

          <Button
            type="submit"
            variant="primary"
            className="w-full"
            disabled={loading}
          >
            {loading ? 'Guardando...' : 'Guardar Tarjeta'}
          </Button>
        </form>

        <div className="mt-6 p-4 bg-neutral rounded-lg">
          <p className="text-sm text-neutralDark text-center mt-6 flex items-center justify-center gap-2">
            <Icon name="lock" size={16} />
            Tu información está protegida y encriptada
          </p>
        </div>
      </div>
    </div>
  );
};

export default PaymentScreen;
