/* eslint-disable linebreak-style */
import 'dotenv/config';
import chai from 'chai';
import chaiHttp from 'chai-http';
import jwt from 'jsonwebtoken';
import app from '../../index';

// import { sequelize } from '../Database/models';

const { expect } = chai;
chai.use(chaiHttp);

describe('VIEW ITEMS IN SHOPPING CART', () => {
  let SELLER_TOKEN;
  let BUYER_TOKEN;

  let sellerRegResToken;
  let sellerRegResVerifyToken;
  let sellerId;
  let buyerRegResToken;
  let buyerRegResVerifyToken;
  let buyerId;

  let adminRegResToken;
  let adminRegResVerifyToken;
  let adminId;
  let adminToken;

  // SELLER INFO
  const sellerData = {
    firstname: 'State',
    lastname: 'Price',
    email: 'state19lomn78j@gmail.com',
    password: 'State1912',
  };
  const sellerLoginData = {
    email: 'state19lomn78j@gmail.com',
    password: 'State1912',
  };
  // BUYER INFO
  const buyerData = {
    firstname: 'MUGABO',
    lastname: 'James',
    email: 'mugabolmj0nh7vg@gmail.com',
    password: 'Mugabo1234',
  };
  const buyerLoginData = {
    email: 'mugabolmj0nh7vg@gmail.com',
    password: 'Mugabo1234',
  };

  const adminData = {
    firstname: 'Admin',
    lastname: 'Doe',
    email: 'admindoezminubyvt9n7m0@gmail.com',
    password: 'Password1234',
  };

  const loginAdmin = {
    email: 'admindoezminubyvt9n7m0@gmail.com',
    password: 'Password1234',
  };

  before(async () => {
    // ========= SELLER ACCOUNT
    const sellerAccount = await chai.request(app).post('/api/register').send(sellerData);

    sellerRegResToken = sellerAccount.body.token;
    sellerRegResVerifyToken = sellerAccount.body.verifyToken;

    const verifySerllerToken = await jwt.verify(
      sellerRegResToken,
      process.env.USER_SECRET_KEY
    );
    sellerId = verifySerllerToken.id;

    // verify email for seller
    await chai
      .request(app)
      .get(`/api/${sellerId}/verify/${sellerRegResVerifyToken.token}`);

    // ========= BUYER ACCOUNT
    const buyerAccount = await chai.request(app).post('/api/register').send(buyerData);

    buyerRegResToken = buyerAccount.body.token;
    buyerRegResVerifyToken = buyerAccount.body.verifyToken;

    const verifybuyerToken = await jwt.verify(
      buyerRegResToken,
      process.env.USER_SECRET_KEY
    );
    buyerId = verifybuyerToken.id;

    // verify email for buyer
    await chai
      .request(app)
      .get(`/api/${buyerId}/verify/${buyerRegResVerifyToken.token}`);

    // ===== ADMIN ACCOUNT
    const adminRegRes = await chai.request(app).post('/api/registerAdmin').send(adminData);

    adminRegResToken = adminRegRes.body.token;
    adminRegResVerifyToken = adminRegRes.body.verifyToken;

    const verifyAdminToken = await jwt.verify(
      adminRegResToken,
      process.env.USER_SECRET_KEY
    );
    adminId = verifyAdminToken.id;

    // verify email for admin
    await chai
      .request(app)
      .get(`/api/${adminId}/verify/${adminRegResVerifyToken.token}`);

    const adminLogin = await chai
      .request(app)
      .post('/api/login')
      .send(loginAdmin);
    expect(adminLogin).to.have.status(200);
    adminToken = adminLogin.body.token;

    /// SELLER
    const sellerLogin = await chai
      .request(app)
      .post('/api/login')
      .send(sellerLoginData);
    expect(sellerLogin).to.have.status(200);
    SELLER_TOKEN = sellerLogin.body.token;

    const buyerLogin = await chai
      .request(app)
      .post('/api/login')
      .send(buyerLoginData);
    expect(buyerLogin).to.have.status(200);
    BUYER_TOKEN = buyerLogin.body.token;

    const verifyMerchant = await jwt.verify(
      SELLER_TOKEN,
      process.env.USER_SECRET_KEY
    );
    const merchantId = verifyMerchant.id;

    // Update seller's role
    await chai
      .request(app)
      .patch(`/api/updateRole/${merchantId}`)
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ role: 'merchant' });

    // create a new product to be added to the shopping cart
    const product = await chai
      .request(app)
      .post('/api/addProduct')
      .set('Authorization', `Bearer ${SELLER_TOKEN}`)
      .send({
        name: 'HCT/RP 360STS',
        image: [
          'https://th.bing.com/th/id/OIP.X7aw6FD9rHltxaZXCkuG2wHaFw?pid=ImgDet&rs=1',
          'https://th.bing.com/th/id/OIP.X7aw6FD9rHltxaZXCkuG2wHaFw?pid=ImgDet&rs=1',
          'https://th.bing.com/th/id/OIP.X7aw6FD9rHltxaZXCkuG2wHaFw?pid=ImgDet&rs=1',
          'https://th.bing.com/th/id/OIP.X7aw6FD9rHltxaZXCkuG2wHaFw?pid=ImgDet&rs=1',
        ],
        price: 2500,
        quantity: 12,
        category: 'GAMMING PC',
        exDate: '2023-05-30',
      });
    expect(product).to.have.status(201);
    const productId = product.body.data.id;

    await chai
      .request(app)
      .post('/api/addItemToCart')
      .set({ Authorization: `Bearer ${BUYER_TOKEN}` })
      .send({
        productId,
        quantity: 5,
      });
  });

  context(' IT SHOULD RETRIEVE ALL ITEMS IN USER ACCOUNT ', () => {
    it(' should retrieve data and return 200 status', async () => {
      const res = await chai
        .request(app)
        .get('/api/view-cart-items')
        .set({ Authorization: `Bearer ${BUYER_TOKEN}` });

      expect(res).to.have.status(200);
    });
  });
  context(' WHEN CART IS EMPTY TELL USER THAT HAS NONE IN CART ', () => {
    it(' should return 404 status when cart is empty', async () => {
      const res = await chai
        .request(app)
        .get('/api/view-cart-items')
        .set({ Authorization: `Bearer ${SELLER_TOKEN}` });

      expect(res).to.have.status(404);
      expect(res.body.message).to.equal('You do not have items in your cart');
    });
  });
});
