'use strict';
if(process.env.NODE_ENV !== "production") {
  require('dotenv').config()
}

const { createPassword } = require('../helpers/bcrypt');

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
    await queryInterface.bulkInsert('Users', [
      {
        username: 'AdminGanteng',
        email: 'gwanteng@gmail.com',
        password: createPassword(process.env.ADMIN_PASSWORD),
        role: 'admin',
        phoneNumber: '+6283184628660',
        address: 'Kerajaan Programmer',
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ])
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
    await queryInterface.bulkDelete('Users', null, {})
  }
};
