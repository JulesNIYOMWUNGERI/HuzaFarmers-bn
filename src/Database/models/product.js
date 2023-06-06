/* eslint-disable linebreak-style */
/* eslint-disable require-jsdoc */
/* eslint-disable no-unused-vars */
/* eslint-disable linebreak-style */
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  /**
   * @class
   */
  class Product extends Model {
    static associate(models) {
      // Define associations here, if any
      this.belongsTo(models.User, {
        foreignKey: 'userId',
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE'
      });
    }

    static async beforeDestroy(options) {
      await this.sequelize
        .getQueryInterface()
        .removeConstraint('Products', 'Products_userId_fkey');
    }
  }

  Product.init(
    {
      name: DataTypes.STRING,
      image: DataTypes.ARRAY(DataTypes.STRING),
      price: DataTypes.DECIMAL(10, 2),
      quantity: DataTypes.INTEGER,
      category: DataTypes.STRING,
      userId: DataTypes.INTEGER,
      status: DataTypes.STRING,
      averageRating: DataTypes.DECIMAL(2, 1),
      exDate: DataTypes.DATE,
      isExpired: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
      }
    },
    {
      sequelize,
      modelName: 'Product'
    }
  );
  Product.addHook('beforeUpdate', (product) => {
    if (product.changed('exDate')) {
      product.isExpired = product.exDate < new Date();
    }
  });
  return Product;
};
