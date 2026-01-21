'use client';
import { useEffect, useState } from 'react';
import OficialRow from '../../components/OficialRow';
import TableContainer from '../../components/TableContainer';
import SectionHeader from '../../components/SectionHeader';
import CreateOficialModal from '../../components/CreateOficialModal';
import EditOficialModal from '../../components/EditOficialModal';
import { OficialesService } from '../../../src/services/oficiales.service';
import { Oficial } from '../../../src/services/dashboard.service'; // Mantenemos la interfaz por ahora
import { Plus, Search } from 'lucide-react';

export default function OficialesPage() {
  const [oficiales, setOficiales] = useState<Oficial[]>([]);
  const [filteredOficiales, setFilteredOficiales] = useState<Oficial[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [editingOficial, setEditingOficial] = useState<Oficial | null>(null);
  
  const fetchOficiales = async () => {
    const data = await OficialesService.getAll();
    setOficiales(data);
    setFilteredOficiales(data); // Inicialmente filtrados = todos
  };

  useEffect(() => {
    fetchOficiales();
  }, []);

  // Efecto para filtrar cuando cambia el término de búsqueda o la lista original
  useEffect(() => {
    if (!searchTerm.trim()) {
      setFilteredOficiales(oficiales);
      return;
    }
    const term = searchTerm.toLowerCase();
    const filtered = oficiales.filter(o => 
      o.placa.toLowerCase().includes(term) || 
      o.nombreCompleto.toLowerCase().includes(term) ||
      o.sector.toLowerCase().includes(term)
    );
    setFilteredOficiales(filtered);
  }, [searchTerm, oficiales]);

  const handleUpdateStatus = async (oficialId: string, newStatus: 'AUTORIZADO' | 'INACTIVO') => {
    const success = await OficialesService.updateStatus(oficialId, newStatus);
    if (success) {
      // Actualizamos el estado local optimísticamente para mejor UX
      setOficiales(prev => prev.map(o => 
        o.id === oficialId ? { ...o, estatusApp: newStatus } : o
      ));
      alert(`Estatus del oficial actualizado a ${newStatus}.`);
    } else {
      alert('Error al actualizar el estatus del oficial.');
    }
  };

  const handleDelete = async (oficialId: string) => {
    const success = await OficialesService.delete(oficialId);
    if (success) {
      setOficiales(prev => prev.filter(o => o.id !== oficialId));
      alert('Oficial eliminado correctamente.');
    } else {
      alert('Error al eliminar el oficial. Intente nuevamente.');
    }
  };

  return (
    <>
      <SectionHeader title="Padrón de Oficiales Autorizados" />

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
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
        <button 
          className="bg-[#691C32] text-white px-8 py-4 rounded-2xl flex items-center gap-3 hover:bg-[#4d1425] transition-all shadow-lg shadow-[#691C32]/20 text-[11px] font-black uppercase tracking-widest"
          onClick={() => setIsCreateModalOpen(true)}
        >
          <Plus size={18} />
          Dar de Alta Oficial
        </button>
      </div>

      {/* Tabla de Resultados */}
      <TableContainer
        footer={
          <p className="text-center text-[10px] text-red-700 font-bold uppercase tracking-wider">
            SISTEMA: Hay {oficiales.filter(o => o.estatusApp === 'AUTORIZADO').length} oficiales activos con facultad sancionadora el día de hoy.
          </p>
        }
      >
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
            {filteredOficiales.length > 0 ? (
              filteredOficiales.map(o => (
                <OficialRow 
                  key={o.id} 
                  oficial={o} 
                  onUpdateStatus={handleUpdateStatus} 
                  onEdit={(oficial) => setEditingOficial(oficial)}
                  onDelete={handleDelete}
                />
              ))
            ) : (
              <tr>
                <td colSpan={5} className="py-8 text-center text-gray-400 text-sm">
                  No se encontraron oficiales coincidiendo con la búsqueda.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </TableContainer>

      {/* Modal de Alta */}
      {isCreateModalOpen && (
        <CreateOficialModal 
          onClose={() => setIsCreateModalOpen(false)}
          onSuccess={() => {
            fetchOficiales();
            alert('Oficial registrado correctamente.');
          }}
        />
      )}

      {/* Modal de Edición */}
      {editingOficial && (
        <EditOficialModal 
          oficial={editingOficial}
          onClose={() => setEditingOficial(null)}
          onSuccess={() => {
            fetchOficiales();
            alert('Información del oficial actualizada.');
          }}
        />
      )}
    </>
  );
}
