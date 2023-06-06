/* eslint-disable no-unused-vars */
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('signUpTokens', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      userId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        unique: true,
      },
      token: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
        expires: 3600
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
        expires: 3600
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('signUpTokens');
  }
};
