import MeasurementRepository from '../repositories/measurementRepository';
import { MeasurementDto } from '../dtos/measurementDto';
import Measurement from '../models/measurement';

class MeasurementService {
  async createMeasurement(measurementData: MeasurementDto): Promise<Measurement> {
    return MeasurementRepository.create(measurementData);
  }

  async getMeasurementById(id: string): Promise<Measurement | null> {
    return MeasurementRepository.findById(id);
  }

  // Adicione lógica adicional conforme necessário
}

export default new MeasurementService();