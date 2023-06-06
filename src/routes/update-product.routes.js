import express from 'express';
import updateProduct from '../controllers/update-product.controller';
import { checkExpiredProducts } from '../controllers/create-product.controller';
import { authorizeMerchant } from '../middlewares/userRoles.middleware';
import checkUserAndProductMiddleware from '../middlewares/check-user-and-product.middleware.js';

const router = express.Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     ProductUpdate:
 *       $ref: '#/components/schemas/Product'
 *
 */

/**
 * @swagger
 * /api/updateProduct/{id}:
 *   patch:
 *     security:
 *      - bearerAuth: []
 *     summary: This API is for Updating a product, To Mark it Available or Unvailable
 *     description: This API is used to update an existing product by ID.
 *     tags:
 *       - Product
 *     parameters:
 *       - name: id
 *         in: path
 *         description: ID of the product to update
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       description: Update fields for the product
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ProductUpdate'
 *     responses:
 *       200:
 *         description: Product updated successfully
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
 *                   $ref: '#/components/schemas/Product'
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
 *         description: Failed to update product
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
 *                 message: Failed to update product
 *
 */
router.patch(
  '/updateProduct/:id',
  authorizeMerchant,
  checkUserAndProductMiddleware,
  updateProduct
);

export default router;
