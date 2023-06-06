/* eslint-disable linebreak-style */
/* eslint-disable padded-blocks */
/* eslint-disable linebreak-style */
/* eslint-disable no-unused-expressions */
import bcrypt from 'bcryptjs';
import chai from 'chai';
import chaiHttp from 'chai-http';
import sgMail from '@sendgrid/mail';
import jwt from 'jsonwebtoken';
import sinon from 'sinon';
import app from '../../index';
import db from '../Database/models';

sgMail.setApiKey(process.env.SENDGRID_API_KEY);
const { expect } = chai;
chai.use(chaiHttp);

describe('Reset Password Via Email', () => {

  let userRegResToken;
  let userRegResVerifyToken;
  let theUserId;

  let userToken;
  let userId;
  const registerUser = {
    firstname: 'RUBERWA',
    lastname: 'RUBERWA',
    email: 'ruberwa3@gmail.com',
    password: 'Ruberwa12',
  };
  const loginUser = {
    email: 'ruberwa3@gmail.com',
    password: 'Ruberwa12',
  };

  before(async () => {
    sinon.stub(sgMail, 'send').resolves({});

    // Register seller
    const sellerAccount = await chai.request(app).post('/api/register').send(registerUser);

    userRegResToken = sellerAccount.body.token;
    userRegResVerifyToken = sellerAccount.body.verifyToken;

    const verifySerllerToken = await jwt.verify(
      userRegResToken,
      process.env.USER_SECRET_KEY
    );
    theUserId = verifySerllerToken.id;

    // verify email for seller
    await chai
      .request(app)
      .get(`/api/${theUserId}/verify/${userRegResVerifyToken.token}`);

    const loginResetUser = await chai
      .request(app)
      .post('/api/login')
      .send(loginUser);
    expect(loginResetUser).to.have.status(200);
    userToken = loginResetUser.body.token;

    const verifyUserToken = await jwt.verify(
      userToken,
      process.env.USER_SECRET_KEY
    );
    userId = verifyUserToken.id;
  });

  describe('POST /api/requestPasswordReset', () => {
    context('when a valid email is provided', () => {
      it('should return status 200 and send password reset email', async () => {
        const res = await chai
          .request(app)
          .post('/api/requestPasswordReset')
          .send({ email: 'ruberwa3@gmail.com' });

        expect(res).to.have.status(200);
      });
    });

    context('when an invalid email is provided', () => {
      it('should return status 404 and an error message', async () => {
        const res = await chai
          .request(app)
          .post('/api/requestPasswordReset')
          .send({ email: 'nonexistentuser@gmail.com' });

        expect(res).to.have.status(404);
        expect(res.body).to.have.property('message', 'User not found');
      });
    });

    context('when no email is provided', () => {
      it('should return status 500 and an error message', async () => {
        const res = await chai
          .request(app)
          .post('/api/requestPasswordReset')
          .send({});

        expect(res).to.have.status(500);
      });
    });
  });

  describe('POST /api/reset-password', () => {
    context('when a valid userId and newPassword are provided', () => {
      it('should return status 200 and update the user password', async () => {
        const res = await chai
          .request(app)
          .post(`/api/reset-password/${userId}`)
          .send({ newPassword: 'Rbr12' });

        expect(res).to.have.status(200);
        expect(res.body).to.have.property(
          'message',
          'Password reset successfully'
        );

        const updatedUser = await db.User.findOne({ where: { id: userId } });
        expect(updatedUser).to.not.be.null;
        const passwordMatch = await bcrypt.compare(
          'Rbr12',
          updatedUser.password
        );
        expect(passwordMatch).to.be.true;
      });
    });

    context('when an invalid userId is provided', () => {
      it('should return status 404 and an error message', async () => {
        const res = await chai
          .request(app)
          .post('/api/reset-password/999')
          .send({ newPassword: 'Rbr12' });

        expect(res).to.have.status(404);
        expect(res.body).to.have.property('message', 'User not found');
      });
    });

    context('when no userId is provided', () => {
      it('should return status 404 and an error message', async () => {
        const res = await chai
          .request(app)
          .post('/api/reset-password')
          .send({ newPassword: 'Rbr12' });

        expect(res).to.have.status(404);
      });
    });

    context('when no newPassword is provided', () => {
      it('should return status 500 and an error message', async () => {
        // Send the reset password request without providing a new password
        const res = await chai
          .request(app)
          .post(`/api/reset-password/${userId}`)
          .send({ newPassword: '' });

        // Expect the response to have a status of 500 and an error message
        expect(res).to.have.status(500);
      });
    });
  });
});
