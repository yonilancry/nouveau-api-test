// controller/entrepriseController.js
const pool = require('../../db');

module.exports = {

  createEntreprise: async (req, res) => {
    try {
      const {
        NomRepresentant,
        qualiteRepresentant,
        email,
        numero_telephone,
        adresse,
        signature // base64 string ou null
      } = req.body;

      const [result] = await pool.execute(
        `INSERT INTO Entreprise 
         (NomRepresentant, qualiteRepresentant, email, numero_telephone, adresse, signature) 
         VALUES (?, ?, ?, ?, ?, ?)`,
        [
          NomRepresentant,
          qualiteRepresentant,
          email,
          numero_telephone,
          adresse,
          signature ? Buffer.from(signature, 'base64') : null
        ]
      );

      res.status(201).json({ id: result.insertId, ...req.body });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Erreur lors de la création de l\'entreprise' });
    }
  },

  getAllEntreprises: async (req, res) => {
    try {
      const [rows] = await pool.query('SELECT id, NomRepresentant, qualiteRepresentant, email, numero_telephone, adresse FROM Entreprise');
      res.json(rows);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Erreur lors de la récupération des entreprises' });
    }
  },

  getEntrepriseById: async (req, res) => {
    try {
      const [rows] = await pool.execute('SELECT * FROM Entreprise WHERE id = ?', [req.params.id]);
      if (rows.length === 0) return res.status(404).json({ error: 'Entreprise non trouvée' });
      res.json(rows[0]);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Erreur serveur' });
    }
  },

  updateEntreprise: async (req, res) => {
    try {
      const {
        NomRepresentant,
        qualiteRepresentant,
        email,
        numero_telephone,
        adresse,
        signature
      } = req.body;

      const [result] = await pool.execute(
        `UPDATE Entreprise SET NomRepresentant=?, qualiteRepresentant=?, email=?, numero_telephone=?, adresse=?, signature=? WHERE id=?`,
        [
          NomRepresentant,
          qualiteRepresentant,
          email,
          numero_telephone,
          adresse,
          signature ? Buffer.from(signature, 'base64') : null,
          req.params.id
        ]
      );

      if (result.affectedRows === 0) return res.status(404).json({ error: 'Entreprise non trouvée' });
      res.json({ id: req.params.id, ...req.body });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Erreur lors de la mise à jour de l\'entreprise' });
    }
  },

  deleteEntreprise: async (req, res) => {
    try {
      const [result] = await pool.execute('DELETE FROM Entreprise WHERE id = ?', [req.params.id]);
      if (result.affectedRows === 0) return res.status(404).json({ error: 'Entreprise non trouvée' });
      res.status(204).send();
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Erreur lors de la suppression de l\'entreprise' });
    }
  }
};
