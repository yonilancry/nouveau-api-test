const express = require('express');
const router = express.Router();
const modelConventionController = require('../controller/ModelConvention/modelConventionController');
const authenticateToken = require('../middleware/auth');

// Récupérer les modèles de l’école connectée
router.get('/by-ecole', authenticateToken, modelConventionController.getConventionModelByEcoleId);

// Créer un modèle pour l’école connectée
router.post('/', authenticateToken, modelConventionController.createModelConvention);

router.get('/', modelConventionController.getAllModelConventions);
router.get('/:id', modelConventionController.getModelConventionById);
router.put('/:id', modelConventionController.updateModelConvention);
router.delete('/:id', modelConventionController.deleteModelConvention);

module.exports = router;
