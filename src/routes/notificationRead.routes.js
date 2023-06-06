import express from 'express';
import { readNotification, readAllNotification } from '../controllers/notificationRead.controller';
import { authorizeUser } from '../middlewares/userRoles.middleware';

const router = express.Router();

/**
 * @swagger
 *  components:
 *      schemas:
 *          Notification:
 *              type: object
 *              properties:
 *                  status:
 *                      type: string
 *                  message:
 *                      type: string
 *                  data:
 *                      type: object
 *                      properties:
 *                          id:
 *                              type: integer
 *                          userId:
 *                              type: string
 *                          message:
 *                              type: string
 *                          isRead:
 *                              type: boolean
 *                          createdAt:
 *                              type: string
 *                          updatedAt:
 *                              type: string
 *          Mark:
 *              type: object
 *              properties:
 *                  isRead:
 *                      type: boolean
 */

/**
 * @swagger
 * /api/singleNotification/{id}:
 *  post:
 *      summary: Mark one notification as read
 *      description: This api is used to mark one notification as read
 *      parameters:
 *       - name: id
 *         in: path
 *         description: Id of the notification you want to mark
 *         schema:
 *             type: integer
 *      tags:
 *        - Notifications
 *      security:
 *        - bearerAuth: []
 *      requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Mark'
 *      responses:
 *          200:
 *              description: This api is for marking one notification as read
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: array
 *                          items:
 *                              $ref: '#components/schemas/Notification'
 */

router.post('/singleNotification/:id', authorizeUser, readNotification);

/**
 * @swagger
 * /api/allNotifications:
 *  post:
 *      summary: Mark all notifications as read
 *      description: This api is used to mark all notifications as read
 *      tags:
 *        - Notifications
 *      security:
 *        - bearerAuth: []
 *      requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Mark'
 *      responses:
 *          200:
 *              description: This api is for marking all notifications as read
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: array
 *                          items:
 *                              $ref: '#components/schemas/Notification'
 */

router.post('/allNotifications', authorizeUser, readAllNotification);

export default router;
