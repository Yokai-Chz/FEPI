import { Deposito } from '../../src/services/dashboard.service';

export default function DepositoRow({ deposito }: { deposito: Deposito }) {
  const estatusColor = deposito.estatus === 'CRÍTICO' ? 'bg-red-100 text-red-600' : 'bg-green-100 text-green-600';
  const barColor = deposito.porcentaje > 80 ? 'bg-red-500' : 'bg-green-500';

  return (
    <tr className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
      <td className="py-6 px-4 text-sm font-bold text-gray-700">{deposito.nombre}</td>
      <td className="py-6 px-4 text-sm text-gray-500 font-medium">{deposito.zona}</td>
      <td className="py-6 px-4">
        <div className="flex items-center gap-3">
          <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
            <div className={`h-full ${barColor}`} style={{ width: `${deposito.porcentaje}%` }} />
          </div>
          <span className="text-[10px] font-black text-gray-400">{deposito.porcentaje}%</span>
        </div>
      </td>
      <td className="py-6 px-4">
        <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest ${estatusColor}`}>
          {deposito.estatus}
        </span>
      </td>
      <td className="py-6 px-4 text-right">
        <button className="text-[#691C32] font-black text-[10px] uppercase hover:underline">Ver Inventario</button>
      </td>
    </tr>
  );
}