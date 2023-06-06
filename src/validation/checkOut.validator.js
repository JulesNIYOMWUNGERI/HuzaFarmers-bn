import joi from 'joi';
// eslint-disable-next-line import/no-extraneous-dependencies

const validator = schema => payload =>
  schema.validate(payload, { abortEarly: false });

const orderSchema = joi.object({
  deliveryAddress: joi
    .object({
      street: joi.string().min(1).max(15).required(),
      city: joi.string().min(4).max(10).required(),
      country: joi.string().min(4).max(10).required(),
      zipCode: joi.string().alphanum().required(),
    })
    .required(),
  paymentInformation: joi
    .object({
      method: joi
        .string()
        .valid('credit card', 'debit card', 'paypal', 'mobile money', 'mpesa')
        .required(),
      details: joi
        .object({
          cardNumber: joi.string().creditCard().required(),
          expirationDate: joi
            .string()
            .pattern(/^(0[1-9]|1[0-2])\/\d{2}$/)
            .required(),
          cvv: joi.string().length(3).required(),
        })
        .required(),
    })
    .required(),
});

validator(orderSchema);

export default validator(orderSchema);
