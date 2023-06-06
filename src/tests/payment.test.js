/* eslint-disable linebreak-style */
/* eslint-disable no-unused-vars */
/* eslint-disable linebreak-style */
import chai from 'chai';
import chaiHttp from 'chai-http';
import jwt from 'jsonwebtoken';
import app from '../../index';
import { users } from '../Database/models';

chai.use(chaiHttp);
const { expect } = chai;

let merchantToken;
let customerToken;
let adminToken;
let customer2Token;
let orderId;

let user1RegResToken;
let user1RegResVerifyToken;
let user1Id;
let user2RegResToken;
let user2RegResVerifyToken;
let user2Id;
let user3RegResToken;
let user3RegResVerifyToken;
let user3Id;

let adminRegResToken;
let adminRegResVerifyToken;
let adminId;

const merchantData = {
  firstname: 'Jane',
  lastname: 'Doe',
  email: 'janedoe@gmail.com',
  password: 'Password1234'
};

const loginMerchant = {
  email: 'janedoe@gmail.com',
  password: 'Password1234'
};

const customerData = {
  firstname: 'John',
  lastname: 'Doe',
  email: 'johndoegg@gmail.com',
  password: 'Password1234'
};

const loginCustomer = {
  email: 'johndoegg@gmail.com',
  password: 'Password1234'
};

const customer2Data = {
  firstname: 'customer',
  lastname: 'two',
  email: 'customerhh2@gmail.com',
  password: 'Password1234'
};

const loginCustomer2 = {
  email: 'customerhh2@gmail.com',
  password: 'Password1234'
};

const adminData = {
  firstname: 'Admin',
  lastname: 'Doe',
  email: 'admindoehhg@gmail.com',
  password: 'Password1234'
};

const loginAdmin = {
  email: 'admindoehhg@gmail.com',
  password: 'Password1234'
};

