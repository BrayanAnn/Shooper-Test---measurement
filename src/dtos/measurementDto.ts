export interface MeasurementDto {
    image: string;
    customerCode: string;
    measureDatetime: Date;
    measureType: 'WATER' | 'GAS';
  }