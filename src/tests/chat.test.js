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

let customerToken;

let userRegResToken;
let userRegResVerifyToken;
let userId;
// let userRegResToken2;
// let userRegResVerifyToken2;
// let userId2;

const customerData = {
  firstname: 'John',
  lastname: 'Doe',
  email: 'johndoe@gmail.com',
  password: 'Password1234',
};

const loginCustomer = {
  email: 'johndoe@gmail.com',
  password: 'Password1234',
};

describe('CHATTING ON THE PLATFORM', async () => {
  before(async () => {
    // Register user
    const userRegRes = await chai.request(app).post('/api/register').send(customerData);

    userRegResToken = userRegRes.body.token;
    userRegResVerifyToken = userRegRes.body.verifyToken;

    const verifyUserToken = await jwt.verify(
      userRegResToken,
      process.env.USER_SECRET_KEY
    );
    userId = verifyUserToken.id;

    // verify email for user1
    await chai
      .request(app)
      .get(`/api/${userId}/verify/${userRegResVerifyToken.token}`);

    const customerLogin = await chai
      .request(app)
      .post('/api/login')
      .send(loginCustomer);
    expect(customerLogin).to.have.status(200);
    customerToken = customerLogin.body.token;
  });

  context('It should send a message', () => {
    it('should return a status of 201 and broadcast message', (done) => {
      const requestBody = {
        message: 'hello',
        sender: 'jules',
      };
      chai
        .request(app)
        .post('/api/chat')
        .set({ Authorization: `Bearer ${customerToken}` })
        .send(requestBody)
        .end((err, res) => {
          chai.expect(res).to.have.status(201);
          done();
        });
    });
  });

  context('It should fail to send a message', () => {
    it('should return a status of 406 with the message specifying the invalid input ', (done) => {
      const requestBody = {
        message: '',
        sender: 'jules',
      };
      chai
        .request(app)
        .post('/api/chat')
        .set({ Authorization: `Bearer ${customerToken}` })
        .send(requestBody)
        .end((err, res) => {
          chai.expect(res).to.have.status(406);
          done();
        });
    });
  });

  context('It should return all message', () => {
    it('should return a status of 200 with all messages', (done) => {
      chai
        .request(app)
        .get('/api/allChat')
        .set({ Authorization: `Bearer ${customerToken}` })
        .end((err, res) => {
          chai.expect(res).to.have.status(200);
          const actualVal = res.body.message;
          expect(actualVal).to.be.equal('messages');
          done();
        });
    });
  });
});
