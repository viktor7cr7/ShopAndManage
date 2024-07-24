import { Router } from 'express';
import {
    createAdminUser,
    createUser,
    loginUser,
    loginUserAdmin,
    logoutUser,
    resetPasswordAdmin,
    verifyEmailAdmin,
    forgotPassword,
    resetPassword,
    verifyEmailUser,
    forgotPasswordAdmin
} from '../controllers/authController.js';
import {
    validateRegisterUser,
    validateUserAdminRegister,
    validateUserAdminSystemLogin,
    validateLoginUser
} from '../middleware/validationMiddleware.js';

const router = Router();

router.post('/register', validateRegisterUser, createUser);
router.post('/login', validateLoginUser, loginUser);
router.get('/logout', logoutUser);
router.get('/admin/logout', logoutUser);
router.post('/admin/register', validateUserAdminRegister, createAdminUser);
router.post('/admin/login', validateUserAdminSystemLogin, loginUserAdmin);
router.post('/verify-email/user', verifyEmailUser);
router.post('/verify-email/admin', verifyEmailAdmin);
router.post('/forgot-password', forgotPassword)
router.post('/admin/forgot-password', forgotPasswordAdmin)
router.post('/reset-password', resetPassword)
router.post('/admin/reset-password', resetPasswordAdmin)

export default router;
