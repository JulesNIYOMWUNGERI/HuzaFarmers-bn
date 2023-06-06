/* eslint-disable linebreak-style */
/* eslint-disable no-unused-vars */
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import sgMail from '@sendgrid/mail';
import db from '../Database/models';
import validateSignup from '../validation/signup.validator';
import asyncWrapper from '../utils/handlingTryCatchBlocks';
import ROLES_LIST from '../utils/userRoles.util';
import { generateToken, hashPassword } from '../utils/user.util';
import sendMail from '../utils/sendEmail.util';

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const { User, signUpToken } = db;

// create and save new user
export const createUser = asyncWrapper(async (req, res) => {
  const { Email } = req.body;
  const { error } = validateSignup(req.body);

  if (error) {
    return res.status(406).send(error.details[0].message);
  }

  const existingUser = await User.findOne({ where: { Email } });

  if (existingUser) {
    return res
      .status(401)
      .json({ message: 'Email already used, please use different email.' });
  }

  const hashedPassword = await hashPassword(req.body.Password);

  const { userRole } = req.body;

  const newRole = ROLES_LIST[userRole];

  const user = {
    FistName: req.body.firstname,
    LastName: req.body.lastname,
    PhoneNo: req.body.phoneNo,
    IDno: req.body.IDno,
    Email: req.body.Email,
    Password: hashedPassword,
    LandSize: req.body.LandSize,
    role: JSON.stringify(newRole),
  };

  User.create(user).then(async (data) => {
    const verifyToken = await signUpToken.create({
      userId: data.id,
      token: crypto.randomBytes(32).toString('hex')
    });

    const url = `${process.env.BASE_URL}users/${data.id}/verify/${verifyToken.token}`;

    const recipient = {
      recipientEmail: data.Email,
      emailSubject: 'Verify Email',
      emailBody: url,
    };
    // await sgMail.send(recipient);

    await sendMail(recipient);

    const token = await generateToken(data);
    return res
      .status(200)
      .header('authenticate', token)
      .json({ message: 'An Email sent to your account please verify', token, verifyToken });
  });
});

export const verifyUser = asyncWrapper(async (req, res) => {
  const user = await User.findByPk(req.params.id);

  if (!user) {
    return res.status(404).json({ message: 'Invalid link, user not found' });
  }

  const token = await signUpToken.findOne({
    where: {
      userId: user.id,
      token: req.params.token
    }
  });

  if (!token) {
    return res.status(404).json({ message: 'Invalid link, token not found' });
  }
  await User.update({ verified: true }, {
    where: {
      id: user.id
    }
  });
  await token.destroy();

  return res.status(200).json({ message: 'Email verified successfully' });
});
