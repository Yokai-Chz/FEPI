/**
 * Utilidades para la validación de placas vehiculares de la CDMX
 * Basado en la NOM-001-SCT-2-2016 y reglamentos locales.
 */

// Letras prohibidas para evitar confusiones (I, O, Q, Ñ)
// Se usa un regex que solo permita: A-H, J-N, P, R-Z
const VALID_CHARS_REGEX = /^[A-HJ-NPR-Z0-9]+$/;

export const isValidCDMXPlate = (plate: string): boolean => {
  // 1. Limpieza básica: mayúsculas, quitar guiones y espacios
  const cleanPlate = plate.toUpperCase().replace(/[\s-]/g, '');

  // 2. Verificar caracteres prohibidos (I, O, Q, Ñ)
  if (!VALID_CHARS_REGEX.test(cleanPlate)) {
    return false;
  }

  // 3. Validar contra patrones conocidos de CDMX

  // --- AUTOMÓVILES PRIVADOS ---
  
  // Formato Anterior: 3 Números + 3 Letras (Ej. 123-ABC)
  const privateOldPattern = /^\d{3}[A-Z]{3}$/;
  
  // Formato Nuevo: 1 Letra + 2 Números + 3 Letras (Ej. A01-AAA)
  const privateNewPattern = /^[A-Z]\d{2}[A-Z]{3}$/;


  // --- MOTOCICLETAS ---
  
  // Formato estándar (Ej. G01AA, 1A1AA) - 5 Caracteres
  // Letra-Num-Num-Letra-Letra OR Num-Letra-Num-Letra-Letra
  const motoPattern1 = /^[A-Z]\d{2}[A-Z]{2}$/; // G01AA
  const motoPattern2 = /^[0-9][A-Z][0-9][A-Z]{2}$/; // 1A1AA (También visto en asignaciones)


  // --- TRANSPORTE PÚBLICO (TAXIS) ---
  
  // Taxi Libre/Sitio (Ej. A-12345, B-12345)
  const taxiPatternAB = /^[AB]\d{5}$/;
  
  // Taxi Libre/Sitio Series L y S (Ej. L-0001-A)
  const taxiPatternLS = /^[LS]\d{4}[A-Z]$/;


  // --- AUTO ANTIGUO ---
  // Formato: AAA-00 (Según infoPlaca.md) o Digito-Letra-Letra-Digito-Digito (Según DOF Series)
  // Adoptamos el de infoPlaca.md como referencia primaria solicitada, pero agregamos el del DOF por robustez.
  const ancientPattern1 = /^[A-Z]{3}\d{2}$/; 
  const ancientPattern2 = /^\d[A-Z]{2}\d{2}$/;

  return (
    privateOldPattern.test(cleanPlate) ||
    privateNewPattern.test(cleanPlate) ||
    motoPattern1.test(cleanPlate) ||
    motoPattern2.test(cleanPlate) ||
    taxiPatternAB.test(cleanPlate) ||
    taxiPatternLS.test(cleanPlate) ||
    ancientPattern1.test(cleanPlate) ||
    ancientPattern2.test(cleanPlate)
  );
};

export const formatPlate = (plate: string): string => {
  const clean = plate.toUpperCase().replace(/[\s-]/g, '');
  
  // --- AUTOMÓVILES PRIVADOS CDMX ---
  // Nuevo: A01-AAA
  if (/^[A-Z]\d{2}[A-Z]{3}$/.test(clean)) {
    return `${clean.substring(0, 3)}-${clean.substring(3)}`;
  }
  // Anterior: 123-ABC
  if (/^\d{3}[A-Z]{3}$/.test(clean)) {
    return `${clean.substring(0, 3)}-${clean.substring(3)}`;
  }

  // --- FEDERAL / CARGA / CAMIONES ---
  // Formato: 12-AB-34 (2 Num - 2 Letras - 2 Num)
  if (/^\d{2}[A-Z]{2}\d{2}$/.test(clean)) {
    return `${clean.substring(0, 2)}-${clean.substring(2, 4)}-${clean.substring(4)}`;
  }
  // Formato: 12-AB-3C (2 Num - 2 Letras - 1 Num 1 Letra)
  if (/^\d{2}[A-Z]{2}\d[A-Z]$/.test(clean)) {
    return `${clean.substring(0, 2)}-${clean.substring(2, 4)}-${clean.substring(4)}`;
  }
  // Formato: 12-AB-C3 (2 Num - 2 Letras - 1 Letra 1 Num)
  if (/^\d{2}[A-Z]{2}[A-Z]\d$/.test(clean)) {
    return `${clean.substring(0, 2)}-${clean.substring(2, 4)}-${clean.substring(4)}`;
  }

  // --- AUTO ANTIGUO ---
  // Formato: AAA-00 (3 Letras - 2 Números)
  if (/^[A-Z]{3}\d{2}$/.test(clean)) {
    return `${clean.substring(0, 3)}-${clean.substring(3)}`;
  }

  // --- TAXIS (L/S Series) ---
  // Formato: L-1234-A
  if (/^[LS]\d{4}[A-Z]$/.test(clean)) {
    return `${clean.substring(0, 1)}-${clean.substring(1, 5)}-${clean.substring(5)}`;
  }
  
  // --- MOTOCICLETAS (Opcional, usualmente sin guión o 5 corridos, pero si se requiere separación) ---
  // Si se detecta el patrón 1 Letra 2 Num 2 Letras (G01AA) -> G01-AA (ejemplo)
  // Dejaremos Motos sin guión por ahora salvo que sea muy largo, ya que 5 chars es corto.

  return clean;
};
