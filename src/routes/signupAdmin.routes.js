import express from 'express';
import createAdminAccount from '../controllers/signupAdmin.controller';

const router = express.Router();

/**
 * @swagger
 * /api/registerAdmin:
 *  post:
 *      tags:
 *          - User
 *      summary: registering an admin
 *      description: This api is used to register an admin account
 *      requestBody:
 *          required: true
 *          content:
 *              application/json:
 *                  schema:
 *                      type: object
 *                      properties:
 *                          firstname:
 *                              type: string
 *                          lastname:
 *                              type: string
 *                          email:
 *                              type: string
 *                          password:
 *                              type: string
 *      responses:
 *          200:
 *              description: Admin account will have been registered successfully
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 */

router.post('/registerAdmin', createAdminAccount);
export default router;
