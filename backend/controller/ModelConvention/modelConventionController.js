const pool = require('../../db');

module.exports = {

  createModelConvention: async (req, res) => {
    try {
      const { details, ecole_id } = req.body;

      // Si details est un objet (tableau ou objet), on stringify, sinon on garde null ou string valide
      let detailsJson = null;
      if (details) {
        if (typeof details === 'string') {
          // Vérifie si c'est une string JSON valide
          try {
            JSON.parse(details);
            detailsJson = details;
          } catch {
            // Si ce n'est pas une string JSON valide, on stringify
            detailsJson = JSON.stringify(details);
          }
        } else {
          detailsJson = JSON.stringify(details);
        }
      }

      const [result] = await pool.execute(
        `INSERT INTO ModelConvention (details, ecole_id) VALUES (?, ?)`,
        [detailsJson, ecole_id]
      );

      res.status(201).json({ id: result.insertId, details, ecole_id });
    } catch (error) {
      console.error('Erreur création modèle convention:', error);
      res.status(500).json({ error: 'Erreur lors de la création du modèle de convention' });
    }
  },

  getAllModelConventions: async (req, res) => {
    try {
      const [rows] = await pool.query('SELECT * FROM ModelConvention');

      const data = rows.map(row => {
        if (!row.details) return { ...row, details: null };

        try {
          // Si details est déjà un objet (par ex. Buffer ou autre), on renvoie tel quel
          if (typeof row.details === 'object') return { ...row, details: row.details };

          return { ...row, details: JSON.parse(row.details) };
        } catch {
          // Si parse échoue, renvoie tel quel (string)
          return { ...row, details: row.details };
        }
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

      if (model.details) {
        try {
          if (typeof model.details === 'object') {
            model.details = model.details;
          } else {
            model.details = JSON.parse(model.details);
          }
        } catch {
          // En cas d’erreur, on laisse details tel quel
        }
      } else {
        model.details = null;
      }

      res.json(model);
    } catch (error) {
      console.error('Erreur get modèle convention:', error);
      res.status(500).json({ error: 'Erreur serveur' });
    }
  },

  updateModelConvention: async (req, res) => {
    try {
      const { details, ecole_id } = req.body;

      let detailsJson = null;
      if (details) {
        if (typeof details === 'string') {
          try {
            JSON.parse(details);
            detailsJson = details;
          } catch {
            detailsJson = JSON.stringify(details);
          }
        } else {
          detailsJson = JSON.stringify(details);
        }
      }

      const [result] = await pool.execute(
        `UPDATE ModelConvention SET details = ?, ecole_id = ? WHERE id = ?`,
        [detailsJson, ecole_id, req.params.id]
      );

      if (result.affectedRows === 0) return res.status(404).json({ error: 'Modèle de convention non trouvé' });

      res.json({ id: req.params.id, details, ecole_id });
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
