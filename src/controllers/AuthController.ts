import { Request, Response } from 'express';
import { AuthService } from '../services/AuthService';

export class AuthController {
    static async register(req: Request, res: Response) {
        const { email, password, fullName } = req.body;
        
        if (!email || !password || !fullName) {
            return res.status(400).json({ message: 'Email, password, and full name are required' });
        }

        try {
            await AuthService.register(email, password, fullName);
            res.status(200).json({ message: 'OTP sent successfully' });
        } catch (error: any) {
            if (error.message === 'User with this email already exists') {
                return res.status(409).json({ message: error.message });
            }
            res.status(500).json({ message: 'Internal server error' });
        }
    }

    static async login(req: Request, res: Response) {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ message: 'Email and password are required' });
        }

        try {
            const { token, user } = await AuthService.login(email, password);
            res.status(200).json({ token, user });
        } catch (error: any) {
            if (error.message === 'Invalid credentials') {
                return res.status(401).json({ message: error.message });
            }
            res.status(500).json({ message: 'Internal server error' });
        }
    }

    static async verifyOtp(req: Request, res: Response) {
        const { email, otp } = req.body;

        if (!email || !otp) {
            return res.status(400).json({ message: 'Email and OTP are required' });
        }

        try {
            const { user, token } = await AuthService.verifyOtp(email, otp);
            res.status(200).json({ message: 'User verified and registered successfully', user, token });
        } catch (error: any) {
            if (error.message === 'Invalid or expired OTP' || error.message === 'User not found for OTP verification') {
                return res.status(400).json({ message: error.message });
            }
            res.status(500).json({ message: 'Internal server error' });
        }
    }

    static async resendOtp(req: Request, res: Response) {
        const { email } = req.body;

        if (!email) {
            return res.status(400).json({ message: 'Email is required' });
        }

        try {
            await AuthService.resendOtp(email);
            res.status(200).json({ message: 'OTP re-sent successfully' });
        } catch (error: any) {
            res.status(500).json({ message: 'Internal server error' });
        }
    }
}
