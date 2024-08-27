import { Router } from 'express';
import { verifyJWT, verifyAdmin } from '../middlewares/auth.middleware.js';
import {
    deleteProduct,
    getProductById,
    listProduct,
    registerProduct,
    updateProductImage,
} from '../controllers/product.controller.js';
import { upload } from '../middlewares/multer.middleware.js';

const router = Router();

router.route('/').post(
    verifyJWT,
    verifyAdmin,
    upload.fields([
        {
            name: 'productImage',
            maxCount: 1,
        },
    ]),
    registerProduct
);

router.route('/').get(listProduct);
router.route('/:id').get(getProductById);
router.route('/:id').delete(verifyJWT, verifyAdmin, deleteProduct);
router.route('/:id/image/').put(verifyJWT, verifyAdmin, updateProductImage);

export default router;
