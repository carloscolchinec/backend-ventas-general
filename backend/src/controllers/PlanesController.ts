import { Request, Response } from 'express';
import { LaravelApiService } from '../services/LaravelApiService';

export class PlanesController {
    static async index(req: Request, res: Response) {
        try {
            const data = await LaravelApiService.getPlanes();
            return res.json(data);
        } catch (error) {
            return res.status(500).json({ message: 'Error fetching planes from external API' });
        }
    }

    static async filtrar(req: Request, res: Response) {
        try {
            const filtros = req.query;
            const data = await LaravelApiService.getPlanes(filtros);
            return res.json(data);
        } catch (error) {
            return res.status(500).json({ message: 'Error filtering planes from external API' });
        }
    }
}
