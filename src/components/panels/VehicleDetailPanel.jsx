import React from 'react';
import Icon from '../ui/Icon';
import { getCompanyColor, getCompanyName, formatPrice, formatBattery, getBatteryColor } from '../../utils/helpers';

const VehicleDetailPanel = ({ vehicle, onReserve, onUnlock, onClose }) => {
  if (!vehicle) return null;

  const isReserved = vehicle.reserved;
  const companyColor = getCompanyColor(vehicle.company);
  const companyName = getCompanyName(vehicle.company);
  const iconName = vehicle.type === 'scooter' ? 'scooter' : 'bike';

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <Icon name={iconName} size={40} className="text-primary" />
          <div>
            <h3 className="text-xl font-bold text-secondary">
              {vehicle.type === 'scooter' ? 'Scooter' : 'Bicicleta'} {companyName}
            </h3>
            <p className="text-sm text-neutralDark">ID: {vehicle.id}</p>
          </div>
        </div>
        <div 
          className="w-3 h-3 rounded-full"
          style={{ backgroundColor: companyColor }}
        ></div>
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="bg-neutral rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <Icon name="price" size={20} />
            <span className="text-sm text-neutralDark">Precio/min</span>
          </div>
          <p className="text-2xl font-bold text-secondary">
            {formatPrice(vehicle.pricePerMin)}
          </p>
        </div>

        <div className="bg-neutral rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <Icon name="battery" size={20} />
            <span className="text-sm text-neutralDark">Batería</span>
          </div>
          <p className={`text-2xl font-bold ${getBatteryColor(vehicle.battery)}`}>
            {formatBattery(vehicle.battery)}
          </p>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="space-y-3">
        {!isReserved ? (
          <>
            <button
              onClick={onReserve}
              className="w-full bg-accent text-secondary py-4 rounded-xl font-bold text-lg hover:bg-opacity-90 transition-all active:scale-95 flex items-center justify-center gap-2"
            >
              <Icon name="time" size={20} />
              Reservar (15 min gratis)
            </button>
            <button
              onClick={onUnlock}
              className="w-full bg-primary text-white py-4 rounded-xl font-bold text-lg hover:bg-opacity-90 transition-all active:scale-95 flex items-center justify-center gap-2"
            >
              <Icon name="unlock" size={20} />
              Desbloquear y Comenzar
            </button>
          </>
        ) : (
          <button
            onClick={onUnlock}
            className="w-full bg-success text-white py-4 rounded-xl font-bold text-lg hover:bg-opacity-90 transition-all active:scale-95 flex items-center justify-center gap-2"
          >
            <Icon name="check" size={20} />
            Reservado - Desbloquear
          </button>
        )}
      </div>

      {/* Info */}
      <div className="mt-4 p-3 bg-neutral rounded-lg">
        <p className="text-sm text-neutralDark text-center">
          Recuerda usar casco y respetar las normas de tránsito
        </p>
      </div>
    </div>
  );
};

export default VehicleDetailPanel;
