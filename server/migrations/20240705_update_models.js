'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Add new columns to Users table
    await queryInterface.addColumn('Users', 'role', {
      type: Sequelize.ENUM('customer', 'owner', 'admin'),
      allowNull: false,
      defaultValue: 'customer'
    });
    
    await queryInterface.addColumn('Users', 'phone', {
      type: Sequelize.STRING,
      allowNull: true
    });
    
    await queryInterface.addColumn('Users', 'address', {
      type: Sequelize.TEXT,
      allowNull: true
    });
    
    await queryInterface.addColumn('Users', 'profileImage', {
      type: Sequelize.STRING,
      allowNull: true
    });
    
    await queryInterface.addColumn('Users', 'isVerified', {
      type: Sequelize.BOOLEAN,
      allowNull: false,
      defaultValue: false
    });
    
    // Remove old isAdmin column if it exists
    try {
      await queryInterface.removeColumn('Users', 'isAdmin');
    } catch (error) {
      console.log('isAdmin column does not exist or could not be removed');
    }
    
    // Add new columns to Cars table
    await queryInterface.addColumn('Cars', 'type', {
      type: Sequelize.ENUM('sedan', 'suv', 'truck', 'van', 'sports', 'luxury', 'electric'),
      allowNull: false,
      defaultValue: 'sedan'
    });
    
    await queryInterface.addColumn('Cars', 'transmission', {
      type: Sequelize.ENUM('automatic', 'manual'),
      allowNull: false,
      defaultValue: 'automatic'
    });
    
    await queryInterface.addColumn('Cars', 'fuelType', {
      type: Sequelize.ENUM('gasoline', 'diesel', 'electric', 'hybrid'),
      allowNull: false,
      defaultValue: 'gasoline'
    });
    
    await queryInterface.addColumn('Cars', 'seats', {
      type: Sequelize.INTEGER,
      allowNull: false,
      defaultValue: 4
    });
    
    await queryInterface.addColumn('Cars', 'description', {
      type: Sequelize.TEXT,
      allowNull: true
    });
    
    await queryInterface.addColumn('Cars', 'imageUrl', {
      type: Sequelize.STRING,
      allowNull: true
    });
    
    await queryInterface.addColumn('Cars', 'location', {
      type: Sequelize.STRING,
      allowNull: true
    });
    
    // Add new columns to Rentals table
    await queryInterface.addColumn('Rentals', 'paymentMethod', {
      type: Sequelize.STRING,
      allowNull: true
    });
    
    await queryInterface.addColumn('Rentals', 'paymentDate', {
      type: Sequelize.DATE,
      allowNull: true
    });
    
    await queryInterface.addColumn('Rentals', 'paymentId', {
      type: Sequelize.STRING,
      allowNull: true
    });
    
    await queryInterface.addColumn('Rentals', 'totalDays', {
      type: Sequelize.INTEGER,
      allowNull: false,
      defaultValue: 1
    });
    
    await queryInterface.addColumn('Rentals', 'dailyRate', {
      type: Sequelize.DECIMAL(10, 2),
      allowNull: false,
      defaultValue: 0
    });
    
    await queryInterface.addColumn('Rentals', 'taxAmount', {
      type: Sequelize.DECIMAL(10, 2),
      allowNull: false,
      defaultValue: 0
    });
    
    await queryInterface.addColumn('Rentals', 'insuranceFee', {
      type: Sequelize.DECIMAL(10, 2),
      allowNull: false,
      defaultValue: 0
    });
    
    await queryInterface.addColumn('Rentals', 'additionalFees', {
      type: Sequelize.DECIMAL(10, 2),
      allowNull: false,
      defaultValue: 0
    });
    
    await queryInterface.addColumn('Rentals', 'notes', {
      type: Sequelize.TEXT,
      allowNull: true
    });
    
    // Update ENUM values for paymentStatus
    await queryInterface.sequelize.query(
      "ALTER TYPE \"enum_Rentals_paymentStatus\" ADD VALUE IF NOT EXISTS 'partially_refunded'"
    );
  },

  down: async (queryInterface, Sequelize) => {
    // Remove all added columns
    await queryInterface.removeColumn('Users', 'role');
    await queryInterface.removeColumn('Users', 'phone');
    await queryInterface.removeColumn('Users', 'address');
    await queryInterface.removeColumn('Users', 'profileImage');
    await queryInterface.removeColumn('Users', 'isVerified');
    
    await queryInterface.removeColumn('Cars', 'type');
    await queryInterface.removeColumn('Cars', 'transmission');
    await queryInterface.removeColumn('Cars', 'fuelType');
    await queryInterface.removeColumn('Cars', 'seats');
    await queryInterface.removeColumn('Cars', 'description');
    await queryInterface.removeColumn('Cars', 'imageUrl');
    await queryInterface.removeColumn('Cars', 'location');
    
    await queryInterface.removeColumn('Rentals', 'paymentMethod');
    await queryInterface.removeColumn('Rentals', 'paymentDate');
    await queryInterface.removeColumn('Rentals', 'paymentId');
    await queryInterface.removeColumn('Rentals', 'totalDays');
    await queryInterface.removeColumn('Rentals', 'dailyRate');
    await queryInterface.removeColumn('Rentals', 'taxAmount');
    await queryInterface.removeColumn('Rentals', 'insuranceFee');
    await queryInterface.removeColumn('Rentals', 'additionalFees');
    await queryInterface.removeColumn('Rentals', 'notes');
    
    // Note: ENUM values cannot be removed in a simple way in PostgreSQL
  }
};
