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

        const newUser = this.userRepository.create({ email, password: hashedPassword, facebookId, googleId });
        await this.userRepository.save(newUser);

        return newUser;
    }

    static async login(email: string, password: string) {
        const user = await this.userRepository.findByEmail(email);

        if (!user) {
            throw new Error('Invalid credentials');
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            throw new Error('Invalid credentials');
        }

        const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET as string, { expiresIn: '1h' });

        return { token, user };
    }

    static async findOrCreateSocialUser(profileId: string, email: string, provider: 'facebook' | 'google') {
        let user;

        if (provider === 'facebook') {
            user = await this.userRepository.findByFacebookId(profileId);
        } else if (provider === 'google') {
            user = await this.userRepository.findByGoogleId(profileId);
        }

        if (user) {
            return user;
        }

        const newUser = this.userRepository.create({
            email,
            password: '', // Senha vazia ou gerada para logins sociais
            facebookId: provider === 'facebook' ? profileId : undefined,
            googleId: provider === 'google' ? profileId : undefined,
        });
        await this.userRepository.save(newUser);
        return newUser;
    }
}
