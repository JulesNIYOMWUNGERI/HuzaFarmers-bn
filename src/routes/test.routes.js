import express from 'express';
import {
  authorizeCustomer,
  authorizeMerchant,
} from '../middlewares/userRoles.middleware';

const router = express.Router();

router.get('/sample_test', (req, res) => {
  res.status(200).json({ message: 'Hello, world!' });
});

router.get('/testCustomerMiddleware', authorizeCustomer, (req, res) => {
  res.status(200).json({ message: 'Hello, Customer' });
});
router.get('/testMerchantMiddleware', authorizeMerchant, (req, res) => {
  res.status(200).json({ message: 'Hello, Merchant' });
});
export default router;
