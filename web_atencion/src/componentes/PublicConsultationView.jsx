import React from 'react';
import { AlertCircle, CheckCircle2, XCircle, Info, Calendar } from 'lucide-react';

const PublicConsultationView = () => {
  const colors = {
    primary: '#6b1d31', 
    success: '#e7f5ec', 
    successText: '#065f46',
    error: '#fef2f2',   
    errorText: '#991b1b',
    warning: '#fffbeb', 
    warningIcon: '#f59e0b',
    textMain: '#1a1a1a',
    textMuted: '#71717a'
  };

  const statusItems = [
    {
      title: "REPORTE DE ROBO",
      status: "SIN REPORTE",
      detail: "Actualizado hace 5 min",
      type: "success"
    },
    {
      title: "TENENCIA / REFRENDO",
      status: "CON ADEUDO",
      detail: "Periodo 2025 pendiente",
      type: "error"
    },
    {
      title: "INFRACCIONES",
      status: "02 PENDIENTES",
      detail: "Corte al 12/01/2026",
      type: "error"
    },
    {
      title: "VERIFICACION",
      status: "VIGENTE (HOLOG. 0)",
      detail: "Vence: Octubre 2026",
      type: "success"
    }
  ];

  return (
    <div className="min-h-screen bg-zinc-100 font-sans flex flex-col">
      
      {/* 1. Header Superior */}
      <header className="bg-white border-b border-zinc-200 px-6 py-4 flex justify-between items-center shadow-sm">
        <div className="flex items-center gap-2">
          <span className="font-black text-lg tracking-tighter" style={{ color: colors.primary }}>SCC |</span>
          <span className="font-bold text-sm text-zinc-800 uppercase tracking-tight">Consulta Pública</span>
        </div>
        <div className="flex items-center gap-2 text-zinc-400">
          <Calendar size={14} />
          <span className="text-[10px] font-bold uppercase">Fecha de consulta: 12/01/2026</span>
        </div>
      </header>

      {/* 2. Contenido Principal */}
      <main className="flex-1 flex items-center justify-center p-4 md:p-8">
        <div className="w-full max-w-5xl bg-white rounded-3xl shadow-xl border border-zinc-200 overflow-hidden p-8 md:p-16 flex flex-col items-center">
          
          {/* Titulo de Placa */}
          <h2 className="text-xl md:text-2xl font-black text-zinc-800 mb-8 uppercase tracking-tight">
            Estatus del Vehiculo: <span className="text-zinc-500">ABC-123-D</span>
          </h2>

          {/* Icono de Alerta Grande */}
          <div className="relative mb-6">
            <div className="w-32 h-32 md:w-40 md:h-40 rounded-full bg-amber-50 flex items-center justify-center border-4 border-amber-100 shadow-inner">
              <span className="text-6xl md:text-7xl font-black text-amber-400">!</span>
            </div>
          </div>

          {/* Mensaje de Estatus */}
          <div className="text-center mb-12">
            <h3 className="text-lg md:text-xl font-black text-zinc-900 uppercase tracking-tighter mb-2">
              Pendientes Detectados
            </h3>
            <p className="text-sm text-zinc-500 font-medium">
              El vehiculo cuenta con obligaciones administrativas pendientes.
            </p>
          </div>

          {/* Grid de Tarjetas de Estatus */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 w-full mb-12">
            {statusItems.map((item, index) => (
              <div 
                key={index}
                className={`p-6 rounded-2xl flex flex-col items-center text-center transition-transform hover:scale-105 ${
                  item.type === 'success' ? 'bg-[#e7f5ec]' : 'bg-[#fef2f2]'
                }`}
              >
                <p className={`text-[9px] font-black uppercase mb-4 tracking-widest ${
                  item.type === 'success' ? 'text-emerald-700' : 'text-rose-700'
                }`}>
                  {item.title}
                </p>
                <p className={`text-sm font-black mb-1 uppercase ${
                  item.type === 'success' ? 'text-emerald-800' : 'text-rose-800'
                }`}>
                  {item.status}
                </p>
                <p className={`text-[10px] font-medium opacity-60 ${
                  item.type === 'success' ? 'text-emerald-900' : 'text-rose-900'
                }`}>
                  {item.detail}
                </p>
              </div>
            ))}
          </div>

          {/* Boton de Accion */}
          <div className="w-full max-w-md space-y-4">
            <button 
              style={{ backgroundColor: colors.primary }}
              className="w-full py-4 rounded-full text-white font-black text-xs md:text-sm uppercase tracking-[0.2em] shadow-lg shadow-rose-900/20 active:scale-95 transition-all"
            >
              Pagar adeudos o impugnar multas
            </button>
            <div className="flex items-center justify-center gap-2 text-zinc-400">
              <Info size={14} />
              <p className="text-[10px] font-medium">
                Se requiere iniciar sesion con Llave CDMX para realizar trámites financieros.
              </p>
            </div>
          </div>

        </div>
      </main>

      {/* 3. Footer Legal */}
      <footer className="p-6 text-center">
        <p className="text-[10px] text-zinc-400 font-medium uppercase tracking-widest">
          Esta consulta es informativa y no sustituye documentos oficiales certificados.
        </p>
      </footer>

    </div>
  );
};

export default PublicConsultationView;