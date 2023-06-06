import joi from 'joi';

const validator = schema => payload =>
  schema.validate(payload, { abortEarly: false });

const searchQuery = joi.object({
  name: joi.string(),
  category: joi.string(),
  minPrice: joi.number().min(0),
  maxPrice: joi.number().min(joi.ref('minPrice')),
});

validator(searchQuery);

export default validator(searchQuery);
