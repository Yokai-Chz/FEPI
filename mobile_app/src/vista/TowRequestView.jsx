import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapPin, ChevronRight, Loader2, Clock, Building2, Car } from 'lucide-react';
import logo_gobierno from "../assets/logo_gobierno.png";

export default function TowRequestView() {
  const navigate = useNavigate(); 

  const [notas, setNotas] = useState('');
  const [vehiculo, setVehiculo] = useState({
    modelo: 'VOLKSWAGEN - JETTA 2022',
    placa: '123-ABC-A'
  });

  const [ubicacion, setUbicacion] = useState({ lat: null, lng: null, cargando: true });
  const [eta, setEta] = useState(null);
  const [corralonAsignado, setCorralonAsignado] = useState(null);

  const colors = { primary: '#691C32' };

  const corralonesDisponibles = [
    { id: 1, nombre: "Corralón Centro Histórico", direccion: "Eje Central Lázaro Cárdenas 12" },
    { id: 2, nombre: "Depósito Vehicular Norte", direccion: "Av. Insurgentes Norte 450" },
    { id: 3, nombre: "Corralón Oriente - Iztapalapa", direccion: "Calz. Ermita Iztapalapa 201" }
  ];

  useEffect(() => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setUbicacion({
            lat: pos.coords.latitude.toFixed(5),
            lng: pos.coords.longitude.toFixed(5),
            cargando: false
          });
          const asignado = corralonesDisponibles[Math.floor(Math.random() * corralonesDisponibles.length)];
          setCorralonAsignado(asignado);
          setEta(Math.floor(Math.random() * (12 - 4 + 1)) + 4);
        },
        () => {
          setUbicacion({ lat: "19.432", lng: "-99.133", cargando: false });
          setCorralonAsignado(corralonesDisponibles[0]);
          setEta(15);
        }
      );
    }
  }, []);

  // 3. Función del botón principal
  const manejarEnvio = () => {
    if (!vehiculo.modelo || !vehiculo.placa) {
      alert("El modelo y la placa son obligatorios para el arrastre.");
      return;
    }
    
    // Simulación de envío a plataforma
    alert(`Solicitud Exitosa\n\nGrúa en camino al punto de infracción.\nDepósito: ${corralonAsignado?.nombre}\nETA: ${eta} minutos.`);
    
    // Regresar al dashboard después de confirmar
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col font-sans">
      
      {/* Header Institucional */}
      <div className="bg-[#691C32] p-4 flex justify-between items-center shadow-md sticky top-0 z-20">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center overflow-hidden">
            <img src={logo_gobierno} alt="Logo" className="w-10 h-10 object-contain" />
          </div>
          <h1 className="text-white font-bold tracking-wider uppercase text-sm">Solicitar Grúa</h1>
        </div>
        {/* Botón X: Regresa al Dashboard */}
        <button 
          onClick={() => navigate('/dashboard')} 
          className="text-white text-2xl font-light p-2 hover:bg-white/10 rounded-full transition-colors"
        >
          ✕
        </button>
      </div>

      {/* Mapa / Ubicación */}
      <div className="h-44 bg-gray-200 flex flex-col items-center justify-center relative overflow-hidden border-b border-gray-200">
        {ubicacion.cargando ? (
          <div className="flex flex-col items-center gap-2">
            <Loader2 className="animate-spin text-gray-400" size={24} />
            <p className="text-[10px] font-bold text-gray-500 uppercase">Localizando...</p>
          </div>
        ) : (
          <>
            {/* Overlay de mapa simulado */}
            <div className="absolute inset-0 bg-slate-200 opacity-50 bg-[radial-gradient(#cbd5e1_1px,transparent_1px)] [background-size:16px_16px]"></div>
            <div style={{ backgroundColor: colors.primary }} className="w-10 h-10 rounded-full border-4 border-white flex items-center justify-center z-10 shadow-xl animate-bounce">
              <MapPin size={18} className="text-white" />
            </div>
            <div className="absolute bottom-3 right-3 text-[8px] font-black text-gray-600 bg-white/90 px-3 py-1.5 rounded-lg shadow-sm border border-gray-100 z-10">
              COORD: {ubicacion.lat}, {ubicacion.lng}
            </div>
          </>
        )}
      </div>

      <div className="p-4 space-y-4 pb-32">
       
        {/* CARD EDITABLE DEL VEHÍCULO */}
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-[#691C32] font-black text-[11px] uppercase tracking-wider flex items-center gap-2">
              <Car size={14} /> Datos del Vehículo
            </h2>
            <span className="bg-amber-50 text-amber-600 text-[9px] font-black px-2 py-1 rounded-lg uppercase border border-amber-100">
              Verificar
            </span>
          </div>
         
          <div className="space-y-3">
            <div>
              <p className="text-[9px] text-gray-400 font-bold uppercase mb-1 ml-1">Modelo y Año:</p>
              <input
                type="text"
                value={vehiculo.modelo}
                onChange={(e) => setVehiculo({...vehiculo, modelo: e.target.value.toUpperCase()})}
                className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 text-xs font-black text-gray-700 focus:ring-1 focus:ring-[#691C32] outline-none transition-all"
              />
            </div>
            <div>
              <p className="text-[9px] text-gray-400 font-bold uppercase mb-1 ml-1">Placas:</p>
              <input
                type="text"
                value={vehiculo.placa}
                onChange={(e) => setVehiculo({...vehiculo, placa: e.target.value.toUpperCase()})}
                className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 text-xs font-black text-gray-700 tracking-[0.2em] focus:ring-1 focus:ring-[#691C32] outline-none transition-all"
              />
            </div>
          </div>
        </div>

        {/* Depósito Asignado */}
        <div className="bg-white rounded-2xl border border-gray-100 p-4 flex items-center gap-4 shadow-sm">
          <div className="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center text-[#691C32] border border-gray-100">
            <Building2 size={20} />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Depósito Asignado</p>
            <p className="text-[12px] font-black text-gray-800 uppercase truncate">
              {corralonAsignado ? corralonAsignado.nombre : 'Localizando depósito...'}
            </p>
          </div>
          <ChevronRight size={18} className="text-gray-300" />
        </div>

        {/* Notas / Observaciones */}
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
          <label className="text-[9px] font-black text-gray-400 uppercase mb-3 block tracking-widest">Observaciones del Arrastre:</label>
          <textarea
            value={notas}
            onChange={(e) => setNotas(e.target.value)}
            placeholder="Motivo de la solicitud y estado físico..."
            className="w-full bg-gray-50 border border-gray-100 rounded-xl p-4 text-xs font-bold text-gray-700 h-24 outline-none focus:ring-1 focus:ring-[#691C32] transition-colors resize-none"
          />
        </div>

        {/* Botonera y ETA */}
        <div className="pt-2">
          <button
            onClick={manejarEnvio}
            disabled={ubicacion.cargando}
            className={`w-full py-5 rounded-2xl text-white font-black text-xs tracking-[0.2em] uppercase shadow-xl transition-all ${
                ubicacion.cargando ? 'bg-gray-300' : 'bg-[#691C32] active:scale-95'
            }`}
          >
            {ubicacion.cargando ? 'Obteniendo Ubicación...' : 'Confirmar Solicitud'}
          </button>
         
          {eta && !ubicacion.cargando && (
            <div className="flex items-center justify-center gap-2 text-gray-400 mt-4 animate-in slide-in-from-bottom-2">
              <Clock size={14} className="text-[#691C32]" />
              <p className="text-[10px] font-black uppercase tracking-tight">
                Tiempo estimado de arribo: <span className="text-gray-800">{eta} MINUTOS</span>
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}