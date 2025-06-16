// controller/modelConventionController.js
const pool = require('../../db');

module.exports = {

  createModelConvention: async (req, res) => {
    try {
      const { details, ecole_id } = req.body; // details est un tableau ou null

      const detailsJson = details ? JSON.stringify(details) : null;

      const [result] = await pool.execute(
        `INSERT INTO ModelConvention (details, ecole_id) VALUES (?, ?)`,
        [detailsJson, ecole_id]
      );

      res.status(201).json({ id: result.insertId, details, ecole_id });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Erreur lors de la création du modèle de convention' });
    }
  },

  getAllModelConventions: async (req, res) => {
    try {
      const [rows] = await pool.query('SELECT * FROM ModelConvention');
      // Convertir details JSON string en objet JS
      const data = rows.map(row => ({
        ...row,
        details: row.details ? JSON.parse(row.details) : null
      }));
      res.json(data);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Erreur lors de la récupération des modèles de convention' });
    }
  },

  getModelConventionById: async (req, res) => {
    try {
      const [rows] = await pool.execute('SELECT * FROM ModelConvention WHERE id = ?', [req.params.id]);
      if (rows.length === 0) return res.status(404).json({ error: 'Modèle de convention non trouvé' });

      const model = rows[0];
      model.details = model.details ? JSON.parse(model.details) : null;

      res.json(model);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Erreur serveur' });
    }
  },

  updateModelConvention: async (req, res) => {
    try {
      const { details, ecole_id } = req.body;
      const detailsJson = details ? JSON.stringify(details) : null;

      const [result] = await pool.execute(
        `UPDATE ModelConvention SET details = ?, ecole_id = ? WHERE id = ?`,
        [detailsJson, ecole_id, req.params.id]
      );

      if (result.affectedRows === 0) return res.status(404).json({ error: 'Modèle de convention non trouvé' });
      res.json({ id: req.params.id, details, ecole_id });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Erreur lors de la mise à jour du modèle de convention' });
    }
  },

  deleteModelConvention: async (req, res) => {
    try {
      const [result] = await pool.execute('DELETE FROM ModelConvention WHERE id = ?', [req.params.id]);
      if (result.affectedRows === 0) return res.status(404).json({ error: 'Modèle de convention non trouvé' });
      res.status(204).send();
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Erreur lors de la suppression du modèle de convention' });
    }
  }
};
