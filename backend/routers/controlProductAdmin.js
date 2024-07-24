import { Router } from 'express';
const router = Router();
import upload from '../middleware/multerMiddleware.js';
import {
    createProduct,
    deleteDiscountProduct,
    deleteProduct,
    getAllProduct,
    getSingleProduct,
    setDiscountProduct,
    updateDiscountProduct,
    updateProduct,
} from '../controllers/controlProductAdmin.js';
import { checkPermissionActionProduct } from '../middleware/authMiddleware.js';
import { getCurrentAdminUser } from '../controllers/authController.js';

router
    .route('/products')
    .get(getAllProduct)
    .post(upload.single('file'), createProduct);
router
    .route('/product/:id')
    .get(checkPermissionActionProduct, getSingleProduct)
    .patch(checkPermissionActionProduct, upload.single('file'), updateProduct)
    .delete(checkPermissionActionProduct, deleteProduct);
router
    .route('/product/discount/:id')
    .post(checkPermissionActionProduct, setDiscountProduct)
    .patch(checkPermissionActionProduct, updateDiscountProduct)
    .delete(checkPermissionActionProduct, deleteDiscountProduct);
router
    .get('/current-user', getCurrentAdminUser)

export default router;
