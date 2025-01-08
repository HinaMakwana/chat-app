import express from 'express';
import { clearChat, deleteMessage, getMessages, sendMessage } from '../controllers/messageController.js';
import hasTokenUser from '../policies/hasTokenUser.js';

const router = express.Router();

router.post('/send',hasTokenUser,sendMessage);
router.get('/get/:id', hasTokenUser, getMessages);
router.post('/delete/:id',hasTokenUser,deleteMessage);
router.post('/clear/chat/:id',hasTokenUser,clearChat);

export default router;