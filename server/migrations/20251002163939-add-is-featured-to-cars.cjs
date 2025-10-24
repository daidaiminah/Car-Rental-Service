'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('Cars', 'isFeatured', {
      type: Sequelize.BOOLEAN,
      allowNull: false,
      defaultValue: false
    });
    
    // Optional: Update some cars to be featured
    await queryInterface.sequelize.query(
      `UPDATE "Cars" SET "isFeatured" = true WHERE id IN (
        SELECT id FROM "Cars" ORDER BY RANDOM() LIMIT 5
      )`
    );
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn('Cars', 'isFeatured');
  }
};
