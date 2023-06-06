import express from 'express';
import viewCartItems from '../controllers/view-cart-items.controller';
import { authorizeUser } from '../middlewares/userRoles.middleware';
import viewCartItemsMiddleware from '../middlewares/view-cart-items.middleware';

const router = express();

/**
 * @swagger
 * components:
 *   securitySchemes:
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 *   schemas:
 *     CartItem:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           example: 1
 *         userId:
 *           type: integer
 *           example: 2
 *         quantity:
 *           type: integer
 *           example: 2
 *         totalPrice:
 *           type: number
 *           format: double
 *           example: 20.00
 *         cartTotalPrice:
 *           type: number
 *           format: double
 *           example: 50.00
 *     CartItemList:
 *       type: array
 *       items:
 *         $ref: '#/components/schemas/CartItem'
 */

/**
 * @swagger
 * /api/view-cart-items:
 *   get:
 *     summary: View items in the shopping cart
 *     description: View the items in the shopping cart of the authenticated user
 *     tags: [Shopping Cart]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Successfully retrieved items in the shopping cart
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 message:
 *                   type: string
 *                   example: HERE ARE YOUR CURRENT ITEMS IN THE SHOPPING CART
 *                 data:
 *                   $ref: '#/components/schemas/CartItemList'
 *       401:
 *         description: Unauthorized. User not authenticated
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: error
 *                 message:
 *                   type: string
 *                   example: UNAUTHORIZED ACCESS! YOU NEED TO BE AUTHENTICATED
 *       500:
 *         description: Server error. Failed to retrieve items in the shopping cart
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: error
 *                 message:
 *                   type: string
 *                   example: Oops! FAILED TO RETRIEVE YOUR ITEMS IN THE SHOPPING CART
 *                 error:
 *                   type: string
 *                   example: Error message
 */

router.get(
  '/view-cart-items',
  authorizeUser,
  viewCartItemsMiddleware,
  viewCartItems
);

export default router;
