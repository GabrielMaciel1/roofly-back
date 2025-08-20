import { User } from '../models/User';
import { Profile } from '../models/Profile';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { UserRepository } from '../repositories/UserRepository';
import { ProfileRepository } from '../repositories/ProfileRepository';

export class AuthService {
    private static userRepository: UserRepository = new UserRepository();
    private static profileRepository: ProfileRepository = new ProfileRepository();

    static async register(email: string, password?: string, fullName?: string, phone?: string, avatarUrl?: string, facebookId?: string, googleId?: string) {
        if (await this.userRepository.findByEmail(email)) {
            throw new Error('User with this email already exists');
        }

        let hashedPassword = '';
        if (password) {
            hashedPassword = await bcrypt.hash(password, 10);
        }

        const newUser = this.userRepository.create({ email, passwordHash: hashedPassword });
        await this.userRepository.save(newUser);

        const newProfile = this.profileRepository.create({
            userId: newUser.id,
            fullName,
            phone,
            avatarUrl,
        });
        await this.profileRepository.save(newProfile);

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
