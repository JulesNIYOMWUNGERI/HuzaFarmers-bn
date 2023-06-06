import express from 'express';
import createProduct from '../controllers/create-product.controller';
import { authorizeMerchant } from '../middlewares/userRoles.middleware';
import AuthMiddleware from '../middlewares/login.middleware';
import validateProductMiddleware from '../middlewares/validateProductMiddleware';

const router = express.Router();

/**
 * @swagger
 *  components:
 *      securitySchemes:
 *        bearerAuth:
 *          type: http
 *          scheme: bearer
 *          bearerFormat: JWT
 *      schemas:
 *          Product:
 *              type: object
 *              properties:
 *                  name:
 *                      type: string
 *                  image:
 *                      type: array
 *                      items:
 *                          type: string
 *                  price:
 *                      type: number
 *                  quantity:
 *                      type: number
 *                  category:
 *                      type: string
 *                  exDate:
 *                      type: string
 */

/**
 * @swagger
 * /api/addProduct:
 *   post:
 *     security:
 *      - bearerAuth: []
 *     summary: This API is for adding a product
 *     description: Add a new product to the database.
 *     tags:
 *       - Product
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Product'
 *     responses:
 *       201:
 *         description: Product created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   enum: [success]
 *                 message:
 *                   type: string
 *                   description: success message
 *                 data:
 *                   $ref: '#/components/schemas/Product'
 *       400:
 *         description: Missing or invalid fields
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   enum: [error]
 *                 message:
 *                   type: string
 *                   description: error message
 *       500:
 *         description: Failed to create product
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   enum: [error]
 *                 message:
 *                   type: string
 *                   description: error message
 *                 error:
 *                   type: string
 *                   description: error details
 */
router.post(
  '/addProduct',
  AuthMiddleware.checkAuthentication,
  authorizeMerchant,
  validateProductMiddleware,
  createProduct,
);

export default router;
