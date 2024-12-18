import express from 'express';
import { login, logout, signup } from '../controllers/authController.js';
import hasTokenUser from '../policies/hasTokenUser.js';

const router = express.Router();

router.post('/signup',signup);
router.post('/login',login);
router.post('/logout',hasTokenUser,logout);

export default router;