describe('MAKING PAYMENT', async () => {
  before(async () => {
    // Register user
    const user1RegRes = await chai.request(app).post('/api/register').send(merchantData);

    user1RegResToken = user1RegRes.body.token;
    user1RegResVerifyToken = user1RegRes.body.verifyToken;

    const verifyUser1Token = await jwt.verify(
      user1RegResToken,
      process.env.USER_SECRET_KEY
    );
    user1Id = verifyUser1Token.id;

    // verify email for user1
    await chai
      .request(app)
      .get(`/api/${user1Id}/verify/${user1RegResVerifyToken.token}`);

    const user2RegRes = await chai.request(app).post('/api/register').send(customerData);

    user2RegResToken = user2RegRes.body.token;
    user2RegResVerifyToken = user2RegRes.body.verifyToken;

    const verifyUser2Token = await jwt.verify(
      user2RegResToken,
      process.env.USER_SECRET_KEY
    );
    user2Id = verifyUser2Token.id;

    // verify email for user2
    await chai
      .request(app)
      .get(`/api/${user2Id}/verify/${user2RegResVerifyToken.token}`);

    const user3RegRes = await chai.request(app).post('/api/register').send(customer2Data);

    user3RegResToken = user3RegRes.body.token;
    user3RegResVerifyToken = user3RegRes.body.verifyToken;

    const verifyUser3Token = await jwt.verify(
      user3RegResToken,
      process.env.USER_SECRET_KEY
    );
    user3Id = verifyUser3Token.id;

    // verify email for user3
    await chai
      .request(app)
      .get(`/api/${user3Id}/verify/${user3RegResVerifyToken.token}`);

    // Register admin
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

    const merchantLogin = await chai
      .request(app)
      .post('/api/login')
      .send(loginMerchant);
    expect(merchantLogin).to.have.status(200);
    merchantToken = merchantLogin.body.token;

    const customerLogin = await chai
      .request(app)
      .post('/api/login')
      .send(loginCustomer);
    expect(customerLogin).to.have.status(200);
    customerToken = customerLogin.body.token;

    const customer2Login = await chai
      .request(app)
      .post('/api/login')
      .send(loginCustomer2);
    expect(customer2Login).to.have.status(200);
    customer2Token = customer2Login.body.token;

    const adminLogin = await chai
      .request(app)
      .post('/api/login')
      .send(loginAdmin);
    expect(adminLogin).to.have.status(200);
    adminToken = adminLogin.body.token;

    const verifyMerchant = await jwt.verify(
      merchantToken,
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
      .set('Authorization', `Bearer ${merchantToken}`)
      .send({
        name: 'HCT/RPKKOOPPVhbg 360ST',
        image: [
          'https://th.bing.com/th/id/OIP.X7aw6FD9rHltxaZXCkuG2wHaFw?pid=ImgDet&rs=1',
          'https://th.bing.com/th/id/OIP.X7aw6FD9rHltxaZXCkuG2wHaFw?pid=ImgDet&rs=1',
          'https://th.bing.com/th/id/OIP.X7aw6FD9rHltxaZXCkuG2wHaFw?pid=ImgDet&rs=1',
          'https://th.bing.com/th/id/OIP.X7aw6FD9rHltxaZXCkuG2wHaFw?pid=ImgDet&rs=1'
        ],
        price: 2500,
        quantity: 12,
        category: 'GAMMINGjut PC',
        exDate: '2023-05-30'
      });
    expect(product).to.have.status(201);
    const productId = product.body.data.id;

    const Cart = await chai
      .request(app)
      .post('/api/addItemToCart')
      .set({ Authorization: `Bearer ${customerToken}` })
      .send({
        productId,
        quantity: 5
      });
    expect(Cart).to.have.status(201);

    // working on checkout
    const chechout = await chai
      .request(app)
      .post('/api/checkout')
      .set({ Authorization: `Bearer ${customerToken}` })
      .send({
        deliveryAddress: {
          street: 'KN 55 st',
          city: 'Kigali',
          country: 'Rwanda',
          zipCode: '3853'
        },
        paymentInformation: {
          method: 'credit card',
          details: {
            cardNumber: '5555 5555 5555 4444',
            expirationDate: '10/23',
            cvv: '346'
          }
        }
      });
    orderId = chechout.body.data.id;
  });

  context(
    'It should fail to make payment because there is a missing input',
    () => {
      it('should return a status of 406 when you entered an invalid data', (done) => {
        const requestBody = {
          card: {
            exp_month: 5,
            exp_year: 2025,
            cvc: '123'
          }
        };
        chai
          .request(app)
          .post(`/api/payment/${orderId}`)
          .set({ Authorization: `Bearer ${customerToken}` })
          .send(requestBody)
          .end((err, res) => {
            chai.expect(res).to.have.status(406);
            done();
          });
      });
    }
  );
  context('It should make payment', () => {
    it('should make payment and return status of 201', (done) => {
      const requestBody = {
        card: {
          number: '5555 5555 5555 4444',
          exp_month: 5,
          exp_year: 2025,
          cvc: '123'
        }
      };
      chai
        .request(app)
        .post(`/api/payment/${orderId}`)
        .set({ Authorization: `Bearer ${customerToken}` })
        .send(requestBody)
        .end((err, res) => {
          chai.expect(res).to.have.status(201);
          done();
        });
    });
  });
  context('It should fail to make payment because order does not exist', () => {
    it('should return a status of 404 when order not found', (done) => {
      const requestBody = {
        card: {
          number: '5555 5555 5555 4444',
          exp_month: 5,
          exp_year: 2025,
          cvc: '123'
        }
      };
      chai
        .request(app)
        .post('/api/payment/999')
        .set({ Authorization: `Bearer ${customerToken}` })
        .send(requestBody)
        .end((err, res) => {
          chai.expect(res).to.have.status(404);
          done();
        });
    });
  });
  context(
    'It should fail to make payment because user does not own the order',
    () => {
      it('should return a status of 403 when user does not own order', (done) => {
        const requestBody = {
          card: {
            number: '5555 5555 5555 4444',
            exp_month: 5,
            exp_year: 2025,
            cvc: '123'
          }
        };
        chai
          .request(app)
          .post(`/api/payment/${orderId}`)
          .set({ Authorization: `Bearer ${customer2Token}` })
          .send(requestBody)
          .end((err, res) => {
            chai.expect(res).to.have.status(403);
            done();
          });
      });
    }
  );
  context(
    'It should fail to make payment because the order have been allready paid',
    () => {
      it('should return a status of 409 when the order have been allready paid', (done) => {
        const requestBody = {
          card: {
            number: '5555 5555 5555 4444',
            exp_month: 5,
            exp_year: 2025,
            cvc: '123'
          }
        };
        chai
          .request(app)
          .post(`/api/payment/${orderId}`)
          .set({ Authorization: `Bearer ${customerToken}` })
          .send(requestBody)
          .end((err, res) => {
            chai.expect(res).to.have.status(409);
            done();
          });
      });
    }
  );
  context('It should get all payments history of specific user', () => {
    it('should return a status of 200 with the payment history of specific user', (done) => {
      chai
        .request(app)
        .get('/api/getAllPayment')
        .set({ Authorization: `Bearer ${customerToken}` })
        .end((err, res) => {
          chai.expect(res).to.have.status(200);
          done();
        });
    });
  });
});
