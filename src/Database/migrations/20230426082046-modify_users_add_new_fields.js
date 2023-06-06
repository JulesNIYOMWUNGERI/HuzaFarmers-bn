'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    return Promise.all([
      queryInterface.addColumn('Users', 'isExpired', {
        type: Sequelize.BOOLEAN,
        allowNull: true,
      }),
      queryInterface.addColumn('Users', 'lastTimePasswordUpdate', {
        type: Sequelize.DATE,
        allowNull: true,
      }),
    ]);
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn('Users', 'isExpired');
    await queryInterface.removeColumn('Users', 'lastTimePasswordUpdated');
  },
};
