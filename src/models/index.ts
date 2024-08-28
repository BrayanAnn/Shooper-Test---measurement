import sequelize from '../config/database';
import Measurement from './measurement';

const db = {
  Measurement,
  sequelize,
};

export default db;