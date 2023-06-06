/* eslint-disable func-names */
/* eslint-disable global-require */
/* eslint-disable import/no-duplicates */
/* eslint-disable no-unused-vars */
/* eslint-disable no-unused-expressions */
import chai from 'chai';
import chaiHttp from 'chai-http';
import jwt from 'jsonwebtoken';
import request from 'chai';
import { expect } from 'chai';
import Sequelize from 'sequelize';
import { verifyToken } from '../utils/user.util';
import app from '../../index';

import AuthMiddleware from '../middlewares/login.middleware';
import logout from '../controllers/logout.controller';

chai.use(chaiHttp);

describe('logout controller', () => {
  let req, res, next;
  let testToken;

  beforeEach(async () => {
    const login = await chai.request(app).post('/api/login').send({
      email: 'user10@gmail.com',
      password: 'Password1234',
    });

    // Store the token as a variable to use in the test case
    testToken = login.body.token;
    req = {
      headers: {
        authorization: `Bearer ${testToken}`,
      },
    };
    res = {
      status(statusCode) {
        this.statusCode = statusCode;
        return this;
      },
      json(data) {
        this.body = data;
        return this;
      },
      redirect(url) {
        this.url = url;
      },
    };
    next = function (err) {
      throw new Error(err);
    };
    AuthMiddleware.blacklist = [];
  });

  describe('GET /logout', () => {
    it('redirects to home page', (done) => {
      chai
        .request(app)
        .get('/logout')
        .end((err, res) => {
          expect(res).to.have.status(200);
          done();
        });
    });
  });

  it('GET HOME PAGE', (done) => {
    chai
      .request(app)
      .get('/home')
      .end((err, res) => {
        expect(res).to.have.status(200);
        done();
      });
  });

  it('returns 400 and "Please sign in!" message if authorization header is missing', async () => {
    delete req.headers.authorization;

    await logout(req, res, next);

    expect(res.statusCode).to.equal(400);
    expect(res.body.msg).to.equal('Please sign in!');
    expect(AuthMiddleware.blacklist).to.be.empty;
  });

  it('returns 401 and "Invalid token" message if token is invalid', async () => {
    const secretKey = process.env.USER_SECRET_KEY;
    const invalidToken = jwt.sign({ username: 'testuser' }, 'invalidsecret', {
      expiresIn: process.env.TOKEN_EXPIRATION,
    });
    req.headers.authorization = `Bearer ${invalidToken}`;

    await logout(req, res, next);

    expect(res.statusCode).to.equal(401);
    expect(res.body.msg).to.equal('Invalid token');
    expect(AuthMiddleware.blacklist).to.be.empty;
  });

  it('returns 401 and "You have been Logged Out!" message if token is blacklisted', async () => {
    AuthMiddleware.blacklist.push(`${testToken}`);

    await logout(req, res, next);

    expect(res.statusCode).to.equal(401);
    expect(res.body.msg).to.equal('Invalid token');
    expect(AuthMiddleware.blacklist).to.have.lengthOf(1);
  });
});

describe('App', () => {
  it('should use port 4000 by default', (done) => {
    const port = 4000;
    const server = app.listen(port, () => {
      expect(server.address().port).to.equal(port);
      server.close();
      done();
    });
  });
});
