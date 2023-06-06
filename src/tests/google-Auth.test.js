import chai from 'chai';
import app from '../../index';

const { expect } = chai;

describe('Authenticate with google', () => {
  it('should return a response with status code 200', (done) => {
    chai
      .request(app)
      .get('/')
      .end((err, res) => {
        chai.expect(res).to.have.status(200);
        done();
      });
  });
});
describe('Google credentials', () => {
  it('should return a response with status code 200', (done) => {
    chai
      .request(app)
      .get('/auth/google')
      .end((err, res) => {
        chai.expect(res).to.have.status(200);
        done();
      });
  });
});
describe('Google callback', () => {
  it('should return a response with status code 200', (done) => {
    chai
      .request(app)
      .get('/google/callback')
      .end((err, res) => {
        chai.expect(res).to.have.status(200);
        done();
      });
  });
});
describe('GET /auth/failure', () => {
  it('should return status code 200', async () => {
    const res = await chai.request(app).get('/auth/failure');

    expect(res).to.have.status(200);
  });
});
describe('GET /protected', () => {
  it('should return status code 401 when user is not authenticated', async () => {
    const res = await chai.request(app).get('/protected');

    expect(res).to.have.status(401);
  });
});
