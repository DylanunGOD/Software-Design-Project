import sqlite3 from 'sqlite3';

const db = new sqlite3.Database('ecorueda.db', (err) => {
  if (err) {
    console.error('Error al conectar:', err.message);
    process.exit(1);
  }
  console.log('✓ Conectado a ecorueda.db\n');
});

// Obtener tablas
db.all("SELECT name FROM sqlite_master WHERE type='table'", (err, tables) => {
  if (err) {
    console.error('Error:', err);
    return;
  }
  
  console.log('📊 TABLAS ENCONTRADAS:');
  console.log('========================\n');
  
  tables.forEach(table => {
    console.log(`✓ ${table.name}`);
  });
  
  console.log('\n\n📈 INFORMACIÓN DE CADA TABLA:');
  console.log('================================\n');
  
  tables.forEach(table => {
    db.all(`SELECT COUNT(*) as count FROM ${table.name}`, (err, result) => {
      if (!err) {
        const count = result[0].count;
        console.log(`  ${table.name}: ${count} registros`);
      }
    });
  });
  
  // Usuarios
  setTimeout(() => {
    console.log('\n\n👥 USUARIOS:');
    console.log('============\n');
    db.all('SELECT id, email, name, balance FROM users LIMIT 5', (err, rows) => {
      if (err) {
        console.error('Error:', err);
      } else {
        console.table(rows);
      }
      
      // Vehículos
      console.log('\n\n🛴 VEHÍCULOS:');
      console.log('==============\n');
      db.all('SELECT id, company, type, lat, lng, battery, status FROM vehicles LIMIT 10', (err, rows) => {
        if (err) {
          console.error('Error:', err);
        } else {
          console.table(rows);
        }
        
        // Viajes
        console.log('\n\n🗺️ VIAJES:');
        console.log('===========\n');
        db.all('SELECT id, user_id, vehicle_id, status, duration_minutes FROM trips LIMIT 5', (err, rows) => {
          if (err) {
            console.error('Error:', err);
          } else {
            console.table(rows);
          }
          
          // Pagos
          console.log('\n\n💳 MÉTODOS DE PAGO:');
          console.log('===================\n');
          db.all('SELECT id, user_id, card_brand, card_number_last4, is_default FROM payments LIMIT 5', (err, rows) => {
            if (err) {
              console.error('Error:', err);
            } else {
              console.table(rows);
            }
            
            db.close();
          });
        });
      });
    });
  }, 500);
});
