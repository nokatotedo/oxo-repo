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
    const types = [
      { name: 'Economy' },
      { name: 'Premium' },
    ]

    types.forEach(type => {
      type.createdAt = new Date()
      type.updatedAt = new Date()  
    })

    await queryInterface.bulkInsert('Types', types)
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
    await queryInterface.bulkDelete('Types', null, {})
  }
};
