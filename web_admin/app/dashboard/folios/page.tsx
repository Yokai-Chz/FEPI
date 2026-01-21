'use client';
import { useEffect, useState } from 'react';
import StatCard from '../../components/StatCard';
import FolioRow from '../../components/FolioRow';
import FolioDetailModal from '../../components/FolioDetailModal'; // Importar el nuevo modal
import TableContainer from '../../components/TableContainer';
import SectionHeader from '../../components/SectionHeader';
import { DashboardService, Folio, RecaudacionStats } from '../../../src/services/dashboard.service';
import { DownloadCloud, Search } from 'lucide-react';

export default function FoliosPage() {
  const [folios, setFolios] = useState<Folio[]>([]);
  const [stats, setStats] = useState<RecaudacionStats | null>(null);
  const [selectedFolio, setSelectedFolio] = useState<Folio | null>(null); // Estado para el folio seleccionado
  const [filterPlaca, setFilterPlaca] = useState(''); // Estado para filtro de placa
  const [filterFolio, setFilterFolio] = useState(''); // Estado para filtro de folio

  const fetchFolios = async () => {
    const fetchedFolios = await DashboardService.getFolios({
      placa: filterPlaca,
      folio: filterFolio
    });
    setFolios(fetchedFolios);
  };

  useEffect(() => {
    fetchFolios();
    DashboardService.getRecaudacionStats().then(setStats);
  }, [filterPlaca, filterFolio]); // Dependencias para re-ejecutar el filtro

  const handleOpenModal = async (folio: Folio) => {
    // Para asegurar que tenemos la información más detallada si es necesario,
    // aunque nuestro fake service ya devuelve todo.
    const fullFolioDetails = await DashboardService.getFolioById(folio.id);
    setSelectedFolio(fullFolioDetails || folio);
  };

  const handleCloseModal = () => {
    setSelectedFolio(null);
    fetchFolios(); // Refrescar la lista de folios al cerrar el modal (por si hubo cambios)
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchFolios();
  };

  return (
    <>
      <SectionHeader title="Monitoreo de Infracciones y Recaudación" />

      <div className="flex gap-8 mb-10">
        <StatCard title="Folios Emitidos Mes" value={stats?.foliosMes || "0"} subValue="Corte al día de hoy" color="border-gray-200" />
        <StatCard title="Pendientes de Pago" value={stats?.pendientesPago || "$0"} subValue="Cartera Vencida" color="border-red-500" />
        <StatCard title="En Proceso de Impugnación" value={stats?.enImpugnacion || "0"} subValue="Recursos de Revisión" color="border-[#BC955C]" />
      </div>

      {/* Tabla de Folios */}
      <TableContainer
        action={
          <div className="flex w-full items-center gap-4">
             <form onSubmit={handleSearch} className="relative flex-1 max-w-md">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" size={18} />
              <input 
                type="text" 
                placeholder="Filtrar por Placa o Folio..." 
                className="w-full pl-12 pr-4 py-3 bg-gray-50 border-none rounded-xl text-sm focus:ring-2 focus:ring-[#BC955C] transition-all"
                value={filterPlaca} // Usamos solo placa por simplicidad de un solo input
                onChange={(e) => setFilterPlaca(e.target.value)}
              />
            </form>
            <button className="flex items-center gap-2 border-2 border-[#BC955C] text-[#BC955C] px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-[#BC955C] hover:text-white transition-all ml-auto">
              <DownloadCloud size={16} />
              Exportar Reporte
            </button>
          </div>
        }
      >
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
            {folios.map(f => <FolioRow key={f.id} folio={f} onViewDetails={handleOpenModal} />)}
          </tbody>
        </table>
      </TableContainer>

      {selectedFolio && (
        <FolioDetailModal folio={selectedFolio} onClose={handleCloseModal} />
      )}
    </>
  );
}
