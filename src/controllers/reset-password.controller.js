import bcrypt from 'bcryptjs';
import sgMail from '@sendgrid/mail';
import db from '../Database/models';
import asyncWrapper from '../utils/handlingTryCatchBlocks';

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

// Password Reset
export const requestPasswordReset = asyncWrapper(async (req, res) => {
  const { email } = req.body;

  // Check if user exists
  const user = await db.User.findOne({ where: { email } });
  if (!user) {
    return res.status(404).json({ message: 'User not found' });
  }

  // Generate password reset link
  const resetLink = `${process.env.RESET_URL}/${user.id}`;

  // Set expiration time
  const expires = new Date();
  expires.setHours(expires.getHours() + 1); // set expiration to 1 hour from now

  // Send password reset email
  const msg = {
    to: email,
    from: process.env.SENDER_EMAIL, // replace with your own email address
    subject: 'Password reset request',
    text: `To reset your password, click on this link: ${resetLink}`,
  };
  await sgMail.send(msg);

  res.json({ message: 'Password reset email sent' });
});

export const resetPassword = asyncWrapper(async (req, res) => {
  const userId = req.params.id;
  const { newPassword } = req.body;

  if (!newPassword) {
    return res.status(500).json({ message: 'New password is required' });
  }

  // Check if user exists
  const user = await db.User.findOne({ where: { id: userId } });
  if (!user) {
    return res.status(404).json({ message: 'User not found' });
  }

  // Update password
  const hashedPassword = await bcrypt.hash(newPassword, 10);
  await db.User.update(
    { password: hashedPassword },
    { where: { id: user.id } },
  );

  res.json({ message: 'Password reset successfully' });
});
