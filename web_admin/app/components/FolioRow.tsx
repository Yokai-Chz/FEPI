import { DownloadCloud } from 'lucide-react'; // Importamos el icono
import { Folio, DashboardService } from '../../src/services/dashboard.service';

interface FolioRowProps {
  folio: Folio;
  onViewDetails: (folio: Folio) => void;
}

export default function FolioRow({ folio, onViewDetails }: FolioRowProps) {
  const statusStyles = {
    LIQUIDADA: 'bg-green-100 text-green-600',
    PENDIENTE: 'bg-orange-100 text-orange-600',
    IMPUGNADA: 'bg-red-100 text-red-600',
  };

  const handleDownload = (e: React.MouseEvent) => {
    // IMPORTANTE: Evita que se dispare el onClick de la fila (onViewDetails)
    e.stopPropagation(); 
    DashboardService.exportEvidence(folio.id);
  };

  return (
    <tr 
      className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors text-[11px] cursor-pointer group"
      onClick={() => onViewDetails(folio)}
    >
      <td className="py-5 px-4 font-bold text-gray-700">{folio.folio}</td>
      <td className="py-5 px-4 text-gray-500 font-medium">{folio.placa}</td>
      <td className="py-5 px-4 text-gray-500">{folio.fechaHora}</td>
      <td className="py-5 px-4 text-gray-500">{folio.oficialId}</td>
      <td className="py-5 px-4 font-bold text-gray-700">{folio.monto}</td>
      <td className="py-5 px-4">
        <span className={`px-3 py-1 rounded-full font-black uppercase tracking-tighter ${statusStyles[folio.estatusPago]}`}>
          {folio.estatusPago}
        </span>
      </td>
      <td className="py-5 px-4 text-right">
        <button 
          onClick={handleDownload}
          className="flex items-center justify-end gap-2 ml-auto group/btn"
          title="Descargar evidencias ZIP"
        >
          <span className="text-gray-400 group-hover/btn:text-[#691C32] transition-colors font-bold">
            ({folio.evidenciaCount})
          </span>
          <div className="p-2 rounded-lg bg-gray-50 group-hover/btn:bg-red-50 transition-colors">
            <DownloadCloud 
              size={16} 
              className="text-gray-300 group-hover/btn:text-[#691C32] transition-colors" 
            />
          </div>
        </button>
      </td>
    </tr>
  );
}