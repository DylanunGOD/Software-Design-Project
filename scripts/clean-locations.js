/**
 * Script para limpiar y simplificar nombres de ubicaciones
 * Convierte nombres de OpenStreetMap a nombres más simples
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Leer el archivo generado
const inputPath = path.join(__dirname, 'generated-locations.js');
let content = fs.readFileSync(inputPath, 'utf8');

// Simplificar nombres
content = content.replace(/Área Metropolitana de San José/g, 'San José');
content = content.replace(/Centro Hospital/g, 'Carmen');
content = content.replace(/Centro Catedral/g, 'Catedral');
content = content.replace(/INVU Santa Ana/g, 'Pozos');
content = content.replace(/Corazón de Jesús/g, 'San José');
content = content.replace(/El Jardín/g, 'Zapote');

// Guardar archivo limpio
const outputPath = path.join(__dirname, 'cleaned-locations.js');
fs.writeFileSync(outputPath, content, 'utf8');

console.log('- Nombres simplificados correctamente');
console.log(`- Archivo generado: ${outputPath}`);
