const express = require('express');
const router = express.Router();
const etudiantController = require('../controller/Etudiant/etudiantController');

router.post('/', etudiantController.createEtudiant);
router.get('/', etudiantController.getAllEtudiants);
router.get('/:id', etudiantController.getEtudiantById);
router.put('/:id', etudiantController.updateEtudiant);  
router.delete('/:id', etudiantController.deleteEtudiant);
router.put('/:id/signature', etudiantController.updateSignature);

module.exports = router;
