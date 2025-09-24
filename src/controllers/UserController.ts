import { Request, Response } from 'express';
import { UserService } from '../services/UserService';

export class UserController {
    static async getUserById(req: Request, res: Response) {
        try {
            const id = parseInt(req.params.id);
            const user = await UserService.getUserById(id);
            if (user) {
                res.status(200).json(user);
            } else {
                res.status(404).json({ message: 'User not found' });
            }
        } catch (error) {
            res.status(500).json({ message: 'Internal server error' });
        }
    }

    static async updateUser(req: Request, res: Response) {
        try {
            const id = parseInt(req.params.id);
            const updates = req.body;
            const updatedUser = await UserService.updateUser(id, updates);
            if (updatedUser) {
                res.status(200).json(updatedUser);
            } else {
                res.status(404).json({ message: 'User not found' });
            }
        } catch (error) {
            res.status(500).json({ message: 'Internal server error' });
        }
    }

    static async deleteUser(req: Request, res: Response) {
        try {
            const id = parseInt(req.params.id);
            const success = await UserService.deleteUser(id);
            if (success) {
                res.status(204).send(); // No Content
            } else {
                res.status(404).json({ message: 'User not found' });
            }
        } catch (error) {
            res.status(500).json({ message: 'Internal server error' });
        }
    }
}
