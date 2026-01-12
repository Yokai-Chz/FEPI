import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; 
import { AlertTriangle, Lock, FileText, X } from 'lucide-react';

export default function ParquimetroView() {
  const navigate = useNavigate();
  const [placa, setPlaca] = useState("");
  const [loading, setLoading] = useState(false);
  
  const [infoVehiculo, setInfoVehiculo] = useState({
    existe: false,
    tiempoExpiradoSegundos: 0,
    zona: "",
    finDePago: "",
    estatus: "" 
  });

  const TOLERANCIA_ALERTA = 300; // 5 min
  const TOLERANCIA_INMOVILIZADOR = 600; // 10 min

  // SIMULACIÓN DE CONEXIÓN
  const consultarPlacaAlBackend = async (placaIngresada) => {
    if (placaIngresada.length < 6) return;
    
    setLoading(true);
    
    // Simulamos una respuesta del servidor de parquímetros CDMX
    setTimeout(() => {
      const respuestaSimulada = {
        existe: true,
        // Simulamos un tiempo aleatorio de vencimiento (400s a 1200s)
        tiempoExpiradoSegundos: Math.floor(Math.random() * (1200 - 400 + 1)) + 400,
        zona: "Polanco - Secc. " + Math.floor(Math.random() * 5),
        finDePago: "14:" + Math.floor(Math.random() * 59) + " hrs",
        estatus: "VENCIDO"
      };
      
      setInfoVehiculo(respuestaSimulada);
      setLoading(false);
    }, 800); 
  };

  const obtenerTiempoLegible = (segundos) => {
    const min = Math.floor(segundos / 60);
    const seg = segundos % 60;
    return `${min} min ${seg < 10 ? '0' : ''}${seg} s`;
  };

  // FUNCIONES DE BOTONES
  const manejarInfraccion = () => {
    // Aquí podrías pasar la placa vía state si lo deseas
    navigate('/nueva-infraccion');
  };

  const manejarInmovilizador = () => {
    alert(`🚨 Solicitud enviada:\n\nInmovilizador (Araña) solicitado para la unidad ${placa}.\nMotivo: Tiempo de parquímetro excedido por más de 10 min.`);
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col font-sans">
      
      {/* Header con navegación funcional */}
      <div className="bg-[#691C32] p-4 flex justify-between items-center shadow-md">
        <h1 className="text-white font-bold tracking-widest uppercase text-sm">Parquímetro</h1>
        <button 
          onClick={() => navigate('/dashboard')} 
          className="text-white hover:bg-white/10 p-2 rounded-full transition-colors"
        >
          <X size={24} />
        </button>
      </div>

      <div className="p-5 space-y-4">
        
        {/* Sección de entrada de Placa */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <p className="text-[10px] text-[#691C32] font-black uppercase mb-3 text-center tracking-widest">
            Consulta de Placa en Sistema
          </p>
          <div className="border-2 border-gray-100 rounded-2xl p-2 focus-within:border-[#BC955C] transition-all bg-gray-50/50">
            <input 
              type="text"
              value={placa}
              onChange={(e) => {
                const val = e.target.value.toUpperCase();
                setPlaca(val);
                if (val.length >= 6) consultarPlacaAlBackend(val);
                else setInfoVehiculo({ ...infoVehiculo, existe: false });
              }}
              placeholder="PLACA"
              className="w-full text-center text-3xl font-black tracking-widest outline-none text-gray-800 bg-transparent"
            />
          </div>
          {loading && (
            <div className="flex items-center justify-center gap-2 mt-3 animate-pulse">
              <div className="w-1.5 h-1.5 bg-[#BC955C] rounded-full"></div>
              <p className="text-[9px] font-bold text-gray-400 uppercase">Consultando base de datos...</p>
            </div>
          )}
        </div>

        {/* Tarjeta de Alerta (Solo se muestra si hay infracción) */}
        {infoVehiculo.existe && infoVehiculo.tiempoExpiradoSegundos > TOLERANCIA_ALERTA && (
          <div className="bg-red-50 border-2 border-red-200 rounded-[2.5rem] p-8 flex flex-col items-center shadow-inner animate-in zoom-in-95 duration-300">
            <div className="w-20 h-20 rounded-full border-4 border-red-500 flex items-center justify-center mb-4 bg-white shadow-md">
              <AlertTriangle size={40} className="text-red-500" />
            </div>
            
            <h2 className="text-red-600 font-black text-2xl uppercase tracking-tighter">Tiempo Expirado</h2>
            <p className="text-red-900/60 font-black text-sm mb-6 bg-red-100/50 px-4 py-1 rounded-full">
              Hace {obtenerTiempoLegible(infoVehiculo.tiempoExpiradoSegundos)}
            </p>

            <div className="w-full grid grid-cols-2 gap-4 border-t border-red-200/50 pt-5">
              <div className="border-r border-red-200/50">
                <p className="text-[9px] text-gray-400 font-bold uppercase">Zona:</p>
                <p className="text-[12px] font-black text-gray-700">{infoVehiculo.zona}</p>
              </div>
              <div className="text-right">
                <p className="text-[9px] text-gray-400 font-bold uppercase">Límite Pago:</p>
                <p className="text-[12px] font-black text-gray-700">{infoVehiculo.finDePago}</p>
              </div>
            </div>
          </div>
        )}

        {/* Botonera de Acciones */}
        <div className="flex flex-col gap-3 pt-4">
          <button 
            onClick={manejarInfraccion}
            disabled={!infoVehiculo.existe}
            className={`w-full py-5 rounded-full font-black uppercase tracking-widest text-xs shadow-xl flex items-center justify-center gap-3 transition-all ${
              infoVehiculo.existe 
              ? 'bg-[#691C32] text-white active:scale-95' 
              : 'bg-gray-200 text-gray-400 cursor-not-allowed'
            }`}
          >
            <FileText size={18} />
            Generar Infracción
          </button>

          <button 
            onClick={manejarInmovilizador}
            disabled={infoVehiculo.tiempoExpiradoSegundos < TOLERANCIA_INMOVILIZADOR}
            className={`w-full py-5 rounded-full font-black uppercase tracking-widest text-xs border-2 flex items-center justify-center gap-3 transition-all ${
              infoVehiculo.tiempoExpiradoSegundos >= TOLERANCIA_INMOVILIZADOR
              ? 'border-[#691C32] text-[#691C32] bg-white shadow-md active:bg-gray-50' 
              : 'border-gray-200 text-gray-300 bg-transparent cursor-not-allowed'
            }`}
          >
            <Lock size={18} />
            Solicitar Inmovilizador
          </button>
        </div>

        <p className="text-[10px] text-gray-400 font-bold text-center px-10 leading-tight uppercase opacity-60">
          La inmovilización aplica por exceder 10 minutos de tolerancia (Art. 33 Reglamento de Tránsito).
        </p>
      </div>
    </div>
  );
}