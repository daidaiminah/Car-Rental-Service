export default (sequelize, DataTypes) => {
  const Car = sequelize.define(
    "Car",
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4, // Sequelize will auto-generate
        primaryKey: true,
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
      ownerId: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
          model: 'Users',
          key: 'id'
        },
        onDelete: 'CASCADE'
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
      tableName: 'Cars',
      freezeTableName: true,
    }
  );

  Car.associate = function(models) {
    Car.belongsTo(models.User, {
      foreignKey: 'ownerId',
      as: 'owner'
    });
    
    Car.hasMany(models.Rental, {
      foreignKey: 'carId',
      as: 'rentals'
    });
    
    Car.hasMany(models.Review, {
      foreignKey: 'carId',
      as: 'reviews'
    });
  };

  return Car;
};
