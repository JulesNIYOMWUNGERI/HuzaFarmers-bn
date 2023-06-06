import express from 'express';
import clearCart from '../controllers/clear-cart.controller';
import { authorizeUser } from '../middlewares/userRoles.middleware';
import clearCartMiddleware from '../middlewares/clear-cart.middleware';

const router = express();

router.delete('/clear-cart', authorizeUser, clearCartMiddleware, clearCart);
/**
 * @swagger
 * /api/clear-cart:
 *   delete:
 *     summary: Clear the shopping cart
 *     description: Clear the shopping cart of the authenticated user
 *     tags: [Shopping Cart]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Cart cleared successfully
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
 *                   example: Your cart has been cleared
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
 *         description: Server error. Failed to clear the cart
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
 *                   example: Oops! FAILED TO CLEAR YOUR CART
 *                 error:
 *                   type: string
 *                   example: Error message
 */

export default router;
