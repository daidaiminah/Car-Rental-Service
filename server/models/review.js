import { Model } from 'sequelize';

export default (sequelize, DataTypes) => {
  class Review extends Model {
    static associate(models) {
      // Define associations
      Review.belongsTo(models.User, {
        foreignKey: 'userId',
        as: 'user'
      });
      
      Review.belongsTo(models.Car, {
        foreignKey: 'carId',
        as: 'car'
      });
      
      Review.belongsTo(models.Rental, {
        foreignKey: 'rentalId',
        as: 'rental'
      });
    }
  }
  
  Review.init({
    rating: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        min: 1,
        max: 5,
        isInt: true
      }
    },
    comment: {
      type: DataTypes.TEXT,
      allowNull: true,
      validate: {
        len: [0, 1000]
      }
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Users',
        key: 'id'
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE'
    },
    carId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Cars',
        key: 'id'
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE'
    },
    rentalId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Rentals',
        key: 'id'
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE'
    }
  }, {
    sequelize,
    modelName: 'Review',
    indexes: [
      {
        unique: true,
        fields: ['userId', 'rentalId']
      }
    ]
  });
  
  return Review;
};