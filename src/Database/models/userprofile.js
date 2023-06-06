/* eslint-disable require-jsdoc */
/* eslint-disable no-unused-vars */
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class UserProfile extends Model {
    static associate(models) {
      // define association here
    }
  }

  UserProfile.init(
    {
      gender: {
        type: DataTypes.STRING
      },
      birthdate: {
        type: DataTypes.STRING
      },
      preferredLanguage: {
        type: DataTypes.STRING
      },
      preferredCurrency: {
        type: DataTypes.STRING
      },
      homeAddress: {
        type: DataTypes.STRING
      },
      street: {
        type: DataTypes.STRING
      },
      city: {
        type: DataTypes.STRING
      },
      country: {
        type: DataTypes.STRING
      },
      poBoxNumber: {
        type: DataTypes.STRING
      },
      zipCode: {
        type: DataTypes.STRING
      },
      phoneNumber: {
        type: DataTypes.STRING
      },
      profileImage: {
        type: DataTypes.STRING
      },
      userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'Users',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      createdAt: {
        allowNull: false,
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
      },
      updatedAt: {
        allowNull: false,
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
      },
    },
    {
      sequelize,
      modelName: 'UserProfile',
    }
  );

  return UserProfile;
};
