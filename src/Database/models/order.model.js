/* eslint-disable require-jsdoc */
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Order extends Model {
    static associate(models) {
      Order.belongsTo(models.User, { foreignKey: 'userId' });
    }
  }
  Order.init(
    {
      userId: DataTypes.INTEGER,
      products: DataTypes.ARRAY(DataTypes.JSONB),
      deliveryAddress: DataTypes.JSONB,
      paymentMethod: DataTypes.STRING,
      status: DataTypes.STRING,
      totalPrice: DataTypes.FLOAT,
    },
    {
      sequelize,
      modelName: 'Order',
    }
  );
  return Order;
};
