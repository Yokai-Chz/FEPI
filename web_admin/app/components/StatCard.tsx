interface StatProps {
  title: string;
  value: string | number;
  subValue: string;
  color: string;
}

export default function StatCard({ title, value, subValue, color }: StatProps) {
  return (
    <div className={`bg-white p-7 rounded-[24px] shadow-sm border-t-[6px] ${color} flex-1`}>
      <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3">{title}</p>
      <h3 className="text-4xl font-bold text-gray-800 tracking-tighter">{value}</h3>
      <p className={`text-[11px] mt-3 font-bold uppercase ${subValue.includes('↑') ? 'text-green-600' : 'text-[#BC955C]'}`}>
        {subValue}
      </p>
    </div>
  );
}