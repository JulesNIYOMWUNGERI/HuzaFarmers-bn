import express from 'express';
import fetchAllUsers from '../controllers/get-users';
import { authorizeAdmin } from '../middlewares/userRoles.middleware';

const router = express.Router();

// get all Users
router.get('/fetchUsers', authorizeAdmin, fetchAllUsers);

export default router;
