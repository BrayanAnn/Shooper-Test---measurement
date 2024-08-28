import express from 'express';
import measurementRoutes from './routes/measurementRoutes';

const app = express();

app.use(express.json());
app.use('/api', measurementRoutes);

export default app;