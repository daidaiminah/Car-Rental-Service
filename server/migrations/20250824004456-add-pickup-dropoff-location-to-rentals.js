'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('Rentals', 'pickupLocation', {
      type: Sequelize.STRING,
      allowNull: true
    });
    
    await queryInterface.addColumn('Rentals', 'dropoffLocation', {
      type: Sequelize.STRING,
      allowNull: true
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn('Rentals', 'pickupLocation');
    await queryInterface.removeColumn('Rentals', 'dropoffLocation');
  }
};
