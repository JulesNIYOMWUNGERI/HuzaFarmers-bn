import chai from 'chai';
import {
  emitProductAddedEvent,
  emitProductUpdatedEvent,
  emitProductRemovedEvent,
  emitProductPurchasedEvent
} from '../events/notifications.event';

const { assert } = chai;

describe('emit notification upon occurence of events on product life cycle', () => {
  it('should emit notification on product creation', async () => {
    const product = {
      id: 123,
      name: 'pens'
    };
    const merchant = {
      id: 456,
      fullname: 'Test Merchant',
      email: 'test@merchant.com'
    };
    const notification = await emitProductAddedEvent(product, merchant);
    assert.isObject(notification);
    assert.property(notification, 'userId');
    assert.property(notification, 'message');
  });
  it('should emit notification on product update', async () => {
    const product = {
      id: 123,
      name: 'pens'
    };
    const merchant = {
      id: 456,
      fullname: 'Test Merchant',
      email: 'test@merchant.com'
    };
    const notification = await emitProductUpdatedEvent(product, merchant);
    assert.isObject(notification);
    assert.property(notification, 'userId');
    assert.property(notification, 'message');
  });
  it('should emit notification on product deletion', async () => {
    const product = {
      id: 123,
      name: 'pens'
    };
    const merchant = {
      id: 456,
      fullname: 'Test Merchant',
      email: 'test@merchant.com'
    };
    const notification = await emitProductRemovedEvent(product, merchant);
    assert.isObject(notification);
    assert.property(notification, 'userId');
    assert.property(notification, 'message');
  });

  it('should emit notification on product purchase', async () => {
    const data = {
      id: 14,
      userId: 28,
      products: [
        {
          price: '500.00',
          quantity: 5,
          productId: 5
        }
      ],
      totalPrice: 500,
      deliveryAddress: {
        city: 'Kigali',
        street: 'KG 123 st',
        country: 'Rwanda',
        zipCode: '12345'
      },
      paymentMethod: 'credit card',
      updatedAt: '2023-05-07T15:15:16.492Z',
      createdAt: '2023-05-07T15:15:16.492Z',
      status: 'pending'
    };
    const customer = {
      id: 456,
      fullname: 'Test Customer',
      email: 'test@customer.com'
    };
    const notification = await emitProductPurchasedEvent(data, customer);
    assert.isObject(notification);
    assert.property(notification, 'userId');
    assert.property(notification, 'message');
  });
});
