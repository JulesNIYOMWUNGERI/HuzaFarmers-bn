/* eslint-disable linebreak-style */
/* eslint-disable linebreak-style */
/* eslint-disable no-unused-vars */
/* eslint-disable linebreak-style */
import jwt from 'jsonwebtoken';
import chai from 'chai';
import chaiHttp from 'chai-http';
import app from '../../index';
import { sequelize } from '../Database/models';

const { expect } = chai;
chai.use(chaiHttp);

describe(' CLEAR SHOPPING CART TEST', () => {
  let sellerToken;
  let adminToken;
  let sellerId;
  let adminRegResToken;
  let customerTokenBeforeMechant;
  let productId;
  const NO_EXISTING_PRODUCT_ID = 98745;
  let BUYER_TOKEN;
  let CART_ITEM_ID;

  let user1RegResToken;
  let user1RegResVerifyToken;
  let user1Id;
  let user2RegResToken;
  let user2RegResVerifyToken;
  let user2Id;
  let adminRegResVerifyToken;
  let adminId;

  // ADMING INFO
  const adminData = {
    firstname: 'Peter',
    lastname: 'adams',
    email: 'adamsww@gmail.com',
    password: 'Adams1912',
  };
  const loginAdmin = {
    email: 'adamsww@gmail.com',
    password: 'Adams1912',
  };
  // SELLER INFO
  const sellerData = {
    firstname: 'State',
    lastname: 'Price',
    email: 'state19hh@gmail.com',
    password: 'State1912',
  };
  const loginSeller = {
    email: 'state19hh@gmail.com',
    password: 'State1912',
  };
  // BUYER INFO
  const buyerData = {
    firstname: 'MUGABO',
    lastname: 'James',
    email: 'mugaboki@gmail.com',
    password: 'Mugabo1234',
  };
  const buyerLogin = {
    email: 'mugaboki@gmail.com',
    password: 'Mugabo1234',
  };

  before(async () => {
    // ========= ADMIN ACCOUNT
    const adminRegRes = await chai
      .request(app)
      .post('/api/registerAdmin')
      .send(adminData);
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

    const adminRes = await chai
      .request(app)
      .post('/api/login')
      .send(loginAdmin);
    expect(adminRes).to.have.status(200);
    adminToken = adminRes.body.token;

    // ========= SELLER ACCOUNT
    const sellerRes = await chai
      .request(app)
      .post('/api/register')
      .send(sellerData);

    user1RegResToken = sellerRes.body.token;
    user1RegResVerifyToken = sellerRes.body.verifyToken;

    const verifyUser1Token = await jwt.verify(
      user1RegResToken,
      process.env.USER_SECRET_KEY
    );
    user1Id = verifyUser1Token.id;

    // verify email for user1
    await chai
      .request(app)
      .get(`/api/${user1Id}/verify/${user1RegResVerifyToken.token}`);

    const customerTokenBeforeMechantRes = await chai
      .request(app)
      .post('/api/login')
      .send(loginSeller);
    expect(customerTokenBeforeMechantRes).to.have.status(200);
    customerTokenBeforeMechant = customerTokenBeforeMechantRes.body.token;

    const verifyCustomerBeforeMerchant = await jwt.verify(
      customerTokenBeforeMechant,
      process.env.USER_SECRET_KEY
    );
    sellerId = verifyCustomerBeforeMerchant.id;

    // ========= BUYER ACCOUNT
    const customerRes = await chai.request(app).post('/api/register').send(buyerData);

    user2RegResToken = customerRes.body.token;
    user2RegResVerifyToken = customerRes.body.verifyToken;

    const verifyCutomerToken = await jwt.verify(
      user2RegResToken,
      process.env.USER_SECRET_KEY
    );
    user2Id = verifyCutomerToken.id;

    // verify email for customer
    await chai
      .request(app)
      .get(`/api/${user2Id}/verify/${user2RegResVerifyToken.token}`);

    const buyerLoginRes = await chai
      .request(app)
      .post('/api/login')
      .send(buyerLogin);
    expect(buyerLoginRes).to.have.status(200);
    const { token } = buyerLoginRes.body;
    BUYER_TOKEN = token;

    // Update seller's role
    await chai
      .request(app)
      .patch(`/api/updateRole/${sellerId}`)
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ role: 'merchant' });
    expect(adminRes).to.have.status(200);

    // Login as seller and get token
    const sellerLoginRes = await chai
      .request(app)
      .post('/api/login')
      .send(loginSeller);
    expect(sellerLoginRes).to.have.status(200);
    sellerToken = sellerLoginRes.body.token;

    // create a new product to be added to the shopping cart
    const productRes = await chai
      .request(app)
      .post('/api/addProduct')
      .set('Authorization', `Bearer ${sellerToken}`)
      .send({
        name: 'HCT/RP 360ST',
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
    productId = productRes.body.data.id;

    const addItemInCart = await chai
      .request(app)
      .post('/api/addItemToCart')
      .set({ Authorization: `Bearer ${BUYER_TOKEN}` })
      .send({
        productId,
        quantity: 2,
      });

    CART_ITEM_ID = addItemInCart.body.data['CURRENT CART DETAILS']['ADDED PRODUCT DETAILS ']
      .ID;
  });
  // after(async () => {
  //   await sequelize.sync({ force: true });
  // });
  context('CLEAR CLEAR CART WHEN THERE ITEM(S) INSIDE ', () => {
    it('should clean shopping cart and return status 200', (done) => {
      chai
        .request(app)
        .delete('/api/clear-cart')
        .set({ Authorization: `Bearer ${BUYER_TOKEN}` })
        .end((err, res) => {
          chai.expect(res).to.have.status(200);
          const actualVal = res.body.message;
          expect(actualVal).to.be.equal(
            'ALL ITEMS REMOVED FROM THE CART SUCCESSFULLY!!!'
          );
          done();
        });
    });
  });

  context('NOTIFY WHEN THERE IS NOTHING TO CLEAN IN THE CART', () => {
    it('should return status 400 and an error message', async () => {
      // make request to add item to cart
      const res = await chai
        .request(app)
        .delete('/api/clear-cart')
        .set({ Authorization: `Bearer ${BUYER_TOKEN}` });
      expect(res).to.have.status(400);
      const actualVal = res.body.message;
      expect(actualVal).to.be.equal(
        'CART IS EMPTY, THERE ARE NO ITEMS TO REMOVE!'
      );
    });
  });
});
