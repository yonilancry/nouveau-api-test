const express = require('express');
const axios = require('axios');
const PDFDocument = require('pdfkit');
const router = express.Router();
const conventionController = require('../controller/Convention/conventionController');

router.post('/', conventionController.createConvention);
router.get('/', conventionController.getAllConventions);

router.get('/user/:id', conventionController.getConventionByUser);

router.get('/:id', conventionController.getConventionById);
router.put('/:id', conventionController.updateConvention);



router.get('/by-etudiant/:id', conventionController.getAllConventionsByEtudiant);



// Routes spécifiques pour validation
router.put('/:id/valider-entreprise', conventionController.validerParEntreprise);
router.put('/:id/valider-ecole', conventionController.validerParEcole);

router.delete('/:id', conventionController.deleteConvention);


router.get('/:id/generate-pdf', async (req, res) => {
  const { id } = req.params;

  try {
    const response = await axios.get(`http://localhost:3000/api/conventions/${id}`);
    const convention = response.data;

    if (!convention || !convention.id) {
      return res.status(404).json({ error: "Convention introuvable" });
    }

    // PDF headers
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="convention_${id}.pdf"`);

    const doc = new PDFDocument();
    doc.pipe(res); // On envoie directement le flux PDF dans la réponse

    // Titre
    doc.fontSize(20).text(`Convention de stage n°${convention.id}`, { align: 'center' }).moveDown();

    // Contenu
    doc.fontSize(12).text(`Statut : ${convention.status}`);
    doc.text(`Étudiant ID : ${convention.etudiant_id}`);
    doc.text(`Entreprise ID : ${convention.entreprise_id}`);
    doc.text(`École ID : ${convention.ecole_id}`);
    doc.text(`Date de début : ${new Date(convention.date_debut).toLocaleDateString('fr-FR')}`);
    doc.text(`Date de fin : ${new Date(convention.date_fin).toLocaleDateString('fr-FR')}`);
    doc.text(`Date de création : ${new Date(convention.dateCreation).toLocaleDateString('fr-FR')}`);

    if (convention.details) {
      doc.moveDown().font('Helvetica-Bold').text('Détails supplémentaires :');
      doc.font('Helvetica').text(convention.details);
    }

    doc.end(); // On termine le flux PDF ici
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erreur lors de la génération du PDF" });
  }
});

module.exports = router;
