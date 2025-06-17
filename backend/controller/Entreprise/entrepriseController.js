const pool = require('../../db');
const bcrypt = require('bcrypt');

module.exports = {

  createEntreprise: async (req, res) => {
    try {
      const {
        representant,
        nom,
        qualiteRepresentant,
        email,
        numero_telephone,
        adresse,
        mot_de_passe,   // mot de passe clair
        signature       // base64 string ou null
      } = req.body;

      if (!mot_de_passe) {
        return res.status(400).json({ error: "Le mot de passe est obligatoire." });
      }

      // Hash du mot de passe
      const hashedPassword = await bcrypt.hash(mot_de_passe, 10);

      const [result] = await pool.execute(
        `INSERT INTO Entreprise 
         (representant, nom, qualiteRepresentant, email, numero_telephone, adresse, mot_de_passe, signature) 
         VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          representant,
          nom || null,
          qualiteRepresentant,
          email,
          numero_telephone,
          adresse,
          hashedPassword,
          signature ? Buffer.from(signature, 'base64') : null
        ]
      );

      res.status(201).json({
        id: result.insertId,
        representant,
        nom,
        qualiteRepresentant,
        email,
        numero_telephone,
        adresse,
        signature
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Erreur lors de la création de l\'entreprise' });
    }
  },

  getAllEntreprises: async (req, res) => {
    try {
      const [rows] = await pool.query(
        'SELECT id, representant, nom, qualiteRepresentant, email, numero_telephone, adresse FROM Entreprise'
      );
      res.json(rows);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Erreur lors de la récupération des entreprises' });
    }
  },

  getEntrepriseById: async (req, res) => {
    try {
      const [rows] = await pool.execute(
        'SELECT id, representant, nom, qualiteRepresentant, email, numero_telephone, adresse FROM Entreprise WHERE id = ?',
        [req.params.id]
      );
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
        representant,
        nom,
        qualiteRepresentant,
        email,
        numero_telephone,
        adresse,
        mot_de_passe,
        signature
      } = req.body;

      let hashedPassword = null;
      if (mot_de_passe) {
        hashedPassword = await bcrypt.hash(mot_de_passe, 10);
      }

      let query;
      let params;

      if (hashedPassword) {
        query = `UPDATE Entreprise SET representant=?, nom=?, qualiteRepresentant=?, email=?, numero_telephone=?, adresse=?, mot_de_passe=?, signature=? WHERE id=?`;
        params = [representant, nom || null, qualiteRepresentant, email, numero_telephone, adresse, hashedPassword, signature ? Buffer.from(signature, 'base64') : null, req.params.id];
      } else {
        query = `UPDATE Entreprise SET representant=?, nom=?, qualiteRepresentant=?, email=?, numero_telephone=?, adresse=?, signature=? WHERE id=?`;
        params = [representant, nom || null, qualiteRepresentant, email, numero_telephone, adresse, signature ? Buffer.from(signature, 'base64') : null, req.params.id];
      }

      const [result] = await pool.execute(query, params);

      if (result.affectedRows === 0) return res.status(404).json({ error: 'Entreprise non trouvée' });

      res.json({
        id: req.params.id,
        representant,
        nom,
        qualiteRepresentant,
        email,
        numero_telephone,
        adresse,
        signature
      });
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
  }, 
  updateSignature: async (req, res) => {
    try {
      const { signature } = req.body;
      const { id } = req.params;
  
      if (!signature) {
        return res.status(400).json({ error: 'Signature manquante' });
      }
  
      const bufferSignature = Buffer.from(signature, 'base64');
  
      const [result] = await pool.execute(
        `UPDATE Entreprise SET signature = ? WHERE id = ?`,
        [bufferSignature, id]
      );
  
      if (result.affectedRows === 0) {
        return res.status(404).json({ error: 'Entreprise non trouvé' });
      }
  
      res.json({ message: 'Signature mise à jour avec succès' });
    } catch (error) {
      console.error('Erreur updateSignature:', error);
      res.status(500).json({ error: 'Erreur lors de la mise à jour de la signature' });
    }
  }

};
