/* eslint-disable linebreak-style */
import { EventEmitter } from 'events';
import socketIOClient from 'socket.io-client';
import {
  ProductStatus, Product, User, Notification
} from '../Database/models';
import sendMail from '../utils/sendEmail.util';

const templateHeader = `<table style="border-collapse:collapse;border-spacing:0;width:100%;min-width:100%" width="100%" height="auto" cellspacing="0" cellpadding="0" bgcolor="#F0F0F0">
<tbody><tr>
<td style="padding-top:54px;padding-bottom:42px" align="center">
<h2 style="color:#0090c6;font-size: xx-large;">E-commmerce App Notification</h2>
</td>
</tr>
</tbody></table>`;

const templateFooter = `<h3>Best regards,</h3>
<h5><i>Team Furebo E-commerce project team</i></h5>`;

const socket = socketIOClient(process.env.DEPLOYED_URL);

export const emitProductAddedEvent = async (product, merchant) => {
  const productId = product.id;
  const createdProductStatus = await ProductStatus.create({
    productId,
    status: 'created'
  });
  const recipient = {
    recipientEmail: merchant.email,
    emailSubject: 'Product creation',
    emailBody: `${templateHeader} <p><h5>Dear ${merchant.fullname}, </h5>
          We are pleased to inform you that your product has been successfully created with id <b>${productId}</b>.
          Your product is now visible to our users and we hope that it receives positive responses from potential buyers. 
          Please ensure that you have provided accurate information about your product, including its features, images, and pricing.
          If you have any questions or concerns, please don't hesitate to contact us.
          We are always here to support you and ensure that your experience on our platform is a pleasant one.
          </p>
          <p>Thank you again for choosing our platform.</p>
           ${templateFooter}`
  };
  const checkEmail = await sendMail(recipient);
  if (checkEmail) {
    const message = `Product ${product.name} has been created`;
    const notification = await Notification.create({
      userId: merchant.id,
      message,
    });
    socket.emit('notification', {
      message: `Product ${createdProductStatus.status}`,
      userId: merchant.id
    });
    return notification;
  }
};

export const emitProductUpdatedEvent = async (product, merchant) => {
  const createdProductStatus = await ProductStatus.create({
    productId: product.id,
    status: 'updated'
  });
  const recipient = {
    recipientEmail: merchant.email,
    emailSubject: 'Product updated',
    emailBody: `${templateHeader} <p><h5>Dear ${merchant.fullname}, </h5>
    We are pleased to inform you that your product has been successfully updated with id <b>${product.id}</b>.
    Your product is now visible to our users and we hope that it receives positive responses from potential buyers. 
    Please ensure that you have provided accurate information about your product, including its features, images, and pricing.
    If you have any questions or concerns, please don't hesitate to contact us.
    We are always here to support you and ensure that your experience on our platform is a pleasant one.
    </p>
    <p>Thank you again for choosing our platform.</p>
     ${templateFooter}`
  };

  const checkEmail = await sendMail(recipient);
  if (checkEmail) {
    const message = `Product ${product.name} has been updated`;
    const notification = await Notification.create({
      userId: merchant.id,
      message,
    });
    socket.emit('notification', {
      message: `Product ${createdProductStatus.status}`,
      userId: merchant.id
    });
    return notification;
  }
};

export const emitProductRemovedEvent = async (product, merchant) => {
  const createdProductStatus = await ProductStatus.create({
    productId: product.id,
    status: 'removed'
  });
  const recipient = {
    recipientEmail: merchant.email,
    emailSubject: 'Product Removed',
    emailBody: `${templateHeader} <p><h5>Dear ${merchant.fullname}, </h5>
          We are pleased to inform you that your product with id <b>${product.id}</b> has been successfully deleted.
          Your product is now off the list of available products.
          If you have any questions or concerns, please don't hesitate to contact us.
          We are always here to support you and ensure that your experience on our platform is a pleasant one.
          </p>
          <p>Thank you again for choosing our platform.</p>
           ${templateFooter}`
  };
  const checkEmail = await sendMail(recipient);
  if (checkEmail) {
    const message = `Product ${product.name} has been removed`;
    const notification = await Notification.create({
      userId: merchant.id,
      message,
    });
    socket.emit('notification', {
      message: `Product ${createdProductStatus.status}`,
      userId: merchant.id
    });
    return notification;
  }
};

export const emitProductPurchasedEvent = async (data, user) => {
  const recipientUser = {
    recipientEmail: user.email,
    emailSubject: 'Products purchased',
    emailBody: `${templateHeader} <p><h5>Dear ${user.fullname}, </h5>
      we would like to notify you that you have successfully purchased all items with the order id of <b>${data.id}</b>.
      If you have any questions or concerns, please don't hesitate to contact us.
      We are always here to support you and ensure that your experience on our platform is a pleasant one.
      </p>
      <p>Thank you again for choosing our platform.</p>
       ${templateFooter}`
  };
  const checkUserEmail = await sendMail(recipientUser);
  data.products.forEach(async (element) => {
    const createdProductStatus = await ProductStatus.create({
      productId: element.productId,
      status: 'purchased'
    });
    const product = await Product.findOne({
      where: { id: element.productId }
    });
    const merchant = await User.findOne({
      where: { id: product.userId }
    });
    const recipientMerchant = {
      recipientEmail: merchant.email,
      emailSubject: 'Product purchased',
      emailBody: `${templateHeader} <p><h5>Dear ${merchant.fullname}, </h5>
        we would like to notify you that your product with id <b>${element.productId}</b> has been purchased.
        If you have any questions or concerns, please don't hesitate to contact us.
        We are always here to support you and ensure that your experience on our platform is a pleasant one.
        </p>
        <p>Thank you again for choosing our platform.</p>
         ${templateFooter}`
    };

    const checkEmailMerchant = await sendMail(recipientMerchant);
    if (checkEmailMerchant) {
      socket.emit('notification', {
        message: `Product ${createdProductStatus.status}`,
        userId: user.id
      });
    }
  });
  const message = `Purchase with order ${data.id}`;
  const notification = await Notification.create({
    userId: user.id,
    message,
  });
  return notification;
};

const emitter = new EventEmitter();

emitter.on('newProduct', emitProductAddedEvent);
emitter.on('productRemoved', emitProductRemovedEvent);
emitter.on('productPurchased', emitProductPurchasedEvent);
emitter.on('productUpdated', emitProductUpdatedEvent);

export default emitter;
