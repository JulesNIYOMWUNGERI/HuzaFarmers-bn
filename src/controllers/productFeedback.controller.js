import { ProductFeedback, Product } from '../Database/models';
import asyncWrapper from '../utils/handlingTryCatchBlocks';

const createProductFeedback = asyncWrapper(async (req, res) => {
  const productId = req.params.id;
  const { rating, review } = req.body;
  const { user } = req;
  // Create new ProductRFeedback object

  const productFeedback = await ProductFeedback.create({
    productId,
    userId: user.id,
    rating,
    review,
  });

  // Update product average rating
  const ProductFeedbacks = await ProductFeedback.findAll({
    where: { productId },
  });

  const numRatings = ProductFeedbacks.length;
  const totalRating = ProductFeedbacks.reduce(
    (sum, rate) => sum + rate.rating,
    0
  );
  const newAvgRating = totalRating / numRatings;
  await Product.update(
    { averageRating: newAvgRating.toFixed(1) },
    {
      where: { id: productId },
    }
  );
  return res
    .status(201)
    .json({ message: 'Review successfuly created', data: productFeedback });
});

export default createProductFeedback;
