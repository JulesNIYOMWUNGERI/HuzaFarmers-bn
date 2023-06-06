import chai from 'chai';
import chaiHttp from 'chai-http';
import jwt from 'jsonwebtoken';
import app from '../../index';

const { expect } = chai;

chai.use(chaiHttp);
describe('User permissions and roles', () => {
  describe(' Admin can update user role', () => {
    it('should update the user role and return a response with status code of 200', (done) => {
      const user = {
        email: 'abc@gmail.com',
        password: 'Abc123456',
      };

      const admin = {
        email: 'admin@gmail.com',
        password: 'Test123456',
      };

      chai
        .request(app)
        .post('/api/login')
        .send(user)
        .end((err, res) => {
          chai.expect(res).to.have.status(200);
          const tokenn = res.header.authenticate;
          const decoded = jwt.verify(tokenn, process.env.USER_SECRET_KEY);
          chai
            .request(app)
            .post('/api/login')
            .send(admin)
            .end((err, res) => {
              expect(res).to.have.status(200);
              expect(res.body).to.have.property('token');
              const token = res.header.authenticate;
              chai
                .request(app)
                .patch(`/api/updateRole/${decoded.id}`)
                .set({ Authorization: `Bearer ${token}` })
                .send({ role: 'merchant' })
                .end((err, res) => {
                  expect(res).to.have.status(200);
                  done();
                });
            });
        });
    });
    it('should check if admin is the one updatig the user role', (done) => {
      const user = {
        email: 'abc@gmail.com',
        password: 'Abc123456',
      };
      chai
        .request(app)
        .post('/api/login')
        .send(user)
        .end((err, res) => {
          chai.expect(res).to.have.status(200);
          const tokenn = res.header.authenticate;
          const decoded = jwt.verify(tokenn, process.env.USER_SECRET_KEY);
          const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImJlbnNvNkBnbWFpbC5jb20iLCJpZCI6MTQsImlhdCI6MTY4MTExNTAyNiwiZXhwIjoxNjgxMTE4NjI2fQ.mXiALk911BOpuuXhuq8Y36hiWtTHa4QMFKDh3hQEaZ8';
          chai
            .request(app)
            .patch(`/api/updateRole/${decoded.id}`)
            .set({ Authorization: `Bearer ${token}` })
            .send({ role: 'merchant' })
            .end((err, res) => {
              expect(res).to.have.status(401);
              done();
            });
        });
    });
    it('should not update the user role if user is already assigned the role', (done) => {
      const user = {
        email: 'abc@gmail.com',
        password: 'Abc123456',
      };

      const admin = {
        email: 'admin@gmail.com',
        password: 'Test123456',
      };
      chai
        .request(app)
        .post('/api/login')
        .send(user)
        .end((err, res) => {
          chai.expect(res).to.have.status(200);
          const tokenn = res.header.authenticate;
          const decoded = jwt.verify(tokenn, process.env.USER_SECRET_KEY);
          chai
            .request(app)
            .post('/api/login')
            .send(admin)
            .end((err, res) => {
              chai.expect(res).to.have.status(200);
              const token = res.header.authenticate;
              chai
                .request(app)
                .patch(`/api/updateRole/${decoded.id}`)
                .set({ Authorization: `Bearer ${token}` })
                .send({ role: 'merchant' })
                .end((err, res) => {
                  expect(res).to.have.status(409);
                  done();
                });
            });
        });
    });
    it('should check for not update with an invalid user role', (done) => {
      const user = {
        email: 'abc@gmail.com',
        password: 'Abc123456',
      };
      const admin = {
        email: 'admin@gmail.com',
        password: 'Test123456',
      };

      chai
        .request(app)
        .post('/api/login')
        .send(user)
        .end((err, res) => {
          chai.expect(res).to.have.status(200);
          const tokenn = res.header.authenticate;
          const decoded = jwt.verify(tokenn, process.env.USER_SECRET_KEY);
          chai
            .request(app)
            .post('/api/login')
            .send(admin)
            .end((err, res) => {
              chai.expect(res).to.have.status(200);
              const token = res.header.authenticate;
              chai
                .request(app)
                .patch(`/api/updateRole/${decoded.id}`)
                .set({ Authorization: `Bearer ${token}` })
                .send({ role: 'black' })
                .end((err, res) => {
                  expect(res).to.have.status(422);
                  done();
                });
            });
        });
    });
    it('should not update the user role if the role field is empty', (done) => {
      const user = {
        email: 'abc@gmail.com',
        password: 'Abc123456',
      };
      const admin = {
        email: 'admin@gmail.com',
        password: 'Test123456',
      };

      chai
        .request(app)
        .post('/api/login')
        .send(user)
        .end((err, res) => {
          chai.expect(res).to.have.status(200);
          const tokenn = res.header.authenticate;
          const decoded = jwt.verify(tokenn, process.env.USER_SECRET_KEY);
          chai
            .request(app)
            .post('/api/login')
            .send(admin)
            .end((err, res) => {
              expect(res).to.have.status(200);
              const token = res.header.authenticate;
              chai
                .request(app)
                .patch(`/api/updateRole/${decoded.id}`)
                .set({ Authorization: `Bearer ${token}` })
                .end((err, res) => {
                  expect(res).to.have.status(400);
                  done();
                });
            });
        });
    });
    it('should not update the user role if a token is not provided', (done) => {
      const user = {
        email: 'abc@gmail.com',
        password: 'Abc123456',
      };
      const admin = {
        email: 'admin@gmail.com',
        password: 'Test123456',
      };

      chai
        .request(app)
        .post('/api/login')
        .send(user)
        .end((err, res) => {
          chai.expect(res).to.have.status(200);
          const tokenn = res.header.authenticate;
          const decoded = jwt.verify(tokenn, process.env.USER_SECRET_KEY);
          chai
            .request(app)
            .post('/api/login')
            .send(admin)
            .end((err, res) => {
              expect(res).to.have.status(200);
              chai
                .request(app)
                .patch(`/api/updateRole/${decoded.id}`)
                .set({ Authorization: '' })
                .end((err, res) => {
                  expect(res).to.have.status(401);
                  done();
                });
            });
        });
    });
    it('should not update the role of a nonexistent account', (done) => {
      const admin = {
        email: 'admin@gmail.com',
        password: 'Test123456',
      };

      chai
        .request(app)
        .post('/api/login')
        .send(admin)
        .end((err, res) => {
          chai.expect(res).to.have.status(200);
          const token = res.header.authenticate;
          const id = 0;
          chai
            .request(app)
            .patch(`/api/updateRole/${id}`)
            .set({ Authorization: `Bearer ${token}` })
            .send({ role: 'merchant' })
            .end((err, res) => {
              expect(res).to.have.status(404);
              done();
            });
        });
    });
    it('should not update the user role if authentication fails', (done) => {
      const user = {
        email: 'abc@gmail.com',
        password: 'Abc123456',
      };
      const admin = {
        email: 'admin@gmail.com',
        password: 'Test123456',
      };

      chai
        .request(app)
        .post('/api/login')
        .send(user)
        .end((err, res) => {
          chai.expect(res).to.have.status(200);
          const tokenn = res.header.authenticate;
          const decoded = jwt.verify(tokenn, process.env.USER_SECRET_KEY);
          chai
            .request(app)
            .post('/api/login')
            .send(admin)
            .end((err, res) => {
              expect(res).to.have.status(200);
              const token = res.header.authenticate;
              chai
                .request(app)
                .patch(`/api/updateRole/${decoded.id}`)
                .set({ athorization: `Bear ${token}` })
                .send({ role: 'merchant' })
                .end((err, res) => {
                  expect(res).to.have.status(401);
                  done();
                });
            });
        });
    });
  });

  describe('check permissions assignment', () => {
    it('should assign a user a permission', (done) => {
      const user = {
        email: 'abc@gmail.com',
        password: 'Abc123456',
      };
      const admin = {
        email: 'admin@gmail.com',
        password: 'Test123456',
      };
      chai
        .request(app)
        .post('/api/login')
        .send(user)
        .end((err, res) => {
          chai.expect(res).to.have.status(200);
          const tokenn = res.header.authenticate;
          const decoded = jwt.verify(tokenn, process.env.USER_SECRET_KEY);
          chai
            .request(app)
            .post('/api/login')
            .send(admin)
            .end((err, res) => {
              expect(res).to.have.status(200);
              const token = res.header.authenticate;
              chai
                .request(app)
                .post(`/api/addPermision/${decoded.id}`)
                .set({ Authorization: `Bearer ${token}` })
                .send({ Permission: 'purchase' })
                .end((err, res) => {
                  expect(res).to.have.status(200);
                  done();
                });
            });
        });
    });
    it('should not assign a user an already existing permission', (done) => {
      const user = {
        email: 'abc@gmail.com',
        password: 'Abc123456',
      };
      const admin = {
        email: 'admin@gmail.com',
        password: 'Test123456',
      };

      chai
        .request(app)
        .post('/api/login')
        .send(user)
        .end((err, res) => {
          chai.expect(res).to.have.status(200);
          const tokenn = res.header.authenticate;
          const decoded = jwt.verify(tokenn, process.env.USER_SECRET_KEY);
          chai
            .request(app)
            .post('/api/login')
            .send(admin)
            .end((err, res) => {
              expect(res).to.have.status(200);
              const token = res.header.authenticate;
              chai
                .request(app)
                .post(`/api/addPermision/${decoded.id}`)
                .set({ Authorization: `Bearer ${token}` })
                .send({ Permission: 'update' })
                .end((err, res) => {
                  expect(res).to.have.status(409);
                  done();
                });
            });
        });
    });
    it('should not assign permission to nonexistent account', (done) => {
      const admin = {
        email: 'admin@gmail.com',
        password: 'Test123456',
      };
      chai
        .request(app)
        .post('/api/login')
        .send(admin)
        .end((err, res) => {
          expect(res).to.have.status(200);
          const id = 0;
          const token = res.header.authenticate;
          chai
            .request(app)
            .post(`/api/addPermision/${id}`)
            .set({ Authorization: `Bearer ${token}` })
            .send({ Permission: 'purchase' })
            .end((err, res) => {
              expect(res).to.have.status(404);
              done();
            });
        });
    });
    it('should not assign a user an empty permission', (done) => {
      const user = {
        email: 'abc@gmail.com',
        password: 'Abc123456',
      };
      const admin = {
        email: 'admin@gmail.com',
        password: 'Test123456',
      };
      chai
        .request(app)
        .post('/api/login')
        .send(user)
        .end((err, res) => {
          chai.expect(res).to.have.status(200);
          const tokenn = res.header.authenticate;
          const decoded = jwt.verify(tokenn, process.env.USER_SECRET_KEY);
          chai
            .request(app)
            .post('/api/login')
            .send(admin)
            .end((err, res) => {
              expect(res).to.have.status(200);
              const token = res.header.authenticate;
              chai
                .request(app)
                .post(`/api/addPermision/${decoded.id}`)
                .set({ Authorization: `Bearer ${token}` })
                .send({ Permission: '' })
                .end((err, res) => {
                  expect(res).to.have.status(400);
                  done();
                });
            });
        });
    });
  });

  describe(' Check permissions removal', () => {
    it('should remove certain permissions from a user', (done) => {
      const user = {
        email: 'abc@gmail.com',
        password: 'Abc123456',
      };
      const admin = {
        email: 'admin@gmail.com',
        password: 'Test123456',
      };
      chai
        .request(app)
        .post('/api/login')
        .send(user)
        .end((err, res) => {
          chai.expect(res).to.have.status(200);
          const tokenn = res.header.authenticate;
          const decoded = jwt.verify(tokenn, process.env.USER_SECRET_KEY);
          chai
            .request(app)
            .post('/api/login')
            .send(admin)
            .end((err, res) => {
              expect(res).to.have.status(200);
              const token = res.header.authenticate;
              chai
                .request(app)
                .delete(`/api/removePermission/${decoded.id}`)
                .set({ Authorization: `Bearer ${token}` })
                .send({ Permission: 'read' })
                .end((err, res) => {
                  expect(res).to.have.status(200);
                  done();
                });
            });
        });
    });

    it('should check permission field to be empty', (done) => {
      const user = {
        email: 'abc@gmail.com',
        password: 'Abc123456',
      };
      const admin = {
        email: 'admin@gmail.com',
        password: 'Test123456',
      };
      chai
        .request(app)
        .post('/api/login')
        .send(user)
        .end((err, res) => {
          chai.expect(res).to.have.status(200);
          const tokenn = res.header.authenticate;
          const decoded = jwt.verify(tokenn, process.env.USER_SECRET_KEY);
          chai
            .request(app)
            .post('/api/login')
            .send(admin)
            .end((err, res) => {
              expect(res).to.have.status(200);
              const token = res.header.authenticate;
              chai
                .request(app)
                .delete(`/api/removePermission/${decoded.id}`)
                .set({ Authorization: `Bearer ${token}` })
                .send({ Permission: '' })
                .end((err, res) => {
                  expect(res).to.have.status(400);
                  done();
                });
            });
        });
    });
    it('should not remove permission for a nonexistent user', (done) => {
      const admin = {
        email: 'admin@gmail.com',
        password: 'Test123456',
      };
      chai
        .request(app)
        .post('/api/login')
        .send(admin)
        .end((err, res) => {
          expect(res).to.have.status(200);
          const token = res.header.authenticate;
          const id = 0;
          chai
            .request(app)
            .delete(`/api/removePermission/${id}`)
            .set({ Authorization: `Bearer ${token}` })
            .send({ Permission: '' })
            .end((err, res) => {
              expect(res).to.have.status(404);
              done();
            });
        });
    });
  });
});

