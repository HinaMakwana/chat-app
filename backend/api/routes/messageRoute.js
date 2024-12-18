import express from 'express';
import { getMessages, sendMessage } from '../controllers/messageController.js';
import hasTokenUser from '../policies/hasTokenUser.js';

const router = express.Router();

router.post('/send',hasTokenUser,sendMessage);
router.get('/get/:id', hasTokenUser, getMessages);

export default router;