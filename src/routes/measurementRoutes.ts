// src/routes/measurementRoutes.ts
import { Router } from 'express';
import MeasurementController from '../controllers/measurementController';

const router = Router();

router.post('/measurements', MeasurementController.create);
router.get('/measurements/:id', MeasurementController.getById);

export default router;