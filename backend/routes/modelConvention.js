const express = require('express');
const router = express.Router();
const modelConventionController = require('../controller/ModelConvention/modelConventionController');

router.post('/', modelConventionController.createModelConvention);
router.get('/', modelConventionController.getAllModelConventions);
router.get('/:id', modelConventionController.getModelConventionById);
router.put('/:id', modelConventionController.updateModelConvention);
router.delete('/:id', modelConventionController.deleteModelConvention);
router.get('/by-ecole/:ecole_id', modelConventionController.getConventionModelByEcoleId);


module.exports = router;
