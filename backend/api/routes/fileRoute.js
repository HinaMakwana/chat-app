import express from 'express';
import { uploadFile} from '../controllers/fileController.js';
import hasTokenUser from '../policies/hasTokenUser.js';
import {upload} from '../../config/multer.js'

const router = express.Router();

router.post('/upload',upload.array('file',10),hasTokenUser,uploadFile);

export default router;