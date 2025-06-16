const { DataTypes } = require('sequelize');
const sequelize = require('../db');

const Ecole = sequelize.define('Ecole', {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  nom: DataTypes.STRING,
  email: { type: DataTypes.STRING, unique: true }
});

module.exports = Ecole;
