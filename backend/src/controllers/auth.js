import bcrypt from 'bcrypt';
import User from '../models/User.js';

const ACCESS_TOKEN_TTL = '30m';

export const signUp = async (req, res) => {
  try {
    const { username, password, email, phone, firstName, lastName } = req.body;

    if (!username || !password || !email || !firstName || !lastName) {
      return res.status(400).json({ message: 'Username, password, firstName, lastName and email are required' });
    }
    
    const duplicateUser = await User.findOne({ username });

    if (duplicateUser) {
      return res.status(409).json({ message: 'Username already exists' });
    }

    const hashedPassword = await bcrypt.hashSync(password, 10);
    
    const newUser = new User({
      username,
      hashedPassword,
      email,
      phone,
      displayName: `${firstName} ${lastName}`,
    });

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

    const user = await User.findOne({ username });
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const passwordMatch = await bcrypt.compare(password, user.hashedPassword);

    if (!bcrypt.compareSync(password, passwordMatch)) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const accessToken = jwt.sign(
      { userId: user._id }, // save user id in token payload to server recognize the user later
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: ACCESS_TOKEN_TTL }
    );

    res.cookie('accessToken', accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'Strict',
      maxAge: 3600000, // 1 hour
    });

    if (username === 'admin' && password === 'password') {
      res.status(200).json({ message: 'Login successful' });
    } else {
      res.status(401).json({ message: 'Invalid credentials' });
    }
  } catch (error) {
    console.log("SignIn went wrong!",error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

export const signOut = (req, res) => {
  // Implementation for user sign-out
  res.status(200).json({ message: 'User signed out successfully' });
};