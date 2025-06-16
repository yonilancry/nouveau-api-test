//const db = require('./models');
// db.query('INSERT INTO users (name, email) VALUES (?, ?)', ['Yoni', 'yoni@example.com'], (err, result) => {
//     if (err) throw err;
//     console.log('Nouvel utilisateur ID :', result.insertId);
//     });
// sync.js
const { sequelize } = require('./models');

sequelize.sync({ alter: true })
  .then(() => {
    console.log('✅ Toutes les tables ont été créées ou mises à jour.');
  })
  .catch((err) => {
    console.error('❌ Erreur lors de la synchronisation :', err);
  })
  .finally(() => {
    sequelize.close();
  });
