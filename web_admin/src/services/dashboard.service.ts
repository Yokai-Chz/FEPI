// =============================================
// INTERFACES
// =============================================
export interface DashboardStats {
  infraccionesHoy: number;
  eficienciaOperativa: string;
  ocupacionCorralones: number;
  alertaCorralones: string;
  oficialesTurno: number;
  zonasActivas: string;
}

export interface Folio {
  id: string;
  folio: string;
  placa: string;
  fechaHora: string;
  oficialId: string;
  monto: string;
  estatusPago: 'LIQUIDADA' | 'PENDIENTE' | 'IMPUGNADA';
  evidenciaCount: number;
  motivo: string;
  vehiculo: {
    marca: string;
    modelo: string;
    color: string;
  };
  ubicacion: {
    direccion: string;
    lat: number;
    lng: number;
  };
}

export interface Deposito {
  id: string;
  nombre: string;
  zona: string;
  capacidadTotal: number;
  ocupacionActual: number;
  porcentaje: number;
  estatus: 'CRÍTICO' | 'DISPONIBLE' | 'MODERADO';
}

export interface RecaudacionStats {
  foliosMes: string;
  pendientesPago: string;
  enImpugnacion: string;
}

export interface Oficial {
  id: string;
  placa: string;
  nombres: string;
  paterno: string;
  materno: string;
  nombreCompleto: string; // Se mantendrá como computado o recibido concatenado para facilidad visual
  sector: string;
  estatusApp: 'AUTORIZADO' | 'INACTIVO';
  curp?: string;
  rfc?: string;
}

// =============================================
// CONFIGURACIÓN
// =============================================
const API_BASE = 'http://localhost:5000/api';

// =============================================
// SERVICIO (CONECTADO Y ADAPTADO)
// =============================================
export const DashboardService = {

  async getGeneralStats(): Promise<DashboardStats> {
    try {
      const response = await fetch(`${API_BASE}/general-stats`);
      if (!response.ok) throw new Error('Error en API General Stats');
      return await response.json();
    } catch (error) {
      console.error("Error al obtener estadísticas generales:", error);
      return {
        infraccionesHoy: 0,
        eficienciaOperativa: "0%",
        ocupacionCorralones: 0,
        alertaCorralones: "Sin conexión",
        oficialesTurno: 0,
        zonasActivas: "N/A"
      };
    }
  },

  
  async getFolios(filtro?: { placa?: string; folio?: string }): Promise<Folio[]> {
    try {
      const response = await fetch(`${API_BASE}/folios`);
      if (!response.ok) throw new Error('Error en API Folios');
      const rawData = await response.json();

      const data: Folio[] = rawData.map((f: any) => ({
        id: f.id_infraccion?.toString() || Math.random().toString(),
        folio: f.folio || `INF-${f.id_infraccion}`,
        placa: f.placa || "S/N",
        fechaHora: f.fecha || "Fecha no disp.",
        oficialId: f.id_agente?.toString() || "000",
        monto: f.monto ? `$${f.monto.toLocaleString()}` : "$0.00",
        estatusPago: f.estatus_pago || 'PENDIENTE',
        evidenciaCount: f.evidencias ? f.evidencias.length : 0,
        motivo: f.notas || "Sin descripción",
        vehiculo: f.vehiculo || { marca: "N/A", modelo: "N/A", color: "N/A" },
        ubicacion: {
          direccion: f.ubicacion_infractor 
            ? `${f.ubicacion_infractor.vialidad} ${f.ubicacion_infractor.numero_exterior}`
            : "Ubicación N/A",
          lat: f.latitud || 0,
          lng: f.longitud || 0
        }
      }));

      if (!filtro || (!filtro.placa && !filtro.folio)) return data;

      const placaLower = filtro.placa?.toLowerCase() || '';
      const folioLower = filtro.folio?.toLowerCase() || '';

      return data.filter(f => 
        (placaLower && f.placa.toLowerCase().includes(placaLower)) ||
        (folioLower && f.folio.toLowerCase().includes(folioLower))
      );
    } catch (error) {
      console.error("Error al obtener folios:", error);
      return [];
    }
  },

    async exportEvidence(folioId: string): Promise<boolean> {
    try {
      // HU009: Generación de carpeta de evidencias (zip)
      // Simplemente abrimos la URL en una nueva pestaña y el navegador descarga el ZIP
      window.location.href = `${API_BASE}/folios/${folioId}/export-zip`;
      return true;
    } catch (error) {
      console.error("Error al descargar ZIP:", error);
      alert("No se pudo generar la carpeta de evidencias.");
      return false;
    }
  },

    async getFolioById(folioStr: string): Promise<Folio | undefined> {
    try {
      // Ahora consumimos la API mediante /api/folios/{folio}
      const response = await fetch(`${API_BASE}/folios/${folioStr}`);
      if (!response.ok) return undefined;
      
      const f = await response.json();
      
      // Mapeamos al formato de nuestra interfaz local
      return {
        id: f.folio, // Usamos el folio como ID único en el frontend también
        folio: f.folio,
        placa: f.placa,
        fechaHora: f.fecha,
        oficialId: f.id_agente.toString(),
        monto: "$0.00", // Opcional: traer de la BD si es necesario
        estatusPago: 'PENDIENTE',
        evidenciaCount: f.evidencias.length,
        motivo: f.notas,
        vehiculo: { marca: "N/A", modelo: "N/A", color: "N/A" },
        ubicacion: {
          direccion: `${f.ubicacion_infractor.vialidad} ${f.ubicacion_infractor.numero_exterior}`,
          lat: f.latitud,
          lng: f.longitud
        }
      };
    } catch (error) {
      console.error("Error al obtener folio por string:", error);
      return undefined;
    }
  },

  async getRecaudacionStats(): Promise<RecaudacionStats> {
    try {
      const response = await fetch(`${API_BASE}/recaudacion-stats`);
      if (!response.ok) throw new Error('Error en API Recaudación');
      return await response.json();
    } catch (error) {
      return { foliosMes: "0", pendientesPago: "$0.00", enImpugnacion: "0" };
    }
  },

  async getDepositos(): Promise<Deposito[]> {
    try {
      const response = await fetch(`${API_BASE}/depositos`);
      if (!response.ok) throw new Error('Error en API Depósitos');
      return await response.json();
    } catch (error) {
      return [];
    }
  },

  async getOficiales(): Promise<Oficial[]> {
    try {
      const response = await fetch(`${API_BASE}/oficiales`);
      if (!response.ok) throw new Error('Error en API Oficiales');
      return await response.json();
    } catch (error) {
      return [];
    }
  },

  async updateOficialStatus(oficialId: string, newStatus: 'AUTORIZADO' | 'INACTIVO'): Promise<boolean> {
    try {
      const response = await fetch(`${API_BASE}/oficiales/${oficialId}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      });
      return response.ok;
    } catch (error) {
      return false;
    }
  },

  async corregirPlaca(folioId: string, nuevaPlaca: string): Promise<boolean> {
    try {
      const response = await fetch(`${API_BASE}/folios/${folioId}/corregir-placa`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nuevaPlaca })
      });
      
      const result = await response.json();
      if (!response.ok) {
        alert(result.message); // Muestra el error de los 3 caracteres
        return false;
      }
      return true;
    } catch (error) {
      return false;
    }
  },

  
};