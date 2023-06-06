import express from 'express';
import disableAccount from '../controllers/disableAccount.controller';
import { authorizeAdmin } from '../middlewares/userRoles.middleware';
import AuthMiddleware from '../middlewares/login.middleware';

const router = express.Router();
/**
 * @swagger
 * components:
 *   schemas:
 *     DisableAccount:
 *       $ref: '#/components/schemas/User'
 *
 */

/**
 * @swagger
 * /api/disableAccount/{id}:
 *   patch:
 *     security:
 *      - bearerAuth: []
 *     summary: This API is for disabling account
 *     description: This API is used to disable an existing account by user ID.
 *     tags:
 *       - User
 *     parameters:
 *       - name: id
 *         in: path
 *         description: ID of the user tobe disable or enable
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       description: Disable fields for isEnabled status
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/DisableAccount'
 *     responses:
 *       200:
 *         description: User disabled successfully
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
 *       404:
 *         description: UserID not found
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
 *                 message: UserID not found
 *       500:
 *         description: Failed to disable an account
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
 *                 message: Failed to disable an account
 *
 */
router.patch(
  '/disableAccount/:id',
  AuthMiddleware.checkAuthentication,
  authorizeAdmin,
  disableAccount
);

export default router;
