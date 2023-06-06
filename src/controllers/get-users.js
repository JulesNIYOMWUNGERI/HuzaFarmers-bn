import asyncWrapper from '../utils/handlingTryCatchBlocks';
import db from '../Database/models';

const { User } = db;

const fetchAllUsers = asyncWrapper(async (req, res) => {
  const users = await User.findAll({
    attributes: ['id', 'fullname', 'email', 'role', 'enable2FA', 'profileImage', 'createdAt'],
  });

  if (!users) {
    return res.status(404).json({ message: 'there is an error' });
  }

  return res.status(200).json(users);
});

export default fetchAllUsers;
