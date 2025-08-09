export default (sequelize, DataTypes) => {
  const Rental = sequelize.define(
    "Rental",
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      carId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'Cars',
          key: 'id'
        }
      },
      userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'Users',
          key: 'id'
        }
      },
      startDate: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      endDate: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      totalCost: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
      },
      status: {
        type: DataTypes.ENUM('pending', 'confirmed', 'in_progress', 'completed', 'cancelled'),
        defaultValue: 'pending',
        allowNull: false,
      },
      paymentStatus: {
        type: DataTypes.ENUM('pending', 'paid', 'partially_refunded', 'refunded', 'failed'),
        defaultValue: 'pending',
        allowNull: false,
      },
      paymentMethod: {
        type: DataTypes.STRING,
      },
      paymentDate: {
        type: DataTypes.DATE,
      },
      paymentId: {
        type: DataTypes.STRING,
      },
      totalDays: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      dailyRate: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
      },
      taxAmount: {
        type: DataTypes.DECIMAL(10, 2),
        defaultValue: 0,
      },
      insuranceFee: {
        type: DataTypes.DECIMAL(10, 2),
        defaultValue: 0,
      },
      additionalFees: {
        type: DataTypes.DECIMAL(10, 2),
        defaultValue: 0,
      },
      notes: {
        type: DataTypes.TEXT,
      },
    },
    {
      timestamps: true,
      tableName: 'Rentals',
      freezeTableName: true,
    }
  );

  Rental.associate = (models) => {
    // Association with Car
    Rental.belongsTo(models.Car, {
      foreignKey: "carId",
      as: "car",
      onDelete: "CASCADE",
    });
    
    // Association with User
    Rental.belongsTo(models.User, {
      foreignKey: "userId",
      as: "user",
      onDelete: "CASCADE"
    });
  };

  return Rental;
};
