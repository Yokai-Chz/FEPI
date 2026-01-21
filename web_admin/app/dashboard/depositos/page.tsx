'use client';
import { useEffect, useState } from 'react';
import StatCard from '../../components/StatCard';
import DepositoRow from '../../components/DepositoRow';
import TableContainer from '../../components/TableContainer';
import SectionHeader from '../../components/SectionHeader';
import { DashboardService, Deposito } from '../../../src/services/dashboard.service';

export default function DepositosPage() {
  const [depositos, setDepositos] = useState<Deposito[]>([]);

  useEffect(() => {
    DashboardService.getDepositos().then(setDepositos);
  }, []);

  return (
    <>
      <SectionHeader title="Gestión de Depósitos (Corralones)" />

      <div className="flex gap-8 mb-10">
        <StatCard title="Total Capacidad" value="12,450 Espacios" subValue="Sistema Centralizado" color="border-gray-200" />
        <StatCard title="Ocupación Promedio" value="78%" subValue="Tendencia Semanal" color="border-red-500" />
        <StatCard title="Ingresos (Últimas 24h)" value="+342 Unidades" subValue="↑ 12% vs Ayer" color="border-[#BC955C]" />
      </div>

      {/* Tabla de Estatus */}
      <TableContainer
        title="Estatus por Depósito"
        action={
          <button className="bg-[#BC955C] text-white px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-[#a68350] transition-colors">
            Descargar Corte
          </button>
        }
      >
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
      </TableContainer>
    </>
  );
}