/* eslint-disable linebreak-style */
import 'dotenv/config';
import chai from 'chai';
import chaiHttp from 'chai-http';

import app from '../../index';

const { expect } = chai;
chai.use(chaiHttp);

describe('USER PROFILE TESTS', () => {
  let USER_TOKEN;

  // USER INFO
  const userData = {
    firstname: 'MUGABO',
    lastname: 'James',
    email: 'mugabojs@gmail.com',
    password: 'Mugabo1234',
  };
  const userLoginData = {
    email: 'mugabojs@gmail.com',
    password: 'Mugabo1234',
  };

  before(async () => {
    // ========= USER ACCOUNT
    await chai.request(app).post('/api/register').send(userData);

    const userLogin = await chai
      .request(app)
      .post('/api/login')
      .send(userLoginData);
    expect(userLogin).to.have.status(200);
    USER_TOKEN = userLogin.body.token;
  });

  context(' IT SHOULD SAVE USER INFO ', () => {
    it('should return status 201 and create user', async () => {
      const userProfileData = {
        gender: 'Male',
        birthdate: '1990-05-15',
        preferredLanguage: 'English',
        preferredCurrency: 'USD',
        homeAddress: '123 Main Street',
        street: 'Main Street',
        city: 'Cityville',
        country: 'United States',
        poBoxNumber: '456789',
        zipCode: '12345',
        phoneNumber: '+1 123-456-7890',
        profileImage: 'https://pbs.twimg.com/profile_images/643271279/Screen_shot_2010-01-20_at_1.17.37_AM_400x400.png'
      };

      const res = await chai
        .request(app)
        .post('/api/post-user-profile')
        .set({ Authorization: `Bearer ${USER_TOKEN}` })
        .send(userProfileData);

      expect(res).to.have.status(201);
    });
  });

  context('INVALID REQUEST BODY', () => {
    it('should return status 400 with error details', async () => {
      const invalidUserProfileData = {
        gender: 'Male',
        birthdate: '1990-05-15',
        preferredLanguage: 'English',
        homeAddress: '123 Main Street',
        street: 'Main Street',
        city: 'Cityville',
        country: 'United States',
        poBoxNumber: '456789',
        zipCode: '12345',
        phoneNumber: '+1 123-456-7890',
        profileImage: 'Screen_shot_2010-01-20_at_1.17.37_AM_400x400.png'
      };

      const res = await chai
        .request(app)
        .post('/api/post-user-profile')
        .set({ Authorization: `Bearer ${USER_TOKEN}` })
        .send(invalidUserProfileData);

      expect(res).to.have.status(400);
    });
  });

  context('GET USER PROFILES', () => {
    it('should return status 200 and user profile if found', async () => {
      const res = await chai
        .request(app)
        .get('/api/get-user-profile')
        .set({ Authorization: `Bearer ${USER_TOKEN}` });

      expect(res).to.have.status(200);
    });
  });

  context('UPDATE USER PROFILE', () => {
    it('should update user profile and return status 200', async () => {
      const updatedUserProfileData = {
        gender: 'Other',
        preferredLanguage: 'Dutch'
      };

      const res = await chai
        .request(app)
        .put('/api/update-user-profile')
        .set({ Authorization: `Bearer ${USER_TOKEN}` })
        .send(updatedUserProfileData);

      expect(res).to.have.status(200);
    });

    it('should return status 400 if request body is invalid', async () => {
      const invalidUserProfileData = {
        phoneNumber: '+1 987-654-3210',
        profileImage: 'profile.jpg'
      };

      const res = await chai
        .request(app)
        .put('/api/update-user-profile')
        .set({ Authorization: `Bearer ${USER_TOKEN}` })
        .send(invalidUserProfileData);

      expect(res).to.have.status(400);
    });
  });

  context('GET USER', () => {
    it('should return status 200 and user profile if found', async () => {
      const res = await chai
        .request(app)
        .get('/api/get-user')
        .set({ Authorization: `Bearer ${USER_TOKEN}` });

      expect(res).to.have.status(200);
    });
  });

  context('UPDATE USER', () => {
    it('should update user profile and return status 200', async () => {
      const updatedUserData = {
        fullname: 'Jack Obs'
      };

      const res = await chai
        .request(app)
        .put('/api/update-user')
        .set({ Authorization: `Bearer ${USER_TOKEN}` })
        .send(updatedUserData);

      expect(res).to.have.status(200);
    });
  });
});
