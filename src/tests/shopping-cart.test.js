/* eslint-disable linebreak-style */
/* eslint-disable no-unused-vars */
import chai from 'chai';
import chaiHttp from 'chai-http';
import jwt from 'jsonwebtoken';
import app from '../../index';

import { Product } from '../Database/models';

const { expect } = chai;
chai.use(chaiHttp);

describe('SHOPPING CART TEST', () => {
  let EXISTING_PRODUCT_ID;
  let UNVAILABLE_PRODUCT_ID;
  let NO_EXISTING_PRODUCT_ID;
  let BUYER_TOKEN;
  let SELLER_TOKEN;

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

  // ADMING INFO
  const adminData = {
    firstname: 'Peter',
    lastname: 'Gymson',
    email: 'gymson@gmail.com',
    password: 'Gymson1912',
  };
  const loginAdmin = {
    email: 'gymson@gmail.com',
    password: 'Gymson1912',
  };
  // SELLER INFO
  const sellerData = {
    firstname: 'Joice',
    lastname: 'Price',
    email: 'joice19@gmail.com',
    password: 'Joice1912',
  };
  const sellerLoginData = {
    email: 'joice19@gmail.com',
    password: 'Joice1912',
  };
  // BUYER INFO
  const buyerData = {
    firstname: 'Brathics',
    lastname: 'James',
    email: 'brathics@gmail.com',
    password: 'Brathics1234',
  };
  const buyerLoginData = {
    email: 'brathics@gmail.com',
    password: 'Brathics1234',
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
    EXISTING_PRODUCT_ID = product.body.data.id;

    // PRODUCT 2
    const product2 = await chai
      .request(app)
      .post('/api/addProduct')
      .set('Authorization', `Bearer ${SELLER_TOKEN}`)
      .send({
        name: 'HCT/RP 360STSGc',
        image: [
          'https://th.bing.com/th/id/OIP.X7aw6FD9rHltxaZXCkuG2wHaFw?pid=ImgDet&rs=1',
          'https://th.bing.com/th/id/OIP.X7aw6FD9rHltxaZXCkuG2wHaFw?pid=ImgDet&rs=1',
          'https://th.bing.com/th/id/OIP.X7aw6FD9rHltxaZXCkuG2wHaFw?pid=ImgDet&rs=1',
          'https://th.bing.com/th/id/OIP.X7aw6FD9rHltxaZXCkuG2wHaFw?pid=ImgDet&rs=1',
        ],
        price: 2500,
        quantity: 12,
        category: 'GAMMING PC/2',
        exDate: '2023-05-30',
      });
    expect(product2).to.have.status(201);
    UNVAILABLE_PRODUCT_ID = product2.body.data.id;

    // Make product 2 unvailable
    const productData = {
      quantity: 5,
      exDate: '2020-04-30',
    };
    chai
      .request(app)
      .patch(`/api/mark-product-availability/${UNVAILABLE_PRODUCT_ID}`)
      .set({ Authorization: `Bearer ${SELLER_TOKEN}` })
      .send(productData)
      .end((err, res) => {
        chai.expect(res).to.have.status(200);
      });

    // ADD ITEM TO CART
    const addItemInCart = await chai
      .request(app)
      .post('/api/addItemToCart')
      .set({ Authorization: `Bearer ${BUYER_TOKEN}` })
      .send({
        EXISTING_PRODUCT_ID,
        quantity: 5,
      });

    console.log(`1 ========== Product ID ${EXISTING_PRODUCT_ID} `);
    console.log(`2 ========== UNAVAILABLE Product ID ${UNVAILABLE_PRODUCT_ID} `);
    console.log(`1 ========== SELLER ID ${SELLER_TOKEN} `);
    console.log(`2 ========== SELLER ID ${SELLER_TOKEN} `);
  });

  context('WHEN VALID PRODUCT ID AND QUANTITY ARE GIVEN ', () => {
    it('should add item to the shopping cart and return status 201', (done) => {
      const itemData = {
        productId: EXISTING_PRODUCT_ID,
        quantity: 2,
      };

      chai
        .request(app)
        .post('/api/addItemToCart')
        .set({ Authorization: `Bearer ${BUYER_TOKEN}` })
        .send(itemData)
        .end((err, res) => {
          chai.expect(res).to.have.status(201);
          const actualVal = res.body.message;
          expect(actualVal).to.be.equal(
            'YES!, ITEM ADD TO THE CART SUCCESSFULLY!!!'
          );
          done();
        });
    });
  });

  context('WHEN PRODUCT WITH THAT ID, ID NOT IN DATABASE', () => {
    it('should return status 404 and an error message', async () => {
      // make request to add item to cart
      const res = await chai
        .request(app)
        .post('/api/addItemToCart')
        .set({ Authorization: `Bearer ${BUYER_TOKEN}` })
        .send({ productId: 99, quantity: 1 });

      // assert response
      expect(res).to.have.status(400);
      const actualVal = res.body.message;
      expect(actualVal).to.be.equal(
        'THE PRODUCT WITH THAT ID, IS NOT AVAILABLE'
      );
    });
  });

  context('WHEN TOKEN IS NOT VALID', () => {
    it('should return status 401 and an error message', (done) => {
      const itemData = {
        productId: EXISTING_PRODUCT_ID,
        quantity: 2,
      };

      chai
        .request(app)
        .post('/api/addItemToCart')
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
        productId: EXISTING_PRODUCT_ID,
        quantity: 2,
      };
      chai
        .request(app)
        .post('/api/addItemToCart')
        .send(itemData)
        .end((err, res) => {
          chai.expect(res).to.have.status(401);
          const actualVal = res.body.message;
          expect(actualVal).to.be.equal('Authorization header missing');
          done();
        });
    });
  });

  context('WHEN PRODUCT IS UNAVAILABLE', () => {
    it('should return status 400 and an error message', (done) => {
      const itemData = {
        productId: UNVAILABLE_PRODUCT_ID,
        quantity: 2,
      };

      chai
        .request(app)
        .post('/api/addItemToCart')
        .set({ Authorization: `Bearer ${BUYER_TOKEN}` })
        .send(itemData)
        .end((err, res) => {
          chai.expect(res).to.have.status(400);
          const actualVal = res.body.message;
          expect(actualVal).to.be.equal(
            'THIS PRODUCT IS EITHER NOT IN STOCK OR EXPIRED'
          );
          done();
        });
    });
  });

  context('WHEN QUANTITY GIVEN IS NOT A NUMBER', () => {
    it('should return status 400 and an error message', (done) => {
      const itemData = {
        productId: EXISTING_PRODUCT_ID,
        quantity: 'two',
      };

      chai
        .request(app)
        .post('/api/addItemToCart')
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
        productId: EXISTING_PRODUCT_ID,
        quantity: -2,
      };

      chai
        .request(app)
        .post('/api/addItemToCart')
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
        productId: EXISTING_PRODUCT_ID,
        quantity: 98765,
      };

      chai
        .request(app)
        .post('/api/addItemToCart')
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
  context('WHEN FAILED TO ADD ITEM TO THE CART', () => {
    it('should return status 500 and an error message', (done) => {
      const itemData = {
        productId: NO_EXISTING_PRODUCT_ID,
        quantity: 2,
      };

      chai
        .request(app)
        .post('/api/addItemToCart')
        .set({ Authorization: `Bearer ${BUYER_TOKEN}` })
        .send(itemData)
        .end((err, res) => {
          chai.expect(res).to.have.status(500);
          done();
        });
    });
  });
});
