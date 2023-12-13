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
    const data = require('../samples/jsons/lodgings.json')
    data.forEach(lodging => {
      lodging.createdAt = new Date()
      lodging.updatedAt = new Date()
    })

    await queryInterface.bulkInsert('Users', [
      {
        username: 'Naruto',
        email: 'uzumaki@gmail.com',
        password: createPassword(process.env.STAFF1_PASSWORD),
        phoneNumber: '+6281268329246',
        address: 'Kerajaan Programmer',
        role: 'staff',
        address: 'Kerajaan Programmer',
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ])
    
    await queryInterface.bulkInsert('Lodgings', data)
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
    await queryInterface.bulkDelete('Lodgings', null, {})
  }
};
