const { DataTypes } = require("sequelize");
const db = require('../configs/db')

module.exports = model;

function model(sequelize) {
  const attributes = {
    role: { type: DataTypes.STRING, allowNull: true },
    
  };


  return sequelize.define("roles", attributes);
}
