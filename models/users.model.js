const { DataTypes } = require("sequelize");
const db = require('../configs/db')

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


  return sequelize.define("users", attributes);
}
