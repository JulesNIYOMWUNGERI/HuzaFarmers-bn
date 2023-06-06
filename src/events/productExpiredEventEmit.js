import events from 'events';

const eventEmitter = new events();

eventEmitter.on('product_expiration', (msg) => {
  console.log(msg);
});
eventEmitter.on('noProductExpired', (msg) => {
  console.log(msg);
});
export default eventEmitter;
