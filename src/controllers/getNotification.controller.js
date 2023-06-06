/* eslint-disable linebreak-style */

import { Notification } from '../Database/models';
import asyncWrapper from '../utils/handlingTryCatchBlocks';

const getUserProfiles = asyncWrapper(async (req, res) => {
  const { id } = req.user;

  const notifications = await Notification.findAll({
    where: { userId: id },
  });

  if (notifications.length > 0) {
    return res.status(200).json(notifications);
  }
  return res.status(404).json({
    success: false,
    message: 'No notifications',
  });
});


export default getUserProfiles;
