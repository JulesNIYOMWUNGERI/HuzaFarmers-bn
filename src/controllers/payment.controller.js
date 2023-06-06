/* eslint-disable no-unused-vars */
import 'dotenv/config';
import stripe from 'stripe';
import asyncWrapper from '../utils/handlingTryCatchBlocks';
import paymentCardShema from '../validation/paymentCard.validator';
import db from '../Database/models';
import emitter from '../events/notifications.event';

// LOAD MODELS FROM DB
const { Payment, ShoppingCart, Order } = db;

// LOAD SECRET
const { STRIPE_SECRET_KEY } = process.env;

// CONFIGURE STRIPE
const stripePayment = stripe(STRIPE_SECRET_KEY);

// MAKE PAYMENT
export const makePayment = asyncWrapper(async (req, res) => {
  // RETRIEVE VALUES RETURNED BY THE MIDDLEWARE
  const { user, findOrder, orderProductsDataArray } = res.datas;

  const { card } = req.body;

  // CHECK IF CARD IS VALID
  const { error } = paymentCardShema(req.body);

  if (error) {
    return res.status(406).send(error.details[0].message);
  }

  // CREATE STRIPE TOKEN
  const stripeToken = await stripePayment.tokens.create({
    card,
  });

  // CREATE STRIPE CUSTOMER
  const stripeCustomer = await stripePayment.customers.create({
    email: user.email,
    source: stripeToken.id,
    address: {
      line1: findOrder.deliveryAddress.street,
      city: findOrder.deliveryAddress.city,
      postal_code: findOrder.deliveryAddress.zipCode,
      country: findOrder.deliveryAddress.country,
    },
    name: user.fullname,
    description: `Customer for ${user.email}`,
  });

  // CREATE STRIPE CHARGE
  const stripeCharge = await stripePayment.charges.create({
    amount: findOrder.totalPrice,
    currency: 'usd',
    customer: stripeCustomer.id,
    description: `Charge for ${user.fullname}`,
  });

  // CHECK IF PAYMENT IS UNSUCCESSFULL
  if (!stripeCharge) {
    res.status(402).json({
      message:
        'There is a problem occured in payment! please try again or contact Admin',
    });
  }

  // CREATE PAYMENT RECORD
  const createPayment = await Payment.create({
    orderId: findOrder.id,
    userId: user.id,
    receiptUrl: stripeCharge.receipt_url,
  });
  // UPDATE ORDER STATUS
  const updateOrder = await findOrder.update({
    status: 'paid',
  });

  // DELETING PAYED PRODUCTS FROM SHOPING CART
  orderProductsDataArray.forEach(async (element) => {
    const data = await ShoppingCart.findOne({
      where: {
        productId: element.id,
      },
    });
    emitter.emit('productPurchased', findOrder, user);
    await data.destroy();
  });

  const { status } = updateOrder;
  return res.status(201).json({
    ok: true,
    message: 'Payment successfully added and order status updated',
    data: createPayment,
    status,
  });
});

// GET PAYMENTS
export const fetchPayments = asyncWrapper(async (req, res) => {
  // GET USER FROM REQ
  const { user } = req;

  // GET PAYMENTS
  const getPayments = await Payment.findAll({
    where: { userId: user.id },
    include: [
      {
        model: Order,
        as: 'Order',
        attributes: ['totalPrice', 'status'],
      },
    ],
  });
  return res.status(200).json({
    ok: true,
    message: 'Payments retrieved successfully',
    data: getPayments,
  });
});
