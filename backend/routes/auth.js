const express = require('express');
const router = express.Router();
const pool = require('../db');

// Inscription Étudiant
router.post('/etudiant/register', async (req, res) => {
  const { nom, prenom, adresse, email, numTel, dateNaissance, motdepasse } = req.body;
  try {
    await pool.query(
      `INSERT INTO Etudiant (nom, prenom, adresse, email, numero_telephone, date_naissance, mot_de_passe, ecole_id, signature)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [nom, prenom, adresse, email, numTel, dateNaissance, motdepasse, 1, null]
    );
    res.status(201).json({ message: 'Étudiant inscrit avec succès' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
//creation entreprise
router.post('/entreprise/register', async (req, res) => {
  const {
    nom, 
    NomRepresentant,
    qualiteRepresentant,
    email,
    numero_telephone,
    adresse,
    motdepasse
  } = req.body;

  try {
    	
    await pool.query(
      `INSERT INTO Entreprise (nom, representant, qualiteRepresentant, email, numero_telephone, adresse, mot_de_passe, signature)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [nom ,NomRepresentant, qualiteRepresentant, email, numero_telephone, adresse, motdepasse, null]
    );
    res.status(201).json({ message: 'Entreprise inscrite avec succès' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


// Inscription École
router.post('/ecole/register', async (req, res) => {
  const { raisonSocial, dateCreation, email, NomRepresentant, numero_telephone, adresse, motdepasse } = req.body;
  try {
    await pool.query(
      `INSERT INTO Ecole (raisonSocial, dateCreation, email, NomRepresentant, numero_telephone, adresse, mot_de_passe, signature)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [raisonSocial, dateCreation, email, NomRepresentant, numero_telephone, adresse, motdepasse, null]
    );
    res.status(201).json({ message: 'École inscrite avec succès' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router; // ✅ À la toute fin
