const { DataTypes } = require('sequelize');
const sequelize = require('../db');

const Entreprise = sequelize.define('Entreprise', {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  nom: DataTypes.STRING,
  adresse: DataTypes.STRING,
  email: { type: DataTypes.STRING, unique: true },
  telephone: DataTypes.STRING
});

module.exports = Entreprise;
    