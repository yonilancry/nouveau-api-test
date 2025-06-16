const jwt = require('jsonwebtoken');
function authenticateToken(req, res, next) {
const authHeader = req.headers['authorization'];
const token = authHeader?.split(' ')[1];
if (!token) return res.status(401).json({ message: 'Token manquant' });
jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
if (err) return res.status(403).json({ message: 'Token invalide ou expiré' });
req.user = user; // Ajoute les infos décodées à la requête
next();
}
);
}
module.exports = authenticateToken;