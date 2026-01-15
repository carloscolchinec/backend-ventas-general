import { Request, Response } from 'express';
import { LaravelApiService } from '../services/LaravelApiService';

export class CatalogosController {
    static async metodosPago(req: Request, res: Response) {
        try {
            const data = await LaravelApiService.getMetodosPago();
            return res.json(data);
        } catch (error) {
            return res.status(500).json({ message: 'Error fetching methods from external API' });
        }
    }

    static async tiposBanco(req: Request, res: Response) {
        try {
            const data = await LaravelApiService.getTiposBanco();
            return res.json(data);
        } catch (error) {
            return res.status(500).json({ message: 'Error fetching banks from external API' });
        }
    }

    static async serviciosAdicionales(req: Request, res: Response) {
        try {
            console.log('[CatalogosController] serviciosAdicionales called');
            const data = await LaravelApiService.getServiciosAdicionales();
            return res.json(data);
        } catch (error) {
            console.error('[CatalogosController] Error in serviciosAdicionales:', error);
            return res.status(500).json({ message: 'Error fetching services from external API' });
        }
    }
}
