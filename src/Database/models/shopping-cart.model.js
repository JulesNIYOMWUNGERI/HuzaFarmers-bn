/* eslint-disable require-jsdoc */
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  /**
   * @class
   */
  class ShoppingCart extends Model {
    static associate(models) {
      // associations can be defined here
      ShoppingCart.belongsTo(models.Product, { foreignKey: 'productId' });
    }
  }
  ShoppingCart.init(
    {
      userId: DataTypes.INTEGER,
      productId: DataTypes.INTEGER,
      quantity: DataTypes.INTEGER,
      totalPrice: DataTypes.DECIMAL(16, 2),
      cartTotalPrice: DataTypes.DECIMAL(16, 2),
      itemCounts: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
      },
    },
    {
      sequelize,
      modelName: 'ShoppingCart',
    }
  );
  return ShoppingCart;
};
