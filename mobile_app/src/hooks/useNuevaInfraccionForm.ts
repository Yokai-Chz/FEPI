import { useState, useEffect } from 'react';
import { Alert } from 'react-native';
import { useRouter } from 'expo-router';
import * as Location from 'expo-location';

import { useAuth } from '../context/AuthContext';
import { useInfraccion } from '../context/InfraccionContext';
import { infraccionesService } from '../services/infracciones.service';
import { isValidCDMXPlate } from '../utils/plateValidation';
import { InfractionArticle } from '../../components/infraccion/InfractionSelector';

export const useNuevaInfraccionForm = () => {
  const router = useRouter();
  const { user } = useAuth();
  const { fotos, resetFotos } = useInfraccion();

  // --- ESTADOS ---
  const [enviando, setEnviando] = useState(false);
  const [placa, setPlaca] = useState("");
  const [esForaneo, setEsForaneo] = useState(false);
  const [niv, setNiv] = useState("");
  const [licencia, setLicencia] = useState("");
  
  // Domicilio del conductor
  const [domicilioInfractor, setDomicilioInfractor] = useState({
    municipio: "",
    vialidad: "",
    numero_exterior: "",
    nombre_asentamiento: "",
    codigo_postal: "",
    nombre_entidad: ""
  });

  const [notas, setNotas] = useState("");
  const [articulosSeleccionados, setArticulosSeleccionados] = useState<InfractionArticle[]>([]);
  
  // Ubicación del HECHO (GPS)
  const [ubicacionHecho, setUbicacionHecho] = useState("");
  const [coordenadas, setCoordenadas] = useState<{lat: number, lon: number} | null>(null);
  const [cargandoUbicacion, setCargandoUbicacion] = useState(false);

  const [esComercial, setEsComercial] = useState(false);

  // --- VALIDACIÓN ---
  const isPlateValid = esForaneo ? placa.length >= 3 : isValidCDMXPlate(placa);
  const isNotesValid = esForaneo ? notas.trim().length > 3 : true;
  const isNivValid = niv.trim().length === 0 || niv.length === 17; 
  const isLicenciaValid = licencia.trim().length === 0 || licencia.length >= 5; 

  const esFormularioValido = 
    !enviando &&
    isPlateValid &&
    isNotesValid &&
    isNivValid &&
    isLicenciaValid &&
    articulosSeleccionados.length > 0 && 
    ubicacionHecho.trim().length >= 5;

  // --- EFECTOS ---
  useEffect(() => {
    obtenerUbicacionActual();
  }, []);

  // --- FUNCIONES ---
  const obtenerUbicacionActual = async () => {
    setCargandoUbicacion(true);
    try {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permiso denegado', 'Se necesita acceso a la ubicación para registrar el lugar del hecho.');
        setCargandoUbicacion(false);
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      const { latitude, longitude } = location.coords;
      setCoordenadas({ lat: latitude, lon: longitude });

      let addressResponse = await Location.reverseGeocodeAsync({ latitude, longitude });
      
      if (addressResponse.length > 0) {
        const addr = addressResponse[0];
        const direccionFormateada = `${addr.street || ''} ${addr.streetNumber || ''}, ${addr.district || ''}, ${addr.subregion || addr.city || ''}`;
        setUbicacionHecho(direccionFormateada.trim());
      } else {
        setUbicacionHecho(`${latitude}, ${longitude}`);
      }

    } catch (error) {
      Alert.alert('Error GPS', 'No se pudo obtener la ubicación actual.');
    } finally {
      setCargandoUbicacion(false);
    }
  };

  const agregarArticulo = (articulo: InfractionArticle) => {
    setArticulosSeleccionados((prev) => [...prev, articulo]);
  };

  const removerArticulo = (id: string) => {
    setArticulosSeleccionados((prev) => prev.filter(a => a.id !== id));
  };

  const finalizarBoleta = async () => {
    setEnviando(true);
    try {
      const evidenciasArray = Object.values(fotos).filter(uri => uri !== null) as string[];

      const dataToSend = {
        fecha: new Date().toISOString(),
        latitud: coordenadas?.lat || 0,
        longitud: coordenadas?.lon || 0,
        placa: placa,
        niv: niv.trim() || null,
        id_agente: user?.id || "ANONYMOUS", 
        id_licencia: licencia.trim() || null,
        descripcion: notas || "Sin observaciones adicionales",
        infracciones: articulosSeleccionados.map(a => a.id),
        ubicacion_infractor: {
          municipio: domicilioInfractor.municipio.trim() || null,
          vialidad: domicilioInfractor.vialidad.trim() || null,
          numero_exterior: domicilioInfractor.numero_exterior.trim() || null,
          nombre_asentamiento: domicilioInfractor.nombre_asentamiento.trim() || null,
          codigo_postal: domicilioInfractor.codigo_postal.trim() || null,
          nombre_entidad: domicilioInfractor.nombre_entidad.trim() || null
        },
        evidencias: evidenciasArray
      };

      await infraccionesService.crearInfraccion(dataToSend, user?.token || "");

      Alert.alert(
        "Éxito", 
        `✅ Infracción registrada.\n${!coordenadas ? '(Guardada localmente por falta de conexión)' : ''}`,
        [{ 
          text: "Terminar", 
          onPress: () => {
            resetFotos(); 
            router.replace('/dashboard');
          } 
        }]
      );
    } catch (error) {
      Alert.alert("Error", "No se pudo procesar la infracción");
    } finally {
      setEnviando(false);
    }
  };

  return {
    // Estados del formulario
    placa, setPlaca,
    esForaneo, setEsForaneo,
    niv, setNiv,
    licencia, setLicencia,
    domicilioInfractor, setDomicilioInfractor,
    notas, setNotas,
    articulosSeleccionados,
    ubicacionHecho, setUbicacionHecho,
    esComercial, setEsComercial,
    fotos, // Viene del context, pero lo exponemos para facilidad
    
    // Estados de UI/Validación
    enviando,
    cargandoUbicacion,
    esFormularioValido,
    isNotesValid,

    // Acciones
    obtenerUbicacionActual,
    agregarArticulo,
    removerArticulo,
    finalizarBoleta
  };
};
