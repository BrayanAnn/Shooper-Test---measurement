// src/models/measurement.ts
import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../config/database';

// Definição dos atributos do modelo
interface MeasurementAttributes {
  id: string;
  image: string;
  customerCode: string;
  measureDatetime: Date;
  measureType: 'WATER' | 'GAS';
  measureValue: number | null;
  confirmedMeasureValue: boolean;
  filePath: string;
}

// Atributos opcionais na criação (id gerado automaticamente)
type MeasurementCreationAttributes = Optional<MeasurementAttributes, 'id'>;

// Classe do modelo Measurement
class Measurement extends Model<MeasurementAttributes, MeasurementCreationAttributes> implements MeasurementAttributes {
  public id!: string;
  public image!: string;
  public customerCode!: string;
  public measureDatetime!: Date;
  public measureType!: 'WATER' | 'GAS';
  public measureValue: number = -1;
  public confirmedMeasureValue: boolean = false;
  public filePath!: string;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Measurement.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    image: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    customerCode: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    filePath: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    measureDatetime: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    measureType: {
      type: DataTypes.ENUM('WATER', 'GAS'),
      allowNull: false,
    },
    measureValue: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    confirmedMeasureValue: {
      type: DataTypes.BOOLEAN,
    }
  },
  {
    sequelize,
    tableName: 'measurements',
  }
);

export default Measurement;