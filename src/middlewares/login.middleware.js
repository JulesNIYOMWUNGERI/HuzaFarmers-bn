/* eslint-disable require-jsdoc */
import { verifyToken } from '../utils/user.util';

class AuthMiddleware {
  static blacklist = [];

  static async checkAuthentication(req, res, next) {
    try {
      const token = req.headers.authorization.split(' ')[1];
      // console.log(req.headers)
      if (!token) {
        return res.status(400).json({
          error: 'error',
          msg: 'Please sign in!',
        });
      }
      const data = await verifyToken(token);
      if (!data) {
        return res.status(500).json({ msg: 'Invalid token, Please sign in!' });
      }
      if (AuthMiddleware.blacklist.includes(token)) {
        return res.status(401).json({ msg: 'You have been Logged Out!' });
      }
      req.id = data.id;
      req.data = data;
      next();
    } catch (error) {
      return res.status(500).json({
        status: 'error',
        msg: 'Something went wrong, Invalid token',
      });
    }
  }
}

export default AuthMiddleware;
