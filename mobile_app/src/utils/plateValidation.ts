/**
 * Utilidades para la validación de placas vehiculares de la CDMX
 * Basado en la NOM-001-SCT-2-2016 y el archivo infoPlaca.md
 */

// Letras prohibidas para evitar confusiones (I, O, Q, Ñ) en CDMX
const VALID_CHARS_REGEX = /^[A-HJ-NPR-Z0-9]+$/;

export const isValidCDMXPlate = (plate: string): boolean => {
  const cleanPlate = plate.toUpperCase().replace(/[\s-]/g, '');

  if (!VALID_CHARS_REGEX.test(cleanPlate)) {
    return false;
  }

  // --- PATRONES SEGÚN INFOPLACA.MD ---

  // 1. Transporte Privado
  const particularAuto = /^[A-Z]\d{2}[A-Z]{3}$/;        // A00-AAA
  const camionGrua = /^[A-Z]\d{3}[A-Z]{2}$/;            // A-000-AA
  const moto1 = /^[A-Z]\d{2}[A-Z]{2}$/;                 // A00AA
  const moto2 = /^\d[A-Z]\d[A-Z]{2}$/;                 // 0A0AA
  const moto3 = /^[A-Z]\d[A-Z]{2}\d$/;                 // A0AA0
  const remolquePrivado = /^[A-Z]\d[A-Z]\d{2}$/;        // A-0A-00

  // 2. Servicio Público Local
  const taxiLS = /^[LS]\d{4}[A-Z]$/;                    // L-0000-A o S-0000-A
  const ruta = /^\d{3}[A-Z]\d{3}$/;                     // 000-A-000
  const autobusPublico = /^\d{6}$/;                     // 000-000

  // 3. Autotransporte Federal
  const federalCarga = /^\d{2}[A-Z]{2}\d[A-Z]$/;        // 00-AA-0A
  const federalDolly = /^[D]\d{2}\d{3}$/;               // D-00-000 (Inicia con D)

  // 4. Servicios Especiales
  const ecologico = /^\d{2}[A-Z]\d{3}$/;                // 00A-000
  const discapacidad = /^\d{2}[A-Z]\d{2}$/;             // 00-A-00
  const antiguo = /^\d[A-Z]{2}\d{2}$/;                  // 0AA-00
  const patrulla = /^[A-Z]{2}\d{4}[A-Z]\d$/;            // AA-000A-0
  const emergencia = /^[A-Z]{2}\d{3}[A-Z]{2}$/;         // AA-000-AA

  return (
    particularAuto.test(cleanPlate) ||
    camionGrua.test(cleanPlate) ||
    moto1.test(cleanPlate) ||
    moto2.test(cleanPlate) ||
    moto3.test(cleanPlate) ||
    remolquePrivado.test(cleanPlate) ||
    taxiLS.test(cleanPlate) ||
    ruta.test(cleanPlate) ||
    autobusPublico.test(cleanPlate) ||
    federalCarga.test(cleanPlate) ||
    federalDolly.test(cleanPlate) ||
    ecologico.test(cleanPlate) ||
    discapacidad.test(cleanPlate) ||
    antiguo.test(cleanPlate) ||
    patrulla.test(cleanPlate) ||
    emergencia.test(cleanPlate)
  );
};

export const formatPlate = (plate: string): string => {
  const clean = plate.toUpperCase().replace(/[\s-]/g, '');
  
  // --- FORMATOS FORÁNEOS (NOM-001-SCT-2-2016) ---
  
  // AAA-000-A (Foráneo Particular - 7 caracteres)
  if (/^[A-Z]{3}\d{3}[A-Z]$/.test(clean)) {
    return `${clean.substring(0, 3)}-${clean.substring(3, 6)}-${clean.substring(6)}`;
  }

  // AA-0000-A (Foráneo Camión - 7 caracteres)
  if (/^[A-Z]{2}\d{4}[A-Z]$/.test(clean)) {
    return `${clean.substring(0, 2)}-${clean.substring(2, 6)}-${clean.substring(6)}`;
  }

  // --- FORMATOS CDMX ---
  
  // A00-AAA (Particular CDMX)
  if (/^[A-Z]\d{2}[A-Z]{3}$/.test(clean)) {
    return `${clean.substring(0, 3)}-${clean.substring(3)}`;
  }
  
  // A-000-AA (Camión/Grúa CDMX)
  if (/^[A-Z]\d{3}[A-Z]{2}$/.test(clean)) {
    return `${clean.substring(0, 1)}-${clean.substring(1, 4)}-${clean.substring(4)}`;
  }

  // L-0000-A (Taxi)
  if (/^[LS]\d{4}[A-Z]$/.test(clean)) {
    return `${clean.substring(0, 1)}-${clean.substring(1, 5)}-${clean.substring(5)}`;
  }

  // 000-A-000 (Ruta)
  if (/^\d{3}[A-Z]\d{3}$/.test(clean)) {
    return `${clean.substring(0, 3)}-${clean.substring(3, 4)}-${clean.substring(4)}`;
  }

  // 00-AA-0A (Federal)
  if (/^\d{2}[A-Z]{2}\d[A-Z]$/.test(clean)) {
    return `${clean.substring(0, 2)}-${clean.substring(2, 4)}-${clean.substring(4)}`;
  }

  // 00-A-00 (Discapacidad)
  if (/^\d{2}[A-Z]\d{2}$/.test(clean)) {
    return `${clean.substring(0, 2)}-${clean.substring(2, 3)}-${clean.substring(3)}`;
  }

  return clean;
};