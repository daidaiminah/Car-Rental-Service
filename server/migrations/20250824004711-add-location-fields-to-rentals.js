'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // First check if the columns already exist to avoid errors
    const tableDescription = await queryInterface.describeTable('Rentals');
    
    if (!tableDescription.pickupLocation) {
      await queryInterface.addColumn('Rentals', 'pickupLocation', {
        type: Sequelize.STRING,
        allowNull: true
      });
    }
    
    if (!tableDescription.dropoffLocation) {
      await queryInterface.addColumn('Rentals', 'dropoffLocation', {
        type: Sequelize.STRING,
        allowNull: true
      });
    }
  },

  async down(queryInterface, Sequelize) {
    // Remove the columns if they exist
    const tableDescription = await queryInterface.describeTable('Rentals');
    
    if (tableDescription.pickupLocation) {
      await queryInterface.removeColumn('Rentals', 'pickupLocation');
    }
    
    if (tableDescription.dropoffLocation) {
      await queryInterface.removeColumn('Rentals', 'dropoffLocation');
    }
  }
};
