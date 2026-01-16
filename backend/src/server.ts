import app from './app';
import { connectDB } from './config/database';
import dotenv from 'dotenv';

dotenv.config();


console.log("Cargando API de:", process.env.LARAVEL_API_URL);
const PORT = Number(process.env.PORT) || 3150;

const startServer = async () => {
    await connectDB();

    app.listen(PORT, '0.0.0.0', () => {
        console.log(`🚀 Server running on port ${PORT}`);
    });
};

startServer();
