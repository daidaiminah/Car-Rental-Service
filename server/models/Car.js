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
      type: {
        type: DataTypes.ENUM('sedan', 'suv', 'truck', 'van', 'sports', 'luxury', 'electric'),
        allowNull: false,
      },
      transmission: {
        type: DataTypes.ENUM('automatic', 'manual'),
        allowNull: false,
      },
      fuelType: {
        type: DataTypes.ENUM('gasoline', 'diesel', 'electric', 'hybrid'),
        allowNull: false,
      },
      seats: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      description: {
        type: DataTypes.TEXT,
      },
      imageUrl: {
        type: DataTypes.STRING,
      },
      location: {
        type: DataTypes.STRING,
      },
      features: {
        type: DataTypes.ARRAY(DataTypes.STRING),
        defaultValue: [],
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
