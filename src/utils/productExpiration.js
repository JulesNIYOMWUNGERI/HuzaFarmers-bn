/* eslint-disable no-await-in-loop */
/* eslint-disable no-restricted-syntax */
import sgMail from '@sendgrid/mail';
import { Op } from 'sequelize';
import { Product, User } from '../Database/models';
import eventEmitter from '../events/productExpiredEventEmit';

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const checkExpiredProducts = async () => {
  const today = new Date();
  const products = await Product.findAll({ where: { exDate: { [Op.lte]: today } } });
  for (const product of products) {
    if (!product.isExpired) {
      const seller = await User.findOne({ where: { id: product.userId } });
      const msg = {
        to: seller.email,
        from: process.env.SENDER_EMAIL, // replace with your own email address
        subject: `This product ${product.name} has expired`,
        text: `Dear seller, your product ${product.name} is expired on this date ${product.exDate}`
      };
      await sgMail.send(msg);
      await Product.update(
        { isExpired: true },
        { where: { id: product.id } },
        eventEmitter.emit('product_expiration', 'Product is expired')
      );
    } else {
      eventEmitter.emit('noProductExpired', 'There is no product reaching expired date');
    }
  }
};

export default checkExpiredProducts;
