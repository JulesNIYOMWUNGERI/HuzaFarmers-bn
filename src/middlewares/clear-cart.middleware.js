import { ShoppingCart } from '../Database/models';

const clearCartMiddleware = async (req, res, next) => {
  const userId = req.user.id;

  // Find all items in the user's shopping cart
  const cartItems = await ShoppingCart.findAll({
    where: { userId },
  });

  // If there are no items in the cart, return an error
  if (!cartItems || cartItems.length === 0) {
    return res.status(400).json({
      status: 'error',
      message: 'CART IS EMPTY, THERE ARE NO ITEMS TO REMOVE!',
    });
  }

  req.userId = userId;
  req.ShoppingCart = ShoppingCart;

  next();
};

export default clearCartMiddleware;
