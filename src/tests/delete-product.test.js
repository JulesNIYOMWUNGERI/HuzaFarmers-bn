/* eslint-disable linebreak-style */
import chai from 'chai';
import chaiHttp from 'chai-http';
import jwt from 'jsonwebtoken';
import app from '../../index';

chai.use(chaiHttp);
const { expect } = chai;

describe('DELETE /api/deleteProduct/:id', () => {
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
    email: 'adams@gmail.com',
    password: 'Adams1912',
  };
  const loginAdmin = {
    email: 'adams@gmail.com',
    password: 'Adams1912',
  };
  // SELLER INFO
  const sellerData = {
    firstname: 'State',
    lastname: 'Price',
    email: 'state19@gmail.com',
    password: 'State1912',
  };
  const loginSellerData = {
    email: 'state19@gmail.com',
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

  context('when deleting an existing product with valid data', () => {
    it('should return status 200 and delete the product in the database', (done) => {
      chai
        .request(app)
        .delete(`/api/deleteProduct/${existingProductId}`)
        .set({ Authorization: `Bearer ${SELLER_TOKEN}` })
        .end((err, res) => {
          const actualVal = res.body.message;
          chai.expect(res).to.have.status(200);
          expect(actualVal).to.have.equal('Product deleted successfully');
          done();
        });
    });
  });
  it('should return a 404 error if the product is not found', async () => {
    const res = await chai
      .request(app)
      .delete('/api/deleteProduct/999')
      .set({ Authorization: `Bearer ${SELLER_TOKEN}` });
    res.should.have.status(404);
    res.body.should.have.property('message').equal('Product not found');
  });
});
