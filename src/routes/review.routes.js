import { Router } from 'express';
import { verifyJWT } from '../middlewares/auth.middleware.js';
import {
    addReview,
    deleteReview,
    getAllProductReview,
    getReviewById,
} from '../controllers/review.controller.js';

const router = Router();

router.route('/:productId').post(verifyJWT, addReview);
router.route('/:reviewId').delete(verifyJWT, deleteReview);
router.route('/:productId').get(getAllProductReview);
router.route('/:reviewId').get(getReviewById);

export default router;
