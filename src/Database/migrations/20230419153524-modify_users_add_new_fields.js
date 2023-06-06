/* eslint-disable no-unused-vars */
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('Users', 'gender', {
      type: Sequelize.STRING,
      allowNull: true,
    });
    await queryInterface.addColumn('Users', 'birthdate', {
      type: Sequelize.DATEONLY,
      allowNull: true,
    });
    await queryInterface.addColumn('Users', 'preferredLanguage', {
      type: Sequelize.STRING,
      allowNull: true,
    });
    await queryInterface.addColumn('Users', 'preferredCurrency', {
      type: Sequelize.STRING,
      allowNull: true,
    });
    await queryInterface.addColumn('Users', 'homeAddress', {
      type: Sequelize.STRING,
      allowNull: true,
    });
    await queryInterface.addColumn('Users', 'billingAddress', {
      type: Sequelize.JSON,
      allowNull: true,
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('Users', 'gender');
    await queryInterface.removeColumn('Users', 'birthdate');
    await queryInterface.removeColumn('Users', 'preferredLanguage');
    await queryInterface.removeColumn('Users', 'preferredCurrency');
    await queryInterface.removeColumn('Users', 'homeAddress');
    await queryInterface.removeColumn('Users', 'billingAddress');
  },
};
