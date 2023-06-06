/* eslint-disable linebreak-style */
/* eslint-disable no-unused-vars */
import db from '../Database/models';
import asyncWrapper from '../utils/handlingTryCatchBlocks';

const { Notification } = db;

export const readNotification = asyncWrapper(async (req, res) => {
  const { id } = req.params;
  const userId = req.user.id;

  const singleNotification = await Notification.findOne({
    where: {
      id, userId, isRead: false
    }
  });

  if (!singleNotification) {
    return res.status(404).json({ message: 'There is no Notification' });
  }

  singleNotification.isRead = req.body.isRead;

  singleNotification.save();

  return res.status(200).json({
    status: 'success',
    message: 'successfully read the notification!',
    data: singleNotification
  });
});

export const readAllNotification = asyncWrapper(async (req, res) => {
  const userId = req.user.id;

  const allNotifications = await Notification.findAll({
    where: {
      userId,
      isRead: false
    }
  });

  if (allNotifications.length === 0) {
    return res.status(404).json({ message: 'you have allready read all your notifications' });
  }

  allNotifications.forEach((notification) => {
    notification.isRead = req.body.isRead;

    notification.save();
  });

  return res.status(200).json({
    status: 'success',
    message: 'successfully read the notification!',
    data: allNotifications
  });
});
