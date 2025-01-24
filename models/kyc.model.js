const { DataTypes } = require("sequelize");
const db = require('../configs/db')

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
    
  };


  return sequelize.define("kyc", attributes);
}
