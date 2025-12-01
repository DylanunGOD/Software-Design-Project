import React, { useState, useEffect } from 'react';
import MapContainer from './MapContainer';
import MapOverlay from './MapOverlay';
import VehicleMarker from '../markers/VehicleMarker';
import TransportMarker from '../markers/TransportMarker';
import BottomSheet from '../panels/BottomSheet';
import VehicleDetailPanel from '../panels/VehicleDetailPanel';
import FilterPanel from '../panels/FilterPanel';
import RoutePanel from '../panels/RoutePanel';
import TransportInfoPanel from '../panels/TransportInfoPanel';
import { VEHICLES_DATA, TRANSPORT_STOPS, MAP_CONFIG } from '../../utils/constants';

const MapScreen = ({ onProfileClick }) => {
  const [map, setMap] = useState(null);
  const [vehicles, setVehicles] = useState(VEHICLES_DATA);
  const [filteredVehicles, setFilteredVehicles] = useState(VEHICLES_DATA);
  const [selectedVehicle, setSelectedVehicle] = useState(null);
  const [selectedTransport, setSelectedTransport] = useState(null);
  const [activePanel, setActivePanel] = useState(null);
  const [filters, setFilters] = useState({ vehicleTypes: [], companies: [] });
  const [userLocation, setUserLocation] = useState(MAP_CONFIG.CENTER);

  useEffect(() => {
    // Obtener ubicación del usuario
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation([position.coords.longitude, position.coords.latitude]);
        },
        (error) => {
          console.log('Error obteniendo ubicación:', error);
        }
      );
    }
  }, []);

  useEffect(() => {
    // Aplicar filtros
    let filtered = vehicles;

    if (filters.vehicleTypes.length > 0) {
      filtered = filtered.filter(v => filters.vehicleTypes.includes(v.type));
    }

    if (filters.companies.length > 0) {
      filtered = filtered.filter(v => filters.companies.includes(v.company));
    }

    setFilteredVehicles(filtered);
  }, [filters, vehicles]);

  const handleVehicleClick = (vehicle) => {
    setSelectedVehicle(vehicle);
    setActivePanel('vehicle');
  };

  const handleTransportClick = (stop) => {
    setSelectedTransport(stop);
    setActivePanel('transport');
  };

  const handleReserveVehicle = () => {
    setVehicles(prev => 
      prev.map(v => 
        v.id === selectedVehicle.id 
          ? { ...v, reserved: true }
          : v
      )
    );
    setSelectedVehicle({ ...selectedVehicle, reserved: true });
  };

  const handleUnlockVehicle = () => {
    console.log('Desbloqueando vehículo:', selectedVehicle.id);
    alert(`¡Vehículo ${selectedVehicle.id} desbloqueado! Disfruta tu viaje`);
    closePanel();
  };

  const handleFilterApply = (newFilters) => {
    setFilters(newFilters);
    closePanel();
  };

  const handleSearch = (query) => {
    console.log('Buscando:', query);
  };

  const handleSelectResult = (result) => {
    console.log('Resultado seleccionado:', result);
    // Aquí podrías centrar el mapa en el resultado
  };

  const handleLocationClick = () => {
    if (map && userLocation) {
      map.flyTo({
        center: userLocation,
        zoom: 15,
        duration: 1000,
      });
    }
  };

  const closePanel = () => {
    setActivePanel(null);
    setSelectedVehicle(null);
    setSelectedTransport(null);
  };

  return (
    <div className="w-full h-screen relative">
      {/* Map */}
      <MapContainer
        center={userLocation}
        zoom={MAP_CONFIG.ZOOM}
        onMapLoad={setMap}
      />

      {/* Markers */}
      {map && filteredVehicles.map((vehicle) => (
        <VehicleMarker
          key={vehicle.id}
          map={map}
          vehicle={vehicle}
          onClick={handleVehicleClick}
        />
      ))}

      {map && TRANSPORT_STOPS.map((stop) => (
        <TransportMarker
          key={stop.id}
          map={map}
          stop={stop}
          onClick={handleTransportClick}
        />
      ))}

      {/* Overlay Controls */}
      <MapOverlay
        onSearch={handleSearch}
        onSelectResult={handleSelectResult}
        onFilterClick={() => setActivePanel('filter')}
        onProfileClick={onProfileClick}
        onLocationClick={handleLocationClick}
        filterActive={filters.vehicleTypes.length > 0 || filters.companies.length > 0}
      />

      {/* Bottom Sheets */}
      <BottomSheet
        isVisible={activePanel === 'vehicle'}
        onClose={closePanel}
      >
        <VehicleDetailPanel
          vehicle={selectedVehicle}
          onReserve={handleReserveVehicle}
          onUnlock={handleUnlockVehicle}
          onClose={closePanel}
        />
      </BottomSheet>

      <BottomSheet
        isVisible={activePanel === 'filter'}
        onClose={closePanel}
      >
        <FilterPanel
          onApply={handleFilterApply}
          onClose={closePanel}
          initialFilters={filters}
        />
      </BottomSheet>

      <BottomSheet
        isVisible={activePanel === 'transport'}
        onClose={closePanel}
      >
        <TransportInfoPanel
          transportStop={selectedTransport}
          onClose={closePanel}
        />
      </BottomSheet>
    </div>
  );
};

export default MapScreen;
