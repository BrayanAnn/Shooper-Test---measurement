import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import measurementRoutes from './routes/measurementRoutes';

const app = express();

app.use(express.json({ limit: '100mb' }));
app.use(express.urlencoded({ limit: '100mb', extended: true }));
app.use(cors());
app.use(bodyParser.json({ limit: '100mb' }));
app.use(bodyParser.urlencoded({ limit: '100mb', extended: true }));
app.use('/api', measurementRoutes);
app.get('/', (req,res) => {
    res.send("API is on")
})
export default app;