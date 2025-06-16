const express = require('express');
const router = express.Router();
const conventionController = require('../controller/Convention/conventionController');

router.post('/', conventionController.createConvention);
router.get('/', conventionController.getAllConventions);
router.get('/:id', conventionController.getConventionById);
router.put('/:id', conventionController.updateConvention);

// Routes spécifiques pour validation
router.put('/:id/valider-entreprise', conventionController.validerParEntreprise);
router.put('/:id/valider-ecole', conventionController.validerParEcole);

router.delete('/:id', conventionController.deleteConvention);

module.exports = router;
