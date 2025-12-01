import React from 'react';
import Button from '../ui/Button';
import Icon from '../ui/Icon';

const RoutePanel = ({ destination, onStartRoute, onClose }) => {
  const mockSteps = [
    { iconName: 'user', title: 'Camina', detail: '200m hacia el norte' },
    { iconName: 'scooter', title: 'Toma el scooter', detail: 'Tier Scooter' },
    { iconName: 'route', title: 'Continúa por Reforma', detail: '1.2km' },
    { iconName: 'location', title: 'Llega a tu destino', detail: destination },
  ];

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold text-secondary">Ruta a {destination}</h3>
        <button onClick={onClose} className="text-neutralDark hover:text-secondary">
          <Icon name="close" size={24} />
        </button>
      </div>

      {/* Route Info */}
      <div className="bg-neutral rounded-lg p-4 mb-6 flex items-center justify-between">
        <div>
          <p className="text-sm text-neutralDark mb-1">Tiempo estimado</p>
          <p className="text-2xl font-bold text-secondary">15 min</p>
        </div>
        <div className="text-right">
          <p className="text-sm text-neutralDark mb-1">Distancia</p>
          <p className="text-2xl font-bold text-secondary">1.8 km</p>
        </div>
      </div>

      {/* Steps */}
      <div className="space-y-3 mb-6">
        {mockSteps.map((step, index) => (
          <div key={index} className="flex items-start gap-3">
            <div className="w-6 h-6 text-primary">
              <Icon name={step.iconName} size={24} />
            </div>
            <div className="flex-1">
              <p className="font-medium text-secondary">{step.title}</p>
              <p className="text-sm text-neutralDark">{step.detail}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Action Button */}
      <Button
        variant="primary"
        onClick={onStartRoute}
        className="w-full"
      >
        Iniciar Navegación
      </Button>
    </div>
  );
};

export default RoutePanel;
