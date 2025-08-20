import { Request, Response } from 'express';
import { advertisementService } from '../services/AdvertisementService';

class AdvertisementController {
  async createAdvertisement(req: Request, res: Response): Promise<void> {
    try {
      const { images, ...advertisementData } = req.body;
      const userId = (req.user as any).id;
      const advertisement = await advertisementService.createAdvertisement(
        userId,
        advertisementData,
        images,
      );
      res.status(201).json(advertisement);
    } catch (error) {
        if (error instanceof Error) {
            res.status(500).json({ message: error.message });
        } else {
            res.status(500).json({ message: 'An unknown error occurred' });
        }
    }
  }

  async getPopularAdvertisements(req: Request, res: Response): Promise<void> {
    try {
      const limit = req.query.limit ? parseInt(req.query.limit as string) : 10;
      const advertisements = await advertisementService.getPopularAdvertisements(limit);
      res.status(200).json(advertisements);
    } catch (error) {
        if (error instanceof Error) {
            res.status(500).json({ message: error.message });
        } else {
            res.status(500).json({ message: 'An unknown error occurred' });
        }
    }
  }

  async incrementViewCount(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      await advertisementService.incrementViewCount(id);
      res.status(200).json({ message: 'View count incremented' });
    } catch (error) {
        if (error instanceof Error) {
            res.status(500).json({ message: error.message });
        } else {
            res.status(500).json({ message: 'An unknown error occurred' });
        }
    }
  }

  async getNearYouAdvertisements(req: Request, res: Response): Promise<void> {
    try {
      const { latitude, longitude, radius, limit } = req.query;

      if (!latitude || !longitude) {
        res.status(400).json({ message: 'Latitude and longitude are required.' });
        return;
      }

      const lat = parseFloat(latitude as string);
      const lon = parseFloat(longitude as string);
      const rad = radius ? parseFloat(radius as string) : undefined;
      const lim = limit ? parseInt(limit as string) : undefined;

      const advertisements = await advertisementService.getNearYouAdvertisements(lat, lon, rad, lim);
      res.status(200).json(advertisements);
    } catch (error) {
        if (error instanceof Error) {
            res.status(500).json({ message: error.message });
        } else {
            res.status(500).json({ message: 'An unknown error occurred' });
        }
    }
  }
}

export const advertisementController = new AdvertisementController();
