// models/index.js
const sequelize = require('../db');
const Etudiant = require('./Etudiant');
const Convention = require('./Convention');
const Entreprise = require('./Entreprise');
const Ecole = require('./Ecole');
const ModeleConvention = require('./ModeleConvention');

// Associations (si tu les as déjà définies)
Etudiant.hasMany(Convention);
Convention.belongsTo(Etudiant);

Entreprise.hasMany(Convention);
Convention.belongsTo(Entreprise);

Ecole.hasMany(Convention);
Convention.belongsTo(Ecole);

Ecole.hasOne(ModeleConvention);
ModeleConvention.belongsTo(Ecole);

module.exports = { sequelize };
