'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class DeliveryAddress extends Model {
    static associate(models) {
      DeliveryAddress.belongsTo(models.User, { foreignKey: 'userId' });
    }
  }
  DeliveryAddress.init(
    {
      userId: DataTypes.INTEGER,
      address: DataTypes.JSONB,
    },
    {
      sequelize,
      modelName: 'DeliveryAddress',
    }
  );
  return DeliveryAddress;
};
