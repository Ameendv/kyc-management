const { DataTypes } = require("sequelize");
const db = require('../config/db')

module.exports = model;

function model(sequelize) {
  const attributes = {
    token: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    expires_at: {
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

  const options = {
    timestamps: true, 
  };

  return sequelize.define("refreshToken", attributes, options);
}
