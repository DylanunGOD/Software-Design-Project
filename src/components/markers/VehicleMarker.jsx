import React, { useEffect, useRef } from 'react';
import maplibregl from 'maplibre-gl';
import { getCompanyColor, getVehicleIcon } from '../../utils/helpers';

const VehicleMarker = ({ map, vehicle, onClick }) => {
  const markerRef = useRef(null);

  useEffect(() => {
    if (!map || !vehicle) return;

    const color = getCompanyColor(vehicle.company);
    const icon = getVehicleIcon(vehicle.type);
    
    // Crear elemento del marcador
    const el = document.createElement('div');
    el.className = 'vehicle-marker';
    el.style.cssText = `
      width: 40px;
      height: 40px;
      background-color: ${color};
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 20px;
      cursor: pointer;
      border: 3px solid white;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
      ${vehicle.reserved ? 'opacity: 0.5;' : ''}
    `;
    el.innerHTML = icon;

    // Click handler
    el.addEventListener('click', () => {
      if (onClick) {
        onClick(vehicle);
      }
    });

    // Crear popup con cantón-distrito
    const popup = new maplibregl.Popup({
      offset: 25,
      closeButton: false,
      closeOnClick: false,
      className: 'vehicle-popup'
    }).setHTML(`
      <div style="padding: 4px 8px; font-size: 12px; font-weight: 500; color: #2C3E50; display: flex; align-items: center; gap: 4px;">
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
          <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
          <circle cx="12" cy="10" r="3"/>
        </svg>
        ${vehicle.canton} - ${vehicle.distrito}
      </div>
    `);

    // Crear marcador con opciones para centrar correctamente
    const marker = new maplibregl.Marker({ 
      element: el,
      anchor: 'center'
    })
      .setLngLat([vehicle.lng, vehicle.lat])
      .setPopup(popup)
      .addTo(map);

    // Mostrar popup al hacer hover
    el.addEventListener('mouseenter', () => marker.togglePopup());
    el.addEventListener('mouseleave', () => marker.togglePopup());

    markerRef.current = marker;

    // Cleanup
    return () => {
      if (markerRef.current) {
        markerRef.current.remove();
      }
    };
  }, [map, vehicle, onClick]);

  return null;
};

export default VehicleMarker;
