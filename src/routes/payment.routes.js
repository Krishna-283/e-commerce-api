import { Router } from 'express';
import { verifyJWT } from '../middlewares/auth.middleware.js';
import {
    createPayment,
    updatePayment,
} from '../controllers/payment.controller.js';

const router = Router();

router.route('/').post(verifyJWT, createPayment);
router.route('/').put(verifyJWT, updatePayment);
router.route('/:paymentId').get(verifyJWT, updatePayment);

export default router;
