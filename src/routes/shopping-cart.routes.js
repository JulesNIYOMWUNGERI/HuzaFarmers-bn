import express from 'express';
import addItemToCart from '../controllers/shopping-cart.controller';
import { authorizeCustomer } from '../middlewares/userRoles.middleware';

const router = express.Router();
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
 */

/**
 * @swagger
 * /api/addItemToCart:
 *   post:
 *     summary: Add an item to the shopping cart
 *     description: Add an item to the shopping cart of the authenticated user
 *     tags: [Shopping Cart]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               productId:
 *                 type: integer
 *               quantity:
 *                 type: integer
 *     responses:
 *       201:
 *         description: Item added to the cart successfully
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
 *                   example: YES!, ITEM ADD TO THE CART SUCCESSFULLY!!!
 *                 data:
 *                   type: object
 *                   properties:
 *                     CURRENT CART DETAILS:
 *                       $ref: '#/components/schemas/CartItem'
 *                     ADDED PRODUCT DETAILS:
 *                       $ref: '#/components/schemas/Product'
 *       400:
 *         description: Bad request. Invalid input or the product is not available
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
 *                   example: THE PRODUCT WITH THAT ID, IS NOT AVAILABLE
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
 *         description: Server error. Failed to add the item to the cart
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
 *                   example: Oops! FAILED TO ADD THIS ITEM TO THE CART
 *                 error:
 *                   type: string
 *                   example: Error message
 */
router.post('/addItemToCart', authorizeCustomer, addItemToCart);

export default router;
