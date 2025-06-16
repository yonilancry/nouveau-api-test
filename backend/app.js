const express = require('express');
const jwt = require('jsonwebtoken'); 
const { swaggerUi, swaggerSpec } = require('./swagger');
require('dotenv').config();
const userRoutes = require('./routes/userRoutes.js');
const app = express();
app.use(express.json()); // parse JSON
/**
 * @swagger
 * /api/users:
 *   get:
 *     summary: Liste tous les utilisateurs
 *     responses:
 *       200:
 *         description: Liste d'utilisateurs
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                   name:
 *                     type: string
 */

/**
 * @swagger
 * /api/users:
 *   post:
 *     summary: Crée un nouvel utilisateur
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *     responses:
 *       201:
 *         description: Utilisateur créé
 */
function authenticateToken (req, res, next) {

const token = req.headers['authorization']?.split(' ')[1];

if (!token) return res.sendStatus(401);

jwt.verify(token, process.env.JWT_SECRET, (err, user) => {

if (err) return res.sendStatus (403);
req.user = user;

next ();

}) ;

}

app.use('/api/users', userRoutes);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
console.log(`API en ligne sur http://localhost:${PORT}`);
});