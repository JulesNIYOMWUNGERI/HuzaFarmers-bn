import chai from 'chai';
import jwt from 'jsonwebtoken';
import chaiHttp from 'chai-http';
import sgMail from '@sendgrid/mail';
import app from '../../index';
// import db from '../Database/models';

sgMail.setApiKey(process.env.SENDGRID_API_KEY);
const { expect } = chai;
chai.use(chaiHttp);
chai.use(chaiHttp);

let testToken;
let userRegResToken;
let userRegResVerifyToken;
let userId;
let userRegResToken2;
let userRegResVerifyToken2;
let userId2;

const userData = {
  firstname: 'ABC',
  lastname: 'ABC',
  email: 'abc@gmail.com',
  password: 'Abc123456',
};

const user2Data = {
  firstname: 'ABC',
  lastname: 'ABC',
  email: 'karori@gmail.com',
  password: 'Abc123456',
};

describe('LOGIN USER', () => {
  before(async () => {
    // registering a user1
    const userRegRes = await chai
      .request(app)
      .post('/api/register')
      .send(userData);
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

    // registering a user2
    const userRegRes2 = await chai
      .request(app)
      .post('/api/register')
      .send(user2Data);
    userRegResToken2 = userRegRes2.body.token;
    userRegResVerifyToken2 = userRegRes2.body.verifyToken;

    const verifyUserToken2 = await jwt.verify(
      userRegResToken2,
      process.env.USER_SECRET_KEY
    );
    userId2 = verifyUserToken2.id;

    // verify email for user2
    await chai
      .request(app)
      .get(`/api/${userId2}/verify/${userRegResVerifyToken2.token}`);

    // Generate a new token for each test
    const res = await chai
      .request(app)
      .post('/api/login')
      .send({ email: 'karori@gmail.com', password: 'Abc123456' });

    // Store the token as a variable to use in the test case
    testToken = res.body.token;
  });
  // CREATE USER
  // it('should register user and return a response with status code 200', (done) => {
  //   const User = {
  //     firstname: 'ABC',
  //     lastname: 'ABC',
  //     email: 'abc@gmail.com',
  //     password: 'Abc123456',
  //   };
  //   chai
  //     .request(app)
  //     .post('/api/register')
  //     .send(User)
  //     .end((err, res) => {
  //       chai.expect(res).to.have.status(200);
  //       const actualVal = res.body.message;
  //       expect(actualVal).to.be.equal('successful signedup');
  //       done();
  //     });
  // });
  it('should throw an error and return a response with status code 406 if the credentails are not validated', (done) => {
    const User = {
      firstname: 'ABC',
      lastname: 'ABC',
      email: 'abc@gmail.com',
      password: 'Abc',
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

  // LOGIN
  // before(async () => {
  //   await db.sequelize.sync({ force: true });
  // });

  it('should login user return status 200 and send token', async () => {
    const res = await chai.request(app).post('/api/login').send({
      email: 'abc@gmail.com',
      password: 'Abc123456',
    });

    expect(res).to.have.status(200);
    expect(res.body).to.have.property('message', 'Logged in succesfully');
    expect(res.body).to.have.property('token');
  });

  it('should return status 400 and request for the credentials to be filled if all is empty', async () => {
    const res = await chai.request(app).post('/api/login').send({
      email: '',
      password: '',
    });

    expect(res).to.have.status(400);
    expect(res.body).to.have.property('message', 'Please Fiil in blank fields');
  });

  it('should return status 401 and deny access if the password is invalid', async () => {
    const res = await chai.request(app).post('/api/login').send({
      email: 'abc@gmail.com',
      password: 'ABC',
    });

    expect(res).to.have.status(401);
    expect(res.body).to.have.property('message', 'Invalid password');
  });

  it('should return status 404 when user does not exist', async () => {
    const res = await chai.request(app).post('/api/login').send({
      email: 'nonexistentuser@gmail.com',
      password: 'Abc123456',
    });

    expect(res).to.have.status(404);
    expect(res.body).to.have.property('message', "User doesn't exist");
  });
  it('It should grant access to a user with a valid token ', async () => {
    const res = await chai
      .request(app)
      .get('/api/protectedroute')
      .set({ authorization: `Bearer ${testToken}` });

    expect(res).to.have.status(200);
    expect(res.body).to.have.property('message', 'Access Granted');
  });
  it('It should deny access to a user with an invalid token ', async () => {
    const token = '.eyJlbWFpbCI6ImFiY0BnbWFpbC5jb20iLCJpYXQiOjE2ODA0MzIzMDZ9.1-JRsNPQIX0wIc3OEcZyFe__gyy07de1PMmaIPo4_zQ';
    const res = await chai
      .request(app)
      .get('/api/protectedroute')
      .set({ authorization: `Bearer ${token}` });

    expect(res).to.have.status(500);
  });
  it('It should return a vlue of 400 if no token is provided', async () => {
    const token = '';
    const res = await chai
      .request(app)
      .get('/api/protectedroute')
      .set({ authorization: `Bearer ${token}` });
    expect(res).to.have.status(400);
  });
});
