import { Router } from 'express';
import { AuthController } from '../controllers/AuthController';

const router = Router();

router.post('/register', AuthController.register);
router.post('/login', AuthController.login);
router.post('/verify-otp', AuthController.verifyOtp); // Nova rota para verificar OTP
router.post('/resend-otp', AuthController.resendOtp); // Nova rota para reenviar OTP

export default router;
