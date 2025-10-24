export default (sequelize, DataTypes) => {
    const Payment = sequelize.define(
      'Payment',
      {
        id: {
          type: DataTypes.UUID,
          defaultValue: DataTypes.UUIDV4,
          primaryKey: true,
          autoIncrement: true,
        },
        rentalId: {
          type: DataTypes.UUID,
          allowNull: false,
          references: {
            model: 'Rentals',
            key: 'id',
          },
          onDelete: 'CASCADE',
        },
        userId: {
          type: DataTypes.UUID,
          allowNull: false,
          references: {
            model: 'Users',
            key: 'id',
          },
          onDelete: 'CASCADE',
        },
        amount: {
          type: DataTypes.DECIMAL(10, 2),
          allowNull: false,
        },
        currency: {
          type: DataTypes.STRING,
          defaultValue: 'USD', // or the preferred currency
        },
        paymentMethod: {
          type: DataTypes.ENUM('card', 'mobile_money', 'paypal', 'bank_transfer', 'cash'),
          allowNull: false,
        },
        paymentStatus: {
          type: DataTypes.ENUM('pending', 'completed', 'failed', 'refunded', 'cancelled'),
          defaultValue: 'pending',
        },
        paymentDate: {
          type: DataTypes.DATE,
          defaultValue: DataTypes.NOW,
        },
        paymentReference: {
          type: DataTypes.STRING,
          allowNull: true, // for transaction IDs from external gateways
        },
        gateway: {
          type: DataTypes.STRING,
          allowNull: true, // e.g., Stripe, PayPal, etc.
        },
        notes: {
          type: DataTypes.TEXT,
          allowNull: true,
        },
      },
      {
        timestamps: true,
      tableName: 'Payments',
      freezeTableName: true,
      }
    );
  
    Payment.associate = (models) => {
      Payment.belongsTo(models.Rental, {
        foreignKey: 'rentalId',
        as: 'rental',
      });
  
      Payment.belongsTo(models.User, {
        foreignKey: 'userId',
        as: 'user',
      });
    };
  
    return Payment;
  };
  