/* eslint-disable no-shadow */
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

let userToken;

let user1RegResToken;
let user1RegResVerifyToken;
let user1Id;

let user2RegResToken;
let user2RegResVerifyToken;
let user2Id;

const userData = {
  firstname: 'Jane',
  lastname: 'Doe',
  email: 'janedoekiuhmf@gmail.com',
  password: 'Password1234',
};

const loginUser = {
  email: 'janedoekiuhmf@gmail.com',
  password: 'Password1234',
};

describe('GET /api/profile', () => {
  before(async () => {
    // Register user
    const userRegRes = await chai
      .request(app)
      .post('/api/register')
      .send(userData);

    user1RegResToken = userRegRes.body.token;
    user1RegResVerifyToken = userRegRes.body.verifyToken;

    const verifyUser1Token = await jwt.verify(
      user1RegResToken,
      process.env.USER_SECRET_KEY
    );
    user1Id = verifyUser1Token.id;

    // verify email for user1
    await chai
      .request(app)
      .get(`/api/${user1Id}/verify/${user1RegResVerifyToken.token}`);

    // Login as user
    const userRes = await chai.request(app).post('/api/login').send(loginUser);
    expect(userRes).to.have.status(200);
    userToken = userRes.body.token;
  });

  after(async () => {
    await users.destroy({
      where: { email: loginUser.email },
      truncate: { cascade: true },
    });
  });

  context(
    'After successful login, User can retrieve all the account information',
    () => {
      it('should retrive user information with status code 200', (done) => {
        chai
          .request(app)
          .get('/api/profile')
          .set({ Authorization: `Bearer ${userToken}` })
          .end((err, res) => {
            chai.expect(res).to.have.status(200);
            done();
          });
      });
    }
  );
});

describe('PATCH /api/profile', () => {
  before(async () => {
    // Register user
    const userRegRes = await chai
      .request(app)
      .post('/api/register')
      .send(userData);

    user2RegResToken = userRegRes.body.token;
    user2RegResVerifyToken = userRegRes.body.verifyToken;

    const verifyUser2Token = await jwt.verify(
      user2RegResToken,
      process.env.USER_SECRET_KEY
    );
    user2Id = verifyUser2Token.id;

    // verify email for user2
    await chai
      .request(app)
      .get(`/api/${user2Id}/verify/${user2RegResVerifyToken.token}`);

    // Login as user
    const userRes = await chai.request(app).post('/api/login').send(loginUser);
    expect(userRes).to.have.status(200);
    userToken = userRes.body.token;
  });

  after(async () => {
    await users.destroy({
      where: { email: loginUser.email },
      truncate: { cascade: true },
    });
  });

  context('when updating an existing user with valid data', () => {
    it('should return status 200 and update the user in the database', (done) => {
      const userData = {
        profileImage: [
          'https://th.bing.com/th/id/OIP.X7aw6FD9rHltxaZXCkuG2wHaFw?pid=ImgDet&rs=1',
          'https://th.bing.com/th/id/OIP.X7aw6FD9rHltxaZXCkuG2wHaFw?pid=ImgDet&rs=1',
          'https://th.bing.com/th/id/OIP.X7aw6FD9rHltxaZXCkuG2wHaFw?pid=ImgDet&rs=1',
          'https://th.bing.com/th/id/OIP.X7aw6FD9rHltxaZXCkuG2wHaFw?pid=ImgDet&rs=1',
        ],
        gender: 'female',
        birthdate: '2001-04-24',
        homeAddress: 'KG 12 st',
        billingAddress: {
          street: 'KG 12 st',
          city: 'Kigali',
          country: 'Rwanda',
          poBoxNumber: '16376',
          zipCode: '478',
        },
      };
      chai
        .request(app)
        .patch('/api/profile')
        .set({ Authorization: `Bearer ${userToken}` })
        .send(userData)
        .end((err, res) => {
          chai.expect(res).to.have.status(200);
          chai.expect(res.body.status).to.equal('success');
          chai.expect(res.body.userInfo.gender).to.equal(userData.gender);
          chai
            .expect(res.body.userInfo.birthdate)
            .to.equal(`${userData.birthdate}T00:00:00.000Z`);
          chai
            .expect(res.body.userInfo.homeAddress)
            .to.equal(userData.homeAddress);
          done();
        });
    });
  });

  context('when updating a user with invalid data', () => {
    it('should return status 400 and an error message', (done) => {
      const userData = {
        gender: 1234,
        birthdate: '2023-06-25',
        homeAddress: 'KG 12 st',
        billingAddress: {
          street: 'KG 12 st',
          country: 'Rwanda',
          poBoxNumber: '16376',
          zipCode: '478',
        },
      };
      chai
        .request(app)
        .patch('/api/profile')
        .set({ Authorization: `Bearer ${userToken}` })
        .send(userData)
        .end((err, res) => {
          chai.expect(res).to.have.status(400);
          chai.expect(res.body.status).to.equal('error');
          chai.expect(res.body.message).to.equal('Invalid Input');
          done();
        });
    });
  });

  context(
    'when trying to update a user, providing only the first name or the last name',
    () => {
      it('should return status 400 and an error message', (done) => {
        const userData = {
          firstname: 'john',
        };
        chai
          .request(app)
          .patch('/api/profile')
          .set({ Authorization: `Bearer ${userToken}` })
          .send(userData)
          .end((err, res) => {
            chai.expect(res).to.have.status(400);
            chai.expect(res.body.status).to.equal('error');
            chai
              .expect(res.body.message)
              .to.equal(
                'Invalid Input! Kindly enter both the first and last name to proceed.'
              );
            done();
          });
      });
    }
  );
});
