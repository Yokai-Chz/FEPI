import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Zap, Check, Trash2, Camera, X } from 'lucide-react';
import logo_gobierno from "../assets/logo_gobierno.png";

export default function EvidenceCaptureView() {
  const navigate = useNavigate();
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  
  const [streamActive, setStreamActive] = useState(false);
  const [flashOn, setFlashOn] = useState(false); // Estado para el Flash
  const [fotos, setFotos] = useState({
    placa: null,
    infraccion: null,
    frente: null,
    posterior: null
  });
  const [seleccion, setSeleccion] = useState('placa');

  const categorias = [
    { id: 'placa', label: 'Placa' },
    { id: 'infraccion', label: 'Motivo' },
    { id: 'frente', label: 'Frente' },
    { id: 'posterior', label: 'Trasera' }
  ];

  const colors = { primary: '#691C32', accent: '#BC955C' };

  useEffect(() => {
    async function iniciarCamara() {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ 
          video: { facingMode: "environment" }, 
          audio: false 
        });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          setStreamActive(true);
        }
      } catch (err) {
        console.error("Error camara:", err);
      }
    }
    iniciarCamara();
    return () => {
      if (videoRef.current?.srcObject) {
        videoRef.current.srcObject.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  const tomarFoto = () => {
    if (!streamActive || fotos[seleccion]) return;

    const video = videoRef.current;
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    
    // Si el flash está "activado", dibujamos un rectángulo blanco rápido antes de la captura
    context.drawImage(video, 0, 0, canvas.width, canvas.height);

    const fotoComprimida = canvas.toDataURL('image/jpeg', 0.5);
    setFotos(prev => ({ ...prev, [seleccion]: fotoComprimida }));
    
    // Auto-saltar a la siguiente vacía
    const siguiente = categorias.find(c => !fotos[c.id] && c.id !== seleccion);
    if (siguiente) setSeleccion(siguiente.id);
  };

  const borrarFoto = (id) => setFotos(prev => ({ ...prev, [id]: null }));
  const totalFotos = Object.values(fotos).filter(f => f !== null).length;

  // Acción del botón Listo
  const finalizarCaptura = () => {
    if (totalFotos === 4) {
      // Regresamos a la vista de infracción
      navigate('/nueva-infraccion'); 
    } else {
      alert("El reglamento exige las 4 fotografías para validar la infracción.");
    }
  };

  return (
    <div className="min-h-screen bg-black flex flex-col font-sans overflow-hidden">
      
      {/* Flash Overlay (Efecto visual de flash) */}
      {flashOn && <div className="fixed inset-0 bg-white z-[100] animate-pulse pointer-events-none opacity-50" />}

      {/* Header*/}
      <div className="bg-[#691C32] p-4 flex justify-between items-center shadow-md z-30">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center overflow-hidden">
            <img src={logo_gobierno} alt="Logo" className="w-8 h-8 object-contain" />
          </div>
          <h1 className="text-white font-black tracking-widest uppercase text-[10px]">
            Evidencia ({totalFotos}/4)
          </h1>
        </div>
        {/* Regresa a la vista anterior */}
        <button 
          onClick={() => navigate('/nueva-infraccion')}
          className="text-white/70 hover:text-white transition-colors"
        >
          <X size={24} />
        </button>
      </div>
      
      {/* VISOR DE CÁMARA */}
      <div className="flex-1 relative bg-zinc-900 flex items-center justify-center overflow-hidden">
        {fotos[seleccion] ? (
          <div className="absolute inset-0 z-20 animate-in fade-in duration-300">
            <img src={fotos[seleccion]} className="w-full h-full object-cover" alt="Preview" />
            <div className="absolute inset-0 bg-black/40 flex items-center justify-center backdrop-blur-sm">
              <button 
                onClick={() => borrarFoto(seleccion)} 
                className="bg-red-600 p-5 rounded-full text-white shadow-2xl active:scale-90 transition-transform flex flex-col items-center gap-1"
              >
                <Trash2 size={24} />
                <span className="text-[8px] font-black uppercase">Borrar</span>
              </button>
            </div>
          </div>
        ) : (
          <video ref={videoRef} autoPlay playsInline className="absolute inset-0 w-full h-full object-cover" />
        )}

        {/* Guías de Encuadre */}
        <div className="absolute inset-16 pointer-events-none z-10 opacity-60">
          <div className="absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 rounded-tl-lg" style={{ borderColor: colors.accent }}></div>
          <div className="absolute top-0 right-0 w-8 h-8 border-t-4 border-r-4 rounded-tr-lg" style={{ borderColor: colors.accent }}></div>
          <div className="absolute bottom-0 left-0 w-8 h-8 border-b-4 border-l-4 rounded-bl-lg" style={{ borderColor: colors.accent }}></div>
          <div className="absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 rounded-br-lg" style={{ borderColor: colors.accent }}></div>
        </div>

        {/* Label de categoría actual */}
        <div className="absolute top-6 px-4 py-1.5 bg-black/60 backdrop-blur-md rounded-full border border-white/20 z-10">
          <p className="text-white text-[10px] font-black uppercase tracking-[0.2em]">
            Capturando: {categorias.find(c => c.id === seleccion)?.label}
          </p>
        </div>
      </div>

      {/* SELECTOR DE CATEGORÍAS */}
      <div className="bg-zinc-900/90 backdrop-blur-md p-4 border-t border-white/10">
        <div className="flex justify-between items-center gap-2">
          {categorias.map((cat) => (
            <button 
              key={cat.id}
              onClick={() => setSeleccion(cat.id)}
              className={`relative flex-1 aspect-square rounded-xl border-2 transition-all flex flex-col items-center justify-center overflow-hidden ${
                seleccion === cat.id ? 'border-[#BC955C] bg-[#BC955C]/10 scale-105' : 'border-zinc-700 opacity-40'
              }`}
            >
              {fotos[cat.id] ? (
                <>
                  <img src={fotos[cat.id]} className="absolute inset-0 w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-[#691C32]/40 flex items-center justify-center">
                    <Check size={18} className="text-white" />
                  </div>
                </>
              ) : (
                <div className="flex flex-col items-center gap-1">
                  <Camera size={14} className="text-white" />
                  <span className="text-[7px] text-white font-black uppercase tracking-tighter">{cat.label}</span>
                </div>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* PANEL DE CONTROL INFERIOR */}
      <div className="bg-black p-8 flex justify-between items-center border-t border-white/5">
        <div className="w-10">
            <button 
              onClick={() => setFlashOn(!flashOn)}
              className={`${flashOn ? 'text-amber-400' : 'text-white/20'} transition-colors cursor-pointer`}
            >
              <Zap size={24} fill={flashOn ? "currentColor" : "none"} />
            </button>
        </div>
        
        {/* Obturador */}
        <button 
          onClick={tomarFoto}
          disabled={!!fotos[seleccion]}
          className={`group relative w-20 h-20 rounded-full border-4 flex items-center justify-center transition-all ${
            fotos[seleccion] ? 'border-zinc-800' : 'border-white active:scale-90'
          }`}
        >
          <div className={`w-16 h-16 rounded-full transition-all ${
            fotos[seleccion] ? 'bg-zinc-800' : 'bg-white group-active:bg-zinc-200 shadow-[0_0_20px_rgba(255,255,255,0.3)]'
          }`}></div>
        </button>

        {/* Botón Finalizar (Listo) */}
        <div className="w-10 flex justify-end">
            <button 
              onClick={finalizarCaptura}
              className={`flex flex-col items-center gap-1 transition-all ${totalFotos === 4 ? 'text-[#BC955C] scale-110' : 'text-zinc-600 opacity-50'}`}
            >
                <div className={`p-3 rounded-full border-2 ${totalFotos === 4 ? 'border-[#BC955C]' : 'border-zinc-600'}`}>
                    <Check size={20} />
                </div>
                <span className="text-[7px] font-black uppercase">Listo</span>
            </button>
        </div>
      </div>

      <canvas ref={canvasRef} className="hidden" />
    </div>
  );
}