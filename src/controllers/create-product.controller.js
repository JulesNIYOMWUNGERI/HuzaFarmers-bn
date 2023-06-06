import sgMail from '@sendgrid/mail';
import { Product } from '../Database/models';
import validateProduct from '../validation/product.validator';
import asyncWrapper from '../utils/handlingTryCatchBlocks';
import checkExpiredProducts from '../utils/productExpiration';
import emitter from '../events/notifications.event';

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const createProduct = asyncWrapper(async (req, res) => {
  const {
    name, image, price, quantity, category, exDate
  } = req.body;

  const { error } = validateProduct(req.body);
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }

  // Get userId from logged in user
  const userId = req.user.id;
  const { user } = req;

  // Verify if product already exists in the user's collection
  const productExists = await Product.findOne({
    where: { name, userId }
  });
  if (productExists) {
    const newQuantity = productExists.quantity + req.body.quantity;
    await productExists.update({
      quantity: newQuantity,
    });
    return res.status(200).json({
      message: `The product already exists, its quantity has been updated to ${newQuantity}, To make other changes to the product use the update option`,
      data: productExists
    });
  }

  // Round the price
  const parsedPrice = parseFloat(price);

  const product = await Product.create({
    name,
    image,
    price: parsedPrice,
    quantity,
    category,
    status: quantity > 1 ? 'available' : 'unavailable',
    exDate,
    isExpired: false,
    userId // set the userId field to the current user's ID
  });
  emitter.emit('newProduct', product, user);
  checkExpiredProducts();
  res.status(201).json({
    status: 'success',
    message: 'Product created successfully',
    data: product
  });
});
export default createProduct;
