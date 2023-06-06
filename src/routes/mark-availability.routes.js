/* eslint-disable linebreak-style */
import express from 'express';
import { authorizeMerchant } from '../middlewares/userRoles.middleware';
import setProductAvailability from '../controllers/mark-availability.controller';
import checkUserAndProductMiddleware from '../middlewares/check-user-and-product.middleware.js';

const router = express.Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     SetProductAvailability:
 *       type: object
 *       properties:
 *         quantity:
 *           type: number
 *           example: 10
 *         exDate:
 *           type: string
 *           example: "2023-04-25"
 */

/**
 * @swagger
 * /api/set-product-availability/{id}:
 *   patch:
 *     security:
 *      - bearerAuth: []
 *     summary: This API is for changing a product's availability, To Mark it Available/Unvailable
 *     description: This API is used to update an existing product's availability by ID.
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
 *             $ref: '#/components/schemas/SetProductAvailability'
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
 *                   $ref: '#/components/schemas/SetProductAvailability'
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
  '/mark-product-availability/:id',
  authorizeMerchant,
  checkUserAndProductMiddleware,
  setProductAvailability
);

export default router;
