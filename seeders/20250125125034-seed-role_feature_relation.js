'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    /**
     * Add seed commands here.
     *
     * Example:
     * await queryInterface.bulkInsert('People', [{
     *   name: 'John Doe',
     *   isBetaMember: false
     * }], {});
    */
    await queryInterface.bulkInsert('role_feature_relation', [
      { role_id: 1, feature_id: 1,view: 0,edit: 0, createdAt: new Date(), updatedAt: new Date() },
      { role_id: 1, feature_id: 2,view: 0,edit: 0, createdAt: new Date(), updatedAt: new Date() },
      { role_id: 1, feature_id: 3,view: 0,edit: 0, createdAt: new Date(), updatedAt: new Date() },
      { role_id: 2, feature_id: 1,view: 1,edit: 1, createdAt: new Date(), updatedAt: new Date() },
      { role_id: 2, feature_id: 2,view: 1,edit: 1, createdAt: new Date(), updatedAt: new Date() },
      { role_id: 2, feature_id: 3,view: 1,edit: 1, createdAt: new Date(), updatedAt: new Date() },
      
    ]);
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
    await queryInterface.bulkDelete('role_feature_relation', null, {});
  }
};
