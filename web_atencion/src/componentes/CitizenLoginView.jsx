import React, { useState } from 'react';
import { ExternalLink, HelpCircle, ArrowRight } from 'lucide-react';

const CitizenLoginView = () => {
  const [placa, setPlaca] = useState('');
  const [vin, setVin] = useState('');

  const colors = {
    primary: '#6b1d31', 
    accent: '#c4a456',  
    bgLight: '#f9f9f9',
    textMain: '#1a1a1a',
    textMuted: '#71717a'
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row font-sans overflow-hidden">
      
      {/* SECCION IZQUIERDA: Identidad Institucional */}
      <div 
        className="relative w-full md:w-[45%] lg:w-[40%] p-10 md:p-16 flex flex-col justify-center text-white overflow-hidden"
        style={{ backgroundColor: colors.primary }}
      >
        {/* Circulos decorativos de fondo */}
        <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] rounded-full bg-white/5 pointer-events-none"></div>
        <div className="absolute bottom-[-20%] right-[-20%] w-[600px] h-[600px] rounded-full bg-black/10 pointer-events-none"></div>

        <div className="relative z-10">
          {/* Badge Superior */}
          <div className="mb-20">
            <span className="px-4 py-2 bg-white/10 border border-white/20 rounded-md text-[10px] font-bold uppercase tracking-widest">
              Gobierno CDMX
            </span>
          </div>

          {/* Titulo Principal */}
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-black leading-[1.1] mb-6 tracking-tighter">
            Sistema de <br />
            Atencion <br />
            Ciudadana
          </h1>

          {/* Linea decorativa dorada */}
          <div className="w-16 h-1.5 mb-8" style={{ backgroundColor: colors.accent }}></div>

          {/* Subtitulo */}
          <p className="text-lg md:text-xl text-white/80 font-medium max-w-sm leading-relaxed">
            Consulta, paga e impugna tus infracciones de manera digital y transparente.
          </p>
        </div>
      </div>

      {/* SECCIoN DERECHA: Formulario de Acceso */}
      <div className="flex-1 bg-[#f4f4f4] flex flex-col items-center justify-center p-6 relative">
        
        {/* Card de Login */}
        <div className="w-full max-w-md bg-white rounded-[40px] shadow-2xl shadow-black/5 p-10 md:p-12 border border-white">
          
          <div className="mb-10">
            <h2 className="text-3xl font-black text-zinc-900 mb-2 tracking-tight">Iniciar Sesion</h2>
            <p className="text-sm text-zinc-400 font-medium">Gestiona los tramites de tu vehiculo</p>
          </div>

          {/* Boton Llave CDMX */}
          <button className="w-full py-4 border-2 rounded-2xl flex items-center justify-center gap-3 group transition-all hover:bg-zinc-50 mb-8" 
                  style={{ borderColor: colors.primary, color: colors.primary }}>
            <span className="font-black text-xs uppercase tracking-widest">Entrar con LLAVE CDMX</span>
            <ExternalLink size={16} className="opacity-50 group-hover:opacity-100" />
          </button>

          {/* Separador */}
          <div className="relative flex items-center mb-10">
            <div className="flex-1 border-t border-zinc-100"></div>
            <span className="px-4 text-[9px] font-black text-zinc-300 uppercase tracking-[0.2em]">O consulta por vehiculo</span>
            <div className="flex-1 border-t border-zinc-100"></div>
          </div>

          {/* Formulario de Consulta */}
          <div className="space-y-6">
            <div>
              <label className="block text-[10px] font-black text-zinc-800 uppercase mb-2 tracking-widest">Placa</label>
              <input 
                type="text" 
                value={placa}
                onChange={(e) => setPlaca(e.target.value)}
                className="w-full bg-zinc-100 border-none rounded-2xl p-4 text-sm font-bold text-zinc-800 focus:ring-2 focus:ring-[#6b1d31]/20 outline-none transition-all"
                placeholder="ABC-12-34"
              />
            </div>

            <div>
              <label className="block text-[10px] font-black text-zinc-800 uppercase mb-2 tracking-widest">Ultimos 5 digitos del VIN (Serie)</label>
              <input 
                type="text" 
                value={vin}
                onChange={(e) => setVin(e.target.value)}
                className="w-full bg-zinc-100 border-none rounded-2xl p-4 text-sm font-bold text-zinc-800 focus:ring-2 focus:ring-[#6b1d31]/20 outline-none transition-all tracking-[0.5em]"
                placeholder="•••••"
              />
            </div>

            <button 
              style={{ backgroundColor: colors.primary }}
              className="w-full py-5 rounded-3xl text-white font-black text-xs uppercase tracking-[0.2em] shadow-xl shadow-rose-950/20 hover:scale-[1.02] active:scale-95 transition-all mt-4"
            >
              Consultar Estatus
            </button>

            <button className="w-full flex items-center justify-center gap-2 text-[10px] font-black uppercase tracking-widest transition-colors hover:opacity-70"
                    style={{ color: colors.accent }}>
              <HelpCircle size={14} />
              ¿Como encuentro mi número de serie?
            </button>
          </div>
        </div>

        {/* Footer de la pagina */}
        <div className="absolute bottom-8 w-full text-center px-6">
          <p className="text-[9px] font-bold text-zinc-400 uppercase tracking-widest">
            © 2026 Gobierno de la Ciudad de México | <span className="hover:text-zinc-600 cursor-pointer">Términos y Condiciones</span>
          </p>
        </div>
      </div>

    </div>
  );
};

export default CitizenLoginView;