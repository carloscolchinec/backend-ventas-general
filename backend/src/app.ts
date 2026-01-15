import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import routes from './routes';
import path from 'path';

const app = express();

// Middlewares
app.use(cors());
app.use(helmet({
    crossOriginResourcePolicy: { policy: "cross-origin" },
}));
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public')); // Serve uploads/contracts
app.use('/assets', express.static(path.join(__dirname, '../src/assets'))); // Serve src assets if needed dev

// Routes
app.use('/api', routes);

// 404 Handler
app.use((req, res) => {
    res.status(404).json({ message: 'Ruta no encontrada' });
});

export default app;
