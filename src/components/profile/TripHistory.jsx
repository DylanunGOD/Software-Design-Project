import React, { useState, useMemo } from 'react';
import Card from '../ui/Card';
import TripItem from './TripItem';
import Icon from '../ui/Icon';
import { SAMPLE_TRIPS } from '../../utils/constants';

const TripHistory = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    types: [],
    cantons: [],
  });

  // Obtener lista única de cantones de salida
  const availableCantons = useMemo(() => {
    const cantonsSet = new Set(SAMPLE_TRIPS.map(trip => trip.fromCanton));
    return Array.from(cantonsSet).sort();
  }, []);

  // Filtrar viajes
  const filteredTrips = useMemo(() => {
    return SAMPLE_TRIPS.filter(trip => {
      // Búsqueda por texto
      const matchesSearch = trip.type.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           trip.date.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           trip.fromCanton.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           trip.toCanton.toLowerCase().includes(searchQuery.toLowerCase());
      
      // Filtro por tipo de transporte
      const matchesType = filters.types.length === 0 || 
                         filters.types.some(type => trip.type.toLowerCase().includes(type.toLowerCase()));
      
      // Filtro por cantón de salida
      const matchesCanton = filters.cantons.length === 0 || 
                           filters.cantons.includes(trip.fromCanton);

      return matchesSearch && matchesType && matchesCanton;
    });
  }, [searchQuery, filters]);

  const toggleTypeFilter = (type) => {
    setFilters(prev => ({
      ...prev,
      types: prev.types.includes(type)
        ? prev.types.filter(t => t !== type)
        : [...prev.types, type]
    }));
  };

  const toggleCantonFilter = (canton) => {
    setFilters(prev => ({
      ...prev,
      cantons: prev.cantons.includes(canton)
        ? prev.cantons.filter(c => c !== canton)
        : [...prev.cantons, canton]
    }));
  };

  const clearFilters = () => {
    setSearchQuery('');
    setFilters({
      types: [],
      cantons: [],
    });
  };

  const activeFiltersCount = filters.types.length + filters.cantons.length;

  return (
    <Card className="mb-4">
      <h3 className="text-lg font-bold text-secondary mb-3">Historial de Viajes</h3>
      
      {/* Barra de Búsqueda */}
      <div className="mb-4">
        <div className="relative">
          <input
            type="text"
            placeholder="Buscar viajes..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full px-4 py-3 pl-10 pr-24 bg-neutral rounded-xl border-2 border-transparent focus:border-primary focus:outline-none transition-colors"
          />
          <Icon name="search" size={18} className="absolute left-3 top-1/2 -translate-y-1/2 opacity-50" />
          
          {/* Botón de Filtros */}
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`absolute right-2 top-1/2 -translate-y-1/2 px-3 py-1.5 rounded-lg font-medium text-sm transition-all ${
              showFilters || activeFiltersCount > 0
                ? 'bg-primary text-white'
                : 'bg-white text-secondary hover:bg-gray-50'
            }`}
          >
            <Icon name="filter" size={14} className="inline mr-1" />
            Filtros
            {activeFiltersCount > 0 && (
              <span className="ml-1 bg-white text-primary rounded-full px-1.5 text-xs font-bold">
                {activeFiltersCount}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Panel de Filtros */}
      {showFilters && (
        <div className="mb-4 p-4 bg-neutral rounded-xl border-2 border-gray-200">
          <div className="flex justify-between items-center mb-3">
            <h4 className="font-semibold text-secondary">Filtros Avanzados</h4>
            {activeFiltersCount > 0 && (
              <button
                onClick={clearFilters}
                className="text-sm text-primary hover:text-primary/80 font-medium"
              >
                Limpiar todo
              </button>
            )}
          </div>

          {/* Filtro por Tipo */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-secondary mb-2">
              Tipo de Transporte
            </label>
            <div className="flex flex-wrap gap-2">
              {['Scooter', 'Bici', 'Metro', 'Bus'].map(type => (
                <button
                  key={type}
                  onClick={() => toggleTypeFilter(type)}
                  className={`px-3 py-1.5 rounded-lg font-medium text-sm transition-all flex items-center gap-2 ${
                    filters.types.includes(type)
                      ? 'bg-primary text-white'
                      : 'bg-white text-secondary hover:bg-gray-50 border border-gray-300'
                  }`}
                >
                  <Icon name={type === 'Scooter' ? 'scooter' : type === 'Bici' ? 'bike' : type === 'Metro' ? 'metro' : 'bus'} size={16} />
                  {type}
                </button>
              ))}
            </div>
          </div>

          {/* Filtro por Cantón de Salida */}
          <div>
            <label className="block text-sm font-medium text-secondary mb-2">
              Cantón de Salida
            </label>
            <div className="flex flex-wrap gap-2">
              {availableCantons.map(canton => (
                <button
                  key={canton}
                  onClick={() => toggleCantonFilter(canton)}
                  className={`px-3 py-1.5 rounded-lg font-medium text-sm transition-all flex items-center gap-2 ${
                    filters.cantons.includes(canton)
                      ? 'bg-primary text-white'
                      : 'bg-white text-secondary hover:bg-gray-50 border border-gray-300'
                  }`}
                >
                  <Icon name="location" size={14} />
                  {canton}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Resultados */}
      <div className="text-sm text-secondary/70 mb-3">
        {filteredTrips.length} {filteredTrips.length === 1 ? 'viaje encontrado' : 'viajes encontrados'}
      </div>

      {/* Lista de Viajes con Scroll */}
      <div className="trip-history-list max-h-96 overflow-y-auto pr-2 space-y-2">
        {filteredTrips.length > 0 ? (
          filteredTrips.map(trip => (
            <TripItem key={trip.id} trip={trip} />
          ))
        ) : (
          <div className="text-center py-8 text-secondary/50">
            <Icon name="search" size={48} className="mb-2" />
            <p className="mb-1">No se encontraron viajes</p>
            <button
              onClick={clearFilters}
              className="mt-3 text-primary hover:text-primary/80 font-medium text-sm"
            >
              Limpiar filtros
            </button>
          </div>
        )}
      </div>
    </Card>
  );
};

export default TripHistory;
