import express from 'express';
import { signUp, signIn, signOut, refreshToken } from '../controllers/auth.js';

const router = express.Router();

router.post('/signUp', signUp);

router.post('/signIn', signIn);

router.post('/signOut', signOut);

router.post('/refresh', refreshToken);

export default router;