'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const generateRandomName = () => {
      const length = Math.floor(Math.random() * 4) + 1; // Panjang nama acak antara 1-4
      let name = '';
      for (let i = 0; i < length; i++) {
        const randomChar = String.fromCharCode(97 + Math.floor(Math.random() * 26)); // Karakter a-z
        name += randomChar;
      }
      return name.charAt(0).toUpperCase() + name.slice(1); // Huruf pertama kapital
    };

    const generatePhoneNumber = () => {
      return '08' + Math.floor(1000000000 + Math.random() * 9000000000).toString(); // Nomor acak 10 digit
    };

    const seedData = [];
    const alphabet = 'abcdefghijklmnopqrstuvwxyz';

    alphabet.split('').forEach((letter) => {
      let count = 0;
      while (count < 50) {
        const name = generateRandomName();
        if (name.toLowerCase().startsWith(letter)) {
          seedData.push({
            name,
            phone: generatePhoneNumber(),
            avatar: null,
            createdAt: new Date(),
            updatedAt: new Date(),
          });
          count++;
        }
      }
    });

    await queryInterface.bulkInsert('Phonebooks', seedData, {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Phonebooks', null, {});
  },
};
