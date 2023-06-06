/* eslint-disable linebreak-style */
/* eslint-disable no-unused-vars */
import chai from 'chai';
import chaiHttp from 'chai-http';
import jwt from 'jsonwebtoken';
import app from '../../index';

const { expect } = chai;
chai.use(chaiHttp);

describe('UPDATING SHOPPING CART TEST', () => {
  const NO_EXISTING_PRODUCT_ID = 98745;
  let BUYER_TOKEN;
  let CART_ITEM_ID;

  let sellerRegResToken;
  let sellerRegResVerifyToken;
  let sellerId;
  let buyerRegResToken;
  let buyerRegResVerifyToken;
  let buyerId;

  let adminRegResToken;
  let adminRegResVerifyToken;
  let adminId;
  let adminToken;

  let SELLER_TOKEN;
  // ADMING INFO
  const adminData = {
    firstname: 'Peter',
    lastname: 'adams',
    email: 'adam9986skijhy@gmail.com',
    password: 'Adams1912',
  };
  const loginAdmin = {
    email: 'adam9986skijhy@gmail.com',
    password: 'Adams1912',
  };
  // SELLER INFO
  const sellerData = {
    firstname: 'State',
    lastname: 'Price',
    email: 'state19okj876@gmail.com',
    password: 'State1912',
  };
  const sellerLoginData = {
    email: 'state19okj876@gmail.com',
    password: 'State1912',
  };
  // BUYER INFO
  const buyerData = {
    firstname: 'MUGABO',
    lastname: 'James',
    email: 'mugabonju7895r@gmail.com',
    password: 'Mugabo1234',
  };
  const buyerLoginData = {
    email: 'mugabonju7895r@gmail.com',
    password: 'Mugabo1234',
  };

  before(async () => {
    // ========= SELLER ACCOUNT
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

    // ========= BUYER ACCOUNT
    const buyerAccount = await chai.request(app).post('/api/register').send(buyerData);

    buyerRegResToken = buyerAccount.body.token;
    buyerRegResVerifyToken = buyerAccount.body.verifyToken;

    const verifybuyerToken = await jwt.verify(
      buyerRegResToken,
      process.env.USER_SECRET_KEY
    );
    buyerId = verifybuyerToken.id;

    // verify email for buyer
    await chai
      .request(app)
      .get(`/api/${buyerId}/verify/${buyerRegResVerifyToken.token}`);

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
      .send(sellerLoginData);
    expect(sellerLogin).to.have.status(200);
    SELLER_TOKEN = sellerLogin.body.token;

    const buyerLogin = await chai
      .request(app)
      .post('/api/login')
      .send(buyerLoginData);
    expect(buyerLogin).to.have.status(200);
    BUYER_TOKEN = buyerLogin.body.token;

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
    const product = await chai
      .request(app)
      .post('/api/addProduct')
      .set('Authorization', `Bearer ${SELLER_TOKEN}`)
      .send({
        name: 'HCT/RP 360STS',
        image: [
          'https://th.bing.com/th/id/OIP.X7aw6FD9rHltxaZXCkuG2wHaFw?pid=ImgDet&rs=1',
          'https://th.bing.com/th/id/OIP.X7aw6FD9rHltxaZXCkuG2wHaFw?pid=ImgDet&rs=1',
          'https://th.bing.com/th/id/OIP.X7aw6FD9rHltxaZXCkuG2wHaFw?pid=ImgDet&rs=1',
          'https://th.bing.com/th/id/OIP.X7aw6FD9rHltxaZXCkuG2wHaFw?pid=ImgDet&rs=1',
        ],
        price: 2500,
        quantity: 12,
        category: 'GAMMING PC',
        exDate: '2023-05-30',
      });
    expect(product).to.have.status(201);
    const productId = product.body.data.id;

    const addItemInCart = await chai
      .request(app)
      .post('/api/addItemToCart')
      .set({ Authorization: `Bearer ${BUYER_TOKEN}` })
      .send({
        productId,
        quantity: 5,
      });

    CART_ITEM_ID = addItemInCart.body.data['CURRENT CART DETAILS']['ADDED PRODUCT DETAILS ']
      .ID;
  });

  context('IT SHOULD UPATE ITEM IN SHOPPING CART ', () => {
    it('should add item to the shopping cart and return status 200', async () => {
      // make request to add item to cart
      const res = await chai
        .request(app)
        .patch(`/api/updateShoppingCart/${CART_ITEM_ID}`)
        .set({ Authorization: `Bearer ${BUYER_TOKEN}` })
        .send({ quantity: 3 });

      // assert response
      expect(res).to.have.status(200);
      const actualVal = res.body.message;
      expect(actualVal).to.be.equal(
        'THE ITEM IN THE CART WAS UPDATED SUCCESSFULLY!!!'
      );
    });
  });
  context('WHEN PRODUCT WITH THAT ID, ID NOT IN PRODUCT', () => {
    it('should return status 404 and an error message', async () => {
      // make request to add item to cart
      const res = await chai
        .request(app)
        .patch(`/api/updateShoppingCart/${NO_EXISTING_PRODUCT_ID}`)
        .set({ Authorization: `Bearer ${BUYER_TOKEN}` })
        .send({ quantity: 1 });

      // assert response
      expect(res).to.have.status(404);
      const actualVal = res.body.message;
      expect(actualVal).to.be.equal('THE PRODUCT IS NOT IN THE CART');
    });
  });

  context('WHEN TOKEN IS NOT VALID', () => {
    it('should return status 401 and an error message', (done) => {
      const itemData = {
        quantity: 2,
      };

      chai
        .request(app)
        .patch(`/api/updateShoppingCart/${CART_ITEM_ID}`)
        .set({ Authorization: 'Bearer invalid_token' })
        .send(itemData)
        .end((err, res) => {
          chai.expect(res).to.have.status(401);
          const actualVal = res.body.message;
          expect(actualVal).to.be.equal('Invalid token');
          done();
        });
    });
  });
  context('WHEN NO TOKEN IS GIVEN', () => {
    it('should return status 401 and an error message', (done) => {
      const itemData = {
        quantity: 2,
      };
      chai
        .request(app)
        .patch(`/api/updateShoppingCart/${CART_ITEM_ID}`)
        .send(itemData)
        .end((err, res) => {
          chai.expect(res).to.have.status(401);
          const actualVal = res.body.message;
          expect(actualVal).to.be.equal('Authorization header missing');
          done();
        });
    });
  });

  context('WHEN QUANTITY GIVEN IS NOT A NUMBER', () => {
    it('should return status 400 and an error message', (done) => {
      const itemData = {
        quantity: 'two',
      };

      chai
        .request(app)
        .patch(`/api/updateShoppingCart/${CART_ITEM_ID}`)
        .set({ Authorization: `Bearer ${BUYER_TOKEN}` })
        .send(itemData)
        .end((err, res) => {
          chai.expect(res).to.have.status(400);
          const actualVal = res.body.message;
          expect(actualVal).to.be.equal(
            'QUANTITY HAS TO BE A VALID POSITIVE NUMBER(s) [1-9]'
          );
          done();
        });
    });
  });
  context('WHEN QUANTITY GIVEN HAS A NEGATIVE NUMBER', () => {
    it('should return status 400 and an error message', (done) => {
      const itemData = {
        quantity: -2,
      };

      chai
        .request(app)
        .patch(`/api/updateShoppingCart/${CART_ITEM_ID}`)
        .set({ Authorization: `Bearer ${BUYER_TOKEN}` })
        .send(itemData)
        .end((err, res) => {
          chai.expect(res).to.have.status(400);
          const actualVal = res.body.message;
          expect(actualVal).to.be.equal(
            'PLEASE ENTER POSITIVE NUMBER(s), LIKE [1-9]'
          );
          done();
        });
    });
  });

  context('WHEN QUANTITY GIVEN IS GREATER THAN STOCK', () => {
    it('should return status 400 and an error message', (done) => {
      const itemData = {
        quantity: 98765,
      };

      chai
        .request(app)
        .patch(`/api/updateShoppingCart/${CART_ITEM_ID}`)
        .set({ Authorization: `Bearer ${BUYER_TOKEN}` })
        .send(itemData)
        .end((err, res) => {
          chai.expect(res).to.have.status(400);
          const actualVal = res.body.message;
          expect(actualVal).to.be.equal('THE STOCK HAS LESS QUANTITY');
          done();
        });
    });
  });
});
