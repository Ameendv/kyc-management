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
    await queryInterface.bulkInsert('users', [
      // { id: 1, name: 'Ameen', email: 'ameen@gmail.com', role_id: 1,password: '$2b$10$LxNaT9oJw17xqco8eBLK0eeVn0XQDLTOo3yTywIpOwJWz/Juw9VAG', createdAt: new Date(), updatedAt: new Date() },
      { id: 2, username: 'Admin', email: 'admin@gmail.com', role_id: 2,password: '$2b$10$Be5kG2Dv.2eV3.5ckIzMS.q0xH.HbjV7zh6JSKwSqO2BvMF5byz96' ,createdAt: new Date(), updatedAt: new Date() },
    ]);
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
    await queryInterface.bulkDelete('users', null, {});
  }
};
