const express = require('express');
const authenticateToken = require('../middleware/auth');
const router = express.Router();
router.get('/', authenticateToken, (req, res) => {
res.json({ message: `Bienvenue ${req.user.username}, voici des données protégées.` });
});
module.exports = router;