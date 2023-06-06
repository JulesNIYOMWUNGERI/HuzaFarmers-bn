import asyncWrapper from '../utils/handlingTryCatchBlocks';
import { ShoppingCart } from '../Database/models';

const viewCartItems = asyncWrapper(async (req, res) => {
  const { userId } = req;

  const viewCart = await ShoppingCart.findAll({ where: { userId } });

  if (viewCart.length === 0) {
    return res
      .status(404)
      .json({ message: 'You do not have items in your cart' });
  }
  return res.status(200).json({ data: viewCart });
});

export default viewCartItems;
