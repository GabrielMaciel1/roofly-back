import { Request, Response } from 'express';
import { AuthService } from '../services/AuthService';

export class AuthController {
    static async register(req: Request, res: Response) {
        const { email, password, fullName, phone, avatarUrl } = req.body;
        
        if (!email || !password) {
            return res.status(400).json({ message: 'Email and password are required' });
        }

        try {
            await AuthService.register(email, password, fullName, phone, avatarUrl);
            res.status(201).json({ message: 'User registered successfully' });
        } catch (error: any) {
            if (error.message === 'User with this email already exists') {
                return res.status(409).json({ message: error.message });
            }
            console.error(error);
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
            console.error(error);
            res.status(500).json({ message: 'Internal server error' });
        }
    }
}
