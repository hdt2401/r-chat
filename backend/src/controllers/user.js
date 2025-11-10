export const getMe = async (req, res) => {
  try {
    // Assuming user info is stored in req.user after authentication middleware
    const user = req.user;
    if (!user) {
      return res.status(401).json({ message: 'Unauthorized' });
    }
    return res.status(200).json({ user });
  } catch (error) {
    console.log("GetMe went wrong!", error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};