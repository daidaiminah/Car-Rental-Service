export default (sequelize, DataTypes) => {
  const Customer = sequelize.define(
    "Customer",
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      phone: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    },
    {
      timestamps: true,
      tableName: 'Customers',
      freezeTableName: true,
    }
  );

  Customer.associate = (models) => {
    Customer.hasMany(models.Rental, {
      foreignKey: "customerId",
      as: "rentals",
    });
  };

  return Customer;
};
