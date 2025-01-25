const { DataTypes } = require("sequelize");
const db = require('../config/db')

module.exports = model;

function model(sequelize) {
  const attributes = {
    name: { type: DataTypes.STRING, allowNull: true },
    
    doc_url: { type: DataTypes.STRING, allowNull: false },
    user_id: {
            type: DataTypes.INTEGER, allowNull: false,
            references: {
                model: db.User,
                key: 'id',
                allowNull: false
            }
        },
    status:{ type: DataTypes.INTEGER, defaultValue: 0, comments: `0: pending, 1: approved, 2: rejected`}
    
  };

  const options = {
    timestamps: true, 
  };


  return sequelize.define("kyc", attributes, options);
}
