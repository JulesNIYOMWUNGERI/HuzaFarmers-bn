import joi from 'joi';
import { joiPasswordExtendCore } from 'joi-password';

const joiPassword = joi.extend(joiPasswordExtendCore);

const validator = (schema) => (payload) => schema.validate(payload, { abortEarly: false });

const signupSchema = joi.object({
  firstname: joi.string().required(),
  lastname: joi.string().required(),
  phoneNo: joi.string().min(10).required(),
  IDno: joi.string().min(12),
  Email: joi.string().email().required().label('email'),
  Password: joiPassword
    .string()
    .minOfLowercase(1)
    .minOfUppercase(1)
    .minOfNumeric(2)
    .noWhiteSpaces()
    .min(8)
    .alphanum()
    .required(),
  comfirmPassword: joi.ref('Password'),
  LandSize: joi.string(),
  userRole: joi.string().required(),
  adminCode: joi.string(),
});

validator(signupSchema);

export default validator(signupSchema);
