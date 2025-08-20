import { AppDataSource } from '../data-source';
import { Profile } from '../models/Profile';

export class ProfileRepository {
    private repository = AppDataSource.getRepository(Profile);

    create(profileData: Partial<Profile>): Profile {
        return this.repository.create(profileData);
    }

    save(profile: Profile): Promise<Profile> {
        return this.repository.save(profile);
    }

    findByUserId(userId: string): Promise<Profile | null> {
        return this.repository.findOne({ where: { userId } });
    }
}
