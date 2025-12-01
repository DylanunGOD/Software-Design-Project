# Location Generation Scripts

Utility scripts for generating and cleaning location data using Nominatim API (OpenStreetMap).

## Scripts

### generate-locations.js
Automatically fetches canton and distrito names based on GPS coordinates.

**Usage**:
```bash
node scripts/generate-locations.js
```

**What it does**:
1. Reads coordinates from vehicles and transport stops
2. Queries Nominatim API for each coordinate
3. Extracts canton and distrito from location data
4. Generates `generated-locations.js` with updated data

**Requirements**:
- Node.js v18+
- Internet connection

**Estimated time**: ~21 seconds (15 vehicles + 3 stops at 1.1s each)

**Nominatim limits**:
- Maximum 1 request per second
- No API key required
- Free for personal/educational use
- User-Agent required (already included)

### clean-locations.js
Cleans and standardizes location data.

**Usage**:
```bash
node scripts/clean-locations.js
```

### verify-locations.js
Validates location data consistency.

**Usage**:
```bash
node scripts/verify-locations.js
```

## API Reference

**Nominatim Reverse Geocoding**
- URL: `https://nominatim.openstreetmap.org/reverse`
- Documentation: https://nominatim.org/release-docs/latest/api/Reverse/

## Output

Generates `scripts/generated-locations.js` with code ready to copy into `constants.js`.

**Example output**:
```
tier-1 (9.9334, -84.0834)...
  San Jose - Carmen
```

## Notes

- Respects Nominatim rate limits (1.1s delay between requests)
- Extracts canton from `address.city_district` or `address.town`
- Extracts distrito from `address.neighbourhood` or `address.suburb`
- Results may vary based on OpenStreetMap data quality
