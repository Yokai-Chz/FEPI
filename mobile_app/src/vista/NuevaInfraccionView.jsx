import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import logo_gobierno from "../assets/logo_gobierno.png";
import icon_ubi from "../assets/icon_ubi.png";

export default function NuevaInfraccionView() {
  const navigate = useNavigate();

  // --- ESTADOS ---
  const [placa, setPlaca] = useState("");
  const [busqueda, setBusqueda] = useState("");
  const [articuloSeleccionado, setArticuloSeleccionado] = useState(null);
  const [ubicacion, setUbicacion] = useState("Av. Insurgentes Sur 123, CDMX");
  const [esComercial, setEsComercial] = useState(false);
  
  // Nuevo estado para recuperar las fotos de la cámara
  const [fotosCapturadas, setFotosCapturadas] = useState([]);

  // Simulamos la recuperación de fotos (esto se conectaría con tu estado global o localStorage)
  useEffect(() => {
    const fotosGuardadas = JSON.parse(localStorage.getItem('evidencia_temporal') || "[]");
    setFotosCapturadas(fotosGuardadas);
  }, []);

  // --- LÓGICA DE VALIDACIÓN ---
  // Ahora validamos que también existan al menos 2 fotos para habilitar el botón final
  const esFormularioValido = 
    placa.trim().length >= 3 && 
    articuloSeleccionado !== null && 
    ubicacion.trim().length >= 10 &&
    fotosCapturadas.length >= 2;

  // --- FUNCIONES ---
  const seleccionarArticulo = () => {
    setArticuloSeleccionado({
      titulo: "Art. 9, Fracc II: Semáforo en Rojo",
      sancion: "10 a 20 UMAs ($1,085 - $2,171)"
    });
    setBusqueda(""); 
  };

  const finalizarBoleta = () => {
    alert("✅ Folio generado con éxito. Enviando reporte a plataforma SSC...");
    localStorage.removeItem('evidencia_temporal'); // Limpiamos al terminar
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col font-sans">
      
      {/* Header */}
      <div className="bg-[#691C32] p-4 flex justify-between items-center shadow-md sticky top-0 z-20">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center overflow-hidden">
            <img src={logo_gobierno} alt="Logo" className="w-10 h-10 object-contain" />
          </div>
          <h1 className="text-white font-bold tracking-wider uppercase text-sm">Nueva Infracción</h1>
        </div>
        <button onClick={() => navigate('/dashboard')} className="text-white text-2xl font-light p-2">✕</button>
      </div>

      <div className="p-4 space-y-4 pb-32">
        
        {/* SECCIÓN DATOS DEL VEHÍCULO */}
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
          <h2 className="text-[#691C32] font-black text-[11px] uppercase mb-4 tracking-wider">Datos del Vehículo</h2>
          <div className={`border-2 border-dashed rounded-2xl p-4 text-center mb-3 transition-colors ${placa.length >= 3 ? 'border-green-200 bg-green-50/30' : 'border-gray-200 focus-within:border-[#691C32]'}`}>
            <input 
              type="text" 
              value={placa}
              onChange={(e) => setPlaca(e.target.value.toUpperCase())}
              placeholder="Placa" 
              className="text-center text-2xl font-black tracking-widest outline-none w-full uppercase text-gray-800 bg-transparent"
            />
          </div>
          {placa.length >= 3 && (
            <div className="bg-green-50 text-[10px] text-green-700 p-2.5 rounded-lg flex items-center gap-2 border border-green-100 font-bold animate-in fade-in">
              <span className="text-sm">✓</span>
              <span>SCC: Vehículo sin reporte de robo vigente</span>
            </div>
          )}
        </div>

        {/* SECCIÓN MOTIVO DE INFRACCIÓN */}
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
          <h2 className="text-[#691C32] font-black text-[11px] uppercase mb-4 tracking-wider">Motivo de Infracción</h2>
          {!articuloSeleccionado ? (
            <>
              <input 
                type="text" 
                value={busqueda}
                onChange={(e) => setBusqueda(e.target.value)}
                placeholder="Buscar artículo o falta" 
                className="w-full bg-gray-50 border border-gray-100 rounded-xl p-4 text-sm outline-none focus:ring-2 focus:ring-[#691C32]/10 mb-2"
              />
              {busqueda.toLowerCase().includes("art") && (
                <div onClick={seleccionarArticulo} className="bg-[#FFF9F2] border-2 border-[#BC955C] border-dashed rounded-xl p-4 cursor-pointer">
                  <p className="text-[12px] font-bold text-gray-800">Art. 9, Fracc II: Semáforo en Rojo</p>
                  <p className="text-[9px] text-amber-600 font-bold uppercase mt-1 italic text-right">Toca para seleccionar</p>
                </div>
              )}
            </>
          ) : (
            <div className="bg-[#691C32]/5 border border-[#691C32]/20 rounded-xl p-4 relative">
              <button onClick={() => setArticuloSeleccionado(null)} className="absolute top-2 right-2 text-[#691C32] text-[10px] font-black uppercase underline">Cambiar</button>
              <p className="text-[12px] font-bold text-[#691C32] pr-12">{articuloSeleccionado.titulo}</p>
              <p className="text-[10px] text-gray-500 mt-1 font-bold">{articuloSeleccionado.sancion}</p>
            </div>
          )}
        </div>

        {/* SECCIÓN EVIDENCIA (CON PREVIEW) */}
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
          <h2 className="text-[#691C32] font-black text-[11px] uppercase mb-4 tracking-wider">Evidencia Fotográfica</h2>
          
          <div className="flex flex-wrap gap-3 mb-4">
            {/* Renderizar miniaturas si existen */}
            {fotosCapturadas.map((foto, index) => (
              <div key={index} className="w-16 h-16 rounded-lg overflow-hidden border border-gray-200 relative">
                <img src={foto} alt="evidencia" className="w-full h-full object-cover" />
                <div className="absolute top-0 right-0 bg-green-500 text-white p-0.5 rounded-bl-md">
                   <span className="text-[8px]">✓</span>
                </div>
              </div>
            ))}

            {/* Botón para abrir cámara */}
            <button 
              onClick={() => navigate('/evidencia')}
              className={`w-16 h-16 border-2 border-dashed rounded-lg flex flex-col items-center justify-center transition-all ${fotosCapturadas.length > 0 ? 'border-[#BC955C] bg-[#BC955C]/5' : 'border-gray-200 bg-gray-50'}`}
            >
              <span className="text-xl font-light text-[#BC955C]">+</span>
            </button>
          </div>

          <p className="text-[10px] font-bold uppercase text-gray-400">
            {fotosCapturadas.length === 0 
              ? "Requiere 4 fotos reglamentarias" 
              : `${fotosCapturadas.length} de 4 fotos capturadas`}
          </p>
        </div>

        {/* Vehículo Comercial */}
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 flex justify-between items-center">
          <span className="text-gray-700 text-xs font-bold uppercase tracking-tight">¿Vehículo comercial / carga?</span>
          <button 
            onClick={() => setEsComercial(!esComercial)}
            className={`w-12 h-6 rounded-full transition-all relative ${esComercial ? 'bg-[#691C32]' : 'bg-gray-200'}`}
          >
            <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${esComercial ? 'left-7' : 'left-1'}`}></div>
          </button>
        </div>

        {/* Ubicación */}
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
          <div className="flex justify-between items-start gap-4">
            <div className="flex-1">
              <p className="text-[9px] text-gray-400 font-bold uppercase mb-2 tracking-widest">Ubicación Actual:</p>
              <textarea 
                value={ubicacion}
                onChange={(e) => setUbicacion(e.target.value)}
                className="w-full text-xs font-bold text-gray-700 bg-gray-50 border-none p-3 rounded-xl focus:ring-0 resize-none"
                rows="2"
              />
            </div>
            <button className="w-12 h-12 bg-gray-50 rounded-xl flex items-center justify-center border border-gray-100 active:scale-90 transition-transform">
              <img src={icon_ubi} alt="ubi" className="w-8 h-8 object-contain" />
            </button>
          </div>
        </div>
      </div>

      {/* Botón Final */}
      <div className="fixed bottom-0 left-0 right-0 p-5 bg-white/95 backdrop-blur-md border-t border-gray-100 z-30">
        <button 
          disabled={!esFormularioValido}
          onClick={finalizarBoleta}
          className={`w-full font-black py-4 rounded-2xl shadow-xl transition-all uppercase tracking-[0.2em] text-sm ${
            esFormularioValido 
            ? 'bg-[#691C32] text-white active:scale-95' 
            : 'bg-gray-200 text-gray-400 cursor-not-allowed shadow-none' 
          }`}
        >
          {esFormularioValido ? 'Generar Boleta' : 'Capturar Evidencia'}
        </button>
      </div>
    </div>
  );
}