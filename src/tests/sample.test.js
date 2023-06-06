/* eslint-disable arrow-parens */
/* eslint-disable linebreak-style */
/* eslint-disable no-unused-expressions */
import chai from 'chai';
import chaiHttp from 'chai-http';
import sgMail from '@sendgrid/mail';
import app from '../../index';

sgMail.setApiKey(process.env.SENDGRID_API_KEY);
chai.use(chaiHttp);
chai.use(chaiHttp);

describe('Sample Test', () => {
  it('should return a response with status code 200', done => {
    chai
      .request(app)
      .get('/api/sample_test')
      .end((err, res) => {
        chai.expect(res).to.have.status(200);
        done();
      });
  });
});
