'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Payments', {
      id: { type: Sequelize.UUID,
        defaultValue: Sequelize.literal('gen_random_uuid()'), primaryKey: true, allowNull: false,
      },
      rentalId: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'Rentals',
          key: 'id',
        },
        onDelete: 'CASCADE',
      },
      userId: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'Users',
          key: 'id',
        },
        onDelete: 'CASCADE',
      },
      amount: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false,
      },
      currency: {
        type: Sequelize.STRING,
        defaultValue: 'USD',
      },
      paymentMethod: {
        type: Sequelize.ENUM('card', 'mobile_money', 'paypal', 'bank_transfer', 'cash'),
        allowNull: false,
      },
      paymentStatus: {
        type: Sequelize.ENUM('pending', 'completed', 'failed', 'refunded', 'cancelled'),
        defaultValue: 'pending',
        allowNull: false,
      },
      paymentDate: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      },
      paymentReference: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      gateway: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      notes: {
        type: Sequelize.TEXT,
        allowNull: true,
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
      },
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Payments');
  }
};
