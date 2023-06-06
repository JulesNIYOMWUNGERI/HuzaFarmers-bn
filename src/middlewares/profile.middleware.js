/* eslint-disable no-unused-vars */
/* eslint-disable no-restricted-globals */
import { users } from '../Database/models';
import validateProfile from '../validation/profile.validator';
import asyncWrapper from '../utils/handlingTryCatchBlocks';

const profilePageMiddleware = async (req, res, next) => {
  const dbUser = req.user;

  const newUserInfo = req.body;

  const { error } = validateProfile(req.body);

  if (error) {
    return res.status(400).json({
      status: 'error',
      message: 'Invalid Input',
      data: error.details[0].message,
    });
  }

  let fullname;

  if (newUserInfo.firstname && newUserInfo.lastname) {
    fullname = `${newUserInfo.firstname} ${newUserInfo.lastname}`;
    newUserInfo.fullname = fullname;
  } else if (
    (!newUserInfo.firstname && newUserInfo.lastname) ||
    (newUserInfo.firstname && !newUserInfo.lastname)
  ) {
    return res.status(400).json({
      status: 'error',
      message:
        'Invalid Input! Kindly enter both the first and last name to proceed.',
    });
  }

  req.user = dbUser;
  req.userId = dbUser.id;
  req.newUserInfo = newUserInfo;
  next();
};

export default profilePageMiddleware;
