/* eslint-disable no-restricted-globals */
import { ShoppingCart, Product } from '../Database/models';
import asyncWrapper from '../utils/handlingTryCatchBlocks';

const addItemToCart = asyncWrapper(async (req, res) => {
  const { productId, quantity } = req.body;

  // Check if the product exists
  const product = await Product.findOne({ where: { id: productId } });
  if (!product) {
    return res.status(400).json({
      status: 'error',
      message: 'THE PRODUCT WITH THAT ID, IS NOT AVAILABLE',
    });
  }

  // Check if the product is available
  if (product.status === 'unavailable') {
    return res.status(400).json({
      status: 'error',
      message: 'THIS PRODUCT IS EITHER NOT IN STOCK OR EXPIRED',
    });
  }

  // Check if the quantity is a valid number
  if (isNaN(quantity)) {
    return res.status(400).json({
      status: 'error',
      message: 'QUANTITY HAS TO BE A VALID POSITIVE NUMBER(s) [1-9]',
    });
  }

  // Check if the quantity is negative
  if (quantity < 0) {
    return res.status(400).json({
      status: 'error',
      message: 'PLEASE ENTER POSITIVE NUMBER(s), LIKE [1-9]',
    });
  }
  // Check if the requested quantity is available
  if (quantity > product.quantity) {
    return res.status(400).json({
      status: 'error',
      message: 'THE STOCK HAS LESS QUANTITY',
    });
  }

  // Check if the user has already added this product to their shopping cart
  const existingCartItem = await ShoppingCart.findOne({
    where: { userId: req.user.id, productId },
  });

  let updatedCartItem;
  if (existingCartItem) {
    // If the user has already added this product to their shopping cart,
    // update the quantity and totalPrice fields
    const newQuantity = existingCartItem.quantity + quantity;
    const totalPrice = newQuantity * product.price;
    const newTotalPrice = totalPrice.toFixed(2);

    updatedCartItem = await existingCartItem.update({
      quantity: newQuantity,
      totalPrice,
      cartTotalPrice: newTotalPrice,
    });
  } else {
    // If this is a new item in the shopping cart, create a new record
    const totalPrice = quantity * product.price;
    const cartTotalPrice = totalPrice.toFixed(2);

    updatedCartItem = await ShoppingCart.create({
      userId: req.user.id,
      productId,
      quantity,
      totalPrice,
      cartTotalPrice,
    });

    // Update the cartTotalPrice for the user's shopping cart
    const cartItems = await ShoppingCart.findAll({
      where: { userId: req.user.id },
      include: Product,
    });

    const newCartTotalPrice = cartItems
      .reduce((total, item) => total + parseFloat(item.totalPrice), 0)
      .toFixed(2);

    // Update the cartTotalPrice field in the database for the newly added item
    await updatedCartItem.update({ cartTotalPrice: newCartTotalPrice });
  }

  res.status(201).json({
    status: 'success',
    message: 'YES!, ITEM ADD TO THE CART SUCCESSFULLY!!!',
    data: {
      'CURRENT CART DETAILS': {
        id: updatedCartItem.id,
        userId: updatedCartItem.userId,
        quantity: updatedCartItem.quantity,
        totalPrice: updatedCartItem.totalPrice,
        cartTotalPrice: updatedCartItem.cartTotalPrice,
        itemCounts: updatedCartItem.itemCounts,
        createdAt: updatedCartItem.createdAt,
        updatedAt: updatedCartItem.updatedAt,
        'ADDED PRODUCT DETAILS ': {
          ID: product.id,
          NAME: product.name,
          IMAGE: product.image,
          PRICE: product.price,
          QUANTITY: product.quantity,
          STATUS: product.status,
          'Expiration Date': product.exDate,
        },
      },
    },
  });
});

export default addItemToCart;
