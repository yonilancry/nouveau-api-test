const { DataTypes } = require('sequelize');
const sequelize = require('../db');

const ModeleConvention = sequelize.define('ModeleConvention', {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  nom: DataTypes.STRING,
  contenu: DataTypes.TEXT
});

module.exports = ModeleConvention;
