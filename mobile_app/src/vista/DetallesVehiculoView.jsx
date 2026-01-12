import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import logo_gobierno from "../assets/logo_gobierno.png";

export default function DetallesVehiculoView() {
  const navigate = useNavigate();

  // ESTADOS 
  const [datosRegistro, setDatosRegistro] = useState({
    marcaModelo: "",
    vin: "",
    tarjetaID: ""
  });
  const [inventario, setInventario] = useState({
    cristalesRotos: false,
    sinLlantas: false,
    objetosValor: false
  });
  const [observaciones, setObservaciones] = useState("");
  const [pesoCarga, setPesoCarga] = useState("");

  // LÓGICA DE NEGOCIO 
  const LIMITE_PESO_CDMX = 3500; 
  
  const vinValido = datosRegistro.vin.length === 17;
  const tarjetaVigente = datosRegistro.tarjetaID.length > 5;
  const pesoExcedido = Number(pesoCarga) > LIMITE_PESO_CDMX;

  // Validación robusta para habilitar el botón
  const puedeSolicitarGrua = 
    datosRegistro.marcaModelo.trim().length > 2 &&
    vinValido &&
    pesoCarga > 0 &&
    !pesoExcedido && 
    (inventario.cristalesRotos || inventario.sinLlantas || inventario.objetosValor || observaciones.trim().length > 0);

  // FUNCIONES
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    // Limitar VIN a 17 caracteres
    if (name === "vin" && value.length > 17) return;
    setDatosRegistro(prev => ({ ...prev, [name]: value.toUpperCase() }));
  };

  const handleCheckbox = (campo) => {
    setInventario(prev => ({ ...prev, [campo]: !prev[campo] }));
  };

  // 3. Función para avanzar al siguiente paso
  const irASolicitarGrua = () => {
    if (puedeSolicitarGrua) {
      navigate('/grua');
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col font-sans">
      
      {/* botón de cierre*/}
      <div className="bg-[#691C32] p-4 flex justify-between items-center shadow-md sticky top-0 z-20">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center overflow-hidden">
            <img src={logo_gobierno} alt="Logo Gobierno" className="w-10 h-10 object-contain" />
          </div>
          <h1 className="text-white font-bold tracking-wider uppercase text-sm">Detalles del Vehículo</h1>
        </div>
        <button 
          onClick={() => navigate('/dashboard')} 
          className="text-white text-2xl font-light p-2 hover:bg-white/10 rounded-full"
        >
          ✕
        </button>
      </div>

      <div className="p-4 space-y-4 pb-32">
        
        {/* Datos de Registro */}
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-[#BC955C]/30 border-l-4 border-l-[#BC955C]">
          <h2 className="text-[#691C32] font-black text-[11px] uppercase mb-4 tracking-wider">Datos de Registro</h2>
          <div className="space-y-4">
            <div>
              <p className="text-[9px] text-gray-400 font-bold uppercase mb-1">Marca / Modelo:</p>
              <input 
                name="marcaModelo" 
                value={datosRegistro.marcaModelo} 
                onChange={handleInputChange} 
                placeholder="Ej. NISSAN TSURU 2015"
                className="w-full text-sm font-black text-gray-800 bg-gray-50 border-none p-3 rounded-lg focus:ring-1 focus:ring-[#BC955C] outline-none" 
              />
            </div>
            <div>
              <div className="flex justify-between items-center mb-1">
                <p className="text-[9px] text-gray-400 font-bold uppercase">Número de Serie (VIN):</p>
                <span className={`text-[9px] font-bold ${vinValido ? 'text-green-600' : 'text-amber-600'}`}>
                  {datosRegistro.vin.length}/17
                </span>
              </div>
              <input 
                name="vin" 
                value={datosRegistro.vin} 
                onChange={handleInputChange} 
                className={`w-full text-sm font-bold tracking-widest bg-gray-50 border-none p-3 rounded-lg outline-none focus:ring-1 ${vinValido ? 'focus:ring-green-500' : 'focus:ring-[#BC955C]'}`} 
              />
            </div>
            <div>
              <p className="text-[9px] text-gray-400 font-bold uppercase mb-1">Tarjeta de Circulación:</p>
              <input 
                name="tarjetaID" 
                value={datosRegistro.tarjetaID} 
                onChange={handleInputChange} 
                className="w-full text-sm font-bold text-gray-700 bg-gray-50 border-none p-3 rounded-lg mb-1 outline-none" 
              />
              {datosRegistro.tarjetaID.length > 0 && (
                <p className={`text-[10px] font-bold uppercase ${tarjetaVigente ? 'text-green-600' : 'text-red-600'}`}>
                  {tarjetaVigente ? '✓ Documento Vigente' : '✕ Documento Vencido'}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Inventario */}
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
          <h2 className="text-[#691C32] font-black text-[11px] uppercase mb-4 tracking-wider">Inventario Rápido</h2>
          <div className="space-y-4 mb-4">
            {['cristalesRotos', 'sinLlantas', 'objetosValor'].map((item) => (
              <div 
                key={item} 
                onClick={() => handleCheckbox(item)}
                className="flex items-center gap-3 cursor-pointer group"
              >
                <div className={`w-6 h-6 rounded-md border-2 flex items-center justify-center transition-colors ${inventario[item] ? 'bg-[#691C32] border-[#691C32]' : 'border-gray-200'}`}>
                  {inventario[item] && <span className="text-white text-xs">✓</span>}
                </div>
                <span className="text-xs font-bold text-gray-600">
                  {item === 'cristalesRotos' && 'Cristales rotos / Daños visibles'}
                  {item === 'sinLlantas' && 'Sin llantas / Refacción'}
                  {item === 'objetosValor' && 'Objetos de valor a la vista'}
                </span>
              </div>
            ))}
          </div>
          <textarea 
            value={observaciones} 
            onChange={(e) => setObservaciones(e.target.value)} 
            placeholder="Observaciones adicionales (golpes, estado de pintura, etc)..." 
            className="w-full bg-gray-50 border border-gray-100 rounded-xl p-4 text-xs font-bold text-gray-700 outline-none resize-none focus:ring-1 focus:ring-[#691C32]" 
            rows="3" 
          />
        </div>

        {/* Datos de Carga */}
        <div className={`rounded-2xl p-5 border transition-all duration-300 ${pesoExcedido ? 'bg-red-50 border-red-200 shadow-inner' : 'bg-blue-50 border-blue-100'}`}>
          <h2 className={`font-black text-[10px] uppercase mb-3 ${pesoExcedido ? 'text-red-800' : 'text-blue-700'}`}>
            Control de Peso (Límite: {LIMITE_PESO_CDMX} KG)
          </h2>
          <p className="text-[9px] text-gray-400 font-bold uppercase mb-1">Peso Bruto Estimado (KG):</p>
          <input 
            type="number"
            value={pesoCarga}
            onChange={(e) => setPesoCarga(e.target.value)}
            className="w-full text-sm font-black text-gray-800 bg-white border-none p-3 rounded-xl focus:ring-2 focus:ring-[#691C32] outline-none shadow-sm"
          />
          {pesoCarga > 0 && (
            <div className="mt-3 flex items-center gap-2">
              <div className={`w-2 h-2 rounded-full ${pesoExcedido ? 'bg-red-600 animate-pulse' : 'bg-green-600'}`}></div>
              <span className={`text-[11px] font-black uppercase ${pesoExcedido ? 'text-red-700' : 'text-green-700'}`}>
                {pesoExcedido ? 'UNIDAD EXCEDE LÍMITE DE ARRASTE' : 'Apto para maniobra'}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Botón Final*/}
      <div className="fixed bottom-0 left-0 right-0 p-5 bg-white/95 backdrop-blur-md border-t border-gray-100 z-30">
        <button 
          disabled={!puedeSolicitarGrua}
          onClick={irASolicitarGrua}
          className={`w-full font-black py-4 rounded-2xl shadow-xl transition-all uppercase tracking-[0.2em] text-sm ${
            puedeSolicitarGrua 
            ? 'bg-[#691C32] text-white active:scale-95' 
            : 'bg-gray-200 text-gray-400 cursor-not-allowed shadow-none' 
          }`}
        >
          {pesoExcedido 
            ? 'PESO EXCEDIDO' 
            : !vinValido && datosRegistro.vin.length > 0 
              ? 'VIN INVÁLIDO' 
              : !puedeSolicitarGrua && datosRegistro.marcaModelo.length > 0
                ? 'COMPLETAR INVENTARIO'
                : 'Continuar a Solicitud'}
        </button>
      </div>
    </div>
  );
}