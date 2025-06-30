export default (sequelize, DataTypes) => {
  const Car = sequelize.define(
    "Car",
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      make: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      model: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      year: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      rentalPricePerDay: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
      },
      isAvailable: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
      },
    },
    {
      timestamps: true,
    }
  );

  Car.associate = (models) => {
    Car.hasMany(models.Rental, {
      foreignKey: "carId",
      as: "rentals",
    });
  };

  return Car;
};
