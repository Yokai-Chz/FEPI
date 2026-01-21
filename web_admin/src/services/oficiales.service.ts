import { API_ROUTES } from '../config/api.config';
import { Oficial } from './dashboard.service';

// --- DATOS DE PRUEBA (EMULACIÓN) ---
let mockOficiales: Oficial[] = [
  {
    id: '1',
    placa: '839210',
    nombres: 'JUAN CARLOS',
    paterno: 'PÉREZ',
    materno: 'GARCÍA',
    nombreCompleto: 'JUAN CARLOS PÉREZ GARCÍA',
    sector: 'SECTOR 53 OASIS',
    estatusApp: 'AUTORIZADO',
    curp: 'PERJ800101HDFRRN01',
    rfc: 'PERJ800101A12'
  },
  {
    id: '2',
    placa: '921034',
    nombres: 'MARÍA FERNANDA',
    paterno: 'RÍOS',
    materno: 'SÁNCHEZ',
    nombreCompleto: 'MARÍA FERNANDA RÍOS SÁNCHEZ',
    sector: 'SECTOR 56 CUCHILLA',
    estatusApp: 'INACTIVO',
    curp: 'RIOS900101MDFRRN02',
    rfc: 'RIOS900101B34'
  },
  {
    id: '3',
    placa: '772345',
    nombres: 'ROBERTO',
    paterno: 'GÓMEZ',
    materno: 'BOLAÑOS',
    nombreCompleto: 'ROBERTO GÓMEZ BOLAÑOS',
    sector: 'SECTOR 51 POLANCO',
    estatusApp: 'AUTORIZADO',
    curp: 'GOMR700101HDFRRN03',
    rfc: 'GOMR700101C56'
  }
];

export interface CreateOficialDto {
  placa: string;
  nombres: string;
  paterno: string;
  materno: string;
  sector: string;
  curp?: string;
  rfc?: string;
  password?: string;
}

export interface UpdateOficialDto {
  nombres?: string;
  paterno?: string;
  materno?: string;
  sector?: string;
  curp?: string;
  rfc?: string;
}

export const OficialesService = {
  /**
   * Obtiene el listado completo de oficiales.
   */
  async getAll(): Promise<Oficial[]> {
    try {
      const response = await fetch(API_ROUTES.OFICIALES.BASE);
      if (!response.ok) throw new Error();
      const data = await response.json();
      return data.map((o: any) => ({
        ...o,
        nombreCompleto: o.nombreCompleto || `${o.nombres} ${o.paterno} ${o.materno || ''}`.trim()
      }));
    } catch (error) {
      console.warn('API no disponible, usando datos de prueba.');
      return [...mockOficiales];
    }
  },

  /**
   * Crea un nuevo oficial en el sistema.
   */
  async create(data: CreateOficialDto): Promise<boolean> {
    try {
      const response = await fetch(API_ROUTES.OFICIALES.BASE, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (response.ok) return true;
      throw new Error();
    } catch (error) {
      // Emulación local
      const newOficial: Oficial = {
        id: Math.random().toString(36).substr(2, 9),
        ...data,
        nombreCompleto: `${data.nombres} ${data.paterno} ${data.materno}`.trim().toUpperCase(),
        estatusApp: 'AUTORIZADO'
      };
      mockOficiales = [newOficial, ...mockOficiales];
      return true;
    }
  },

  /**
   * Actualiza la información básica de un oficial.
   */
  async update(id: string, data: UpdateOficialDto): Promise<boolean> {
    try {
      const response = await fetch(API_ROUTES.OFICIALES.BY_ID(id), {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (response.ok) return true;
      throw new Error();
    } catch (error) {
      // Emulación local
      mockOficiales = mockOficiales.map(o => o.id === id ? { 
        ...o, 
        ...data,
        nombreCompleto: `${data.nombres || o.nombres} ${data.paterno || o.paterno} ${data.materno || o.materno}`.trim().toUpperCase()
      } : o);
      return true;
    }
  },

  /**
   * Actualiza el estatus de autorización.
   */
  async updateStatus(id: string, newStatus: 'AUTORIZADO' | 'INACTIVO'): Promise<boolean> {
    try {
      const response = await fetch(API_ROUTES.OFICIALES.STATUS(id), {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });
      if (response.ok) return true;
      throw new Error();
    } catch (error) {
      // Emulación local
      mockOficiales = mockOficiales.map(o => o.id === id ? { ...o, estatusApp: newStatus } : o);
      return true;
    }
  },

  /**
   * Elimina un oficial del sistema.
   */
  async delete(id: string): Promise<boolean> {
    try {
      const response = await fetch(API_ROUTES.OFICIALES.BY_ID(id), {
        method: 'DELETE',
      });
      if (response.ok) return true;
      throw new Error();
    } catch (error) {
      // Emulación local
      mockOficiales = mockOficiales.filter(o => o.id !== id);
      return true;
    }
  },
};
