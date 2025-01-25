const { DataTypes } = require("sequelize");
const db = require('../config/db')

module.exports = model;

function model(sequelize) {
  const attributes = {
    feature: { type: DataTypes.STRING, allowNull: false },
    
  };

  const options = {
    timestamps: true, 
  };


  return sequelize.define("features", attributes, options);
}
