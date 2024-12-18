import express from 'express';
import { getUsers } from '../controllers/userController.js';
import hasTokenUser from '../policies/hasTokenUser.js';

const router = express.Router();

router.get('/',hasTokenUser,getUsers)

export default router;