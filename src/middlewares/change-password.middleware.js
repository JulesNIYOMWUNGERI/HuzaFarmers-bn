import { User } from '../Database/models';
import { hashPassword, comparePassword } from '../utils/user.util';

const changePasswordMiddleware = async (req, res, next) => {
  const { id } = req.params;
  const { currentPassword, newPassword } = req.body;

  // GET USER BY ID
  const user = await User.findOne({ where: { id } });

  if (!user) {
    return res.status(404).json({ status: 'error', message: 'User not found' });
  }

  // CHECK IF ID IS FORM USER WHO LOGGED IN
  if (user.id !== req.user.id) {
    return res.status(403).json({
      status: 'error',
      message: 'Unautholized',
    });
  }

  // CHECK IF PASSWORD PROVIDED IS SAME AS ONE CURRENT BEING USED
  const comparedPassword = await comparePassword(
    currentPassword,
    req.user.password
  );
  if (!comparedPassword) {
    return res.status(401).json({ message: 'Current Password is incorrect' });
  }

  // AVOID USER TO USE THE SAME PASSWORD
  if (currentPassword === newPassword) {
    return res.status(400).json({
      status: 'error',
      message: 'New Password can not be same as old Password',
    });
  }

  // HASH NEW PASSWORD BEFORE IT SAVED
  const hashedPassword = await hashPassword(newPassword);
  if (hashedPassword) {
    req.user = user;
    req.hashedPassword = hashedPassword;
    next();
  }
};

export default changePasswordMiddleware;
