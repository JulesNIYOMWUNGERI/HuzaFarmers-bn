import dotenv from 'dotenv';
import asyncWrapper from '../utils/handlingTryCatchBlocks';
import db from '../Database/models';

// CONFIGURE DOTENV
dotenv.config();

const { Order, Product, Payment } = db;

const validatePayment = asyncWrapper(async (req, res, next) => {
  const { id: orderId } = req.params;
  const { user } = req;

  // CHECK IF ORDER EXISTS
  const findOrder = await Order.findOne({ where: { id: orderId } });
  if (!findOrder) {
    return res.status(404).json({
      message: 'Order not found',
    });
  }

  // CHECK IF USER OWNS ORDER
  if (findOrder.dataValues.userId !== user.dataValues.id) {
    return res.status(403).json({
      message:
        'You are not authorized to make this payment. This order does not belong to you',
    });
  }

  // CHECK IF USER HAS PAID FOR ORDER BEFORE
  const isOrderPaid = await Payment.findOne({ where: { orderId } });
  if (isOrderPaid) {
    return res.status(409).json({
      message: 'You have already paid for this order',
    });
  }

  // CHECK IF PRODUCT EXISTS

  const orderProductsData = findOrder.products.map(async (product) => {
    const data = await Product.findOne({
      where: {
        id: product.productId,
      },
    });
    return data.dataValues;
  });

  const orderProductsDataArray = await Promise.all(orderProductsData);

  if (!orderProductsDataArray) {
    return res.status(404).json({
      message: 'Products data not found in dataBase',
    });
  }

  // PASS THE VALUES TO THE CONTROLLER
  res.datas = {
    user,
    findOrder,
    isOrderPaid,
    orderProductsDataArray,
  };

  next();
});

export default validatePayment;
