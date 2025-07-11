'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const { DataTypes } = Sequelize;
    const transaction = await queryInterface.sequelize.transaction();
    
    try {
      // Enable UUID extension if not already enabled
      await queryInterface.sequelize.query('CREATE EXTENSION IF NOT EXISTS "uuid-ossp"', { transaction });

      // ===== USERS TABLE =====
      // Change primary key to UUID
      await queryInterface.sequelize.query(
        'ALTER TABLE "Users" ALTER COLUMN "id" DROP DEFAULT, ALTER COLUMN "id" SET DATA TYPE UUID USING (uuid_generate_v4())',
        { transaction }
      );

      // Add missing columns to Users
      await queryInterface.addColumn(
        'Users',
        'lastLogin',
        { type: DataTypes.DATE, allowNull: true },
        { transaction }
      );
      
      await queryInterface.addColumn(
        'Users',
        'resetPasswordToken',
        { type: DataTypes.STRING, allowNull: true },
        { transaction }
      );
      
      await queryInterface.addColumn(
        'Users',
        'resetPasswordExpires',
        { type: DataTypes.DATE, allowNull: true },
        { transaction }
      );

      // ===== CARS TABLE =====
      // Change primary key to UUID
      await queryInterface.sequelize.query(
        'ALTER TABLE "Cars" ALTER COLUMN "id" DROP DEFAULT, ALTER COLUMN "id" SET DATA TYPE UUID USING (uuid_generate_v4())',
        { transaction }
      );
      
      // Change ownerId to UUID and add foreign key
      await queryInterface.sequelize.query(
        'ALTER TABLE "Cars" ALTER COLUMN "ownerId" SET DATA TYPE UUID USING (gen_random_uuid())',
        { transaction }
      );
      
      // Add missing columns to Cars
      const carColumns = [
        { name: 'licensePlate', type: 'STRING', allowNull: true, unique: true },
        { name: 'vin', type: 'STRING', allowNull: true, unique: true },
        { name: 'color', type: 'STRING', allowNull: true },
        { name: 'mileage', type: 'INTEGER', allowNull: false, defaultValue: 0 },
        { name: 'features', type: 'TEXT[]', allowNull: true, defaultValue: '{}' },
        { name: 'location', type: 'STRING', allowNull: true },
        { name: 'isActive', type: 'BOOLEAN', allowNull: false, defaultValue: true }
      ];
      
      for (const col of carColumns) {
        await queryInterface.addColumn(
          'Cars',
          col.name,
          { 
            type: DataTypes[col.type], 
            allowNull: col.allowNull,
            unique: col.unique,
            defaultValue: col.defaultValue
          },
          { transaction }
        );
      }

      // ===== RENTALS TABLE =====
      // Change primary key to UUID
      await queryInterface.sequelize.query(
        'ALTER TABLE "Rentals" ALTER COLUMN "id" DROP DEFAULT, ALTER COLUMN "id" SET DATA TYPE UUID USING (uuid_generate_v4())',
        { transaction }
      );
      
      // Change foreign keys to UUID
      await queryInterface.sequelize.query(
        'ALTER TABLE "Rentals" ALTER COLUMN "carId" SET DATA TYPE UUID USING (gen_random_uuid())',
        { transaction }
      );
      
      await queryInterface.sequelize.query(
        'ALTER TABLE "Rentals" ALTER COLUMN "userId" SET DATA TYPE UUID USING (gen_random_uuid())',
        { transaction }
      );
      
      // Add missing columns to Rentals
      const rentalColumns = [
        { name: 'totalDays', type: 'INTEGER', allowNull: false },
        { name: 'dailyRate', type: 'DECIMAL', allowNull: false },
        { name: 'taxAmount', type: 'DECIMAL', allowNull: false, defaultValue: 0 },
        { name: 'insuranceFee', type: 'DECIMAL', allowNull: false, defaultValue: 0 },
        { name: 'additionalFees', type: 'DECIMAL', allowNull: false, defaultValue: 0 },
        { name: 'cancellationReason', type: 'TEXT', allowNull: true },
        { name: 'cancellationDate', type: 'DATE', allowNull: true },
        { name: 'pickupLocation', type: 'STRING', allowNull: true },
        { name: 'dropoffLocation', type: 'STRING', allowNull: true },
      ];
      
      for (const col of rentalColumns) {
        await queryInterface.addColumn(
          'Rentals',
          col.name,
          { 
            type: DataTypes[col.type], 
            allowNull: col.allowNull,
            defaultValue: col.defaultValue
          },
          { transaction }
        );
      }

      // Add indexes for better query performance
      await queryInterface.addIndex('Users', ['email'], { unique: true, transaction });
      await queryInterface.addIndex('Cars', ['licensePlate'], { unique: true, transaction });
      await queryInterface.addIndex('Cars', ['vin'], { unique: true, transaction });
      await queryInterface.addIndex('Rentals', ['userId'], { transaction });
      await queryInterface.addIndex('Rentals', ['carId'], { transaction });
      await queryInterface.addIndex('Rentals', ['status'], { transaction });
      await queryInterface.addIndex('Rentals', ['paymentStatus'], { transaction });

      await transaction.commit();
      console.log('✅ Database schema updated successfully');
    } catch (error) {
      await transaction.rollback();
      console.error('❌ Error updating database schema:', error);
      throw error;
    }
  },

  async down(queryInterface, Sequelize) {
    const transaction = await queryInterface.sequelize.transaction();
    
    try {
      // Remove indexes
      await queryInterface.removeIndex('Users', ['email'], { transaction });
      await queryInterface.removeIndex('Cars', ['licensePlate'], { transaction });
      await queryInterface.removeIndex('Cars', ['vin'], { transaction });
      await queryInterface.removeIndex('Rentals', ['userId'], { transaction });
      await queryInterface.removeIndex('Rentals', ['carId'], { transaction });
      await queryInterface.removeIndex('Rentals', ['status'], { transaction });
      await queryInterface.removeIndex('Rentals', ['paymentStatus'], { transaction });

      // Remove added columns from Rentals
      const rentalColumns = [
        'totalDays', 'dailyRate', 'taxAmount', 'insuranceFee', 'additionalFees',
        'cancellationReason', 'cancellationDate', 'pickupLocation', 'dropoffLocation'
      ];
      
      for (const col of rentalColumns) {
        await queryInterface.removeColumn('Rentals', col, { transaction });
      }

      // Remove added columns from Cars
      const carColumns = [
        'licensePlate', 'vin', 'color', 'mileage', 'features', 'location', 'isActive'
      ];
      
      for (const col of carColumns) {
        await queryInterface.removeColumn('Cars', col, { transaction });
      }

      // Remove added columns from Users
      const userColumns = [
        'lastLogin', 'resetPasswordToken', 'resetPasswordExpires'
      ];
      
      for (const col of userColumns) {
        await queryInterface.removeColumn('Users', col, { transaction });
      }

      // Note: Reverting UUID changes is complex and may require data migration
      // In a real scenario, you would need to back up data, drop and recreate tables
      console.log('⚠️ Note: Manual intervention required to revert UUID changes');

      await transaction.commit();
    } catch (error) {
      await transaction.rollback();
      console.error('❌ Error reverting database schema:', error);
      throw error;
    }
  }
};
