'use client';
import { useEffect, useState } from 'react';
import Sidebar from '../../components/Sidebar';
import StatCard from '../../components/StatCard';
import FolioRow from '../../components/FolioRow';
import { DashboardService, Folio, RecaudacionStats } from '../../../src/services/dashboard.service';
import { DownloadCloud, Search } from 'lucide-react';

export default function FoliosPage() {
  const [folios, setFolios] = useState<Folio[]>([]);
  const [stats, setStats] = useState<RecaudacionStats | null>(null);

  useEffect(() => {
    DashboardService.getFolios().then(setFolios);
    DashboardService.getRecaudacionStats().then(setStats);
  }, []);

  return (
    <div className="flex min-h-screen bg-[#f4f4f4]">
      <Sidebar />
      <main className="flex-1 p-12">
        <header className="mb-10">
          <h2 className="text-[#691C32] text-sm font-black uppercase tracking-[0.2em]">
            Monitoreo de Infracciones y Recaudación
          </h2>
        </header>

        <div className="flex gap-8 mb-10">
          <StatCard title="Folios Emitidos Mes" value={stats?.foliosMes || "0"} subValue="Corte al día de hoy" color="border-gray-200" />
          <StatCard title="Pendientes de Pago" value={stats?.pendientesPago || "$0"} subValue="Cartera Vencida" color="border-red-500" />
          <StatCard title="En Proceso de Impugnación" value={stats?.enImpugnacion || "0"} subValue="Recursos de Revisión" color="border-[#BC955C]" />
        </div>

        {/* Tabla de Folios */}
        <div className="bg-white rounded-[32px] shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-8 border-b border-gray-50 flex justify-between items-center gap-4">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" size={18} />
              <input 
                type="text" 
                placeholder="Filtrar por Placa o Folio..." 
                className="w-full pl-12 pr-4 py-3 bg-gray-50 border-none rounded-xl text-sm focus:ring-2 focus:ring-[#BC955C] transition-all"
              />
            </div>
            <button className="flex items-center gap-2 border-2 border-[#BC955C] text-[#BC955C] px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-[#BC955C] hover:text-white transition-all">
              <DownloadCloud size={16} />
              Exportar Reporte
            </button>
          </div>
          
          <table className="w-full text-left">
            <thead className="bg-gray-50/50">
              <tr>
                {['Folio', 'Placa', 'Fecha / Hora', 'Oficial (ID)', 'Monto', 'Estatus Pago', 'Evidencia'].map((head) => (
                  <th key={head} className="py-4 px-4 text-[9px] font-black text-gray-400 uppercase tracking-widest">
                    {head === 'Evidencia' ? '' : head}
                  </th>
                ))}
                <th className="py-4 px-4"></th>
              </tr>
            </thead>
            <tbody>
              {folios.map(f => <FolioRow key={f.id} folio={f} />)}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
}