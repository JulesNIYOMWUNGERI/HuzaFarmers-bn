/* eslint-disable no-unused-vars */
import validateProduct from '../validation/product.validator';

const validateProductMiddleware = async (req, res, next) => {
  try {
    const { name, image, price, quantity, category, exDate } = req.body;

    const { error } = validateProduct(req.body);
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }
    next();
  } catch (error) {
    res.status(500).send({ message: 'Internal server error', error });
  }
};

export default validateProductMiddleware;
