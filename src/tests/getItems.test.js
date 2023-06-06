/* eslint-disable no-unused-vars */
/* eslint-disable linebreak-style */
import chai from 'chai';
import chaiHttp from 'chai-http';
import jwt from 'jsonwebtoken';
import app from '../../index';

const { expect } = chai;
chai.use(chaiHttp);

describe('Retrieve list of items', () => {
  let sellerToken;
  let adminToken;
  let sellerId;
  let UserId;
  // eslint-disable-next-line no-unused-vars
  let adminRegResToken;
  let customerTokenBeforeMechant;
  let buyerToken;

  let buyerRegResToken;
  let buyerRegResVerifyToken;
  let buyerId;

  let sellerRegResToken;
  let sellerRegResVerifyToken;
  let sellerID;

  let adminRegResVerifyToken;
  let adminId;

  const adminData = {
    firstname: 'admin',
    lastname: 'admin',
    email: 'john@gmail.com',
    password: 'Test123456',
  };
  const sellerData = {
    firstname: 'Jana',
    lastname: 'Seller',
    email: 'pacifique@gmail.com',
    password: 'Seller1912',
  };
  const buyerData = {
    firstname: 'Buyer',
    lastname: 'Seller',
    email: 'shimwa@gmail.com',
    password: 'Abc123456',
  };
  const loginAdmin = {
    email: 'john@gmail.com',
    password: 'Test123456',
  };
  const loginSeller = {
    email: 'pacifique@gmail.com',
    password: 'Seller1912',
  };
  const loginBuyer = {
    email: 'shimwa@gmail.com',
    password: 'Abc123456',
  };
  before(async () => {
    // Register admin
    const adminRegRes = await chai
      .request(app)
      .post('/api/registerAdmin')
      .send(adminData);
    adminRegResToken = adminRegRes.body.token;
    adminRegResVerifyToken = adminRegRes.body.verifyToken;

    const verifyAdminToken = await jwt.verify(
      adminRegResToken,
      process.env.USER_SECRET_KEY
    );
    adminId = verifyAdminToken.id;

    // verify email for user1
    await chai
      .request(app)
      .get(`/api/${adminId}/verify/${adminRegResVerifyToken.token}`);

    // Register seller
    // eslint-disable-next-line no-unused-vars
    const sellerRes = await chai
      .request(app)
      .post('/api/register')
      .send(sellerData);

    sellerRegResToken = sellerRes.body.token;
    sellerRegResVerifyToken = sellerRes.body.verifyToken;

    const verifySellerToken = await jwt.verify(
      sellerRegResToken,
      process.env.USER_SECRET_KEY
    );
    sellerID = verifySellerToken.id;

    // verify email for user2
    await chai
      .request(app)
      .get(`/api/${sellerID}/verify/${sellerRegResVerifyToken.token}`);

    // Register buyer
    // eslint-disable-next-line no-unused-vars
    const buyerRes = await chai
      .request(app)
      .post('/api/register')
      .send(buyerData);
    // UserId = buyerRes.body.id;

    buyerRegResToken = buyerRes.body.token;
    buyerRegResVerifyToken = buyerRes.body.verifyToken;

    const verifyBuyerToken = await jwt.verify(
      buyerRegResToken,
      process.env.USER_SECRET_KEY
    );
    buyerId = verifyBuyerToken.id;

    // verify email for user2
    await chai
      .request(app)
      .get(`/api/${buyerId}/verify/${buyerRegResVerifyToken.token}`);

    // Login as buyer and get token
    const buyerLoginRes = await chai
      .request(app)
      .post('/api/login')
      .send(loginBuyer);
    expect(buyerLoginRes).to.have.status(200);
    buyerToken = buyerLoginRes.body.token;

    // Login as admin and get token
    const adminRes = await chai
      .request(app)
      .post('/api/login')
      .send(loginAdmin);
    expect(adminRes).to.have.status(200);
    adminToken = adminRes.body.token;

    // Login as Login Seller before updted and get token
    const customerTokenBeforeMechantRes = await chai
      .request(app)
      .post('/api/login')
      .send(loginSeller);
    expect(customerTokenBeforeMechantRes).to.have.status(200);
    customerTokenBeforeMechant = customerTokenBeforeMechantRes.body.token;

    const verifyCustomerBeforeMerchant = await jwt.verify(
      customerTokenBeforeMechant,
      process.env.USER_SECRET_KEY
    );
    sellerId = verifyCustomerBeforeMerchant.id;

    // Update user's role
    await chai
      .request(app)
      .patch(`/api/updateRole/${buyerId}`)
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ role: 'merchant' });
    expect(adminRes).to.have.status(200);

    // Update seller's role
    await chai
      .request(app)
      .patch(`/api/updateRole/${sellerId}`)
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ role: 'merchant' });
    expect(adminRes).to.have.status(200);

    // Login as seller and get token
    const sellerLoginRes = await chai
      .request(app)
      .post('/api/login')
      .send(loginSeller);
    expect(sellerLoginRes).to.have.status(200);
    sellerToken = sellerLoginRes.body.token;
  });

  it('should return status 201 and add the product to the database', (done) => {
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
      type: 'Television',
      category: 'Electronics',
      exDate: '2123-05-30',
    };

    chai
      .request(app)
      .post('/api/addProduct')
      .set({ Authorization: `Bearer ${sellerToken}` })
      .send(productData)
      .end((err, res) => {
        chai.expect(res).to.have.status(201);
        const actualVal = res.body.message;
        expect(actualVal).to.be.equal('Product created successfully');
        done();
      });
  });

  it('should retrive a list of all items with status code 200', (done) => {
    chai
      .request(app)
      .get('/api')
      .end((err, res) => {
        chai.expect(res).to.have.status(200);
        done();
      });
  });

  it('should retrive a list of all items in the collection of seller with status code 200', (done) => {
    chai
      .request(app)
      .get('/api/sellerCollection')
      .set({ Authorization: `Bearer ${sellerToken}` })
      .end((err, res) => {
        chai.expect(res).to.have.status(200);
        done();
      });
  });
  it('should return a status code 401 when user has no access', (done) => {
    chai
      .request(app)
      .get('/api/sellerCollection')
      .set({ Authorization: `Bearer ${buyerToken}` })
      .end((err, res) => {
        chai.expect(res).to.have.status(404);
        done();
      });
  });
  it('should return a status code 401 when token is invalid', (done) => {
    const token = '.eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6Imp1bGVzMjJAZ21haWwuY29tIiwiaWQiOjIsImlhdCI6MTY4MTE5ODg4MiwiZXhwIjoxNjgxMzcxNjgyfQ.Ffk2vqJUTerxMCECkJtLHV4SrZq3kP3ppbo4mDZg8MM';
    chai
      .request(app)
      .get('/api/sellerCollection')
      .set({ Authorization: `Bearer ${token}` })
      .end((err, res) => {
        chai.expect(res).to.have.status(401);
        done();
      });
  });
  it('should return a status code 401 when token is invalid', (done) => {
    chai
      .request(app)
      .get('/api/sellerCollection')
      .end((err, res) => {
        chai.expect(res).to.have.status(401);
        done();
      });
  });
  it('should return a status code 401 when token is expired', (done) => {
    const token = 'eyJlbWFpbCI6ImFiY0BnbWFpbC5jb20iLCJpY8XQiOjE2ODA0MzIzMDZ9.1-JRsNPQIX0wIc3OEcZyFe__gyy07de1PMmaIPo4_zQ';
    chai
      .request(app)
      .get('/api/sellerCollection')
      .set({ Authorization: `Bearer ${token}` })
      .end((err, res) => {
        chai.expect(res).to.have.status(401);
        done();
      });
  });
  it('should set size to default value if sizeAsNumber is NaN', (done) => {
    const req = {
      query: {
        page: 1,
        size: 'not a number',
      },
    };
    chai
      .request(app)
      .get('/api')
      .query(req.query)
      .end((err, res) => {
        chai.expect(res).to.have.status(200);
        chai.expect(res.body.data).to.have.property('itemsPerPage').to.equal(5);
        done();
      });
  });
  it('should set size to default value if sizeAsNumber is not under 10', (done) => {
    const req = {
      query: {
        page: 1,
        size: 200,
      },
    };
    chai
      .request(app)
      .get('/api')
      .query(req.query)
      .end((err, res) => {
        chai.expect(res).to.have.status(200);
        chai.expect(res.body.data).to.have.property('itemsPerPage').to.equal(5);
        done();
      });
  });
  it('should set size and page to default value if sizeAsNumber is NaN and number of page is less than 1', (done) => {
    const req = {
      query: {
        page: -2,
        size: 'not a number',
      },
    };
    chai
      .request(app)
      .get('/api')
      .query(req.query)
      .end((err, res) => {
        chai.expect(res).to.have.status(200);
        chai.expect(res.body.data).to.have.property('itemsPerPage').to.equal(5);
        chai.expect(res.body.data).to.have.property('currentPage').to.equal(1);
        done();
      });
  });
  it('should set size and page to default value if sizeAsNumber is NaN and number of page is less than 1 then retrive all items in collection of seller', (done) => {
    const req = {
      query: {
        page: -2,
        size: 'not a number',
      },
    };
    chai
      .request(app)
      .get('/api/sellerCollection')
      .set({ Authorization: `Bearer ${sellerToken}` })
      .query(req.query)
      .end((err, res) => {
        chai.expect(res).to.have.status(200);
        chai.expect(res.body.data).to.have.property('itemsPerPage').to.equal(5);
        chai.expect(res.body.data).to.have.property('currentPage').to.equal(1);
        done();
      });
  });
  it('should set size to default value if sizeAsNumber is not under 10 and then return all items in collection of seller', (done) => {
    const req = {
      query: {
        page: 1,
        size: 200,
      },
    };
    chai
      .request(app)
      .get('/api/sellerCollection')
      .set({ Authorization: `Bearer ${sellerToken}` })
      .query(req.query)
      .end((err, res) => {
        chai.expect(res).to.have.status(200);
        chai.expect(res.body.data).to.have.property('itemsPerPage').to.equal(5);
        done();
      });
  });
  it('should set size and page to default value if sizeAsNumber is not under 10 and pageAsNumber is under 1 and then return all items in collection of seller', (done) => {
    const req = {
      query: {
        page: -2,
        size: 200,
      },
    };
    chai
      .request(app)
      .get('/api/sellerCollection')
      .set({ Authorization: `Bearer ${sellerToken}` })
      .query(req.query)
      .end((err, res) => {
        chai.expect(res).to.have.status(200);
        chai.expect(res.body.data).to.have.property('itemsPerPage').to.equal(5);
        chai.expect(res.body.data).to.have.property('currentPage').to.equal(1);
        done();
      });
  });
  it('getListOfSellerItems should return the status of 404 when no items found on specified page', (done) => {
    const req = {
      query: {
        page: 5,
        size: 200,
      },
    };
    chai
      .request(app)
      .get('/api/sellerCollection')
      .set({ Authorization: `Bearer ${sellerToken}` })
      .query(req.query)
      .end((err, res) => {
        chai.expect(res).to.have.status(404);
        done();
      });
  });

  it('getListOfBuyerItems should return the status of 404 when no items found on specified page', (done) => {
    const req = {
      query: {
        page: 5,
        size: 200,
      },
    };
    chai
      .request(app)
      .get('/api')
      .set({ Authorization: `Bearer ${sellerToken}` })
      .query(req.query)
      .end((err, res) => {
        chai.expect(res).to.have.status(404);
        done();
      });
  });
});
