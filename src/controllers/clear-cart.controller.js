/* eslint-disable no-unused-vars */
import asyncWrapper from '../utils/handlingTryCatchBlocks';

const clearCart = asyncWrapper(async (req, res, next) => {
  const { ShoppingCart, userId } = req;
  // Delete all items in the user's shopping cart
  await ShoppingCart.destroy({ where: { userId } });

  res.status(200).json({
    status: 'success',
    message: 'ALL ITEMS REMOVED FROM THE CART SUCCESSFULLY!!!',
  });
});

export default clearCart;
