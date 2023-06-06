/* eslint-disable no-unused-vars */
import chai from 'chai';
import chaiHttp from 'chai-http';
import jwt from 'jsonwebtoken';
import app from '../../index';
import 'dotenv/config';

chai.should();
chai.use(chaiHttp);
const { expect } = chai;

let adminRegResVerifyToken;
let adminId1;

describe('DISABLE ACCOUNT', async () => {
  let adminToken;
  let adminRegResToken;
  let adminId;
  const loginAdmin = {
    email: 'admin19@gmail.com',
    password: 'Admin1912',
  };

  const adminData = {
    firstname: 'James',
    lastname: 'admin',
    email: 'admin19@gmail.com',
    password: 'Admin1912',
  };
  before(async () => {
    // Register admin
    const adminRegRes = await chai
      .request(app)
      .post('/api/registerAdmin')
      .send(adminData);
    adminRegResToken = adminRegRes.body.token;
    adminRegResVerifyToken = adminRegRes.body.verifyToken;

    const verifyAdminToken1 = await jwt.verify(
      adminRegResToken,
      process.env.USER_SECRET_KEY
    );
    adminId1 = verifyAdminToken1.id;

    // verify email for admin
    await chai
      .request(app)
      .get(`/api/${adminId1}/verify/${adminRegResVerifyToken.token}`);

    const adminRes = await chai
      .request(app)
      .post('/api/login')
      .send(loginAdmin);
    expect(adminRes).to.have.status(200);
    adminToken = adminRes.body.token;
    const verifyAdminToken = await jwt.verify(
      adminToken,
      process.env.USER_SECRET_KEY
    );
    adminId = verifyAdminToken.id;
  });
  it('Should disable an account', (done) => {
    chai
      .request(app)
      .patch(`/api/disableAccount/${adminId}`)
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ role: 'merchant' })
      .end((err, res) => {
        chai.expect(res).to.have.status(200);
        done();
      });
  });
  it('Should fail to disable an account if the user ID does not exist', (done) => {
    chai
      .request(app)
      .patch(`/api/disableAccount/${adminId}`)
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ role: 'merchant' })
      .end((err, res) => {
        chai.expect(res).to.have.status(500);
        done();
      });
  });
  it('Should fail to disable an account if the user ID does not exist', (done) => {
    chai
      .request(app)
      .patch('/api/disableAccount/10')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ role: 'merchant' })
      .end((err, res) => {
        chai.expect(res).to.have.status(500);
        done();
      });
  });
});
