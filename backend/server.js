const express = require('express');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
const cors = require('cors');
const path = require('path');
const pool = require('./db');

dotenv.config();
const app = express();
app.use(express.json());
app.use(cors());

// === Redirection manuelle de "/" vers accueil.html AVANT les fichiers statiques ===
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/acceuil.html'));
});

// === Servir les fichiers HTML statiques depuis le dossier frontend ===
app.use(express.static(path.join(__dirname, '../frontend')));

// === Routes API ===
const etudiantRoutes = require('./routes/Etudiant');
const entrepriseRoutes = require('./routes/Entreprise');
const ecoleRoutes = require('./routes/Ecole');
const conventionRoutes = require('./routes/convention');
const modelConventionRoutes = require('./routes/modelConvention');
const protectedRoutes = require('./routes/protected');

// === Simuler des utilisateurs (à remplacer par vraie auth plus tard) ===
const users = [{ id: 1, username: 'john', password: 'pass123' }];

// === Login JWT ===
app.post('/login', (req, res) => {
  const { username, password } = req.body;
  const user = users.find(u => u.username === username && u.password === password);
  if (!user) return res.status(401).json({ message: 'Identifiants invalides' });

  const token = jwt.sign(
    { id: user.id, username: user.username },
    process.env.JWT_SECRET,
    { expiresIn: '1h' }
  );

  res.json({ token });
});

// === Routes protégées par JWT ===
app.use('/protected', protectedRoutes);

// === Routes principales de l'API ===
app.use('/api/etudiants', etudiantRoutes);
app.use('/api/entreprises', entrepriseRoutes);
app.use('/api/ecoles', ecoleRoutes);
app.use('/api/conventions', conventionRoutes);
app.use('/api/model-conventions', modelConventionRoutes);

// === Connexion à la base de données + démarrage serveur ===
(async () => {
  try {
    const connection = await pool.getConnection();
    console.log('✅ Connexion DB réussie');
    connection.release();

    app.listen(process.env.PORT, () => {
      console.log(`🚀 API en ligne sur http://localhost:${process.env.PORT}`);
    });
  } catch (error) {
    console.error('❌ Problème de DB :', error);
  }
})();
