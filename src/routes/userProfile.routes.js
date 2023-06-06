/* eslint-disable linebreak-style */
import Router from 'express';
import {
  theUserProfile, getUserProfiles, getUsers, updateUserProfile, updateUser
} from '../controllers/userProfile.controller';
import { authorizeUser } from '../middlewares/userRoles.middleware';

const router = Router();

router.post('/post-user-profile', authorizeUser, theUserProfile);
router.get('/get-user-profile', authorizeUser, getUserProfiles);
router.put('/update-user-profile', authorizeUser, updateUserProfile);

router.get('/get-user', authorizeUser, getUsers);
router.put('/update-user', authorizeUser, updateUser);

// ====== COMPONENTS
/**
 * @swagger
 *  components:
 *      securitySchemes:
 *        bearerAuth:
 *          type: http
 *          scheme: bearer
 *          bearerFormat: JWT
 *      schemas:
 *          UserProfile:
 *              type: object
 *              properties:
 *                  gender:
 *                      type: string
 *                  birthdate:
 *                      type: string
 *                      format: date
 *                  preferredLanguage:
 *                      type: string
 *                  preferredCurrency:
 *                      type: string
 *                  homeAddress:
 *                      type: string
 *                  street:
 *                      type: string
 *                  city:
 *                      type: string
 *                  country:
 *                      type: string
 *                  poBoxNumber:
 *                      type: string
 *                  zipCode:
 *                      type: string
 *                  phoneNumber:
 *                      type: string
 *                  profileImage:
 *                      type: string
 */

// ====== SWAGGER - CREATING PROFILE

/**
 * @swagger
 * /api/post-user-profile:
 *   post:
 *     security:
 *      - bearerAuth: []
 *     summary: This API is for creating a user profile
 *     description: Create a new user profile.
 *     tags:
 *       - UserProfile
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UserProfile'
 *     responses:
 *       201:
 *         description: User profile created successfully
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
 *                   $ref: '#/components/schemas/UserProfile'
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
 *                 errors:
 *                   type: array
 *                   items:
 *                     type: string
 *                   description: validation error messages
 *       500:
 *         description: Failed to create user profile
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

// ====== SWAGGER - GET USER PROFILE
/**
 * @swagger
 * /api/get-user-profile:
 *   get:
 *     security:
 *      - bearerAuth: []
 *     summary: This API is for retrieving a user profile
 *     description: Retrieve the user profile of the authenticated user.
 *     tags:
 *       - UserProfile
 *     responses:
 *       200:
 *         description: User profile retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UserProfile'
 *       404:
 *         description: User or user profile not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   enum: [false]
 *                 message:
 *                   type: string
 *                   description: error message
 */

// SWAGGER  UPDATE - USER PROFILE
/**
 * @swagger
 * /api/update-user-profile:
 *   put:
 *     security:
 *      - bearerAuth: []
 *     summary: This API is for updating a user profile
 *     description: Update the user profile of the authenticated user.
 *     tags:
 *       - UserProfile
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UserProfile'
 *     responses:
 *       200:
 *         description: User profile updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UserProfile'
 *       400:
 *         description: Invalid request body
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   enum: [false]
 *                 message:
 *                   type: string
 *                   description: error message
 *                 errors:
 *                   type: array
 *                   items:
 *                     type: string
 *       404:
 *         description: User profile not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   enum: [false]
 *                 message:
 *                   type: string
 *                   description: error message
 */

// GET USER
/**
 * @swagger
 * /api/get-user:
 *   get:
 *     security:
 *      - bearerAuth: []
 *     summary: This API is for retrieving user information
 *     description: Retrieve the information of the authenticated user.
 *     tags:
 *       - UserProfile
 *     responses:
 *       200:
 *         description: User information retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 firstName:
 *                   type: string
 *                   description: First name of the user
 *                 lastName:
 *                   type: string
 *                   description: Last name of the user
 *                 email:
 *                   type: string
 *                   description: Email address of the user
 *                 createdAt:
 *                   type: string
 *                   description: Creation date of the user (formatted as YYYY-MM-DD)
 *       404:
 *         description: User not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   enum: [false]
 *                 message:
 *                   type: string
 *                   description: Error message
 */

// UPDATE USER
/**
 * @swagger
 * /api/update-user:
 *   put:
 *     security:
 *      - bearerAuth: []
 *     summary: This API is for updating user information
 *     description: Update the information of the authenticated user.
 *     tags:
 *       - UserProfile
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               fullname:
 *                 type: string
 *                 description: Full name of the user
 *     responses:
 *       200:
 *         description: User information updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                   description: ID of the updated user
 *                 firstName:
 *                   type: string
 *                   description: Updated first name of the user
 *                 lastName:
 *                   type: string
 *                   description: Updated last name of the user
 *                 updatedAt:
 *                   type: string
 *                   description: Date and time of the update
 *       404:
 *         description: User not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   enum: [false]
 *                 message:
 *                   type: string
 *                   description: Error message
 */

export default router;
