'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    return Promise.all([
      queryInterface.addColumn('Products', 'isExpired', {
        type: Sequelize.BOOLEAN,
        allowNull: true

      })
    ]);
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn('Products', 'isExpired');
  }
};
