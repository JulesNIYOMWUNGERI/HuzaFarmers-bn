import db from '../Database/models';
import chatSchema from '../validation/chat.validator';
import asyncWrapper from '../utils/handlingTryCatchBlocks';

const { Chats } = db;

// sending messages to the chat
export const CreatNewMessage = asyncWrapper(async (req, res) => {
  const { message } = req.body;

  // validating inputs
  const { error } = chatSchema(req.body);

  if (error) {
    return res.status(406).send(error.details[0].message);
  }

  // Creating New Chat
  const Newmessage = await Chats.create({
    message,
    sender: req.body.sender,
  });

  // Broadcasting the message to all connected users
  res.status(201).json({
    status: 'success',
    data: Newmessage,
    message: 'sent sucessfully',
  });
});

// getting all messages
export const listAllMessages = asyncWrapper(async (req, res) => {
  const allMessages = await Chats.findAll({});
  if (!allMessages) {
    res.status(200).json({
      status: 'success',
      data: allMessages,
      message: 'no message found',
    });
  }
  res.status(200).json({
    status: 'success',
    data: allMessages,
    message: 'messages',
  });
});
