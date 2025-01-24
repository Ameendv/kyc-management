// const config = require("config.js");
const mysql = require("mysql2/promise");
// const {createPool} = require('mysql');

const { Sequelize } = require("sequelize");

module.exports = db = {};

initialize();

async function initialize() {
  // create db if it doesn't already exist
  // const { host, port, user, password, database } = config.database;
  const host = process.env.HOST
  const port = process.env.PORT
  const user = 'root'
  const password = process.env.PASSWORD
  const database = process.env.DATABASE
  const connection = await mysql.createConnection({
    host,
    port,
    user,
    password,
  });


  await connection.query(`CREATE DATABASE IF NOT EXISTS \`${database}\`;`)
  
  // connect to db
  const sequelize = new Sequelize(database, user, password, {
    dialect: "mysql",
    define: { freezeTableName: true },
    host,
    port,
    password,
    logging: false,
    // retry: {
    //   match: [/Deadlock/i],
    //   max: 3, // Maximum rety 3 times
    //   backoffBase: 1000, // Initial backoff duration in ms. Default: 100,
    //   backoffExponent: 1.5, // Exponent to increase backoff each try. Default: 1.1
    // },
  });

  db.User = require('../models/users.model')(sequelize)
  db.Roles = require('../models/roles.model')(sequelize)
  db.Features = require('../models/features.model')(sequelize)
  db.Kyc = require('../models/kyc.model')(sequelize)
  db.RoleFeatureAccess = require('../models/role_feature_relation.model')(sequelize)

  db.RefreshToken = require('../models/refreshToken.model')(sequelize)

  // Users and Roles
db.Roles.hasMany(db.User, { foreignKey: 'role_id' });
db.User.belongsTo(db.Roles, { foreignKey: 'role_id' });

// Roles and Features (via RoleFeatureAccess)
db.Roles.belongsToMany(db.Features, {
  through: db.RoleFeatureAccess,
  foreignKey: 'role_id',
  otherKey: 'feature_id',
});
db.Features.belongsToMany(db.Roles, {
  through: db.RoleFeatureAccess,
  foreignKey: 'feature_id',
  otherKey: 'role_id',
});

// RoleFeatureAccess relations
db.RoleFeatureAccess.belongsTo(db.Roles, { foreignKey: 'role_id' });
db.RoleFeatureAccess.belongsTo(db.Features, { foreignKey: 'feature_id' });
db.Roles.hasMany(db.RoleFeatureAccess, { foreignKey: 'role_id' });
db.Features.hasMany(db.RoleFeatureAccess, { foreignKey: 'feature_id' });

// KYC and Users
db.User.hasOne(db.Kyc, { foreignKey: 'user_id' });
db.Kyc.belongsTo(db.User, { foreignKey: 'user_id' });


  //users, kycdetails, roles, features, rolefeatureacess, 

  //users: role_id, username, password, 
  //kyc:name, mailId, id doc link
  //roles: role_name, 
  //features: featurename,
  //role feature access : role_id, feature_id, view, edit


  db.RefreshToken.belongsTo(db.User, { foreignKey: 'userId', onDelete: 'CASCADE' });
  db.User.hasMany(db.RefreshToken, { foreignKey: 'userId' });

   


    db.sequelize = sequelize

    
    // sync all models with database
    await sequelize.sync();
}