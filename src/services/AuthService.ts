import { User } from '../models/User';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { UserRepository } from '../repositories/UserRepository';

export class AuthService {
    private static userRepository: UserRepository = new UserRepository();

    static async register(email: string, password?: string, facebookId?: string, googleId?: string) {
        if (await this.userRepository.findByEmail(email)) {
            throw new Error('User with this email already exists');
        }

        let hashedPassword = '';
        if (password) {
            hashedPassword = await bcrypt.hash(password, 10);
        }

        const newUser = this.userRepository.create({ email, passwordHash: hashedPassword });
        await this.userRepository.save(newUser);

        return newUser;
    }

    static async login(email: string, password: string) {
        const user = await this.userRepository.findByEmail(email);

        if (!user) {
            throw new Error('Invalid credentials');
        }

        const isPasswordValid = await bcrypt.compare(password, user.passwordHash);
        if (!isPasswordValid) {
            throw new Error('Invalid credentials');
        }

        const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET as string, { expiresIn: '1h' });

        return { token, user };
    }

    
}
