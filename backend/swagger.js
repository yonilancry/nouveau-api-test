// swagger.js
const swaggerJSDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');
// Configuration Swagger
const options = {
definition: {
openapi: '3.0.0',
info: {
title: 'API Utilisateurs',
version: '1.0.0',
description: 'Documentation API utilisateurs avec Swagger',
},
servers: [{ url: 'http://localhost:3000' }],
},
apis: ['app.js'], // ou tous les fichiers contenant des routes
};
const swaggerSpec = swaggerJSDoc(options);
module.exports = { swaggerUi, swaggerSpec };