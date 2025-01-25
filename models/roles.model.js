const { DataTypes } = require("sequelize");
const db = require('../config/db')

module.exports = model;

function model(sequelize) {
  const attributes = {
    role: { type: DataTypes.STRING, allowNull: true },
    
  };

  const options = {
    timestamps: true, 
  };

  return sequelize.define("roles", attributes, options);
}
