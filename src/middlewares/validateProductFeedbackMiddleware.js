/* eslint-disable no-unused-vars */
import { Product } from '../Database/models';

const validateProductFeedbackMiddleware = async (req, res, next) => {
  try {
    // Validate request body
    const productId = req.params.id;
    const { rating } = req.body;
    const { review } = req.body;

    if (!productId) {
      return res.status(400).json({ error: 'Product ID are required.' });
    }
    if (rating === undefined || rating === null) {
      return res.status(400).json({ message: 'Rating is required.' });
    }
    if (rating < 1 || rating > 5) {
      return res
        .status(400)
        .json({ message: 'the rating must be between 1 and 5' });
    }

    if (!(await Product.findByPk(productId))) {
      return res.status(404).json({ message: 'product not found' });
    }
    next();
  } catch (error) {
    res.status(500).send({ message: 'Internal server error', error });
  }
};

export default validateProductFeedbackMiddleware;
