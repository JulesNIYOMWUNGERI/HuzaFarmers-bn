/* eslint-disable linebreak-style */
import express from 'express';
import findOne from '../controllers/findProduct.controller';
import { authorizeUser } from '../middlewares/userRoles.middleware';
// use the functions here

const router = express.Router();
router.get('/getProduct/:id', authorizeUser, findOne);

/**
 * @swagger
 * /api/getProduct/{id}:
 *  get:
 *      security:
 *      - bearerAuth: []
 *      summary: This API is used to check if get method on single Product is working or not
 *      description: This API is used to check if GET method on single Product is working or not
 *      tags:
 *        - Product
 *      parameters:
 *          - in: path
 *            name: id
 *            required: true
 *            description: the product's id
 *            schema:
 *            type: interger
 *      responses:
 *          200:
 *              description: Product Retrieved succesfully
 *          404:
 *              description: There is no product ${id} in the store.
 */

export default router;
