import { Request, Response } from 'express';
import MeasurementService from '../services/measurementService';
import { MeasurementDto } from '../dtos/measurementDto';

class MeasurementController {
  async create(req: Request, res: Response): Promise<void> {
    try {
      const measurementData: MeasurementDto = req.body;
      const newMeasurement = await MeasurementService.createMeasurement(measurementData);
      res.status(201).json(newMeasurement);
    } catch (error: unknown) {
      if (error instanceof Error) {
        res.status(400).json({ error: error.message });
      } else {
        res.status(500).json({ error: 'An unexpected error occurred' });
      }
    }
  }

  async getById(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const measurement = await MeasurementService.getMeasurementById(id);
      if (measurement) {
        res.status(200).json(measurement);
      } else {
        res.status(404).json({ error: 'Measurement not found' });
      }
    } catch (error: unknown) {
      if (error instanceof Error) {
        res.status(500).json({ error: error.message });
      } else {
        res.status(500).json({ error: 'An unexpected error occurred' });
      }
    }
  }
}

export default new MeasurementController();