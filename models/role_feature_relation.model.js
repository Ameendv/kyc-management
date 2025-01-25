const { DataTypes } = require("sequelize");
const db = require('../config/db')

module.exports = model;

function model(sequelize) {
  const attributes = {
    role_id: {
        type: DataTypes.INTEGER, allowNull: false,
        references: {
            model: db.Roles,
            key: 'id',
            allowNull: false
        }
    },
    feature_id: {
        type: DataTypes.INTEGER, allowNull: false,
        references: {
            model: db.Features,
            key: 'id',
            allowNull: false
        }
    },
    view: { type: DataTypes.BOOLEAN, allowNull: false },
    edit: { type: DataTypes.BOOLEAN, allowNull: false },
    
  };

  const options = {
    timestamps: true, 
  };


  return sequelize.define("role_feature_relation", attributes, options);
}
