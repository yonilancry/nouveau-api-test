const { DataTypes } = require('sequelize');
const sequelize = require('../db');

const Etudiant = sequelize.define('Etudiant', {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  nom: DataTypes.STRING,
  prenom: DataTypes.STRING,
  email: { type: DataTypes.STRING, unique: true },
  motDePasse: DataTypes.STRING
});

module.exports = Etudiant;
