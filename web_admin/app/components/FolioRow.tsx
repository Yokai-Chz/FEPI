import { Folio } from '../../src/services/dashboard.service';

export default function FolioRow({ folio }: { folio: Folio }) {
  const statusStyles = {
    LIQUIDADA: 'bg-green-100 text-green-600',
    PENDIENTE: 'bg-orange-100 text-orange-600',
    IMPUGNADA: 'bg-red-100 text-red-600',
  };

  return (
    <tr className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors text-[11px]">
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
        <button className="text-[#691C32] font-black hover:underline cursor-pointer">
          Ver Fotos ({folio.evidenciaCount})
        </button>
      </td>
    </tr>
  );
}