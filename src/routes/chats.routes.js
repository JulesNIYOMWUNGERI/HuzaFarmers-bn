import express from 'express';
import {
  CreatNewMessage,
  listAllMessages,
} from '../controllers/chats.controller';
import { authorizeUser } from '../middlewares/userRoles.middleware';

const router = express.Router();

/**
 * @swagger
 *  components:
 *      schemas:
 *          Broadcast:
 *              type: object
 *              properties:
 *                  status:
 *                      type: string
 *                  data:
 *                      type: object
 *                      properties:
 *                          id:
 *                              type: integer
 *                          message:
 *                              type: string
 *                          sender:
 *                              type: string
 *                          createdAt:
 *                              type: string
 *                          updatedAt:
 *                              type: string
 *                  message:
 *                      type: string
 *          Chat:
 *              type: object
 *              properties:
 *                  message:
 *                      type: string
 *                  sender:
 *                      type: string
 */

/**
 * @swagger
 * /api/chat:
 *  post:
 *      summary: Chatting on the platform
 *      description: This api is used to chat on the platform
 *      tags:
 *        - Chat
 *      security:
 *        - bearerAuth: []
 *      requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Chat'
 *      responses:
 *          201:
 *              description: This api is for chatting on the platform
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: array
 *                          items:
 *                              $ref: '#components/schemas/Broadcast'
 */

router.post('/chat', authorizeUser, CreatNewMessage);

/**
 * @swagger
 * /api/allChat:
 *  get:
 *      summary: Get all chats
 *      description: This api is used to get all chats
 *      tags:
 *        - Chat
 *      security:
 *        - bearerAuth: []
 *      responses:
 *          200:
 *              description: This api is for getting all chats
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: array
 *                          items:
 *                              $ref: '#components/schemas/Broadcast'
 */

router.get('/allChat', authorizeUser, listAllMessages);

export default router;
