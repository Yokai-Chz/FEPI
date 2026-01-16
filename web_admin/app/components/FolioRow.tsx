import { Folio } from '../../src/services/dashboard.service';

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

  return (
    <tr 
      className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors text-[11px] cursor-pointer"
      onClick={() => onViewDetails(folio)} // Hace toda la fila clickeable
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
        {/* El botón "Ver Fotos" se integra en el onClick de la fila ahora */}
        <span className="text-gray-400">({folio.evidenciaCount})</span>
      </td>
    </tr>
  );
}
