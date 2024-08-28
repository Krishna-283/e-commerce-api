import { Router } from 'express';
import { verifyJWT } from '../middlewares/auth.middleware.js';
import {
    addItem,
    deleteCart,
    deleteItemById,
    getCart,
    updateCart,
} from '../controllers/cart.controller.js';

const router = Router();

router.route('/').post(verifyJWT, addItem);
router.route('/:itemId').delete(verifyJWT, deleteItemById);
router.route('/:itemId').put(verifyJWT, updateCart);
router.route('/').get(verifyJWT, getCart);
router.route('/').delete(verifyJWT, deleteCart);

export default router;
