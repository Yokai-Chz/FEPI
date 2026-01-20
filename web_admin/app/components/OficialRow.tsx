import { Oficial } from '../../src/services/dashboard.service';

export default function OficialRow({ oficial }: { oficial: Oficial }) {
  const isAutorizado = oficial.estatusApp === 'AUTORIZADO';

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
        {isAutorizado ? (
          <div className="flex justify-end gap-3 text-[11px] font-black uppercase">
            <button className="text-gray-400 hover:text-gray-600">Editar</button>
            <span className="text-gray-200">|</span>
            <button className="text-red-500 hover:text-red-700">Suspender</button>
          </div>
        ) : (
          <button className="text-green-600 font-black text-[11px] uppercase hover:underline">
            Reactivar
          </button>
        )}
      </td>
    </tr>
  );
}