/* eslint-disable linebreak-style */
import express from 'express';
import {
  getUserInformation,
  updateUserInformation,
} from '../controllers/profile.controller';

import { authorizeUser } from '../middlewares/userRoles.middleware';

import AuthMiddleware from '../middlewares/login.middleware';

import profilePageMiddleware from '../middlewares/profile.middleware';

const router = express.Router();

/**
 * @swagger
 *  components:
 *      schemas:
 *          UserInformation:
 *              type: object
 *              properties:
 *                  name:
 *                      type: string
 *                  email:
 *                      type: string
 *                  profileImage:
 *                      type: array
 *                      items:
 *                          type: string
 *                  gender:
 *                      type: string
 *                  birthdate:
 *                      type: string
 *                  preferredLanguage:
 *                      type: string
 *                  preferredCurrency:
 *                      type: string
 *                  homeAddress:
 *                      type: string
 *                  billingAddress:
 *                        type: object
 *                        properties:
 *                          street:
 *                            type: string
 *                          city:
 *                            type: string
 *                          country:
 *                            type: string
 *                          poBoxNumber:
 *                            type: string
 *                          zipCode:
 *                            type: string
 *                  accountTimeStamp:
 *                        type: string
 *
 */

router.get(
  '/profile',
  AuthMiddleware.checkAuthentication,
  authorizeUser,
  profilePageMiddleware,
  getUserInformation
);

/**
 * @swagger
 * /api/profile:
 *   get:
 *     security:
 *        - bearerAuth: []
 *     summary: Get the user information
 *     tags: [Profile Page]
 *     produces:
 *         - application/json
 *     responses:
 *       201:
 *         description: If user is authenticated, get all the user information
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 message:
 *                   type: string
 *                   example: User profile page
 *                 data:
 *                   $ref: '#/components/schemas/UserInformation'
 *
 *       400:
 *         description: Bad request. Invalid input or User details not available
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
 *                   example: User not found
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
 *       500:
 *         description: Server error. Failed to load User profile
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
 *                   example: Oops! Couldn't load the User profile
 *                 error:
 *                   type: string
 *                   example: Error message
 */

router.patch(
  '/profile',
  AuthMiddleware.checkAuthentication,
  authorizeUser,
  profilePageMiddleware,
  updateUserInformation
);

/**
 * @swagger
 * components:
 *      schemas:
 *          UserUpdate:
 *              type: object
 *              properties:
 *                  firstname:
 *                      type: string
 *                  lastname:
 *                      type: string
 *                  profileImage:
 *                      type: array
 *                      items:
 *                          type: string
 *                  gender:
 *                      type: string
 *                  birthdate:
 *                      type: string
 *                  preferredLanguage:
 *                      type: string
 *                  preferredCurrency:
 *                      type: string
 *                  homeAddress:
 *                      type: string
 *                  billingAddress:
 *                        type: object
 *                        properties:
 *                          street:
 *                            type: string
 *                          city:
 *                            type: string
 *                          country:
 *                            type: string
 *                          poBoxNumber:
 *                            type: string
 *                          zipCode:
 *                            type: string
 *
 */

/**
 * @swagger
 * /api/profile:
 *   patch:
 *     security:
 *      - bearerAuth: []
 *     summary: This endpoint is for updating user information
 *     description: This endpoint is used to update the details of an existing user.
 *     tags: [Profile Page]
 *     requestBody:
 *       description: Update user information
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *              $ref: '#/components/schemas/UserUpdate'
 *     responses:
 *       200:
 *         description: User information updated successfully
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
 *                   $ref: '#/components/schemas/User'
 *       400:
 *         description: Bad request. Invalid input or User details not available
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
 *                   example: User not found
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
 *         description: Server error! Failed to updated user information
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
 *                 message: Oops! Couldn't update the User information
 *
 */

export default router;
