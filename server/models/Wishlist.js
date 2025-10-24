export default (sequelize, DataTypes) => {
  const Wishlist = sequelize.define(
    'Wishlist',
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
        autoIncrement: true,
      },
      userId: {
        type: DataTypes.UUID,
        allowNull: false,
      },
      carId: {
        type: DataTypes.UUID,
        allowNull: false,
      },
      notes: {
        type: DataTypes.TEXT,
      },
    },
    {
      tableName: 'Wishlists',
      freezeTableName: true,
      timestamps: true,
    }
  );

  Wishlist.associate = (models) => {
    Wishlist.belongsTo(models.User, {
      foreignKey: 'userId',
      as: 'user',
    });

    Wishlist.belongsTo(models.Car, {
      foreignKey: 'carId',
      as: 'car',
    });
  };

  return Wishlist;
};
