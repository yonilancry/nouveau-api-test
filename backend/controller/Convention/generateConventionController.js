const PDFDocument = require('pdfkit');
const axios = require('axios');
const fs = require('fs');

// Fonction principale
async function generateConventionPDF() {
  try {
    const response = await axios.get('http://localhost:3000/api/conventions');
    const conventions = response.data;

    if (!conventions.length) {
      console.log("Aucune convention trouvée.");
      return;
    }

    const doc = new PDFDocument();
    const filePath = 'convention.pdf';
    doc.pipe(fs.createWriteStream(filePath));

    doc.fontSize(20).text('Convention de Stage', { align: 'center' });
    doc.moveDown();

    conventions.forEach((convention, index) => {
      doc.fontSize(12).text(`Convention #${convention.id}`);
      doc.text(`Étudiant ID : ${convention.etudiant_id}`);
      doc.text(`Entreprise ID : ${convention.entreprise_id}`);
      doc.text(`École ID : ${convention.ecole_id}`);
      doc.text(`Date de début : ${new Date(convention.date_debut).toLocaleDateString()}`);
      doc.text(`Date de fin : ${new Date(convention.date_fin).toLocaleDateString()}`);
      doc.text(`Date de création : ${new Date(convention.dateCreation).toLocaleDateString()}`);
      doc.text(`Statut : ${convention.status}`);
      doc.moveDown();
    });

    doc.end();

    console.log(`✅ PDF généré avec succès : ${filePath}`);
  } catch (error) {
    console.error('Erreur lors de la génération du PDF :', error.message);
  }
}

generateConventionPDF();
