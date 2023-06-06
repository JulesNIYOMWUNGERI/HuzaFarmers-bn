import express from 'express';
import updateShoppingCart from '../controllers/update-shopping-cart.contoller';
import { authorizeCustomer } from '../middlewares/userRoles.middleware';
import updateShoppingCartMiddleware from '../middlewares/update-shopping-cart.middleware';

const router = express.Router();

/**
 * @swagger
 * /api/updateShoppingCart/{id}:
 *   patch:
 *     summary: Update an item in the shopping cart
 *     description: Update an item in the shopping cart of the authenticated user
 *     tags: [Shopping Cart]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the product to update in the cart
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               quantity:
 *                 type: integer
 *                 example: 2
 *     responses:
 *       '200':
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: 'success'
 *                 message:
 *                   type: string
 *                   example: 'The item was successfully updated in the cart'
 *                 data:
 *                   type: object
 *                   properties:
 *                     UPDATEDCARTDETAILS:
 *                       $ref: '#/components/schemas/CartItem'
 *       '400':
 *         description: Bad Request
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: 'error'
 *                 message:
 *                   type: string
 *                   example: 'The product with that ID is not available'
 *       '401':
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: 'error'
 *                 message:
 *                   type: string
 *                   example: 'Unauthorized access'
 *       '500':
 *         description: Internal Server Error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: 'error'
 *                 message:
 *                   type: string
 *                   example: 'Failed to update the cart'
 *                 error:
 *                   type: string
 *                   example: 'Internal Server Error'
 */

router.patch(
  '/updateShoppingCart/:id',
  authorizeCustomer,
  updateShoppingCartMiddleware,
  updateShoppingCart
);

export default router;
