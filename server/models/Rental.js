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
      customerId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'Customers',
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
    },
    {
      timestamps: true,
    }
  );

  Rental.associate = (models) => {
    Rental.belongsTo(models.Car, {
      foreignKey: "carId",
      as: "car",
      onDelete: "CASCADE",
    });
    Rental.belongsTo(models.Customer, {
      foreignKey: "customerId",
      as: "customer",
      onDelete: "CASCADE",
    });
  };

  return Rental;
};
