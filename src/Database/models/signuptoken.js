/* eslint-disable no-unused-vars */
/* eslint-disable require-jsdoc */
const {
  Model
} = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class signUpToken extends Model {
    static associate(models) {
      // define association here
      signUpToken.belongsTo(models.User, { foreignKey: 'userId' });
    }
  }
  signUpToken.init({
    userId: {
      type: DataTypes.NUMBER,
      allowNull: false,
      unique: true,
    },
    token: {
      type: DataTypes.STRING,
      allowNull: false,
    }
  }, {
    sequelize,
    modelName: 'signUpToken',
  });
  return signUpToken;
};
