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

const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

// Connexion École
router.post('/ecole/login', async (req, res) => {
  const { email, motdepasse } = req.body;

  try {
    const [rows] = await pool.query(
      'SELECT * FROM Ecole WHERE email = ?',
      [email]
    );

    if (rows.length === 0) {
      return res.status(404).json({ error: 'École introuvable' });
    }

    const ecole = rows[0];
  //  const match = await bcrypt.compare(motdepasse, ecole.mot_de_passe);
   // if (!match) return res.status(401).json({ error: "Mot de passe incorrect" });
   if (motdepasse !== ecole.mot_de_passe) {
  return res.status(401).json({ error: "Mot de passe incorrect" });
}

    const token = jwt.sign({ id: ecole.id, role: 'ecole' }, process.env.JWT_SECRET, {
      expiresIn: '1h',
    });

    res.json({ message: 'Connexion réussie', token });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Connexion Étudiant
router.post('/etudiant/login', async (req, res) => {
  const { email, motdepasse } = req.body;

  try {
    const [rows] = await pool.query('SELECT * FROM Etudiant WHERE email = ?', [email]);
    if (rows.length === 0) return res.status(404).json({ error: "Étudiant introuvable" });

    const etudiant = rows[0];
   // const match = await bcrypt.compare(motdepasse, etudiant.mot_de_passe);
  //  if (!match) return res.status(401).json({ error: "Mot de passe incorrect" });
  if (motdepasse !== etudiant.mot_de_passe) {
  return res.status(401).json({ error: "Mot de passe incorrect" });
}

    const token = jwt.sign({ id: etudiant.id, role: 'etudiant' }, process.env.JWT_SECRET, {
      expiresIn: '1h',
    });

    res.json({ message: "Connexion réussie", token });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Connexion Entreprise
router.post('/entreprise/login', async (req, res) => {
  const { email, motdepasse } = req.body;

  try {
    const [rows] = await pool.query('SELECT * FROM Entreprise WHERE email = ?', [email]);
    if (rows.length === 0) return res.status(404).json({ error: "Entreprise introuvable" });

    const entreprise = rows[0];
   // const match = await bcrypt.compare(motdepasse, entreprise.mot_de_passe);
   // if (!match) return res.status(401).json({ error: "Mot de passe incorrect" });
   if (motdepasse !== entreprise.mot_de_passe) {
  return res.status(401).json({ error: "Mot de passe incorrect" });
}
   

    const token = jwt.sign({ id: entreprise.id, role: 'entreprise' }, process.env.JWT_SECRET, {
      expiresIn: '1h',
    });

    res.json({ message: "Connexion réussie", token });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
