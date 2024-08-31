import { Request, Response } from 'express';
import MeasurementService from '../services/measurementService';
import { MeasurementDto } from '../dtos/measurementDto';

class MeasurementController {
  // Método para criar um Measurement sem imagem
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

  // Método para obter um Measurement por ID
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

  // Método para upload de imagem e criação de Measurement
  async uploadImage(req: Request, res: Response): Promise<void> {
    try {
      const { image, customer_code, measure_datetime, measure_type } = req.body;

      if (!image || !customer_code || !measure_datetime || !measure_type) {
        res.status(400).json({ error: 'image, customer_code, measure_date_time, and measure_type são necessários' });
        return;
      }

      if (!['WATER', 'GAS'].includes(measure_type)) {
        res.status(400).json({ error: 'measureType must be either WATER or GAS' });
        return;
      }

      const filePath = await MeasurementService.saveBase64Image(image, customer_code);

      const measure_value = await MeasurementService.getMeasurementFromImage(image);

      const measurementData: MeasurementDto = {
        image: image,
        customerCode: customer_code,
        measureDatetime: new Date(measure_datetime),
        measureType: measure_type,
        filePath: filePath,
        measureValue: measure_value,
        confirmedMeasureValue: false
      };

      // Cria o registro do Measurement
      const newMeasurement = await MeasurementService.createMeasurement(measurementData);

      res.status(200).json({ image_url: newMeasurement.filePath , measure_value: measure_value, measure_uuid: newMeasurement.id });
    } catch (error: unknown) {
      if (error instanceof Error) {
        res.status(400).json({ error: error.message });
      } else {
        res.status(500).json({ error: 'An unexpected error occurred' });
      }
    }
  }
}

export default new MeasurementController();
