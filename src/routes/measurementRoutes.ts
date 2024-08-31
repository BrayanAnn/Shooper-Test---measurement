import { Router } from 'express';
import MeasurementController from '../controllers/measurementController';

const router = Router();

//GET METHODS
router.get('/measurements/:id', MeasurementController.getById);
router.post('/measurements', MeasurementController.create);

//POST METHODS
router.post('/measurements/upload', MeasurementController.uploadImage);

export default router;