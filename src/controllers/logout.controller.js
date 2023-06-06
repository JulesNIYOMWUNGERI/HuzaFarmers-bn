/* eslint-disable import/no-cycle */
import jwt from 'jsonwebtoken';
import AuthMiddleware from '../middlewares/login.middleware';
import { User } from '../Database/models';

const verifyToken = (token, secretKey) => {
  try {
    const decoded = jwt.verify(token, secretKey);
    return decoded;
  } catch (error) {
    return null;
  }
};

const logout = async (req, res) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(400).json({ msg: 'Please sign in!' });
  }
  const token = authHeader.split(' ')[1];
  const secretKey = process.env.USER_SECRET_KEY;
  const decoded = verifyToken(token, secretKey);
  if (!decoded) {
    return res.status(401).json({ msg: 'Invalid token' });
  }
  await User.update(
    {
      checkTwoFactor: false,
    },
    {
      where: {
        id: decoded.id,
      },
    }
  );
  AuthMiddleware.blacklist.push(token);
  return res.status(200).json({ msg: 'Logged out successfully' });
};

export default logout;
