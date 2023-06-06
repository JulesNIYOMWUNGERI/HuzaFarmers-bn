/* eslint-disable no-unused-vars */
import chai from 'chai';
import chaiHttp from 'chai-http';
import jwt from 'jsonwebtoken';
import app from '../../index';

const { expect } = chai;
chai.use(chaiHttp);

describe('REGISTRATION', () => {
  // CREATE USER
  it('should register user and return a response with status code 200', (done) => {
    const User = {
      firstname: 'ABC',
      lastname: 'ABC',
      email: 'abcdef@gmail.com',
      password: 'Abc123456',
    };
    chai
      .request(app)
      .post('/api/register')
      .send(User)
      .end((err, res) => {
        chai.expect(res).to.have.status(200);
        const userToken = res.body.token;
        const verifyingToken = res.body.verifyToken;
        const verifyUserToken = jwt.verify(
          userToken,
          process.env.USER_SECRET_KEY
        );
        const userId = verifyUserToken.id;

        chai
          .request(app)
          .get(`/api/${userId}/verify/${verifyingToken.token}`)
          .end((err, res) => {
            chai.expect(res).to.have.status(200);
            done();
          });
      });
  });

  it('should not create a user account with weak password', (done) => {
    const User = {
      firstname: 'admin',
      lastname: 'acc',
      email: 'admin2@gmail.com',
      password: 'test123',
    };
    chai
      .request(app)
      .post('/api/register')
      .send(User)
      .end((err, res) => {
        chai.expect(res).to.have.status(406);
        done();
      });
  });

  it('should not create a user account with an already existing email', (done) => {
    const User = {
      firstname: 'admin',
      lastname: 'acc',
      email: 'abcdef@gmail.com',
      password: 'Test123456',
    };
    chai
      .request(app)
      .post('/api/register')
      .send(User)
      .end((err, res) => {
        chai.expect(res).to.have.status(401);
        done();
      });
  });
});
