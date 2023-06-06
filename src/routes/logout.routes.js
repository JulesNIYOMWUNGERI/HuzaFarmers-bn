import express from 'express';
import logout from '../controllers/logout.controller';
import AuthMiddleware from '../middlewares/login.middleware';

/**
 * @swagger
 * /api/logout:
 *   post:
 *     security:
 *      - bearerAuth: []
 *     summary: Logout the user
 *     description: Logout the user by blacklisting their token
 *     tags:
 *       - App Logout
 *     responses:
 *       200:
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 msg:
 *                   type: string
 *                   description: Logged out successfully
 *                   example: Logged out successfully
 *       400:
 *         description: Bad Request
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 msg:
 *                   type: string
 *                   description: Please sign in
 *                   example: Please sign in
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: You have been Logged Out
 *                   example: You have been Logged Out
 *       500:
 *         description: Internal Server Error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 msg:
 *                   type: string
 *                   description: Invalid token, Please sign in
 *                   example: Invalid token, Please sign in
 */

const router = express.Router();

router.post('/logout', AuthMiddleware.checkAuthentication, logout);

const app = express();

app.use(express.json());

app.use(router);

export default app;
