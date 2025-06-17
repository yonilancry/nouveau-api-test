// controller/conventionController.js
const pool = require('../../db');

module.exports = {
  createConvention: async (req, res) => {
    try {
      const {
        status,
        dateCreation,
        dateDebut,
        dateFin,
        entreprise_id = null,
        etudiant_id,
        ecole_id,
        inputs
      } = req.body;

      // 1. Récupérer le modèle de convention lié à l'école
      const [modelRows] = await pool.execute(
        'SELECT details FROM ModelConvention WHERE ecole_id = ?',
        [ecole_id]
      );

      let details = null;

      if (modelRows.length > 0 && modelRows[0].details) {
        const modelFields = JSON.parse(modelRows[0].details); // ['sexe', 'remuneration', ...]
        details = {};

        for (const field of modelFields) {
          details[field] = inputs[field] ?? null;
        }
      } else {
        // Aucun modèle, donc on ne structure pas les détails
        details = null;
      }

      // 2. Insérer la convention
      const [result] = await pool.execute(
        `INSERT INTO Convention (status, dateCreation, date_debut, date_fin, details, entreprise_id, etudiant_id, ecole_id)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          status,
          dateCreation,
          dateDebut,
          dateFin,
          details ? JSON.stringify(details) : null,
          entreprise_id,
          etudiant_id,
          ecole_id
        ]
      );

      res.status(201).json({ id: result.insertId, ...req.body, details });
    } catch (error) {
      console.error('Erreur création convention:', error);
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
      const {
        status,
        dateCreation,
        dateDebut,
        dateFin,
        entreprise_id,
        etudiant_id,
        ecole_id,
        inputs
      } = req.body;

      // Reprendre modèle
      const [modelRows] = await pool.execute(
        'SELECT details FROM ModelConvention WHERE ecole_id = ?',
        [ecole_id]
      );

      let details = null;

      if (modelRows.length > 0 && modelRows[0].details) {
        const modelFields = JSON.parse(modelRows[0].details);
        details = {};
        for (const field of modelFields) {
          details[field] = inputs[field] ?? null;
        }
      }

      const [result] = await pool.execute(
        `UPDATE Convention SET status=?, dateCreation=?, dateDebut=?, dateFin=?, details=?, entreprise_id=?, etudiant_id=?, ecole_id=? WHERE id=?`,
        [
          status,
          dateCreation,
          dateDebut,
          dateFin,
          details ? JSON.stringify(details) : null,
          entreprise_id,
          etudiant_id,
          ecole_id,
          req.params.id
        ]
      );

      if (result.affectedRows === 0) return res.status(404).json({ error: 'Convention non trouvée' });
      res.json({ id: req.params.id, ...req.body, details });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Erreur lors de la mise à jour de la convention' });
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
      res.status(500).json({ error: 'Erreur lors de la validation par entreprise' });
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
      res.status(500).json({ error: 'Erreur lors de la validation par école' });
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
  }, 


  getConventionByUser: async (req, res) => {
    try {
      const userId = req.params.id; // <-- ici
  
      if (!userId) {
        return res.status(400).json({ error: 'User ID is required' });
      }
  
      const [conventionRows] = await pool.execute(
        `SELECT * FROM Convention 
         WHERE etudiant_id = ? OR entreprise_id = ? 
         ORDER BY dateCreation DESC 
         LIMIT 1`,
        [userId, userId]
      );
  
      if (conventionRows.length === 0) {
        return res.status(404).json({ error: 'Aucune convention trouvée pour cet utilisateur' });
      }
  
      const convention = conventionRows[0];
  
      const [modelRows] = await pool.execute(
        `SELECT details FROM ModelConvention WHERE ecole_id = ?`,
        [convention.ecole_id]
      );
  
      const model = modelRows.length > 0 ? { details: JSON.parse(modelRows[0].details) } : null;
  
      const result = {
        id: convention.id,
        status: convention.status,
        dateCreation: convention.dateCreation,
        dateDebut: convention.dateDebut,
        dateFin: convention.dateFin,
        entreprise_id: convention.entreprise_id,
        etudiant_id: convention.etudiant_id,
        ecole_id: convention.ecole_id,
        details: convention.details ? JSON.parse(convention.details) : {},
        model: model
      };
  
      res.json(result);
    } catch (error) {
      console.error('Erreur getConventionByUser:', error);
      res.status(500).json({ error: 'Erreur serveur lors de la récupération de la convention' });
    }
  }, 

  getAllConventionsByEtudiant: async (req, res) => {
    try {
      const etudiantId = req.params.id;
  
      if (!etudiantId) {
        return res.status(400).json({ error: 'ID étudiant requis' });
      }
  
      const [rows] = await pool.execute(
        `SELECT * FROM Convention WHERE etudiant_id = ? ORDER BY dateCreation DESC`,
        [etudiantId]
      );
  
      // Parse les détails JSON pour chaque convention
      const conventions = rows.map(row => ({
        ...row,
        details: row.details ? JSON.parse(row.details) : {}
      }));
  
      res.json(conventions);
    } catch (error) {
      console.error('Erreur getAllConventionsByEtudiant:', error);
      res.status(500).json({ error: 'Erreur serveur' });
    }
  },
  
};
