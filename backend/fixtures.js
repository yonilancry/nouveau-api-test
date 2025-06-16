const mysql = require('mysql2/promise');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') }); 

async function seed() {
    console.log('Host:', process.env.DB_HOST);
console.log('User:', process.env.DB_USER);
console.log('Password:', process.env.DB_PASSWORD);
console.log('DB:', process.env.DB_NAME);

  const connection = await mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
  });

  console.log('📥 Connexion OK, insertion des fixtures...');

  // === Supprimer les données existantes ===
  await connection.query('DELETE FROM Conventions');
  await connection.query('DELETE FROM Entreprises');
  await connection.query('DELETE FROM Etudiants');
  await connection.query('DELETE FROM Ecoles');

  // === Insertion Écoles ===
  await connection.query(
    `INSERT INTO Ecoles (nom, email, createdAt,updatedAt) VALUES (?, ?, ?, ?)`,
    ['EPSI', '12 rue de l’école', new Date, new Date]
  );

  // === Insertion Étudiants ===
  await connection.query(
    `INSERT INTO Etudiants (nom, prenom, email, motDePasse, createdAt, updatedAt, ecoleId) VALUES (?, ?, ?, ?, ?, ?, ?)`,
    ['Durand', 'Alice', 'alice@example.com', "motdepasse", new Date, new Date, 1]
  );

  // === Insertion Entreprises ===
  await connection.query(
    `INSERT INTO Entreprises (nom,adresse,email,telephone,createdAt,updatedAt) VALUES (?, ?, ?,?, ?, ?)`,
    ['OpenTech', '9 rue Startup', 'contact@opentech.com', "0888888888", new Date(), new Date()]
  );

  console.log('✅ Fixtures insérées avec succès !');

  connection.end();
}

seed().catch(err => {
  console.error('❌ Erreur lors de l’insertion des fixtures :', err);
});
