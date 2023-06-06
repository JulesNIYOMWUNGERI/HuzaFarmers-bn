import joi from 'joi';

const validator = schema => payload =>
  schema.validate(payload, { abortEarly: false });

const paymentCardShema = joi.object({
  card: joi
    .object({
      number: joi.string().creditCard().required(),
      exp_month: joi.number().required(),
      exp_year: joi.number().required(),
      cvc: joi.string().required(),
    })
    .required(),
});

validator(paymentCardShema);

export default validator(paymentCardShema);
