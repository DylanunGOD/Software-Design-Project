import React, { useState } from 'react';
import Button from '../ui/Button';
import Icon from '../ui/Icon';
import { COMPANIES, VEHICLE_TYPES } from '../../utils/constants';

const FilterPanel = ({ onApply, onClose, initialFilters = {} }) => {
  const [selectedVehicleTypes, setSelectedVehicleTypes] = useState(
    initialFilters.vehicleTypes || []
  );
  const [selectedCompanies, setSelectedCompanies] = useState(
    initialFilters.companies || []
  );

  const toggleVehicleType = (type) => {
    setSelectedVehicleTypes(prev =>
      prev.includes(type)
        ? prev.filter(t => t !== type)
        : [...prev, type]
    );
  };

  const toggleCompany = (company) => {
    setSelectedCompanies(prev =>
      prev.includes(company)
        ? prev.filter(c => c !== company)
        : [...prev, company]
    );
  };

  const handleApply = () => {
    onApply({
      vehicleTypes: selectedVehicleTypes,
      companies: selectedCompanies,
    });
  };

  const handleClear = () => {
    setSelectedVehicleTypes([]);
    setSelectedCompanies([]);
  };

  const FilterOption = ({ label, isActive, onClick, iconName }) => (
    <button
      onClick={onClick}
      className={`px-4 py-2 rounded-full border-2 transition-all flex items-center gap-2 ${
        isActive
          ? 'bg-primary border-primary text-white'
          : 'bg-white border-neutral text-secondary hover:border-primary'
      }`}
    >
      {iconName && <Icon name={iconName} size={18} />}
      {label}
    </button>
  );

  return (
    <div>
      <h3 className="text-xl font-bold text-secondary mb-6">Filtrar Vehículos</h3>

      {/* Vehicle Types */}
      <div className="mb-6">
        <p className="text-sm font-medium text-neutralDark mb-3">Tipo de Vehículo</p>
        <div className="flex flex-wrap gap-2">
          <FilterOption
            label="Scooters"
            iconName="scooter"
            isActive={selectedVehicleTypes.includes(VEHICLE_TYPES.SCOOTER)}
            onClick={() => toggleVehicleType(VEHICLE_TYPES.SCOOTER)}
          />
          <FilterOption
            label="Bicicletas"
            iconName="bike"
            isActive={selectedVehicleTypes.includes(VEHICLE_TYPES.BIKE)}
            onClick={() => toggleVehicleType(VEHICLE_TYPES.BIKE)}
          />
        </div>
      </div>

      {/* Companies */}
      <div className="mb-6">
        <p className="text-sm font-medium text-neutralDark mb-3">Compañías</p>
        <div className="flex flex-wrap gap-2">
          <FilterOption
            label="Tier"
            isActive={selectedCompanies.includes(COMPANIES.TIER)}
            onClick={() => toggleCompany(COMPANIES.TIER)}
          />
          <FilterOption
            label="Lime"
            isActive={selectedCompanies.includes(COMPANIES.LIME)}
            onClick={() => toggleCompany(COMPANIES.LIME)}
          />
          <FilterOption
            label="Bird"
            isActive={selectedCompanies.includes(COMPANIES.BIRD)}
            onClick={() => toggleCompany(COMPANIES.BIRD)}
          />
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-3">
        <Button
          variant="secondary"
          onClick={handleClear}
          className="flex-1"
        >
          Limpiar
        </Button>
        <Button
          variant="primary"
          onClick={handleApply}
          className="flex-1"
        >
          Aplicar Filtros
        </Button>
      </div>
    </div>
  );
};

export default FilterPanel;
