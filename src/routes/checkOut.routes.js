import express from 'express';
import { authorizeCustomer } from '../middlewares/userRoles.middleware';

import AuthMiddleware from '../middlewares/login.middleware';

import checkOutMiddleware from '../middlewares/checkOut.middleware';

import { buyerCheckout } from '../controllers/checkOut.controller';

const router = express.Router();

/**
 * @swagger
 *  components:
 *      schemas:
 *          Order Product Details:
 *              type: object
 *              properties:
 *                  productId:
 *                      type: integer
 *                      example: 1
 *                  quantity:
 *                      type: integer
 *                      example: 2
 *                  price:
 *                      type: number
 *                      format: double
 *                      example: 5000.00
 *          Order:
 *              type: object
 *              properties:
 *                  id:
 *                      type: integer
 *                  userId:
 *                      type: integer
 *                  products:
 *                      type: array
 *                      items:
 *                          $ref: '#/components/schemas/Order Product Details'
 *                  priceToPay:
 *                      type: number
 *                      format: double
 *                      example: 120000.00
 *                  paymentMethod:
 *                      type: string
 *                      example: credit card
 *                  deliveryAddress:
 *                        type: object
 *                        properties:
 *                          street:
 *                            type: string
 *                          city:
 *                            type: string
 *                          country:
 *                            type: string
 *                          zipCode:
 *                            type: string
 *                  status:
 *                      type: string
 *                      example: pending
 *
 */

router.post(
  '/checkout',
  AuthMiddleware.checkAuthentication,
  authorizeCustomer,
  checkOutMiddleware,
  buyerCheckout
);

/**
 * @swagger
 * components:
 *      schemas:
 *          Checkout:
 *              type: object
 *              properties:
 *                  deliveryAddress:
 *                        type: object
 *                        properties:
 *                          street:
 *                            type: string
 *                          city:
 *                            type: string
 *                          country:
 *                            type: string
 *                          zipCode:
 *                            type: string
 *                  paymentInformation:
 *                        type: object
 *                        properties:
 *                          method:
 *                            type: string
 *                            example: credit card
 *                          details:
 *                            type: object
 *                            properties:
 *                              cardNumber:
 *                                  type: string
 *                              expirationDate:
 *                                  type: string
 *                              cvv:
 *                                  type: string
 *
 */

/**
 * @swagger
 * /api/checkout:
 *   post:
 *     security:
 *      - bearerAuth: []
 *     summary: This endpoint is for checking out as a buyer
 *     description: This endpoint is used to checkout and make an order as a buyer.
 *     tags: [Checkout]
 *     requestBody:
 *       description: Buyer checkout
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *              $ref: '#/components/schemas/Checkout'
 *     responses:
 *       200:
 *         description: Order created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                 message:
 *                   type: string
 *                   example: Order created successfully, kindly proceed to payment!
 *                 data:
 *                   $ref: '#/components/schemas/Order'
 *       400:
 *         description: Bad request. Invalid input
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
 *                   example: Invalid Input
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
 *
 *       404:
 *         description: User not found
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
 *                 message: User not found
 *
 *       500:
 *         description: Server error! Failed to complete the checkout process
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
 *                 message: Oops! Couldn't complete the checkout process
 *
 */

export default router;
