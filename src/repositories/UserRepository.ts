import { AppDataSource } from '../data-source';
import { User } from '../models/User';
import { Repository } from 'typeorm';

export class UserRepository {
    private userRepository: Repository<User>;

    constructor() {
        this.userRepository = AppDataSource.getRepository(User);
    }

    async findByEmail(email: string): Promise<User | null> {
        return this.userRepository.findOneBy({ email });
    }

    async findById(id: string): Promise<User | null> {
        return this.userRepository.findOneBy({ id });
    }

    async save(user: User): Promise<User> {
        return this.userRepository.save(user);
    }

    create(userPartial: Partial<User>): User {
        return this.userRepository.create(userPartial);
    }
}
