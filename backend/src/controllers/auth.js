import bcrypt from 'bcrypt';
import User from '../models/User.js';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import Session from '../models/Session.js';

const ACCESS_TOKEN_TTL = '30m';
const REFRESH_TOKEN_TTL = 14*24*60*60*1000; // 14 days in milliseconds

export const signUp = async (req, res) => {
  try {
    // GET data from req.body
    const { username, password, email, phone, firstName, lastName } = req.body;
    // check values that user not send
    if (!username || !password || !email || !firstName || !lastName) {
      return res.status(400).json({ message: 'Username, password, firstName, lastName and email are required' });
    }
    // check user in DB by username to avoid duplicate users
    const duplicateUser = await User.findOne({ username });
    if (duplicateUser) {
      return res.status(409).json({ message: 'Username already exists' });
    }
    // hash password before saving to DB
    const hashedPassword = bcrypt.hashSync(password, 10);
    // create new user in DB
    const newUser = new User({
      username,
      hashedPassword,
      email,
      phone,
      displayName: `${firstName} ${lastName}`,
    });
    // Save new user to DB
    await newUser.save();
    return res.status(201).json({ message: 'User signed up successfully' });
  } catch (error) {
    console.log("SignUp went wrong!",error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

export const signIn = async (req, res) => {
  // Implementation for user sign-in
  try {
    const { username, password } = req.body;
    // Here you would normally check the username and password against your database
    if (!username || !password) {
      return res.status(400).json({ message: 'Username and password are required' });
    }
    // check existing user in DB
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    // compare password with hashed password in DB
    const passwordMatch = await bcrypt.compare(password, user.hashedPassword);
    if (!passwordMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    // if all good, create JWT tokens
    const accessToken = jwt.sign(
      { userId: user._id }, // save user id in token payload to server recognize the user later
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: ACCESS_TOKEN_TTL }
    );
    // create refresh token
    const refreshToken = crypto.randomBytes(64).toString('hex');
    // create session in DB with refresh token
    const expiresAt = new Date(Date.now() + REFRESH_TOKEN_TTL);
    const session = new Session({
      userId: user._id,
      refreshToken,
      expiresAt,
    });
    await session.save();
    // return refresh token in cookie
    res.cookie('refreshToken', refreshToken, {
      httpOnly: true, // cookie not accessible via JavaScript
      secure: true, 
      sameSite: 'none', // backend and frontend on different domains
      maxAge: REFRESH_TOKEN_TTL,
    });
    return res.status(200).json({ message: `${user.displayName} logged in successfully`, accessToken });
  } catch (error) {
    console.log("SignIn went wrong!",error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

export const signOut = async (req, res) => {
  try {
    // get refresh token from cookie
    const token = req.cookies?.refreshToken; //req.cookies populated by cookie-parser middleware
    if (!token) {
      return res.status(400).json({ message: 'Refresh token not provided' });
    }
    // delete refresh token in session
    await Session.deleteOne({ refreshToken: token });
    // delete cookie
    res.clearCookies('refreshToken');
    return res.status(204).json({ message: 'Signed out successfully' });
  } catch (error) {
    console.log("SignOut went wrong!",error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};