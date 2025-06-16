// controller/etudiantController.js
const pool = require('../../db');

module.exports = {

  createEtudiant: async (req, res) => {
    try {
      const {
        Nom,
        prenom,
        adresse,
        email,
        numTel,
        dateNaissance,
        signature, // base64 string ou null
        ecole_id // lien vers l'école, si besoin
      } = req.body;
      console.log(Nom);

      const [result] = await pool.execute(
        `INSERT INTO Etudiant 
         (Nom, prenom, adresse, email, numTel, dateNaissance, signature, ecole_id) 
         VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          Nom,
          prenom,
          adresse,
          email,
          numTel,
          dateNaissance,
          signature ? Buffer.from(signature, 'base64') : null,
          ecole_id || null
        ]
      );

      res.status(201).json({ id: result.insertId, ...req.body });
    } catch (error) {
        console.error('❌ ERREUR SQL:', error);
        res.status(500).json({ error: 'Erreur lors de la création de l\'étudiant' });
    }
  },

  getAllEtudiants: async (req, res) => {
    try {
      const [rows] = await pool.query('SELECT id, Nom, prenom, adresse, email, numTel, dateNaissance FROM Etudiant');
      res.json(rows);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Erreur lors de la récupération des étudiants' });
    }
  },

  getEtudiantById: async (req, res) => {
    try {
      const [rows] = await pool.execute('SELECT * FROM Etudiant WHERE id = ?', [req.params.id]);
      if (rows.length === 0) return res.status(404).json({ error: 'Étudiant non trouvé' });
      res.json(rows[0]);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Erreur serveur' });
    }
  },

  updateEtudiant: async (req, res) => {
    try {
      const {
        Nom,
        prenom,
        adresse,
        email,
        numTel,
        dateNaissance,
        signature,
        ecole_id
      } = req.body;

      const [result] = await pool.execute(
        `UPDATE Etudiant SET Nom=?, prenom=?, adresse=?, email=?, numTel=?, dateNaissance=?, signature=?, ecole_id=? WHERE id=?`,
        [
          Nom,
          prenom,
          adresse,
          email,
          numTel,
          dateNaissance,
          signature ? Buffer.from(signature, 'base64') : null,
          ecole_id || null,
          req.params.id
        ]
      );

      if (result.affectedRows === 0) return res.status(404).json({ error: 'Étudiant non trouvé' });
      res.json({ id: req.params.id, ...req.body });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Erreur lors de la mise à jour de l\'étudiant' });
    }
  },

  deleteEtudiant: async (req, res) => {
    try {
      const [result] = await pool.execute('DELETE FROM Etudiant WHERE id = ?', [req.params.id]);
      if (result.affectedRows === 0) return res.status(404).json({ error: 'Étudiant non trouvé' });
      res.status(204).send();
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Erreur lors de la suppression de l\'étudiant' });
    }
  }
};
