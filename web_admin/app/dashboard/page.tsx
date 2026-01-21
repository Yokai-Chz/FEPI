'use client';
import { useEffect, useState } from 'react';
import StatCard from '../components/StatCard';
import SectionHeader from '../components/SectionHeader';
import { DashboardService, DashboardStats } from '../../src/services/dashboard.service';

export default function DashboardPage() {
  const [data, setData] = useState<DashboardStats | null>(null);

  useEffect(() => {
    DashboardService.getGeneralStats().then(res => setData(res));
  }, []);

  if (!data) return (
    <div className="h-screen w-full flex items-center justify-center bg-[#f4f4f4]">
      <p className="text-[#691C32] font-bold animate-pulse uppercase tracking-widest text-xs">Cargando Sistema...</p>
    </div>
  );

  return (
    <>
      <SectionHeader 
        title="Monitoreo General de Operaciones" 
        subtitle="Corte informativo: 14 Enero 2026"
      />

      {/* Cards Dinámicas */}
      <div className="flex gap-8 mb-12">
        <StatCard 
          title="Infracciones (Hoy)" 
          value={data.infraccionesHoy} 
          subValue={`${data.eficienciaOperativa} Eficiencia operativa`} 
          color="border-[#691C32]" 
        />
        <StatCard 
          title="Cupo Corralones" 
          value={`${data.ocupacionCorralones}%`} 
          subValue={`Alerta: ${data.alertaCorralones}`} 
          color="border-[#BC955C]" 
        />
        <StatCard 
          title="Oficiales Activos" 
          value={data.oficialesTurno} 
          subValue={`Sectores: ${data.zonasActivas}`} 
          color="border-gray-800" 
        />
      </div>

      <div className="flex gap-10">
        {/* Mapa */}
        <div className="flex-[2] bg-white rounded-[32px] shadow-sm p-8 border border-gray-100 min-h-[450px]">
           <p className="text-[11px] font-black text-gray-400 uppercase tracking-[0.2em] mb-6">Distribución Geográfica de Incidentes</p>
           <div className="w-full h-full bg-gray-50 rounded-[24px] border-2 border-dashed border-gray-200 flex items-center justify-center relative overflow-hidden">
              <div className="absolute w-24 h-24 bg-[#691C32]/5 rounded-full animate-ping" />
              <div className="w-4 h-4 bg-[#691C32] rounded-full relative z-10" />
           </div>
        </div>

        {/* Panel Alertas */}
        <div className="flex-1 space-y-6">
           <div className="bg-[#691C32] p-5 rounded-2xl text-white text-xs font-black uppercase tracking-widest shadow-lg shadow-[#691C32]/20">
              ⚠ Alertas del Sistema
           </div>
           <div className="bg-white p-6 rounded-[24px] shadow-sm border-l-[6px] border-red-500">
              <p className="text-[10px] font-black text-red-500 uppercase tracking-widest">Reporte de Robo Detectado</p>
              <p className="text-sm font-bold mt-2 text-gray-800 tracking-tight">Placa: ABC-1234 | Sector: 1</p>
              <p className="text-[10px] text-gray-400 mt-3 italic font-medium">Prioridad: Alta</p>
           </div>
        </div>
      </div>
    </>
  );
}
