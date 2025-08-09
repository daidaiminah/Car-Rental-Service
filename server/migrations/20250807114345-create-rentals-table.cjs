'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Rentals', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      carId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'Cars',
          key: 'id',
        },
        onDelete: 'CASCADE',
      },
      userId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'Users',
          key: 'id',
        },
        onDelete: 'CASCADE',
      },
      customerId: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: 'Customers',
          key: 'id',
        },
        onDelete: 'SET NULL',
      },
      startDate: { type: Sequelize.DATE, allowNull: false },
      endDate: { type: Sequelize.DATE, allowNull: false },
      totalCost: { type: Sequelize.DECIMAL(10, 2), allowNull: false },
      status: {
        type: Sequelize.ENUM('pending', 'confirmed', 'in_progress', 'completed', 'cancelled'),
        defaultValue: 'pending',
        allowNull: false,
      },
      paymentStatus: {
        type: Sequelize.ENUM('pending', 'paid', 'partially_refunded', 'refunded', 'failed'),
        defaultValue: 'pending',
        allowNull: false,
      },
      paymentMethod: Sequelize.STRING,
      paymentDate: Sequelize.DATE,
      paymentId: Sequelize.STRING,
      totalDays: { type: Sequelize.INTEGER, allowNull: false },
      dailyRate: { type: Sequelize.DECIMAL(10, 2), allowNull: false },
      taxAmount: { type: Sequelize.DECIMAL(10, 2), defaultValue: 0 },
      insuranceFee: { type: Sequelize.DECIMAL(10, 2), defaultValue: 0 },
      additionalFees: { type: Sequelize.DECIMAL(10, 2), defaultValue: 0 },
      notes: Sequelize.TEXT,
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
    await queryInterface.dropTable('Rentals');
  }
};
