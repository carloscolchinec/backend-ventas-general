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
app.use(express.static(path.join(__dirname, '../dist'))); // Serve Vue/Vite App

// View Engine Setup
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Routes
import pdfRoutes from './routes/pdfRoutes';
app.use('/api', routes);
app.use('/pdf', pdfRoutes);

// Catch-all handler for SPA (Must be last)
app.get(/.*/, (req, res) => {
    res.sendFile(path.join(__dirname, '../dist/index.html'));
});

export default app;
