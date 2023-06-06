/* eslint-disable linebreak-style */
import Router from 'express';
import getUserProfiles from '../controllers/getNotification.controller';
import { authorizeUser } from '../middlewares/userRoles.middleware';

const router = Router();
router.get('/get-notification', authorizeUser, getUserProfiles);

export default router;
