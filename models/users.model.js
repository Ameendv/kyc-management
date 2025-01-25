const { DataTypes } = require("sequelize");
const db = require('../config/db')

module.exports = model;

function model(sequelize) {
  const attributes = {
    username: { type: DataTypes.STRING, allowNull: true },
    role_id: {
        type: DataTypes.INTEGER, defaultValue:1,
        references: {
            model: db.Roles,
            key: 'id',
            allowNull: false
        }
    },
    email: { type: DataTypes.STRING, allowNull: false },
    password: { type: DataTypes.STRING, allowNull: false },
    
  };
  const options = {
    timestamps: true, 
  };


  return sequelize.define("users", attributes, options);
}
