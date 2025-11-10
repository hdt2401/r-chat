import express from 'express';
import { signUp } from '../controllers/auth.js';

const router = express.Router();

router.post('/signUp', signUp);

router.post('/login', (req, res) => {
  const { username, password } = req.body;
  // Here you would normally check the username and password against your database
  if (username === 'admin' && password === 'password') {
    res.status(200).json({ message: 'Login successful' });
  } else {
    res.status(401).json({ message: 'Invalid credentials' });
  }
});

router.post('/register', (req, res) => {
  const { username, email, password } = req.body;
  // Here you would normally create a new user in your database
  res.status(201).json({ message: 'User registered successfully' });
});

export default router;