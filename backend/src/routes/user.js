import express from 'express'; 
import { getMe, testing } from '../controllers/user.js';

const router = express.Router();

router.get('/me', getMe);

router.get('/test', testing);

export default router;