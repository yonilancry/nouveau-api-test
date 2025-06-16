const pool = require('../../db');
const bcrypt = require('bcrypt');

const SALT_ROUNDS = 10;

module.exports = {
  createEcole: async (req, res) => {
    try {
      const {
        raisonSocial,
        dateCreation,
        dateUpdated,
        email,
        mot_de_passe,
        NomRepresentant,
        numero_telephone,
        adresse,
        signature // base64 ou null
      } = req.body;

      if (!mot_de_passe) {
        return res.status(400).json({ error: 'Le mot de passe est requis' });
      }

      const hashedPassword = await bcrypt.hash(mot_de_passe, SALT_ROUNDS);

      const [result] = await pool.execute(
        `INSERT INTO Ecole 
         (raisonSocial, dateCreation, dateUpdated, email, mot_de_passe, NomRepresentant, numero_telephone, adresse, signature) 
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          raisonSocial,
          dateCreation,
          dateUpdated,
          email,
          hashedPassword,
          NomRepresentant,
          numero_telephone,
          adresse,
          signature ? Buffer.from(signature, 'base64') : null
        ]
      );

      res.status(201).json({ id: result.insertId });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Erreur lors de la création de l'école" });
    }
  },

  getAllEcoles: async (req, res) => {
    try {
      const [rows] = await pool.query(
        'SELECT id, raisonSocial, dateCreation, dateUpdated, email, NomRepresentant, numero_telephone, adresse FROM Ecole'
      );
      res.json(rows);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Erreur lors de la récupération des écoles' });
    }
  },

  getEcoleById: async (req, res) => {
    try {
      const [rows] = await pool.execute('SELECT * FROM Ecole WHERE id = ?', [req.params.id]);
      if (rows.length === 0) return res.status(404).json({ error: 'École non trouvée' });

      const { mot_de_passe, ...ecoleSansMotDePasse } = rows[0];
      res.json(ecoleSansMotDePasse);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Erreur serveur' });
    }
  },

  updateEcole: async (req, res) => {
    try {
      const {
        raisonSocial,
        dateCreation,
        dateUpdated,
        email,
        mot_de_passe,
        NomRepresentant,
        numero_telephone,
        adresse,
        signature
      } = req.body;

      let hashedPassword = null;
      if (mot_de_passe) {
        hashedPassword = await bcrypt.hash(mot_de_passe, SALT_ROUNDS);
      }

      const [result] = await pool.execute(
        `UPDATE Ecole 
         SET raisonSocial=?, dateCreation=?, dateUpdated=?, email=?, ${hashedPassword ? 'mot_de_passe=?, ' : ''}NomRepresentant=?, numero_telephone=?, adresse=?, signature=? 
         WHERE id=?`,
        [
          raisonSocial,
          dateCreation,
          dateUpdated,
          email,
          ...(hashedPassword ? [hashedPassword] : []),
          NomRepresentant,
          numero_telephone,
          adresse,
          signature ? Buffer.from(signature, 'base64') : null,
          req.params.id
        ]
      );

      if (result.affectedRows === 0) return res.status(404).json({ error: 'École non trouvée' });
      res.json({ id: req.params.id });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Erreur lors de la mise à jour de l'école" });
    }
  },

  deleteEcole: async (req, res) => {
    try {
      const [result] = await pool.execute('DELETE FROM Ecole WHERE id = ?', [req.params.id]);
      if (result.affectedRows === 0) return res.status(404).json({ error: 'École non trouvée' });
      res.status(204).send();
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Erreur lors de la suppression de l'école" });
    }
  }
};
