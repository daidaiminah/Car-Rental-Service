'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Remove the old customerId column if it exists
    await queryInterface.removeConstraint('Rentals', 'Rentals_customerId_fkey');
    await queryInterface.removeColumn('Rentals', 'customerId');

    // Add the new userId column
    await queryInterface.addColumn('Rentals', 'userId', {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: {
        model: 'Users',
        key: 'id',
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE',
    });

    // Add status and paymentStatus columns
    await queryInterface.addColumn('Rentals', 'status', {
      type: Sequelize.ENUM('pending', 'confirmed', 'in_progress', 'completed', 'cancelled'),
      allowNull: false,
      defaultValue: 'pending',
    });

    await queryInterface.addColumn('Rentals', 'paymentStatus', {
      type: Sequelize.ENUM('pending', 'paid', 'refunded', 'failed'),
      allowNull: false,
      defaultValue: 'pending',
    });
  },

  down: async (queryInterface, Sequelize) => {
    // Revert the changes if needed
    await queryInterface.removeColumn('Rentals', 'userId');
    await queryInterface.removeColumn('Rentals', 'status');
    await queryInterface.removeColumn('Rentals', 'paymentStatus');
    
    // Add back the customerId column if needed
    await queryInterface.addColumn('Rentals', 'customerId', {
      type: Sequelize.INTEGER,
      references: {
        model: 'Customers',
        key: 'id',
      },
    });
  },
};
