const { DataTypes } = require("sequelize");
const db = require('../configs/db')

module.exports = model;

function model(sequelize) {
  const attributes = {
    feature: { type: DataTypes.STRING, allowNull: false },
    
  };


  return sequelize.define("features", attributes);
}
