// controller/conventionController.js
const pool = require('../../db');

module.exports = {

  createConvention: async (req, res) => {
    try {
      const { status, dateCreation, dateDebut, dateFin, details, entreprise_id, etudiant_id, ecole_id } = req.body;

      const [result] = await pool.execute(
        `INSERT INTO Convention (status, dateCreation, dateDebut, dateFin, details, entreprise_id, etudiant_id, ecole_id)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        [status, dateCreation, dateDebut, dateFin, JSON.stringify(details), entreprise_id, etudiant_id, ecole_id]
      );

      res.status(201).json({ id: result.insertId, ...req.body });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Erreur lors de la création de la convention' });
    }
  },

  getAllConventions: async (req, res) => {
    try {
      const [rows] = await pool.query('SELECT * FROM Convention');
      res.json(rows);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Erreur lors de la récupération des conventions' });
    }
  },

  getConventionById: async (req, res) => {
    try {
      const [rows] = await pool.execute('SELECT * FROM Convention WHERE id = ?', [req.params.id]);
      if (rows.length === 0) return res.status(404).json({ error: 'Convention non trouvée' });
      res.json(rows[0]);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Erreur serveur' });
    }
  },

  updateConvention: async (req, res) => {
    try {
      const { status, dateCreation, dateDebut, dateFin, details, entreprise_id, etudiant_id, ecole_id } = req.body;

      const [result] = await pool.execute(
        `UPDATE Convention SET status=?, dateCreation=?, dateDebut=?, dateFin=?, details=?, entreprise_id=?, etudiant_id=?, ecole_id=? WHERE id=?`,
        [status, dateCreation, dateDebut, dateFin, JSON.stringify(details), entreprise_id, etudiant_id, ecole_id, req.params.id]
      );

      if (result.affectedRows === 0) return res.status(404).json({ error: 'Convention non trouvée' });
      res.json({ id: req.params.id, ...req.body });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Erreur lors de la mise à jour' });
    }
  },

  validerParEntreprise: async (req, res) => {
    try {
      const [result] = await pool.execute(
        `UPDATE Convention SET status = 'Validée par entreprise' WHERE id = ?`,
        [req.params.id]
      );
      if (result.affectedRows === 0) return res.status(404).json({ error: 'Convention non trouvée' });
      res.json({ message: 'Convention validée par entreprise' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Erreur lors de la validation' });
    }
  },

  validerParEcole: async (req, res) => {
    try {
      const [result] = await pool.execute(
        `UPDATE Convention SET status = 'Validée par école' WHERE id = ?`,
        [req.params.id]
      );
      if (result.affectedRows === 0) return res.status(404).json({ error: 'Convention non trouvée' });
      res.json({ message: 'Convention validée par école' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Erreur lors de la validation' });
    }
  },

  deleteConvention: async (req, res) => {
    try {
      const [result] = await pool.execute('DELETE FROM Convention WHERE id = ?', [req.params.id]);
      if (result.affectedRows === 0) return res.status(404).json({ error: 'Convention non trouvée' });
      res.status(204).send();
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Erreur lors de la suppression' });
    }
  }
};
