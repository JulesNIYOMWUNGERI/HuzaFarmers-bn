/* eslint-disable require-jsdoc */
/* eslint-disable no-unused-vars */
const {
  Model
} = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  /**
     * @class
     */
  class ProductStatus extends Model {
    static associate(models) {}
  }
  ProductStatus.init({
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    productId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Product',
        key: 'id',
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      }
    },
    status: {
      type: DataTypes.ENUM('created', 'updated', 'removed', 'expired', 'purchased'),
      allowNull: false,
    },
  }, {
    sequelize,
    modelName: 'ProductStatus',
  });

  return ProductStatus;
};
