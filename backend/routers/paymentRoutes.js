import { Router } from 'express';
import {
    addFundsUseStripe,
    buyProducts,
    webHook,
} from '../controllers/paymentController.js';
import { authenticateUser } from '../middleware/authMiddleware.js';
import express from 'express';
const router = Router();

router.post(
    '/create-checkout-session',
    authenticateUser,
    buyProducts,
    addFundsUseStripe
);
router.patch('/create-checkout-session', authenticateUser, addFundsUseStripe);
router.post('/webhook', express.raw({ type: 'application/json' }), webHook);

export default router;
