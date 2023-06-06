import express from 'express';
import { makePayment, fetchPayments } from '../controllers/payment.controller';
import { authorizeCustomer } from '../middlewares/userRoles.middleware';
import validatePayment from '../middlewares/validatePayment';

const router = express.Router();

/**
 * @swagger
 *  components:
 *      schemas:
 *          Payment:
 *              type: object
 *              properties:
 *                  ok:
 *                      type: boolean
 *                  message:
 *                      type: string
 *                  data:
 *                      type: array
 *                      items:
 *                          type: object
 *                          properties:
 *                              id:
 *                                  type: integer
 *                              orderId:
 *                                  type: integer
 *                              userId:
 *                                  type: integer
 *                              receiptUrl:
 *                                  type: string
 *                              createdAt:
 *                                  type: string
 *                              updatedAt:
 *                                  type: string
 *                              Order:
 *                                  type: object
 *                                  properties:
 *                                      totalPrice:
 *                                          type: integer
 *                                      status:
 *                                          type: string
 *          PaymentSuccess:
 *              type: object
 *              properties:
 *                  ok:
 *                      type: boolean
 *                  message:
 *                      type: string
 *                  data:
 *                      type: object
 *                      properties:
 *                          id:
 *                              type: integer
 *                          orderId:
 *                              type: integer
 *                          userId:
 *                              type: integer
 *                          receiptUrl:
 *                              type: string
 *                          createdAt:
 *                              type: string
 *                          updatedAt:
 *                              type: string
 *                  status:
 *                      type: string
 *          Card:
 *              type: object
 *              properties:
 *                  card:
 *                      type: object
 *                      properties:
 *                          number:
 *                              type: string
 *                          exp_month:
 *                              type: number
 *                          exp_year:
 *                              type: number
 *                          cvc:
 *                              type: string
 */

/**
 * @swagger
 * /api/payment/{id}:
 *  post:
 *      summary: Make payment using stripeAPI
 *      description: This api is used to make a payment using stripeAPI
 *      parameters:
 *        - name: id
 *          in: path
 *          description: Id of the order you want to pay
 *          schema:
 *              type: integer
 *      tags:
 *        - Payment
 *      security:
 *        - bearerAuth: []
 *      requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Card'
 *      responses:
 *          201:
 *              description: This api is used to make a payment using stripeAPI
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: array
 *                          items:
 *                              $ref: '#components/schemas/PaymentSuccess'
 */

router.post('/payment/:id', authorizeCustomer, validatePayment, makePayment);

/**
 * @swagger
 * /api/getAllPayment:
 *  get:
 *      summary: Get payment history
 *      description: This api is used to get a payment history
 *      tags:
 *        - Payment
 *      security:
 *        - bearerAuth: []
 *      responses:
 *          200:
 *              description: This api is for getting a payment history
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: array
 *                          items:
 *                              $ref: '#components/schemas/Payment'
 */
router.get('/getAllPayment', authorizeCustomer, fetchPayments);

export default router;
