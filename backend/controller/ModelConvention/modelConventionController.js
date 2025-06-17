const pool = require('../../db');

// Fonction utilitaire pour parser "details"
function parseDetails(details) {
  if (!details) return null;

  if (typeof details === 'string') {
    try {
      // D'abord, tenter un JSON.parse si c'est du vrai JSON
      const parsed = JSON.parse(details);
      return JSON.stringify(parsed);
    } catch {
      // Sinon, traiter comme une string séparée par des virgules
      const fields = details
        .split(',')
        .map(f => f.trim())
        .filter(f => f.length > 0);
      return JSON.stringify(fields);
    }
  }

  // Si details est déjà un objet ou un tableau
  return JSON.stringify(details);
}

module.exports = {

  createModelConvention: async (req, res) => {
    try {
      const { details, ecole_id } = req.body;
      const detailsJson = parseDetails(details);

      const [result] = await pool.execute(
        `INSERT INTO ModelConvention (details, ecole_id) VALUES (?, ?)`,
        [detailsJson, ecole_id]
      );

      res.status(201).json({ id: result.insertId, details: JSON.parse(detailsJson), ecole_id });
    } catch (error) {
      console.error('Erreur création modèle convention:', error);
      res.status(500).json({ error: 'Erreur lors de la création du modèle de convention' });
    }
  },

  getAllModelConventions: async (req, res) => {
    try {
      const [rows] = await pool.query('SELECT * FROM ModelConvention');

      const data = rows.map(row => {
        let parsedDetails = null;
        try {
          parsedDetails = row.details ? JSON.parse(row.details) : null;
        } catch {
          parsedDetails = row.details;
        }
        return { ...row, details: parsedDetails };
      });

      res.json(data);
    } catch (error) {
      console.error('Erreur récupération modèles convention:', error);
      res.status(500).json({ error: 'Erreur lors de la récupération des modèles de convention' });
    }
  },

  getModelConventionById: async (req, res) => {
    try {
      const [rows] = await pool.execute('SELECT * FROM ModelConvention WHERE id = ?', [req.params.id]);
      if (rows.length === 0) return res.status(404).json({ error: 'Modèle de convention non trouvé' });

      const model = rows[0];
      try {
        model.details = model.details ? JSON.parse(model.details) : null;
      } catch {
        // Si parse échoue, on laisse tel quel
      }

      res.json(model);
    } catch (error) {
      console.error('Erreur get modèle convention:', error);
      res.status(500).json({ error: 'Erreur serveur' });
    }
  },
  
  getConventionModelByEcoleId: async (req, res) => {
    try {
      const { ecole_id } = req.params;
  
      const [rows] = await pool.execute(
        'SELECT * FROM ModelConvention WHERE ecole_id = ?',
        [ecole_id]
      );
  
      if (rows.length === 0) {
        return res.status(404).json({ error: 'Aucun modèle trouvé pour cette école' });
      }
  
      const model = rows[0];
      try {
        model.details = model.details ? JSON.parse(model.details) : null;
      } catch {
        // En cas d'échec du parsing JSON, on garde la version brute
      }
  
      res.json(model);
    } catch (error) {
      console.error('Erreur get modèle par école_id:', error);
      res.status(500).json({ error: 'Erreur lors de la récupération du modèle de convention par école' });
    }
  },
  

  updateModelConvention: async (req, res) => {
    try {
      const { details, ecole_id } = req.body;
      const detailsJson = parseDetails(details);

      const [result] = await pool.execute(
        `UPDATE ModelConvention SET details = ?, ecole_id = ? WHERE id = ?`,
        [detailsJson, ecole_id, req.params.id]
      );

      if (result.affectedRows === 0) return res.status(404).json({ error: 'Modèle de convention non trouvé' });

      res.json({ id: req.params.id, details: JSON.parse(detailsJson), ecole_id });
    } catch (error) {
      console.error('Erreur update modèle convention:', error);
      res.status(500).json({ error: 'Erreur lors de la mise à jour du modèle de convention' });
    }
  },

  deleteModelConvention: async (req, res) => {
    try {
      const [result] = await pool.execute('DELETE FROM ModelConvention WHERE id = ?', [req.params.id]);
      if (result.affectedRows === 0) return res.status(404).json({ error: 'Modèle de convention non trouvé' });
      res.status(204).send();
    } catch (error) {
      console.error('Erreur suppression modèle convention:', error);
      res.status(500).json({ error: 'Erreur lors de la suppression du modèle de convention' });
    }
  }
};
