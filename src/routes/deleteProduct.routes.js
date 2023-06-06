import express from 'express';
import deleteProduct from '../controllers/deleteProduct.controller';
import { authorizeUser } from '../middlewares/userRoles.middleware';
import RoleCheck from '../middlewares/user.Checkrole';
import AuthMiddleware from '../middlewares/login.middleware';

const router = express.Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     ProductDelete:
 *       $ref: '#/components/schemas/Product'
 *
 */
/**
 * @swagger
 * /api/deleteProduct/{id}:
 *   delete:
 *     security:
 *      - bearerAuth: []
 *     summary: This API is for delete a product
 *     description: This API is used to delete an existing product by ID.
 *     tags:
 *       - Product
 *     parameters:
 *       - name: id
 *         in: path
 *         description: ID of the product to delete and token of seller
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Product deleted successfully
 *       404:
 *         description: Product not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                 message:
 *                   type: string
 *               example:
 *                 status: error
 *                 message: Product not found
 *       500:
 *         description: Failed to delete product
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                 message:
 *                   type: string
 *                 data:
 *                   type: string
 *               example:
 *                 status: error
 *                 message: Failed to delete product
 *
 */
router.delete(
  '/deleteProduct/:id',
  AuthMiddleware.checkAuthentication,
  authorizeUser,
  RoleCheck(['merchant', 'admin']),
  deleteProduct
);
export default router;
