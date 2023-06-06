import events from 'events';

const eventEmitter = new events();

eventEmitter.on('password_expiration', (msg) => {
  console.log(msg);
});
eventEmitter.on('noExpiredPassword', (msg) => {
  console.log(msg);
});
export default eventEmitter;
