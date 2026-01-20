import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();
export class LaravelApiService {
    private static baseUrl = "https://socpro.seroficom.com/backend/api";

    static async getPlanes(filtros: any = {}) {
        try {
            // Adjust endpoint if needed (e.g., /planes or /planes/filtrar)
            // If filters are present, use /planes/filtrar
            const endpoint = Object.keys(filtros).length > 0 ? '/planes/filtrar' : '/planes';
            console.log(`[LaravelApiService] Fetching planes from: ${this.baseUrl}${endpoint}`, filtros);
            const response = await axios.get(`${this.baseUrl}${endpoint}`, { params: filtros });
            console.log(`[LaravelApiService] Planes response status: ${response.status}, items: ${Array.isArray(response.data) ? response.data.length : 'not array'}`);
            return response.data;
        } catch (error) {
            console.error('Error fetching planes from Laravel:', error);
            throw error;
        }
    }

    static async getPlanById(id: string | number) {
        try {
            const encodedId = encodeURIComponent(id.toString());
            const url = `${this.baseUrl}/planes/${encodedId}`;
            console.log(`[LaravelApiService] Calling: GET ${url}`);
            const response = await axios.get(url);
            // Laravel format: { success: true, data: { ... } }
            console.log(`[LaravelApiService] getPlanById response from ${url}:`, JSON.stringify(response.data));
            return response.data.success ? response.data.data : response.data;
        } catch (error: any) {
            console.error(`[LaravelApiService] Error fetching plan ${id} from Laravel (${this.baseUrl}):`, error.message);
            if (error.response) {
                console.error(`[LaravelApiService] Error response status: ${error.response.status}`);
                console.error(`[LaravelApiService] Error response data:`, error.response.data);
            }
            throw error;
        }
    }

    static async getMetodosPago() {
        try {
            const response = await axios.get(`${this.baseUrl}/catalogos/metodos-pago`);
            return response.data;
        } catch (error) {
            console.error('Error fetching metodos pago from Laravel:', error);
            throw error;
        }
    }

    static async getTiposBanco() {
        try {
            const response = await axios.get(`${this.baseUrl}/catalogos/tipos-banco`);
            return response.data;
        } catch (error) {
            console.error('Error fetching tipos banco from Laravel:', error);
            throw error;
        }
    }

    static async getServiciosAdicionales() {
        try {
            console.log(`[LaravelApiService] Fetching servicios from: ${this.baseUrl}/catalogos/servicios-adicionales`);
            const response = await axios.get(`${this.baseUrl}/catalogos/servicios-adicionales`);
            console.log(`[LaravelApiService] Servicios response data:`, JSON.stringify(response.data));
            return response.data;
        } catch (error) {
            console.error('Error fetching servicios adicionales from Laravel:', error);
            throw error;
        }
    }
}