describe(' Customer and merchant role', () => {
  it('should check if user is a customer', (done) => {
    const customer = {
      firstname: 'admin',
      lastname: 'acc',
      email: 'admin24@gmail.com',
      password: 'Test123456',
    };
    chai
      .request(app)
      .post('/api/register')
      .send(customer)
      .end((err, res) => {
        if (res) {
          chai.expect(res).to.have.status(200);
          const token = res.header.authenticate;
          chai
            .request(app)
            .get('/api/testCustomerMiddleware')
            .set({ Authorization: `Bearer ${token}` })
            .end((err, res) => {
              chai.expect(res).to.have.status(200);
              done();
            });
        } else {
          chai.expect(res).to.have.status(500);
          done();
        }
      });
  });
  it('should check if user is not a customer and return a status of 403', (done) => {
    const customer = {
      firstname: 'admin',
      lastname: 'acc',
      email: 'admin274@gmail.com',
      password: 'Test123456',
    };
    chai
      .request(app)
      .post('/api/registerAdmin')
      .send(customer)
      .end((err, res) => {
        if (res) {
          chai.expect(res).to.have.status(200);
          const token = res.header.authenticate;
          chai
            .request(app)
            .get('/api/testCustomerMiddleware')
            .set({ Authorization: `Bearer ${token}` })
            .end((err, res) => {
              chai.expect(res).to.have.status(403);
              done();
            });
        } else {
          chai.expect(res).to.have.status(500);
          done();
        }
      });
  });
  it('should check if user has invalid token and return a status of 401 if they do not', (done) => {
    const customer = {
      firstname: 'admin',
      lastname: 'acc',
      email: 'admin24@gmail.com',
      password: 'Test123456',
    };
    chai
      .request(app)
      .post('/api/registerAdmin')
      .send(customer)
      .end((err, res) => {
        if (res) {
          const token = res.header.authenticate;
          chai
            .request(app)
            .get('/api/testCustomerMiddleware')
            .set({ Authorization: `Ber ${token}` })
            .end((err, res) => {
              chai.expect(res).to.have.status(401);
              done();
            });
        } else {
          chai.expect(res).to.have.status(500);
          done();
        }
      });
  });
  it('should check if user is a merchant and return a response with status code of 200', (done) => {
    const user = {
      firstname: 'admin',
      lastname: 'acc',
      email: 'admin245@gmail.com',
      password: 'Test123456',
    };
    const admin = {
      email: 'admin@gmail.com',
      password: 'Test123456',
    };

    chai
      .request(app)
      .post('/api/register')
      .send(user)
      .end((err, res) => {
        chai.expect(res).to.have.status(200);
        const userToken = res.body.token;
        const verifyingToken = res.body.verifyToken;
        const verifyUserToken = jwt.verify(
          userToken,
          process.env.USER_SECRET_KEY
        );
        const userId = verifyUserToken.id;

        chai
          .request(app)
          .get(`/api/${userId}/verify/${verifyingToken.token}`)
          .end((err, res) => {
            chai.expect(res).to.have.status(200);
          });
        chai
          .request(app)
          .post('/api/login')
          .send(admin)
          .end((err, res) => {
            expect(res).to.have.status(200);
            expect(res.body).to.have.property('token');
            const token = res.header.authenticate;
            chai.expect(res).to.have.status(200);
            chai
              .request(app)
              .post('/api/login')
              .send({
                email: 'admin245@gmail.com',
                password: 'Test123456',
              })
              .end((err, res) => {
                expect(res).to.have.status(200);
                const tokenn = res.header.authenticate;
                const decoded = jwt.verify(tokenn, process.env.USER_SECRET_KEY);
                chai
                  .request(app)
                  .patch(`/api/updateRole/${decoded.id}`)
                  .set({ Authorization: `Bearer ${token}` })
                  .send({ role: 'merchant' })
                  .end((err, res) => {
                    expect(res).to.have.status(200);
                    chai.expect(res).to.have.status(200);
                    chai
                      .request(app)
                      .post('/api/login')
                      .send({
                        email: 'admin245@gmail.com',
                        password: 'Test123456',
                      })
                      .end((err, res) => {
                        const newToken = res.header.authenticate;
                        chai
                          .request(app)
                          .get('/api/testMerchantMiddleware')
                          .set({ Authorization: `Bearer ${newToken}` })
                          .end((err, res) => {
                            chai.expect(res).to.have.status(200);
                            done();
                          });
                      });
                  });
              });
          });
      });
  });
  it('should check if user is not a merchant and return a response with status code of 403', (done) => {
    const admin = {
      email: 'admin@gmail.com',
      password: 'Test123456',
    };

    chai
      .request(app)
      .post('/api/login')
      .send(admin)
      .end((err, res) => {
        const newToken = res.header.authenticate;
        chai
          .request(app)
          .get('/api/testMerchantMiddleware')
          .set({ Authorization: `Bearer ${newToken}` })
          .end((err, res) => {
            chai.expect(res).to.have.status(403);
            done();
          });
      });
  });
  it('should check if the token is invalid and return a response with status code of 401', (done) => {
    const admin = {
      email: 'admin@gmail.com',
      password: 'Test123456',
    };

    chai
      .request(app)
      .post('/api/login')
      .send(admin)
      .end(() => {
        chai
          .request(app)
          .get('/api/testMerchantMiddleware')
          .set({ Authorization: 'token' })
          .end((err, res) => {
            chai.expect(res).to.have.status(401);
            done();
          });
      });
  });
});
