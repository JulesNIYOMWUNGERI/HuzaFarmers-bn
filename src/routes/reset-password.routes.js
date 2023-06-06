import express from 'express';
import {
  requestPasswordReset,
  resetPassword,
} from '../controllers/reset-password.controller';

const router = express.Router();

router.post('/requestPasswordReset', requestPasswordReset);
/**
 * @swagger
 * /api/requestPasswordReset:
 *   post:
 *     summary: Request password reset
 *     description: Sends a password reset email to the user's email address.
 *     tags:
 *       - Reset User Password
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 example: ruberwa3@gmail.com
 *     responses:
 *       200:
 *         description: Password reset email sent
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Password reset email sent
 *       404:
 *         description: User not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: User not found
 */

router.post('/reset-password/:id', resetPassword);
/**
 * @swagger
 *
 * /api/reset-password:
 *   post:
 *     summary: Reset user password.
 *     description: Reset user password using a user ID and new password.
 *     tags:
 *       - Reset User Password
 *     parameters:
 *       - name: id
 *         in: path
 *         description: ID of the user to update
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       description: Reset password request body.
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - newPassword
 *             properties:
 *               userId:
 *                 type: integer
 *                 description: The ID of the user to reset the password for.
 *               newPassword:
 *                 type: string
 *                 description: The new password for the user.
 *     responses:
 *       '200':
 *         description: Password reset successfully.
 *       '400':
 *         description: Bad request.
 *       '404':
 *         description: User not found.
 */

export default router;
