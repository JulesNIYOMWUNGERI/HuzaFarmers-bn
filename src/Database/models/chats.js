/* eslint-disable require-jsdoc */
/* eslint-disable no-unused-vars */
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Chats extends Model {
    static associate(models) {
      // define association here
    }
  }
  Chats.init(
    {
      message: DataTypes.STRING,
      sender: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: 'Chats',
    }
  );
  return Chats;
};
