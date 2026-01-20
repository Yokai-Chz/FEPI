'use client';
import { useEffect, useState } from 'react';
import Sidebar from '../../components/Sidebar';
import StatCard from '../../components/StatCard';
import DepositoRow from '../../components/DepositoRow';
import { DashboardService, Deposito } from '../../../src/services/dashboard.service';

export default function DepositosPage() {
  const [depositos, setDepositos] = useState<Deposito[]>([]);

  useEffect(() => {
    DashboardService.getDepositos().then(setDepositos);
  }, []);

  return (
    <div className="flex min-h-screen bg-[#f4f4f4]">
      <Sidebar />
      <main className="flex-1 p-12">
        <header className="mb-10">
          <h2 className="text-[#691C32] text-sm font-black uppercase tracking-[0.2em] mb-2">
            Gestión de Depósitos (Corralones)
          </h2>
        </header>

        <div className="flex gap-8 mb-10">
          <StatCard title="Total Capacidad" value="12,450 Espacios" subValue="Sistema Centralizado" color="border-gray-200" />
          <StatCard title="Ocupación Promedio" value="78%" subValue="Tendencia Semanal" color="border-red-500" />
          <StatCard title="Ingresos (Últimas 24h)" value="+342 Unidades" subValue="↑ 12% vs Ayer" color="border-[#BC955C]" />
        </div>

        {/* Tabla de Estatus */}
        <div className="bg-white rounded-[32px] shadow-sm overflow-hidden border border-gray-100">
          <div className="p-8 border-b border-gray-50 flex justify-between items-center">
            <h3 className="text-xl font-black text-gray-800 tracking-tight">Estatus por Depósito</h3>
            <button className="bg-[#BC955C] text-white px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-[#a68350] transition-colors">
              Descargar Corte
            </button>
          </div>
          
          <table className="w-full text-left">
            <thead className="bg-gray-50/50">
              <tr>
                <th className="py-4 px-4 text-[9px] font-black text-gray-400 uppercase tracking-widest">Nombre del Depósito</th>
                <th className="py-4 px-4 text-[9px] font-black text-gray-400 uppercase tracking-widest">Zona</th>
                <th className="py-4 px-4 text-[9px] font-black text-gray-400 uppercase tracking-widest">Capacidad / Uso</th>
                <th className="py-4 px-4 text-[9px] font-black text-gray-400 uppercase tracking-widest">Estatus</th>
                <th className="py-4 px-4 text-right text-[9px] font-black text-gray-400 uppercase tracking-widest">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {depositos.map(d => <DepositoRow key={d.id} deposito={d} />)}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
}