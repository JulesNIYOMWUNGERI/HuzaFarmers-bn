/* eslint-disable linebreak-style */
/* eslint-disable no-unused-vars */
import chai from 'chai';
import chaiHttp from 'chai-http';
import jwt from 'jsonwebtoken';
import app from '../../index';

chai.use(chaiHttp);
const { expect } = chai;

describe('VIEW SPECIFIC PRODUCT /api/getProduct/:id', () => {
  let existingProductId;
  let SELLER_TOKEN;

  let sellerRegResToken;
  let sellerRegResVerifyToken;
  let sellerId;

  let adminRegResToken;
  let adminRegResVerifyToken;
  let adminId;
  let adminToken;
  // ADMING INFO
  const adminData = {
    firstname: 'Peter',
    lastname: 'adams',
    email: 'adamsniu@gmail.com',
    password: 'Adams1912',
  };
  const loginAdmin = {
    email: 'adamsniu@gmail.com',
    password: 'Adams1912',
  };
  // SELLER INFO
  const sellerData = {
    firstname: 'State',
    lastname: 'Price',
    email: 'state19jyt@gmail.com',
    password: 'State1912',
  };
  const loginSellerData = {
    email: 'state19jyt@gmail.com',
    password: 'State1912',
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

    // create a new product to be added to the shopping cart
    const productRes = await chai
      .request(app)
      .post('/api/addProduct')
      .set('Authorization', `Bearer ${SELLER_TOKEN}`)
      .send({
        name: 'HCT/RP 36ST',
        image: [
          'https://th.bing.com/th/id/OIP.X7aw6FD9rHltxaZXCkuG2wHaFw?pid=ImgDet&rs=1',
          'https://th.bing.com/th/id/OIP.X7aw6FD9rHltxaZXCkuG2wHaFw?pid=ImgDet&rs=1',
          'https://th.bing.com/th/id/OIP.X7aw6FD9rHltxaZXCkuG2wHaFw?pid=ImgDet&rs=1',
          'https://th.bing.com/th/id/OIP.X7aw6FD9rHltxaZXCkuG2wHaFw?pid=ImgDet&rs=1',
        ],
        price: 2500,
        quantity: 12,
        category: 'GAMMING PC',
        exDate: '2123-05-30',
      });
    existingProductId = productRes.body.data.id;
  });

  //= === START TESTS
  context('when a buyer requests a product that is available', () => {
    it('should return status 200', (done) => {
      chai
        .request(app)
        .get(`/api/getProduct/${existingProductId}`)
        .set({ Authorization: `Bearer ${SELLER_TOKEN}` })
        .end((err, res) => {
          chai.expect(res).to.have.status(200);
          done();
        });
    });
  });

  context(
    'when a seller requests a product that is available in their collecion',
    () => {
      it('should return status 200 and the details of the product', (done) => {
        chai
          .request(app)
          .get(`/api/getProduct/${existingProductId}`)
          .set({ Authorization: `Bearer ${SELLER_TOKEN}` })
          .end((err, res) => {
            chai.expect(res).to.have.status(200);
            done();
          });
      });
    }
  );

  context('when the productId is invalid', () => {
    it('should return status 404', (done) => {
      chai
        .request(app)
        .get('/api/getProduct/1000')
        .set({ Authorization: `Bearer ${SELLER_TOKEN}` })
        .end((err, res) => {
          chai.expect(res).to.have.status(404);
          done();
        });
    });
  });
});
