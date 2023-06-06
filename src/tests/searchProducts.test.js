/* eslint-disable linebreak-style */
/* eslint-disable no-unused-vars */
/* eslint-disable linebreak-style */
import 'dotenv/config';
import chai from 'chai';
import chaiHttp from 'chai-http';
import sinon from 'sinon';
import jwt from 'jsonwebtoken';
import { Product } from '../Database/models';
import app from '../../index';

const { expect } = chai;
chai.use(chaiHttp);

describe('SEARCH PRODUCTS', async () => {
  let SELLER_TOKEN;
  let SELLER2_TOKEN;

  let sellerRegResToken;
  let sellerRegResVerifyToken;
  let sellerId;
  let seller2RegResToken;
  let seller2RegResVerifyToken;
  let seller2Id;

  let adminRegResToken;
  let adminRegResVerifyToken;
  let adminId;
  let adminToken;

  const adminData = {
    firstname: 'ZIGA',
    lastname: 'SHEILA',
    email: 'sheila1kb6deh@gmail.com',
    password: 'Admin1912',
  };
  const loginAdmin = {
    email: 'sheila1kb6deh@gmail.com',
    password: 'Admin1912',
  };
  const sellerData = {
    firstname: 'Mike',
    lastname: 'sinzi',
    email: 'sinzi1kmjhugbhy@gmail.com',
    password: 'Seller1912',
  };
  const loginSellerData = {
    email: 'sinzi1kmjhugbhy@gmail.com',
    password: 'Seller1912',
  };
  const seller2Data = {
    firstname: 'Michael',
    lastname: 'sinzi',
    email: 'michaenhbvgtrfvjuytgfl1@gmail.com',
    password: 'Seller1912',
  };
  const loginSeller2Data = {
    email: 'michaenhbvgtrfvjuytgfl1@gmail.com',
    password: 'Seller1912',
  };

  before(async () => {
    // ========= SELLER 1 ACCOUNT
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

    // ========= SELLER 2 ACCOUNT
    const seller2Account = await chai.request(app).post('/api/register').send(seller2Data);

    seller2RegResToken = seller2Account.body.token;
    seller2RegResVerifyToken = seller2Account.body.verifyToken;

    const verifySerller2Token = await jwt.verify(
      seller2RegResToken,
      process.env.USER_SECRET_KEY
    );
    seller2Id = verifySerller2Token.id;

    // verify email for seller
    await chai
      .request(app)
      .get(`/api/${seller2Id}/verify/${seller2RegResVerifyToken.token}`);

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

    // ADMIN
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
      .send(loginSellerData);
    expect(sellerLogin).to.have.status(200);
    SELLER_TOKEN = sellerLogin.body.token;

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

    /// SELLER 2
    const seller2Login = await chai
      .request(app)
      .post('/api/login')
      .send(loginSeller2Data);
    expect(seller2Login).to.have.status(200);
    SELLER2_TOKEN = seller2Login.body.token;

    const verifyMerchant2 = await jwt.verify(
      SELLER2_TOKEN,
      process.env.USER_SECRET_KEY
    );
    const merchant2Id = verifyMerchant2.id;

    // Update seller2's role
    await chai
      .request(app)
      .patch(`/api/updateRole/${merchant2Id}`)
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ role: 'merchant' });
    // create a new product to be added to the shopping cart
  });

  it('should return status 201 and add first product to the database', (done) => {
    const productData = {
      name: 'Screen',
      image: [
        'https://th.bing.com/th/id/OIP.X7aw6FD9rHltxaZXCkuG2wHaFw?pid=ImgDet&rs=1',
        'https://th.bing.com/th/id/OIP.X7aw6FD9rHltxaZXCkuG2wHaFw?pid=ImgDet&rs=1',
        'https://th.bing.com/th/id/OIP.X7aw6FD9rHltxaZXCkuG2wHaFw?pid=ImgDet&rs=1',
        'https://th.bing.com/th/id/OIP.X7aw6FD9rHltxaZXCkuG2wHaFw?pid=ImgDet&rs=1'
      ],
      price: 900.99,
      quantity: 10,
      category: 'Electronics',
      exDate: '2123-05-30'
    };

    chai
      .request(app)
      .post('/api/addProduct')
      .set({ Authorization: `Bearer ${SELLER_TOKEN}` })
      .send(productData)
      .end((err, res) => {
        chai.expect(res).to.have.status(201);
        const actualVal = res.body.message;
        expect(actualVal).to.be.equal('Product created successfully');
        done();
      });
  });

  it('should return status 201 and add second product to the database', (done) => {
    const productData = {
      name: 'lenovo',
      image: [
        'https://th.bing.com/th/id/OIP.X7aw6FD9rHltxaZXCkuG2wHaFw?pid=ImgDet&rs=1',
        'https://th.bing.com/th/id/OIP.X7aw6FD9rHltxaZXCkuG2wHaFw?pid=ImgDet&rs=1',
        'https://th.bing.com/th/id/OIP.X7aw6FD9rHltxaZXCkuG2wHaFw?pid=ImgDet&rs=1',
        'https://th.bing.com/th/id/OIP.X7aw6FD9rHltxaZXCkuG2wHaFw?pid=ImgDet&rs=1'
      ],
      price: 900.99,
      quantity: 10,
      category: 'Electronics',
      exDate: '2123-05-30'
    };

    chai
      .request(app)
      .post('/api/addProduct')
      .set({ Authorization: `Bearer ${SELLER_TOKEN}` })
      .send(productData)
      .end((err, res) => {
        chai.expect(res).to.have.status(201);
        const actualVal = res.body.message;
        expect(actualVal).to.be.equal('Product created successfully');
        done();
      });
  });

  // Define a test for searching by name
  it('should return products that match the name query', (done) => {
    const req = {
      query: {
        name: 'lenovo'
      }
    };
    chai
      .request(app)
      .get('/api/search')
      .set({ Authorization: `Bearer ${SELLER_TOKEN}` })
      .query(req.query)
      .end((err, res) => {
        chai.expect(res).to.have.status(200);
        done();
      });
  });

  // Define a test for searching by price range
  it('should return products that match the price range query', (done) => {
    const req = {
      query: {
        minPrice: 100,
        maxPrice: 1000
      }
    };
    chai
      .request(app)
      .get('/api/search')
      .set({ Authorization: `Bearer ${SELLER_TOKEN}` })
      .query(req.query)
      .end((err, res) => {
        chai.expect(res).to.have.status(200);
        done();
      });
  });

  // Define a test for searching by category
  it('should return products that match the category query', (done) => {
    chai
      .request(app)
      .get('/api/search?category=Electronics')
      .set({ Authorization: `Bearer ${SELLER_TOKEN}` })
      .end((err, res) => {
        chai.expect(res).to.have.status(200);
        done();
      });
  });

  // Define a test for searching with a combination of queries
  it('should return products that match the combination of queries', (done) => {
    chai
      .request(app)
      .get(
        '/api/search?name=Screen&category=Electronics&minPrice=100&maxPrice=1000'
      )
      .set({ Authorization: `Bearer ${SELLER_TOKEN}` })
      .end((err, res) => {
        chai.expect(res).to.have.status(200);
        done();
      });
  });

  // Define a test for searching with unavailable product
  it('should return error of 404 and a message of product not found ', (done) => {
    chai
      .request(app)
      .get('/api/search?name=Lion')
      .set({ Authorization: `Bearer ${SELLER_TOKEN}` })
      .end((err, res) => {
        chai.expect(res).to.have.status(404);
        const actualVal = res.body.message;
        expect(actualVal).to.be.equal('Product not found');
        done();
      });
  });

  it('should return error with status 406 when you entered an invalid credentials', (done) => {
    chai
      .request(app)
      .get('/api/search?minPrice=1000&maxPrice=100')
      .set({ Authorization: `Bearer ${SELLER_TOKEN}` })
      .end((err, res) => {
        chai.expect(res).to.have.status(406);
        done();
      });
  });

  it('should return error with status 406 when you entered an invalid credentials', (done) => {
    chai
      .request(app)
      .get('/api/search?name=')
      .set({ Authorization: `Bearer ${SELLER_TOKEN}` })
      .end((err, res) => {
        chai.expect(res).to.have.status(406);
        done();
      });
  });

  it('should return error with status 406 when you entered no query', (done) => {
    chai
      .request(app)
      .get('/api/search')
      .set({ Authorization: `Bearer ${SELLER_TOKEN}` })
      .end((err, res) => {
        chai.expect(res).to.have.status(406);
        const actualVal = res.body.message;
        expect(actualVal).to.be.equal('you should provide at least one query');
        done();
      });
  });
});
