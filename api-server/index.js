import app, { initializeApp } from './src/app.js';
import config from './src/config/env.js';

const PORT = config.PORT;

const start = async () => {
  try {
    await initializeApp();
    
    app.listen(PORT, () => {
      console.log(`
========================================
     EcoRueda API                    
     ============================   
     Puerto: ${PORT}                          
     Entorno: ${config.NODE_ENV}               
     Documentacion: /api/docs           
========================================
      `);
    });
  } catch (error) {
    console.error('Error al iniciar la aplicacion:', error);
    process.exit(1);
  }
};

start();
