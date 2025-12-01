import React from 'react';
import Icon from '../ui/Icon';

const TransportInfoPanel = ({ transportStop, onClose }) => {
  if (!transportStop) return null;

  const iconName = transportStop.type === 'metro' ? 'metro' : 'bus';

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 text-primary">
            <Icon name={iconName} size={40} />
          </div>
          <div>
            <h3 className="text-xl font-bold text-secondary">{transportStop.name}</h3>
            <p className="text-sm text-neutralDark capitalize">{transportStop.type}</p>
          </div>
        </div>
        <button onClick={onClose} className="text-neutralDark hover:text-secondary">
          <Icon name="close" size={24} />
        </button>
      </div>

      {/* Lines */}
      <div className="mb-6">
        <p className="text-sm font-medium text-neutralDark mb-3">Líneas</p>
        <div className="flex gap-2">
          {transportStop.lines.map((line) => (
            <div
              key={line}
              className="w-12 h-12 bg-secondary text-white rounded-lg flex items-center justify-center font-bold text-lg"
            >
              {line}
            </div>
          ))}
        </div>
      </div>

      {/* Arrivals */}
      <div>
        <p className="text-sm font-medium text-neutralDark mb-3">Próximos Arribos</p>
        <div className="space-y-2">
          {transportStop.arrivals.map((arrival, index) => (
            <div
              key={index}
              className="flex items-center justify-between bg-neutral rounded-lg p-3"
            >
              <span className="text-secondary font-medium">Línea {transportStop.lines[0]}</span>
              <span className="text-primary font-bold">{arrival}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Route Button */}
      <button className="w-full mt-6 bg-info text-white py-3 rounded-lg font-medium hover:bg-opacity-90 transition-all">
        Ver Ruta Completa
      </button>
    </div>
  );
};

export default TransportInfoPanel;
