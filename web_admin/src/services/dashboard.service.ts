// INTERFACES
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
  oficialNombre: string;
  monto: string;
  estatusPago: 'LIQUIDADA' | 'PENDIENTE' | 'IMPUGNADA';
  evidenciaCount: number;
  motivo: string;
  ubicacion: {
    direccion: string;
    lat: number;
    lng: number;
  };
  vehiculo: {
    marca: string;
    modelo: string;
    color: string;
  };
  evidencias: {
    id: string;
    url: string; // Usaremos URLs de placeholder
    fecha: string;
  }[];
}

export interface FolioHistory {
  id: string;
  fecha: string;
  usuario: string;
  accion: string;
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


// =============================================
// BASE DE DATOS FALSA
// =============================================
const FAKE_FOLIOS_DB: Folio[] = [
  { 
    id: '1', folio: 'MX-99201', placa: 'ABC-1234', fechaHora: '13/01/26 10:15', 
    oficialId: '982734', oficialNombre: 'Ríos Rivera Fernanda', monto: '$1,085.00', estatusPago: 'LIQUIDADA', evidenciaCount: 2,
    motivo: 'ART-30-I: Estacionarse sobre banquetas, cruces peatonales o ciclovías',
    ubicacion: {
      direccion: 'Av. Insurgentes Sur 123, Roma Nte., Cuauhtémoc, 06700 Ciudad de México, CDMX',
      lat: 19.417,
      lng: -99.160
    },
    vehiculo: { marca: 'Nissan', modelo: 'Versa', color: 'Rojo' },
    evidencias: [
      { id: 'e1', url: 'https://placehold.co/600x400/cccccc/691C32?text=Evidencia+1', fecha: '13/01/26 10:14' },
      { id: 'e2', url: 'https://placehold.co/600x400/cccccc/691C32?text=Evidencia+2', fecha: '13/01/26 10:14' },
    ]
  },
  { 
    id: '2', folio: 'MX-99198', placa: 'XYZ-9876', fechaHora: '13/01/26 09:40', 
    oficialId: '771022', oficialNombre: 'Hernández Mora Jorge', monto: '$2,170.00', estatusPago: 'PENDIENTE', evidenciaCount: 3,
    motivo: 'ART-11-X-A: Circular sobre carriles exclusivos para el transporte público',
    ubicacion: {
      direccion: 'Paseo de la Reforma 222, Juárez, Cuauhtémoc, 06600 Ciudad de México, CDMX',
      lat: 19.431,
      lng: -99.155
    },
    vehiculo: { marca: 'Chevrolet', modelo: 'Aveo', color: 'Blanco' },
    evidencias: [
      { id: 'e3', url: 'https://placehold.co/600x400/cccccc/691C32?text=Evidencia+3', fecha: '13/01/26 09:39' },
      { id: 'e4', url: 'https://placehold.co/600x400/cccccc/691C32?text=Evidencia+4', fecha: '13/01/26 09:39' },
      { id: 'e5', url: 'https://placehold.co/600x400/cccccc/691C32?text=Evidencia+5', fecha: '13/01/26 09:39' },
    ]
  },
];

const FAKE_HISTORY_DB: Record<string, FolioHistory[]> = {
  '1': [
    { id: 'h1', fecha: '14/01/26 11:00', usuario: 'spatino', accion: 'Creación de Folio.' }
  ],
  '2': [
    { id: 'h2', fecha: '14/01/26 12:30', usuario: 'spatino', accion: "Placa corregida de 'XYZ-9875' a 'XYZ-9876'." },
    { id: 'h3', fecha: '14/01/26 11:00', usuario: 'slopez', accion: 'Creación de Folio.' }
  ]
};

const FAKE_OFICIALES_DB: Oficial[] = [
  { 
    id: '1', placa: '982734', nombreCompleto: 'Ríos Rivera Fernanda', 
    sector: 'Zona Centro (01)', estatusApp: 'AUTORIZADO' 
  },
  { 
    id: '2', placa: '771022', nombreCompleto: 'Hernández Mora Jorge', 
    sector: 'Zona Oriente (04)', estatusApp: 'INACTIVO' 
  },
  { 
    id: '3', placa: '830193', nombreCompleto: 'Castillo Vera Sofía', 
    sector: 'Zona Poniente (02)', estatusApp: 'AUTORIZADO' 
  },
];


// =============================================
// SERVICIOS 
// =============================================
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

  async getFolios(filtro?: { placa?: string; folio?: string }): Promise<Folio[]> {
    console.log("Filtrando con:", filtro);
    if (!filtro || (!filtro.placa && !filtro.folio)) {
      return FAKE_FOLIOS_DB;
    }

    const placaLower = filtro.placa?.toLowerCase() || '';
    const folioLower = filtro.folio?.toLowerCase() || '';

    return FAKE_FOLIOS_DB.filter(f => 
      (placaLower && f.placa.toLowerCase().includes(placaLower)) ||
      (folioLower && f.folio.toLowerCase().includes(folioLower))
    );
  },

  async getFolioById(id: string): Promise<Folio | undefined> {
    return FAKE_FOLIOS_DB.find(f => f.id === id);
  },

  async getFolioHistory(folioId: string): Promise<FolioHistory[]> {
    return FAKE_HISTORY_DB[folioId] || [];
  },

  async anularFolio(folioId: string, motivo: string): Promise<boolean> {
    const folio = FAKE_FOLIOS_DB.find(f => f.id === folioId);
    if (folio) {
      folio.estatusPago = 'IMPUGNADA'; // Usaremos 'IMPUGNADA' como 'ANULADA'
      FAKE_HISTORY_DB[folioId]?.push({
        id: `h${Date.now()}`,
        fecha: new Date().toLocaleString('es-MX'),
        usuario: 'spatino',
        accion: `Folio anulado. Motivo: ${motivo}`
      });
      console.log(`Folio ${folioId} anulado. Motivo: ${motivo}`);
      return true;
    }
    return false;
  },
  
  async corregirPlaca(folioId: string, nuevaPlaca: string): Promise<boolean> {
     const folio = FAKE_FOLIOS_DB.find(f => f.id === folioId);
    if (folio) {
      const placaAnterior = folio.placa;
      folio.placa = nuevaPlaca;
       FAKE_HISTORY_DB[folioId]?.push({
        id: `h${Date.now()}`,
        fecha: new Date().toLocaleString('es-MX'),
        usuario: 'spatino',
        accion: `Placa corregida de '${placaAnterior}' a '${nuevaPlaca}'.`
      });
      console.log(`Placa del folio ${folioId} corregida a ${nuevaPlaca}`);
      return true;
    }
    return false;
  },

  async exportEvidence(folioId: string): Promise<boolean> {
    console.log(`Simulando la descarga de la carpeta de evidencias para el folio ${folioId}`);
    // En un caso real, esto haría una llamada al backend que devolvería un archivo zip
    alert(`Descargando evidencias para el folio ${folioId} (simulado)`);
    return true;
  },

  async getOficiales(): Promise<Oficial[]> {
    return FAKE_OFICIALES_DB;
  },

  async updateOficialStatus(oficialId: string, newStatus: 'AUTORIZADO' | 'INACTIVO'): Promise<boolean> {
    const oficial = FAKE_OFICIALES_DB.find(o => o.id === oficialId);
    if (oficial) {
      oficial.estatusApp = newStatus;
      console.log(`Estatus del oficial ${oficialId} actualizado a ${newStatus}`);
      return true;
    }
    return false;
  }
};