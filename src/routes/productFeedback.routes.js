import express from 'express';
import createProductFeedback from '../controllers/productFeedback.controller';
import { authorizeCustomer } from '../middlewares/userRoles.middleware';
import AuthMiddleware from '../middlewares/login.middleware';
import validateProductFeedbackMiddleware from '../middlewares/validateProductFeedbackMiddleware';

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
 *          ProductFeedback:
 *              type: object
 *              properties:
 *                  rating:
 *                      type: number
 *                  review:
 *                      type: string
 */

/**
 * @swagger
 * /api/addProductFeedback/{id}:
 *   post:
 *     security:
 *      - bearerAuth: []
 *     summary: This API is for adding a rating and review to a product
 *     description: Add a new review and rating. The rating should be between 1 and 5
 *     tags:
 *       - Product
 *     parameters:
 *       - name: id
 *         in: path
 *         description: ID of the product to add a review and rate to
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ProductFeedback'
 *     responses:
 *       201:
 *         description: Product review created successfully
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
 *                   $ref: '#/components/schemas/ProductFeedback'
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
  '/addProductFeedback/:id',
  AuthMiddleware.checkAuthentication,
  authorizeCustomer,
  validateProductFeedbackMiddleware,
  createProductFeedback
);

export default router;
