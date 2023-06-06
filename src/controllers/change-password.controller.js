import 'dotenv/config';
import asyncWrapper from '../utils/handlingTryCatchBlocks';

const modifyPassword = asyncWrapper(async (req, res) => {
  const { hashedPassword, user } = req;

  user.password = hashedPassword;

  await user.save();
  return res.status(200).json({ message: 'Password changed successfully' });
});

export default modifyPassword;
