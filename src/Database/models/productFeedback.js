/* eslint-disable valid-jsdoc */
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  /**
   * @lass
   */
  class ProductFeedback extends Model {
    /**
     * @params {models}.
     * @returns {models}
     */
    static associate(models) {
      // define association here
      ProductFeedback.belongsTo(models.Product, {
        foreignKey: 'productId',
        as: 'Product',
        onDelete: 'CASCADE',
      });
    }
  }
  ProductFeedback.init(
    {
      rating: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      review: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      productId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: 'ProductFeedback',
    }
  );
  return ProductFeedback;
};
