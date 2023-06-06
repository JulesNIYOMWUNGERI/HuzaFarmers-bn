/* eslint-disable require-jsdoc */
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Payment extends Model {
    static associate(models) {
      // define association here
      Payment.belongsTo(models.Order, {
        foreignKey: 'orderId',
        as: 'Order',
        onDelete: 'CASCADE'
      });
    }
  }
  Payment.init(
    {
      orderId: {
        allowNull: false,
        type: DataTypes.INTEGER
      },
      userId: {
        allowNull: false,
        type: DataTypes.INTEGER
      },
      receiptUrl: {
        allowNull: false,
        type: DataTypes.STRING
      }
    },
    {
      sequelize,
      modelName: 'Payment'
    }
  );
  return Payment;
};
