export default (sequelize, DataTypes) => {
    const User = sequelize.define(
      "User",
      {
        id: {
          type: DataTypes.INTEGER,
          primaryKey: true,
          autoIncrement: true,
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
        password: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        role: {
          type: DataTypes.ENUM('customer', 'owner', 'admin'),
          allowNull: false,
          defaultValue: 'customer',
        },
        phone: {
          type: DataTypes.STRING,
        },
        address: {
          type: DataTypes.TEXT,
        },
        profileImage: {
          type: DataTypes.STRING,
        },
        isVerified: {
          type: DataTypes.BOOLEAN,
          defaultValue: false,
        },
      },
      {
        timestamps: true,
        tableName: 'Users',
        freezeTableName: true
      }
    );
  
    User.associate = (models) => {
    User.hasMany(models.Car, {
      foreignKey: 'ownerId',
      as: 'cars'
    });
    
    User.hasMany(models.Rental, {
      foreignKey: 'userId',
      as: 'rentals'
    });
    
    User.hasMany(models.Review, {
      foreignKey: 'userId',
      as: 'reviews'
    });
  };

  return User;
};