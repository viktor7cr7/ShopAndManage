import { Router } from 'express';
import { authenticateUser } from '../middleware/authMiddleware.js';
import {
    getAllUserProducts,
    getCurrentRating,
    getCurrentUser,
    getItems,
    getOrders,
    getSingleUserProducts,
    getSummAmount,
    getTransaction,
    updateUser,
} from '../controllers/userController.js';
import { setRatingProduct } from '../controllers/controlProductAdmin.js';
import upload from '../middleware/multerMiddleware.js';
const router = Router();

router.get('/products',  getAllUserProducts);
router
    .route('/products/:id')
    .put( setRatingProduct)
    .get( getSingleUserProducts);
router.get('/current-user',  getCurrentUser)
router.get('/orders',  getOrders)
router.post('/orders/item/rating',  getCurrentRating)
router.get('/orders/item/:id',  getItems)
router.get('/transaction',  getTransaction)
router.patch('/update-info', upload.single('avatar'), updateUser)
router.get('/total-amount',  getSummAmount)

export default router;
