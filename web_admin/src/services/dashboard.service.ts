export interface DashboardStats {
  infraccionesHoy: number;
  eficienciaOperativa: string;
  ocupacionCorralones: number;
  alertaCorralones: string;
  oficialesTurno: number;
  zonasActivas: string;
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

export interface UsuarioAdmin {
  nombre: string;
  rol: string;
  iniciales: string;
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
}

export interface RecaudacionStats {
  foliosMes: string;
  pendientesPago: string;
  enImpugnacion: string;
}

export interface Oficial {
  id: string;
  placa: string;
  nombreCompleto: string;
  sector: string;
  estatusApp: 'AUTORIZADO' | 'INACTIVO';
}

// SERVICIOS 

export const DashboardService = {
  async getGeneralStats(): Promise<DashboardStats> {
    // Simulación: fetch('http://tu-api.com/stats')
    return {
      infraccionesHoy: 1248,
      eficienciaOperativa: "↑ 8.5%",
      ocupacionCorralones: 24,
      alertaCorralones: "Nivel de ocupación alto",
      oficialesTurno: 412,
      zonasActivas: "Centro, Norte, Oriente"
    };
  },

  async getDepositos(): Promise<Deposito[]> {
    // Simulación: fetch('http://tu-api.com/depositos')
    return [
      { 
        id: '1', 
        nombre: 'Depósito Centro (Zócalo)', 
        zona: 'Centro', 
        capacidadTotal: 1000, 
        ocupacionActual: 920, 
        porcentaje: 92, 
        estatus: 'CRÍTICO' 
      },
      { 
        id: '2', 
        nombre: 'Depósito Oriente (Iztapalapa)', 
        zona: 'Oriente', 
        capacidadTotal: 2500, 
        ocupacionActual: 1250, 
        porcentaje: 50, 
        estatus: 'DISPONIBLE' 
      },
    ];
  },

  async getRecaudacionStats(): Promise<RecaudacionStats> {
    return {
      foliosMes: "15,420",
      pendientesPago: "$2,450,100 MXN",
      enImpugnacion: "142 Quejas"
    };
  },

  async getFolios(): Promise<Folio[]> {
    return [
      { 
        id: '1', folio: 'MX-99201', placa: 'ABC-1234', fechaHora: '13/01/26 10:15', 
        oficialId: '982734', monto: '$1,085.00', estatusPago: 'LIQUIDADA', evidenciaCount: 3 
      },
      { 
        id: '2', folio: 'MX-99198', placa: 'XYZ-9876', fechaHora: '13/01/26 09:40', 
        oficialId: '771022', monto: '$2,170.00', estatusPago: 'PENDIENTE', evidenciaCount: 2 
      },
    ];
  },

  async getOficiales(): Promise<Oficial[]> {
    return [
      { 
        id: '1', placa: '982734', nombreCompleto: 'Ríos Rivera Fernanda', 
        sector: 'Zona Centro (01)', estatusApp: 'AUTORIZADO' 
      },
      { 
        id: '2', placa: '771022', nombreCompleto: 'Hernández Mora Jorge', 
        sector: 'Zona Oriente (04)', estatusApp: 'INACTIVO' 
      },
    ];
  }
};