/* eslint-disable no-unused-vars */
/* eslint-disable no-restricted-globals */
import { ShoppingCart, Product, User } from '../Database/models';

const updateShoppingCartMiddleware = async (req, res, next) => {
  const productId = req.params.id;
  const { quantity } = req.body;

  const { id } = req.user;

  // GET USER BY ID
  const user = await User.findOne({ where: { id } });

  if (!user) {
    return res.status(404).json({ status: 'error', message: 'User not found' });
  }

  // CHECK IF ID IS FORM USER WHO LOGGED IN
  if (user.id !== req.user.id) {
    return res.status(403).json({ status: 'error', message: 'Unautholized' });
  }

  // Check if the user has already added this product to their shopping cart
  const cartItem = await ShoppingCart.findOne({
    where: { userId: req.user.id, productId },
    include: Product,
  });

  if (!cartItem) {
    return res.status(404).json({
      status: 'error',
      message: 'THE PRODUCT IS NOT IN THE CART',
    });
  }
  // Check if the quantity is a valid numbe(s)
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

  // Check if the requested quantity amount are less
  if (quantity > cartItem.Product.quantity) {
    return res.status(400).json({
      status: 'error',
      message: 'THE STOCK HAS LESS QUANTITY',
    });
  }
  req.user = user;
  req.quantity = quantity;
  req.cartItem = cartItem;
  req.ShoppingCart = ShoppingCart;
  req.Product = Product;
  next();
};

export default updateShoppingCartMiddleware;
