/* eslint-disable linebreak-style */
/* eslint-disable no-unused-vars */
import { users } from '../Database/models';
import asyncWrapper from '../utils/handlingTryCatchBlocks';

// Get user information
export const getUserInformation = asyncWrapper(async (req, res) => {
  const { user } = req;

  res.status(200).json({
    status: 'success',
    'User info': {
      name: user.fullname,
      profileImage: user.profileImage,
      email: user.email,
      gender: user.gender,
      birthdate: user.birthdate,
      language: user.language,
      currency: user.currency,
      homeAddress: user.homeAddress,
      billingAddress: user.billingAddress,
      accountTimeStamp: user.createdAt,
    },
  });
});

// Update user information
export const updateUserInformation = asyncWrapper(async (req, res) => {
  const { user, userId, newUserInfo } = req;

  const dbUser = await users.findByPk(userId);

  await dbUser.update({
    fullname: newUserInfo.fullname,
    profileImage: newUserInfo.profileImage,
    gender: newUserInfo.gender,
    birthdate: newUserInfo.birthdate,
    preferredLanguage: newUserInfo.preferredLanguage,
    preferredCurrency: newUserInfo.preferredCurrency,
    homeAddress: newUserInfo.homeAddress,
    billingAddress: newUserInfo.billingAddress,
  });

  res.status(200).json({
    status: 'success',
    message: 'User information updated successfully',
    userInfo: {
      name: dbUser.fullname,
      profileImage: dbUser.profileImage,
      email: dbUser.email,
      gender: dbUser.gender,
      birthdate: dbUser.birthdate,
      language: dbUser.language,
      currency: dbUser.currency,
      homeAddress: dbUser.homeAddress,
      billingAddress: dbUser.billingAddress,
      accountTimeStamp: dbUser.createdAt,
    },
  });
});
