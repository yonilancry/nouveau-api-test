const pool = require('../../db');
const bcrypt = require('bcrypt');

module.exports = {

  createEtudiant: async (req, res) => {
    try {
      const {
        Nom,
        prenom,
        adresse,
        email,
        mot_de_passe,
        numero_telephone,
        dateNaissance,
        signature, // base64 ou null
        ecole_id
      } = req.body;

      const hashedPassword = await bcrypt.hash(mot_de_passe, 10);

      const [result] = await pool.execute(
        `INSERT INTO Etudiant 
         (Nom, prenom, adresse, email, mot_de_passe, numero_telephone, date_naissance, signature, ecole_id) 
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          Nom,
          prenom,
          adresse,
          email,
          hashedPassword,
          numero_telephone,
          dateNaissance,
          signature ? Buffer.from(signature, 'base64') : null,
          ecole_id || null
        ]
      );

      res.status(201).json({ id: result.insertId, Nom, prenom, email });
    } catch (error) {
      console.error('❌ ERREUR SQL:', error);
      res.status(500).json({ error: 'Erreur lors de la création de l\'étudiant' });
    }
  },

  getAllEtudiants: async (req, res) => {
    try {
      const [rows] = await pool.query(
        'SELECT id, Nom, prenom, adresse, email, numero_telephone, date_naissance FROM Etudiant'
      );
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

      // Ne pas retourner le mot de passe
      const { mot_de_passe, ...etudiantSansMdp } = rows[0];
      res.json(etudiantSansMdp);
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
        mot_de_passe, // optionnel
        numero_telephone,
        dateNaissance,
        signature,
        ecole_id
      } = req.body;

      let hashedPasswordClause = '';
      const values = [
        Nom,
        prenom,
        adresse,
        email,
        numero_telephone,
        dateNaissance,
        signature ? Buffer.from(signature, 'base64') : null,
        ecole_id || null
      ];

      if (mot_de_passe) {
        const hashedPassword = await bcrypt.hash(mot_de_passe, 10);
        hashedPasswordClause = ', mot_de_passe = ?';
        values.splice(4, 0, hashedPassword); // Insère à la bonne position
      }

      values.push(req.params.id); // WHERE id = ?

      const query = `
        UPDATE Etudiant 
        SET Nom = ?, prenom = ?, adresse = ?, email = ?${hashedPasswordClause}, numero_telephone = ?, date_naissance = ?, signature = ?, ecole_id = ?
        WHERE id = ?
      `;

      const [result] = await pool.execute(query, values);

      if (result.affectedRows === 0) return res.status(404).json({ error: 'Étudiant non trouvé' });
      res.json({ id: req.params.id, Nom, prenom, email });
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
