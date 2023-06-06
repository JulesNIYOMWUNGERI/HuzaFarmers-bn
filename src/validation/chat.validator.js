import joi from 'joi';

const validator = (schema) => (payload) => schema.validate(payload, { abortEarly: false });

const chatSchema = joi.object({
  message: joi.string().required(),
  sender: joi.string().required(),
});

validator(chatSchema);

export default validator(chatSchema);
