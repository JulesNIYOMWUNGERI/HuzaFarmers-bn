/* eslint-disable linebreak-style */
/* eslint-disable no-unused-vars */
import 'dotenv/config';
import chai from 'chai';
import chaiHttp from 'chai-http';
import sinon from 'sinon';
import jwt from 'jsonwebtoken';
import { Product, User } from '../Database/models';
import app from '../../index';

const { expect } = chai;
chai.use(chaiHttp);

describe('POST PRODUCT', async () => {
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
    email: 'sheila1@gmail.com',
    password: 'Admin1912',
  };
  const loginAdmin = {
    email: 'sheila1@gmail.com',
    password: 'Admin1912',
  };
  const sellerData = {
    firstname: 'Mike',
    lastname: 'sinzi',
    email: 'sinzi1@gmail.com',
    password: 'Seller1912',
  };
  const loginSellerData = {
    email: 'sinzi1@gmail.com',
    password: 'Seller1912',
  };
  const seller2Data = {
    firstname: 'Michael',
    lastname: 'sinzi',
    email: 'michael1@gmail.com',
    password: 'Seller1912',
  };
  const loginSeller2Data = {
    email: 'michael1@gmail.com',
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

  after(async () => {
    // Delete all the products from the Products table
    await Product.destroy({ truncate: true, cascade: true });

    // Delete all the users from the Users table
    await User.destroy({ truncate: true, cascade: true });
  });

  context('CREATE PRODUCT WITH valid Data', () => {
    it('should return status 201 and add the product to the database', async () => {
      const productData = {
        name: 'Screen',
        image: [
          'https://th.bing.com/th/id/OIP.X7aw6FD9rHltxaZXCkuG2wHaFw?pid=ImgDet&rs=1',
          'https://th.bing.com/th/id/OIP.X7aw6FD9rHltxaZXCkuG2wHaFw?pid=ImgDet&rs=1',
          'https://th.bing.com/th/id/OIP.X7aw6FD9rHltxaZXCkuG2wHaFw?pid=ImgDet&rs=1',
          'https://th.bing.com/th/id/OIP.X7aw6FD9rHltxaZXCkuG2wHaFw?pid=ImgDet&rs=1',
        ],
        price: 2000.99,
        quantity: 10,
        category: 'Electronics',
        exDate: '2023-05-30',
      };

      const res = await chai
        .request(app)
        .post('/api/addProduct')
        .set({ Authorization: `Bearer ${SELLER_TOKEN}` })
        .send(productData);
      expect(res).to.have.status(201);
      const actualVal = res.body.message;
      expect(actualVal).to.be.equal('Product created successfully');
    });
  });

  context('WHEN A PRODUCT ALREADY EXISTS in the seller collection', () => {
    it('should return status 200 and return an adequate message', async () => {
      const productData = {
        name: 'Screen',
        image: [
          'https://th.bing.com/th/id/OIP.X7aw6FD9rHltxaZXCkuG2wHaFw?pid=ImgDet&rs=1',
          'https://th.bing.com/th/id/OIP.X7aw6FD9rHltxaZXCkuG2wHaFw?pid=ImgDet&rs=1',
          'https://th.bing.com/th/id/OIP.X7aw6FD9rHltxaZXCkuG2wHaFw?pid=ImgDet&rs=1',
          'https://th.bing.com/th/id/OIP.X7aw6FD9rHltxaZXCkuG2wHaFw?pid=ImgDet&rs=1',
        ],
        price: 2000.99,
        quantity: 10,
        category: 'Electronics',
        exDate: '2023-05-30',
      };

      const res = await chai
        .request(app)
        .post('/api/addProduct')
        .set({ Authorization: `Bearer ${SELLER_TOKEN}` })
        .send(productData);
      expect(res).to.have.status(200);
      const actualVal = res.body.message;
      expect(actualVal).to.be.equal(
        'The product already exists, its quantity has been updated to 20, To make other changes to the product use the update option'
      );
    });
  });

  context('when a required field is missing', () => {
    it('should return status 400 and an error message detailing the missing field', async () => {
      const productData = {
        name: 'Laptop',
        image: [
          'https://th.bing.com/th/id/OIP.X7aw6FD9rHltxaZXCkuG2wHaFw?pid=ImgDet&rs=1',
          'https://th.bing.com/th/id/OIP.X7aw6FD9rHltxaZXCkuG2wHaFw?pid=ImgDet&rs=1',
          'https://th.bing.com/th/id/OIP.X7aw6FD9rHltxaZXCkuG2wHaFw?pid=ImgDet&rs=1',
          'https://th.bing.com/th/id/OIP.X7aw6FD9rHltxaZXCkuG2wHaFw?pid=ImgDet&rs=1',
        ],
        price: 2000.99,
        quantity: 10,
        category: 'Electronics',
        // exDate is missing
      };

      const res = await chai
        .request(app)
        .post('/api/addProduct')
        .set({ Authorization: `Bearer ${SELLER_TOKEN}` })
        .send(productData);
      chai.expect(res).to.have.status(400);
    });
  });

  context('when the price value is invalid', () => {
    it('should return status 400 and an error message', async () => {
      const productData = {
        name: 'Laptop',
        image: [
          'https://th.bing.com/th/id/OIP.X7aw6FD9rHltxaZXCkuG2wHaFw?pid=ImgDet&rs=1',
          'https://th.bing.com/th/id/OIP.X7aw6FD9rHltxaZXCkuG2wHaFw?pid=ImgDet&rs=1',
          'https://th.bing.com/th/id/OIP.X7aw6FD9rHltxaZXCkuG2wHaFw?pid=ImgDet&rs=1',
          'https://th.bing.com/th/id/OIP.X7aw6FD9rHltxaZXCkuG2wHaFw?pid=ImgDet&rs=1',
        ],
        price: 'invalid_price_value',
        quantity: 10,
        category: 'example',
        exDate: '2123-04-30',
      };

      const res = await chai
        .request(app)
        .post('/api/addProduct')
        .set({ Authorization: `Bearer ${SELLER_TOKEN}` })
        .send(productData);
      chai.expect(res).to.have.status(400);
      const actualVal = res.body.message;
      expect(actualVal).to.be.equal('"price" must be a number');
    });
  });

  context('when product creation fails', () => {
    it('should return status 500 and an error message', async () => {
      // Mock the behavior of the Product.create method to always throw an error
      const createStub = sinon
        .stub(Product, 'create')
        .rejects(new Error('Failed to create product'));
      const productData = {
        name: 'Laptop',
        image: [
          'https://th.bing.com/th/id/OIP.X7aw6FD9rHltxaZXCkuG2wHaFw?pid=ImgDet&rs=1',
          'https://th.bing.com/th/id/OIP.X7aw6FD9rHltxaZXCkuG2wHaFw?pid=ImgDet&rs=1',
          'https://th.bing.com/th/id/OIP.X7aw6FD9rHltxaZXCkuG2wHaFw?pid=ImgDet&rs=1',
          'https://th.bing.com/th/id/OIP.X7aw6FD9rHltxaZXCkuG2wHaFw?pid=ImgDet&rs=1',
        ],
        price: 2000.99,
        quantity: 10,
        category: 'Electronics',
        exDate: '2023-05-30',
      };
      const res = chai
        .request(app)
        .post('/api/addProduct')
        .set({ Authorization: `Bearer ${SELLER_TOKEN}` })
        .send(productData)
        .end((err, res) => {
          expect(res).to.have.status(500);
          const actualVal = res.body.message;
          expect(actualVal).to.be.equal('Failed to create product');
          // Restore the original behavior of the Product.create method
          createStub.restore();
        });
    });

    context('when the quantity is not a positive number', () => {
      it('should return status 400 and an error message', async () => {
        const productData = {
          name: 'Laptop',
          image: [
            'https://th.bing.com/th/id/OIP.X7aw6FD9rHltxaZXCkuG2wHaFw?pid=ImgDet&rs=1',
            'https://th.bing.com/th/id/OIP.X7aw6FD9rHltxaZXCkuG2wHaFw?pid=ImgDet&rs=1',
            'https://th.bing.com/th/id/OIP.X7aw6FD9rHltxaZXCkuG2wHaFw?pid=ImgDet&rs=1',
            'https://th.bing.com/th/id/OIP.X7aw6FD9rHltxaZXCkuG2wHaFw?pid=ImgDet&rs=1',
          ],
          quantity: -12,
          price: 200,
          category: 'example',
          exDate: '2023-05-30',
        };

        const res = await chai
          .request(app)
          .post('/api/addProduct')
          .set({ Authorization: `Bearer ${SELLER_TOKEN}` })
          .send(productData);
        expect(res).to.have.status(400);
        const actualVal = res.body.message;
        expect(actualVal).to.be.equal(
          '"quantity" must be greater than or equal to 0'
        );
      });
    });

    // context('when product creation fails', () => {
    //   it('should return status 500 and an error message', async () => {
    //   // Mock the behavior of the Product.create method to always throw an error
    //     const createStub = sinon
    //       .stub(Product, 'create')
    //       .rejects(new Error('Failed to create product'));
    //     const productData = {
    //       name: 'Laptop',
    //       image: [
    //         'https://th.bing.com/th/id/OIP.X7aw6FD9rHltxaZXCkuG2wHaFw?pid=ImgDet&rs=1',
    //         'https://th.bing.com/th/id/OIP.X7aw6FD9rHltxaZXCkuG2wHaFw?pid=ImgDet&rs=1',
    //         'https://th.bing.com/th/id/OIP.X7aw6FD9rHltxaZXCkuG2wHaFw?pid=ImgDet&rs=1',
    //         'https://th.bing.com/th/id/OIP.X7aw6FD9rHltxaZXCkuG2wHaFw?pid=ImgDet&rs=1',
    //       ],
    //       price: 2000.99,
    //       quantity: 10,
    //       category: 'HP',
    //       exDate: '2023-05-30',
    //     };
    //     const res = await chai
    //       .request(app)
    //       .post('/api/addProduct')
    //       .set({ Authorization: `Bearer ${SELLER_TOKEN}` })
    //       .send(productData);
    //     expect(res).to.have.status(500);
    //     const actualVal = res.body.message;
    //     expect(actualVal).to.be.equal('Failed to create product');
    //     // Restore the original behavior of the Product.create method
    //     createStub.restore();
    //   });
    // });
  });
});
