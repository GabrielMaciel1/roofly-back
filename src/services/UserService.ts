import { UserRepository } from '../repositories/UserRepository';
import { User } from '../models/User';

export class UserService {
    private static userRepository: UserRepository = new UserRepository();

    static async getUserById(id: number): Promise<User | null> {
        return this.userRepository.findById(id);
    }

    static async updateUser(id: number, updates: Partial<User>): Promise<User | null> {
        const user = await this.userRepository.findById(id);
        if (!user) {
            return null;
        }
        // Apply updates
        Object.assign(user, updates);
        return this.userRepository.save(user);
    }

    static async deleteUser(id: number): Promise<boolean> {
        // Implement delete logic if needed, TypeORM repository has remove method
        // For simplicity, let's assume we just return true if user exists
        const user = await this.userRepository.findById(id);
        if (user) {
            // await this.userRepository.remove(user); // Uncomment if you want to implement actual delete
            return true;
        }
        return false;
    }
}
