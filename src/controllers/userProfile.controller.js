/* eslint-disable no-unused-vars */
/* eslint-disable linebreak-style */
/* eslint-disable no-undef */
/* eslint-disable linebreak-style */
import { UserProfile, User } from '../Database/models';
import asyncWrapper from '../utils/handlingTryCatchBlocks';
import userProfileSchema from '../validation/user-profile.validations';

export const theUserProfile = asyncWrapper(async (req, res) => {
  // Validate the request body against the userProfileSchema
  const { error, value } = userProfileSchema.validate(req.body);

  if (error) {
    return res.status(400).json({
      success: false,
      message: 'Invalid request body',
      errors: error.details.map((err) => err.message),
    });
  }

  const { id } = req.user;

  const user = await UserProfile.findOne({
    where: { userId: id },
  });

  if (user) {
    return res
      .status(401)
      .json({ message: 'Profile Exist' });
  }

  // Create the user profile with the validated data
  const userProfile = await UserProfile.create({
    ...value,
    userId: id
  });

  return res.status(201).json(userProfile);
});

export const getUserProfiles = asyncWrapper(async (req, res) => {
  const { id } = req.user;

  const user = await User.findOne({
    where: { id },
  });

  const userProfile = await UserProfile.findOne({
    where: { userId: id },
  });

  if (user && userProfile) {
    return res.status(200).json(userProfile);
  }
  return res.status(404).json({
    success: false,
    message: 'User profile not found',
  });
});

export const updateUserProfile = asyncWrapper(async (req, res) => {
  const { id } = req.user;

  // Find the user profile based on the user ID
  const userProfile = await UserProfile.findOne({
    where: { userId: id },
  });

  if (userProfile) {
    // Validate the request body against the userProfileSchema
    const { error, value } = userProfileSchema.validate(req.body);

    if (error) {
      return res.status(400).json({
        success: false,
        message: 'Invalid request body',
        errors: error.details.map((err) => err.message),
      });
    }

    // Update the user profile with the validated data

    const updatedDate = await userProfile.update(value);

    return res.status(200).json(userProfile);
  }
  return res.status(404).json({
    success: false,
    message: 'User not found',
  });
});

export const getUsers = asyncWrapper(async (req, res) => {
  const { id } = req.user;

  const user = await User.findOne({
    where: { id },
    attributes: ['fullname', 'email', 'createdAt', 'isEnabled', 'verified', 'enable2FA', 'isExpired'],
  });

  if (user) {
    // Split the fullname into first and last name
    const [firstName, lastName] = user.fullname.split(' ');

    // Format createdAt to include only the date and hour
    const createdAt = user.createdAt.toISOString().split('T')[0];

    return res.status(200).json({
      firstName,
      lastName,
      email: user.email,
      createdAt,
      isEnabled: user.isEnabled,
      verified: user.verified,
      enable2FA: user.enable2FA,
      isExpired: user.isExpired,
    });
  }

  return res.status(404).json({
    success: false,
    message: 'User not found',
  });
});

export const updateUser = asyncWrapper(async (req, res) => {
  const { id } = req.user;

  const user = await User.findOne({
    where: { id }
  });

  if (user) {
    // Update the user profile with the provided data
    await user.update({
      fullname: req.body.fullname,
      email: req.body.email,
    });

    return res.status(200).json(user);
  }
  return res.status(404).json({
    success: false,
    message: 'User not found',
  });
});
