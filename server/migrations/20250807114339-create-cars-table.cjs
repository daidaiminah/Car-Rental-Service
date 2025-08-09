'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Cars', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      make: { type: Sequelize.STRING, allowNull: false },
      model: { type: Sequelize.STRING, allowNull: false },
      year: { type: Sequelize.INTEGER, allowNull: false },
      rentalPricePerDay: { type: Sequelize.DECIMAL(10, 2), allowNull: false },
      isAvailable: { type: Sequelize.BOOLEAN, defaultValue: true },
      type: {
        type: Sequelize.ENUM('sedan', 'suv', 'truck', 'van', 'sports', 'luxury', 'electric'),
        allowNull: false,
      },
      transmission: {
        type: Sequelize.ENUM('automatic', 'manual'),
        allowNull: false,
      },
      fuelType: {
        type: Sequelize.ENUM('gasoline', 'diesel', 'electric', 'hybrid'),
        allowNull: false,
      },
      seats: { type: Sequelize.INTEGER, allowNull: false },
      description: Sequelize.TEXT,
      imageUrl: Sequelize.STRING,
      location: Sequelize.STRING,
      features: {
        type: Sequelize.ARRAY(Sequelize.STRING),
        defaultValue: [],
      },
      ownerId: {
        type: Sequelize.INTEGER,
        references: {
          model: 'Users',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      }
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Cars');
  }
};
