import joi from 'joi';
// eslint-disable-next-line import/no-extraneous-dependencies
import { joiPasswordExtendCore } from 'joi-password';

const joiPassword = joi.extend(joiPasswordExtendCore);

const validator = schema => payload =>
  schema.validate(payload, { abortEarly: false });

const profileSchema = joi.object({
  firstname: joi.string(),
  lastname: joi.string(),
  email: joi.string().email(),
  gender: joi.string().min(4).max(6),
  birthdate: joi.date().max('now'),
  preferredLanguage: joi.string().min(4).max(15),
  preferredCurrency: joi.string().min(3).max(25),
  homeAddress: joi.string().min(1).max(15),
  profileImage: joi.array().items(joi.string().trim().required()).min(4).max(8),
  billingAddress: joi.object({
    street: joi.string().min(1).max(15).required(),
    city: joi.string().min(4).max(10).required(),
    country: joi.string().min(4).max(10).required(),
    poBoxNumber: joi.string().alphanum().required(),
    zipCode: joi.string().alphanum().required(),
    phoneNumber: joi.number(),
  }),
  password: joiPassword
    .string()
    .minOfLowercase(1)
    .minOfUppercase(1)
    .minOfNumeric(2)
    .noWhiteSpaces()
    .min(8)
    .alphanum(),
});

validator(profileSchema);

export default validator(profileSchema);
