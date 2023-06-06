import Joi from 'joi';

const validator = schema => payload =>
  schema.validate(payload, { abortEarly: false });

const productSchema = Joi.object({
  name: Joi.string().required(),
  type: Joi.string(),
  category: Joi.string().required(),
  price: Joi.number().min(0).required(),
  image: Joi.array().items(Joi.string().trim().required()).min(4).max(8),
  quantity: Joi.number().min(0).required(),
  exDate: Joi.date().min('now').required(),
});

validator(productSchema);

export default validator(productSchema);
