'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // First check if the Reviews table exists
    const tableExists = await queryInterface.showAllTables().then(tables => 
      tables.includes('Reviews')
    );

    if (!tableExists) {
      console.log('Reviews table does not exist. Running initial migration...');
      return;
    }

    // Check if rentalId column already exists
    const tableDescription = await queryInterface.describeTable('Reviews');
    if (tableDescription.rentalId) {
      console.log('rentalId column already exists in Reviews table');
      return;
    }

    // Add rentalId column
    await queryInterface.addColumn('Reviews', 'rentalId', {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: {
        model: 'Rentals',
        key: 'id'
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE'
    });

    // Add unique constraint for user and rental
    await queryInterface.addConstraint('Reviews', {
      fields: ['userId', 'rentalId'],
      type: 'unique',
      name: 'unique_user_rental_review'
    });
  },

  down: async (queryInterface, Sequelize) => {
    // Remove the unique constraint first
    try {
      await queryInterface.removeConstraint('Reviews', 'unique_user_rental_review');
    } catch (error) {
      console.log('Constraint might not exist, continuing...');
    }
    
    // Then remove the column
    await queryInterface.removeColumn('Reviews', 'rentalId');
  }
};
