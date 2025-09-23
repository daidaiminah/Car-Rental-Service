export default (sequelize, DataTypes) => {
  const Notification = sequelize.define(
    "Notification",
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'Users',  // This should match your User model's table name
          key: 'id'
        },
        onDelete: 'CASCADE',
      },
      title: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      message: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      type: {
        type: DataTypes.STRING,
        allowNull: false,
        comment: 'Type of notification (e.g., rental_request, rental_status_update, etc.)',
      },
      isRead: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
      data: {
        type: DataTypes.JSONB,
        allowNull: true,
        comment: 'Additional data related to the notification',
      },
    },
    {
      timestamps: true,
      tableName: 'Notifications',
      freezeTableName: true,
      indexes: [
        {
          fields: ['userId'],
        },
        {
          fields: ['isRead'],
        },
        {
          fields: ['createdAt'],
        },
      ],
    }
  );

  Notification.associate = function(models) {
    Notification.belongsTo(models.User, {
      foreignKey: 'userId',
      as: 'user',
      onDelete: 'CASCADE',
    });
  };

  return Notification;
};
