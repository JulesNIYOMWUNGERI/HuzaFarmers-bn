/* eslint-disable object-curly-newline */
import asyncWrapper from '../utils/handlingTryCatchBlocks';

// eslint-disable-next-line padded-blocks
const updateShoppingCart = asyncWrapper(async (req, res) => {
  const { quantity, cartItem, ShoppingCart, Product } = req;
  // Update the quantity and totalPrice fields of the cart item
  const totalPrice = quantity * cartItem.Product.price;
  const cartTotalPrice = totalPrice.toFixed(2);
  const updatedCartItem = await cartItem.update({
    quantity,
    totalPrice,
    cartTotalPrice,
  });

  // Update the cartTotalPrice field for the user's shopping cart
  const cartItems = await ShoppingCart.findAll({
    where: { userId: req.user.id },
    include: Product,
  });

  const newCartTotalPrice = cartItems
    .reduce((total, item) => total + parseFloat(item.totalPrice), 0)
    .toFixed(2);

  await ShoppingCart.update(
    { cartTotalPrice: newCartTotalPrice },
    { where: { userId: req.user.id } }
  );

  res.status(200).json({
    status: 'success',
    message: 'THE ITEM IN THE CART WAS UPDATED SUCCESSFULLY!!!',
    data: {
      'UPDATED CART DETAILS': {
        id: updatedCartItem.id,
        userId: updatedCartItem.userId,
        quantity: updatedCartItem.quantity,
        totalPrice: updatedCartItem.totalPrice,
        cartTotalPrice: newCartTotalPrice,
        itemCounts: updatedCartItem.itemCounts,
        createdAt: updatedCartItem.createdAt,
        updatedAt: updatedCartItem.updatedAt,
        'PRODUCT DETAILS': {
          id: cartItem.Product.id,
          name: cartItem.Product.name,
          image: cartItem.Product.image,
          price: cartItem.Product.price,
          quantity: cartItem.Product.quantity,
          status: cartItem.Product.status,
          exDate: cartItem.Product.exDate,
        },
      },
    },
  });
});

export default updateShoppingCart;
