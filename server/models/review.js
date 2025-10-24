import { Model } from 'sequelize';

export default (sequelize, DataTypes) => {
  class Review extends Model {
    static associate(models) {
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
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4, // Sequelize auto-generates UUID
      primaryKey: true,
    },
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
      type: DataTypes.UUID,
      allowNull: false
    },
    carId: {
      type: DataTypes.UUID,
      allowNull: false
    },
    rentalId: {
      type: DataTypes.UUID,
      allowNull: false
    }
  }, {
    sequelize,
    modelName: 'Review',
    tableName: 'Reviews',
    indexes: [
      {
        unique: true,
        fields: ['userId', 'rentalId'] // one review per rental per user
      }
    ]
  });

  return Review;
};
