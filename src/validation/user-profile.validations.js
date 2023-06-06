/* eslint-disable linebreak-style */
import joi from 'joi';

const userProfileSchema = joi.object({
  gender: joi.string().valid('Male', 'Female', 'Other'),
  birthdate: joi.string(),
  preferredLanguage: joi.string(),
  preferredCurrency: joi.string(),
  homeAddress: joi.string(),
  street: joi.string(),
  city: joi.string(),
  country: joi.string(),
  poBoxNumber: joi.string(),
  zipCode: joi.string(),
  phoneNumber: joi.string(),
  profileImage: joi.string().uri(),
  userId: joi.number().integer()
});

export default userProfileSchema;
