
export default {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('Users', 'profilePicturePublicId', {
      type: Sequelize.STRING,
      allowNull: true
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('Users', 'profilePicturePublicId');
  }
};