const { DataTypes } = require('sequelize');
const sequelize = require('../db');

const Convention = sequelize.define('Convention', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  statut: {
    type: DataTypes.ENUM('brouillon', 'attente_entreprise', 'attente_ecole', 'validee'),
    defaultValue: 'brouillon'
  },
  contenu: {
    type: DataTypes.JSON,
    allowNull: false // ou true si tu veux autoriser le brouillon vide
  }
}, {
  tableName: 'Conventions'
});

module.exports = Convention;
