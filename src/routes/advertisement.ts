import { Router } from 'express';
import { advertisementController } from '../controllers/AdvertisementController';
import passport from 'passport';

const router = Router();

router.post('/', passport.authenticate('jwt', { session: false }), advertisementController.createAdvertisement);
router.get('/popular', advertisementController.getPopularAdvertisements);
router.post('/:id/view', advertisementController.incrementViewCount);
router.get('/near-you', advertisementController.getNearYouAdvertisements);

export default router;
