import { Router } from 'express';
import { verifyJWT } from '../middlewares/auth.middleware.js';
import { createOrder, getOrdersByUser, updateOrder } from '../controllers/order.controller.js';

const router = Router();

router.route('/').post(verifyJWT, createOrder);
router.route('/').put(verifyJWT, updateOrder);
router.route('/user').get(verifyJWT, getOrdersByUser);

export default router;
