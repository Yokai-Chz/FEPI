import { Dimensions } from 'react-native';

const { width, height } = Dimensions.get('window');

// 1. Paleta de Colores
export const COLORS = {
  // Institucionales
  primary: '#691C32',    // Vino CDMX
  secondary: '#BC955C',  // Dorado CDMX
  
  // Semánticos
  success: '#047857',    // Verde éxito
  warning: '#fbbf24',    // Amarillo alerta
  error: '#dc2626',      // Rojo error
  info: '#3b82f6',       // Azul info
  
  // Escala de Grises
  white: '#FFFFFF',
  background: '#f3f4f6', // Gris muy claro para fondos
  surface: '#FFFFFF',    // Para tarjetas
  textMain: '#1f2937',   // Gris oscuro casi negro
  textSec: '#6b7280',    // Gris medio
  textLight: '#9ca3af',  // Gris claro (placeholders)
  border: '#e5e7eb',     // Bordes sutiles
};

// 2. Espaciado (Sistema de grid de 4px)
export const SPACING = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
};

// 3. Tamaños de Fuente
export const FONT_SIZE = {
  xs: 10,
  sm: 12,
  md: 14,
  lg: 16,
  xl: 18,
  xxl: 24,
  xxxl: 32,
};

// 4. Bordes y Radios
export const BORDER_RADIUS = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  round: 9999, // Para círculos perfectos
};

// 5. Dimensiones
export const SIZES = {
  width,
  height,
};

// 6. Sombras (Estilo Tailwind/Web)
export const SHADOWS = {
  sm: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.18,
    shadowRadius: 1.0,
    elevation: 1,
  },
  md: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 3,
  },
  lg: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.30,
    shadowRadius: 6,
    elevation: 8,
  }
};