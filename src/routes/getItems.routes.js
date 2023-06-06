import express from 'express';
import { authorizeUser } from '../middlewares/userRoles.middleware';
import RoleCheck from '../middlewares/user.Checkrole';
import {
  getAllBuyerItems,
  getAllSellerItems,
} from '../controllers/getItems.controller';

const router = express.Router();

/**
 * @swagger
 * /api:
 *  get:
 *      summary: get a list of items as a customer
 *      description: This api is used to get a list of items as a customer
 *      parameters:
 *        - in: query
 *          name: page
 *          description: page number to retrieve, default is 1
 *          schema:
 *              type: integer
 *        - in: query
 *          name: size
 *          description: number of items per page to retrieve, default is 5
 *          schema:
 *              type: integer
 *      tags:
 *        - get a list of items
 *      responses:
 *          200:
 *              description: This api is used to get a list of available items as a customer
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: array
 *                          items:
 *                              $ref: '#components/schemas/Product'
 */

router.get('/', getAllBuyerItems);

/**
 * @swagger
 * /api/sellerCollection:
 *  get:
 *      summary: get the list of items in seller's collection
 *      description: This api is used to get list of items in seller's collection
 *      parameters:
 *        - in: query
 *          name: page
 *          description: page number to retrieve, default is 1
 *          schema:
 *              type: integer
 *        - in: query
 *          name: size
 *          description: number of items per page to retrieve, default is 5
 *          schema:
 *              type: integer
 *      tags:
 *        - get a list of items
 *      security:
 *        - bearerAuth: []
 *      responses:
 *          200:
 *              description: This api is used to get list of items in seller's collection
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: array
 *                          items:
 *                              $ref: '#components/schemas/Product'
 */

router.get(
  '/sellerCollection',
  authorizeUser,
  RoleCheck(['merchant']),
  getAllSellerItems
);

export default router;
