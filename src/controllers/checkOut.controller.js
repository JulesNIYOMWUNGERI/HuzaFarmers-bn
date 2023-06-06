/* eslint-disable no-unused-vars */
/* eslint-disable import/prefer-default-export */
import asyncWrapper from '../utils/handlingTryCatchBlocks';
import {
  ShoppingCart,
  Product,
  User,
  Order,
  DeliveryAddress,
} from '../Database/models';

export const buyerCheckout = asyncWrapper(async (req, res) => {
  const {
    user,
    currentCart,
    cartTotalPrice,
    deliveryAddress,
    paymentInformation,
  } = req;

  const products = [];

  currentCart.forEach((item) => {
    const product = {
      productId: item.productId,
      quantity: item.productId,
      price: item.totalPrice,
    };
    products.push(product);
  });

  const addressExists = await DeliveryAddress.findOne({
    where: {
      userId: user.id,
      address: deliveryAddress,
    },
  });

  if (!addressExists) {
    await DeliveryAddress.create({
      userId: user.id,
      address: deliveryAddress,
    });
  }

  const order = await Order.create({
    userId: user.id,
    products,
    totalPrice: cartTotalPrice,
    deliveryAddress,
    paymentMethod: paymentInformation.method,
  });

  res.status(200).json({
    status: 'success',
    message: 'Order created successfully, kindly proceed to payment!',
    data: order,
  });
});
