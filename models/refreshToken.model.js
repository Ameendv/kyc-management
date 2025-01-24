const { DataTypes } = require("sequelize");
const db = require('../configs/db')

module.exports = model;

function model(sequelize) {
  const attributes = {
    token: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    expiresAt: {
        type: DataTypes.DATE,
        allowNull: false,
    },
        role_id: {
            type: DataTypes.INTEGER,
            references: {
                model: db.User,
                key: 'id',
                allowNull: false
            }
        },
    
  };


  return sequelize.define("refreshToken", attributes);
}
