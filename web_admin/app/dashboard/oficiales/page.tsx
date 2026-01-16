'use client';
import { useEffect, useState } from 'react';
import Sidebar from '../../components/Sidebar';
import OficialRow from '../../components/OficialRow';
import { DashboardService, Oficial } from '../../../src/services/dashboard.service';
import { Plus, Search } from 'lucide-react';

export default function OficialesPage() {
  const [oficiales, setOficiales] = useState<Oficial[]>([]);
  
  const fetchOficiales = () => {
    DashboardService.getOficiales().then(setOficiales);
  };

  useEffect(() => {
    fetchOficiales();
  }, []);

  const handleUpdateStatus = async (oficialId: string, newStatus: 'AUTORIZADO' | 'INACTIVO') => {
    const success = await DashboardService.updateOficialStatus(oficialId, newStatus);
    if (success) {
      alert(`Estatus del oficial actualizado a ${newStatus}.`);
      fetchOficiales(); // Recargar la lista para reflejar el cambio
    } else {
      alert('Error al actualizar el estatus del oficial.');
    }
  };

  return (
    <div className="flex min-h-screen bg-[#f4f4f4]">
      <Sidebar />
      <main className="flex-1 p-12">
        <header className="mb-8">
          <h2 className="text-[#691C32] text-sm font-black uppercase tracking-[0.15em]">
            Padrón de Oficiales Autorizados
          </h2>
        </header>

        {/* Buscador y Botón de Acción */}
        <div className="bg-white p-6 rounded-[24px] shadow-sm border border-gray-100 mb-8 flex justify-between items-center gap-6">
          <div className="flex-1 max-w-xl">
            <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-2 ml-1">
              Buscar por placa o nombre
            </p>
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" size={18} />
              <input 
                type="text" 
                placeholder="Ej: 982734 o 'Fernanda Ríos'" 
                className="w-full pl-12 pr-4 py-3 bg-gray-50 border-none rounded-xl text-sm focus:ring-2 focus:ring-[#BC955C] outline-none transition-all"
              />
            </div>
          </div>
          <button className="bg-[#691C32] text-white px-8 py-4 rounded-2xl flex items-center gap-3 hover:bg-[#4d1425] transition-all shadow-lg shadow-[#691C32]/20 text-[11px] font-black uppercase tracking-widest">
            <Plus size={18} />
            Dar de Alta Oficial
          </button>
        </div>

        {/* Tabla de Resultados */}
        <div className="bg-white rounded-[32px] shadow-sm border border-gray-100 overflow-hidden">
          <table className="w-full text-left">
            <thead className="bg-gray-50/50">
              <tr>
                <th className="py-5 px-6 text-[9px] font-black text-gray-400 uppercase tracking-widest">Placa (ID)</th>
                <th className="py-5 px-6 text-[9px] font-black text-gray-400 uppercase tracking-widest">Nombre Completo</th>
                <th className="py-5 px-6 text-[9px] font-black text-gray-400 uppercase tracking-widest">Sector / Adscripción</th>
                <th className="py-5 px-6 text-[9px] font-black text-gray-400 uppercase tracking-widest">Estatus App</th>
                <th className="py-5 px-6 text-right text-[9px] font-black text-gray-400 uppercase tracking-widest">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {oficiales.map(o => <OficialRow key={o.id} oficial={o} onUpdateStatus={handleUpdateStatus} />)}
            </tbody>
          </table>
          
          {/* Footer */}
          <div className="p-4 bg-red-50/50 border-t border-red-50">
            <p className="text-center text-[10px] text-red-700 font-bold uppercase tracking-wider">
              SISTEMA: Hay {oficiales.filter(o => o.estatusApp === 'AUTORIZADO').length} oficiales activos con facultad sancionadora el día de hoy.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}