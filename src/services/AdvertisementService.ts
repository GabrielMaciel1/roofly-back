import { AppDataSource } from '../data-source';
import { Advertisement } from '../models/Advertisement';
import { AdvertisementPhoto } from '../models/AdvertisementPhoto';
import { User } from '../models/User';

class AdvertisementService {
  async createAdvertisement(
    userId: string,
    data: Partial<Advertisement>,
    images: string[],
  ): Promise<Advertisement> {
    const userRepository = AppDataSource.getRepository(User);
    const advertisementRepository = AppDataSource.getRepository(Advertisement);

    const user = await userRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new Error('User not found');
    }

    const advertisement = new Advertisement();
    Object.assign(advertisement, data);
    advertisement.user = user;
    advertisement.userId = user.id;

    if (images && images.length > 0) {
      advertisement.photos = images.map((imageData, index) => {
        const photo = new AdvertisementPhoto();
        photo.data = imageData;
        photo.sortOrder = index;
        return photo;
      });
    }

    return advertisementRepository.save(advertisement);
  }

  async getAllAdvertisements(): Promise<Advertisement[]> {
    const advertisementRepository = AppDataSource.getRepository(Advertisement);
    return advertisementRepository.find({ relations: ['photos', 'user'] });
  }

  async getPopularAdvertisements(limit: number = 10): Promise<Advertisement[]> {
    const advertisementRepository = AppDataSource.getRepository(Advertisement);
    return advertisementRepository.find({
      order: { views: 'DESC' },
      take: limit,
      relations: ['photos', 'user'],
    });
  }

  async incrementViewCount(advertisementId: string): Promise<void> {
    const advertisementRepository = AppDataSource.getRepository(Advertisement);
    await advertisementRepository.increment({ id: advertisementId }, 'views', 1);
  }

  async getNearYouAdvertisements(
    latitude: number,
    longitude: number,
    radius: number = 10, // Default radius in kilometers
    limit: number = 10,
  ): Promise<Advertisement[]> {
    const advertisementRepository = AppDataSource.getRepository(Advertisement);

    // Haversine formula to calculate distance in kilometers
    const haversineFormula = `(
      6371 * acos(
        cos(radians(:latitude)) * cos(radians(Advertisement.latitude)) *
        cos(radians(Advertisement.longitude) - radians(:longitude)) +
        sin(radians(:latitude)) * sin(radians(Advertisement.latitude))
      )
    )`;

    return advertisementRepository.createQueryBuilder('Advertisement')
      .addSelect(haversineFormula, 'distance')
      .where(`(${haversineFormula}) <= :radius`, { latitude, longitude, radius })
      .orderBy('distance', 'ASC')
      .limit(limit)
      .leftJoinAndSelect('Advertisement.photos', 'photos')
      .leftJoinAndSelect('Advertisement.user', 'user')
      .getMany();
  }

  async updateAdvertisement(
    id: string,
    userId: string,
    data: Partial<Advertisement>,
    images: string[],
  ): Promise<Advertisement> {
    const advertisementRepository = AppDataSource.getRepository(Advertisement);
    let advertisement = await advertisementRepository.findOne({ where: { id, userId } });

    if (!advertisement) {
      throw new Error('Advertisement not found or user not authorized');
    }

    Object.assign(advertisement, data);

    if (images !== undefined) {
      // Clear existing photos and add new ones
      advertisement.photos = images.map((imageData, index) => {
        const photo = new AdvertisementPhoto();
        photo.data = imageData;
        photo.sortOrder = index;
        return photo;
      });
    }

    return advertisementRepository.save(advertisement);
  }
}

export const advertisementService = new AdvertisementService();
