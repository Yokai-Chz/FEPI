// Global API Configuration
export const API_BASE_URL = 'http://localhost:5000/api';

export const API_ROUTES = {
  DASHBOARD: {
    GENERAL_STATS: `${API_BASE_URL}/general-stats`,
    RECAUDACION_STATS: `${API_BASE_URL}/recaudacion-stats`,
  },
  OFICIALES: {
    BASE: `${API_BASE_URL}/oficiales`,
    BY_ID: (id: string) => `${API_BASE_URL}/oficiales/${id}`,
    STATUS: (id: string) => `${API_BASE_URL}/oficiales/${id}/status`,
  },
  FOLIOS: {
    BASE: `${API_BASE_URL}/folios`,
    BY_ID: (id: string) => `${API_BASE_URL}/folios/${id}`,
    EXPORT_ZIP: (id: string) => `${API_BASE_URL}/folios/${id}/export-zip`,
    CORREGIR_PLACA: (id: string) => `${API_BASE_URL}/folios/${id}/corregir-placa`,
  },
  DEPOSITOS: {
    BASE: `${API_BASE_URL}/depositos`,
  },
};
