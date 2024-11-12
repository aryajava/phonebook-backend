'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert('Phonebooks', [
      {
        name: 'John Doe',
        phone: '081234567890',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Mr. X',
        phone: '081234567891',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Mrs. Y',
        phone: '081234567892',
        createdAt: new Date(),
        updatedAt: new Date()
      }], {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Phonebooks', null, {});
  }
};
