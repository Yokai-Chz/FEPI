import { Oficial } from '../../src/services/dashboard.service';

import { Trash2 } from 'lucide-react';
import { Oficial } from '../../src/services/dashboard.service';

interface OficialRowProps {
  oficial: Oficial;
  onUpdateStatus: (oficialId: string, newStatus: 'AUTORIZADO' | 'INACTIVO') => void;
  onEdit: (oficial: Oficial) => void;
  onDelete: (oficialId: string) => void;
}

export default function OficialRow({ oficial, onUpdateStatus, onEdit, onDelete }: OficialRowProps) {
  const isAutorizado = oficial.estatusApp === 'AUTORIZADO';

  const handleSuspend = () => {
    if (confirm(`¿Está seguro de que desea SUSPENDER el acceso a la app para el oficial ${oficial.nombreCompleto}?`)) {
      onUpdateStatus(oficial.id, 'INACTIVO');
    }
  };

  const handleReactivate = () => {
    if (confirm(`¿Está seguro de que desea REACTIVAR el acceso a la app para el oficial ${oficial.nombreCompleto}?`)) {
      onUpdateStatus(oficial.id, 'AUTORIZADO');
    }
  };

  const handleDelete = () => {
    if (confirm(`⚠️ ACCIÓN IRREVERSIBLE\n\n¿Está seguro de que desea ELIMINAR DEFINITIVAMENTE al oficial ${oficial.nombreCompleto}?\n\nEsta acción borrará todo su historial y acceso.`)) {
      onDelete(oficial.id);
    }
  };

  return (
    <tr className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors text-sm">
      <td className="py-6 px-6 font-bold text-gray-800">{oficial.placa}</td>
      <td className="py-6 px-6 text-gray-600 font-medium">{oficial.nombreCompleto}</td>
      <td className="py-6 px-6 text-gray-500">{oficial.sector}</td>
      <td className="py-6 px-6">
        <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest ${
          isAutorizado ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-400'
        }`}>
          {oficial.estatusApp}
        </span>
      </td>
      <td className="py-6 px-6 text-right">
        <div className="flex justify-end items-center gap-3 text-[11px] font-black uppercase">
          {isAutorizado ? (
            <>
              <button 
                onClick={() => onEdit(oficial)}
                className="text-gray-400 hover:text-gray-600"
              >
                Editar
              </button>
              <span className="text-gray-200">|</span>
              <button onClick={handleSuspend} className="text-amber-500 hover:text-amber-700">Suspender</button>
            </>
          ) : (
            <>
              <button 
                onClick={() => onEdit(oficial)}
                className="text-gray-400 hover:text-gray-600"
              >
                Editar
              </button>
              <span className="text-gray-200">|</span>
              <button onClick={handleReactivate} className="text-green-600 hover:underline">
                Reactivar
              </button>
            </>
          )}
          
          <button 
            onClick={handleDelete}
            className="ml-2 p-2 text-red-300 hover:text-red-600 hover:bg-red-50 rounded-full transition-all"
            title="Eliminar definitivamente"
          >
            <Trash2 size={16} />
          </button>
        </div>
      </td>
    </tr>
  );
}
