/* eslint-disable no-unused-vars */
import speakeasy from 'speakeasy';
import client from '../utils/redis.util';
import db from '../Database/models';
import asyncWrapper from '../utils/handlingTryCatchBlocks';

const { User } = db;

export const enable2FAForMerchants = asyncWrapper(async (req, res) => {
  const existingUser = await User.findByPk(req.user.id);
  if (existingUser.enable2FA) {
    return res
      .status(409)
      .json({ message: 'Two Factor Authentication is already enabled' });
  }
  await User.update(
    {
      enable2FA: true,
    },
    {
      where: {
        id: existingUser.id,
      },
    }
  );
  return res.status(200).json({ message: 'Two Factor Authentication enabled' });
});

export const generateOTPCode = (secretKey) => {
  const code = speakeasy.time({
    secret: secretKey,
    encoding: 'base32',
    step: 300,
  });
  return code;
};
export const generateSecretKey = () => {
  const secretKey = speakeasy.generateSecret({
    name: process.env.TWO_FACTOR_AUTH_NAME,
  });
  return {
    base32: secretKey.base32,
  };
};

export const disable2FAForMerchants = asyncWrapper(async (req, res) => {
  const existingUser = await User.findByPk(req.user.id);
  if (!existingUser.enable2FA) {
    return res
      .status(409)
      .json({ message: 'Two Factor Authentication is not ON' });
  }
  await User.update(
    {
      enable2FA: false,
      checkTwoFactor: false,
    },
    {
      where: {
        id: existingUser.id,
      },
    }
  );
  return res
    .status(200)
    .json({ message: 'Two Factor Authentication has been disabled' });
});

export const verify2FAkey = asyncWrapper(async (req, res) => {
  const existingUser = await User.findByPk(req.id);
  if (!existingUser.enable2FA) {
    return res
      .status(409)
      .json({ message: 'Two Factor Authentication is not ON' });
  }
  const key = req.body.code.trim();
  if (!key) {
    return res
      .status(400)
      .json({ message: 'Please provide the code sent to you on email' });
  }
  const result = await client.get(existingUser.email, (err, value) => {
    if (err) {
      return res.status(500).json({ message: 'Error' });
    }
  });
  if (result) {
    const codeFromRedis = result.split('=')[0];
    if (key === codeFromRedis) {
      client.del(existingUser.email);
      await User.update(
        {
          checkTwoFactor: true,
        },
        {
          where: {
            id: existingUser.id,
          },
        }
      );
      const userData = {
        id: existingUser.id,
        fullname: existingUser.fullname,
        email: existingUser.email,
        role: existingUser.role
      };
      return res
        .status(200)
        .json({ message: 'Two Factor Authentication has been verified', userData });
    }
    return res.status(403).json({
      message:
        'Two Factor Authentication has not been verified, Please provide the right OTP code',
    });
  }
  return res
    .status(400)
    .json({ message: 'Please login again to receive an OTP code' });
});
