import React, { useEffect, useRef } from 'react';
import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import { MAP_CONFIG } from '../../utils/constants';

const MapContainer = ({ center = MAP_CONFIG.CENTER, zoom = MAP_CONFIG.ZOOM, onMapLoad }) => {
  const mapContainer = useRef(null);
  const map = useRef(null);

  useEffect(() => {
    if (map.current) return; // Ya está inicializado

    map.current = new maplibregl.Map({
      container: mapContainer.current,
      style: MAP_CONFIG.STYLE,
      center: center,
      zoom: zoom,
    });

    map.current.on('load', () => {
      if (onMapLoad) {
        onMapLoad(map.current);
      }
    });

    // Cleanup
    return () => {
      if (map.current) {
        map.current.remove();
        map.current = null;
      }
    };
  }, []);

  // Actualizar centro cuando cambie
  useEffect(() => {
    if (map.current && center) {
      map.current.flyTo({
        center: center,
        zoom: zoom,
        duration: 1000,
      });
    }
  }, [center, zoom]);

  return (
    <div 
      ref={mapContainer} 
      className="w-full h-full"
    />
  );
};

export default MapContainer;
