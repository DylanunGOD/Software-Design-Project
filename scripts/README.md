# Generador de Ubicaciones - Nominatim

Este script obtiene automáticamente los nombres de cantón y distrito basándose en coordenadas GPS usando la API gratuita de Nominatim (OpenStreetMap).

##  Uso

```bash
node scripts/generate-locations.js
```

##  Qué hace

1. Lee las coordenadas de vehículos y paradas de transporte
2. Consulta la API de Nominatim para cada coordenada
3. Extrae el cantón y distrito de cada ubicación
4. Genera un archivo `generated-locations.js` con los datos actualizados

##  Requisitos

- Node.js v18+
- Conexión a internet

##  Tiempo estimado

- ~15 vehículos × 1.1 seg = ~17 segundos
- ~3 paradas × 1.1 seg = ~4 segundos
- **Total: ~21 segundos**

##  Límites de Nominatim

- Máximo 1 request por segundo
- Sin API key necesaria
- Gratis para uso personal/educativo
- User-Agent requerido (ya incluido)

##  Resultado

Genera `scripts/generated-locations.js` con código listo para copiar y pegar en `constants.js`.

##  API usada

- **Nominatim Reverse Geocoding**
- URL: `https://nominatim.openstreetmap.org/reverse`
- Documentación: https://nominatim.org/release-docs/latest/api/Reverse/

##  Ejemplo de salida

```
  tier-1 (9.9334, -84.0834)...
    San José - Carmen

  tier-2 (9.9326, -84.0793)...
    San José - Merced
```

##  Notas

- El script respeta el límite de 1 req/seg automáticamente
- Si una coordenada falla, se marca como "Error"
- Los nombres pueden variar según los datos de OpenStreetMap
