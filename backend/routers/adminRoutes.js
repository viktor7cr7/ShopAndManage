import { Router } from 'express';
import { authenticateAdmin } from '../middleware/authMiddleware.js';
import { getOrdersForAdmin, updateAdminInfo } from '../controllers/adminController.js';
import upload from '../middleware/multerMiddleware.js';
const router = Router();

router.patch('/update-info', authenticateAdmin, upload.single('avatar'), updateAdminInfo)
router.get('/orders-stat', getOrdersForAdmin)

export default router