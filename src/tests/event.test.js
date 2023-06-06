import chai from 'chai';
import eventEmitter from '../events/passwordEventEmit';

const { expect } = chai;

describe('eventEmitter', () => {
  it('should emit the password_expiration event with a message', (done) => {
    const message = 'Password has expired';

    eventEmitter.once('password_expiration', (msg) => {
      expect(msg).to.equal(message);
      done();
    });

    eventEmitter.emit('password_expiration', message);
  });

  it('should emit the noExpiredPassword event with a message', (done) => {
    const message = 'Password has not expired';

    eventEmitter.once('noExpiredPassword', (msg) => {
      expect(msg).to.equal(message);
      done();
    });
    eventEmitter.emit('noExpiredPassword', message);
  });
});
