import React, { useEffect, useRef } from 'react';
import maplibregl from 'maplibre-gl';

const TransportMarker = ({ map, stop, onClick }) => {
  const markerRef = useRef(null);

  useEffect(() => {
    if (!map || !stop) return;

    const iconSvg = stop.type === 'metro' 
      ? '<svg viewBox="0 0 24 24" fill="white" width="18" height="18"><rect x="6" y="4" width="12" height="16" rx="2" stroke="white" stroke-width="2" fill="none"/><path d="M6 8h12" stroke="white" stroke-width="2"/><circle cx="9" cy="16" r="1" fill="white"/><circle cx="15" cy="16" r="1" fill="white"/></svg>'
      : '<svg viewBox="0 0 24 24" fill="white" width="18" height="18"><rect x="5" y="6" width="14" height="14" rx="2" stroke="white" stroke-width="2" fill="none"/><path d="M5 11h14" stroke="white" stroke-width="2"/><circle cx="9" cy="17" r="1" fill="white"/><circle cx="15" cy="17" r="1" fill="white"/></svg>';
    const bgColor = stop.type === 'metro' ? '#3498DB' : '#E74C3C';
    
    // Crear elemento del marcador
    const el = document.createElement('div');
    el.className = 'transport-marker';
    el.style.cssText = `
      width: 36px;
      height: 36px;
      background-color: ${bgColor};
      border-radius: 8px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 18px;
      cursor: pointer;
      border: 2px solid white;
      box-shadow: 0 2px 6px rgba(0, 0, 0, 0.25);
    `;
    el.innerHTML = iconSvg;

    // Click handler
    el.addEventListener('click', () => {
      if (onClick) {
        onClick(stop);
      }
    });

    // Crear popup con cantón-distrito
    const popup = new maplibregl.Popup({
      offset: 25,
      closeButton: false,
      closeOnClick: false,
      className: 'transport-popup'
    }).setHTML(`
      <div style="padding: 4px 8px; font-size: 12px; font-weight: 500; color: #2C3E50; display: flex; align-items: center; gap: 4px;">
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
          <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
          <circle cx="12" cy="10" r="3"/>
        </svg>
        ${stop.canton} - ${stop.distrito}
      </div>
    `);

    // Crear marcador con opciones para centrar correctamente
    const marker = new maplibregl.Marker({ 
      element: el,
      anchor: 'center'
    })
      .setLngLat([stop.lng, stop.lat])
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
  }, [map, stop, onClick]);

  return null;
};

export default TransportMarker;
