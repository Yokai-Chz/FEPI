'use client';
import { LayoutDashboard, Truck, FileText, Users, BarChart, LogOut, CarFront, FileBarChart } from 'lucide-react';
import { useRouter, usePathname } from 'next/navigation';

export default function Sidebar() {
  const router = useRouter();
  const pathname = usePathname();

  const menu = [
    { name: 'Tablero de control', icon: <LayoutDashboard size={20} />, path: '/dashboard' },
    { name: 'Depósitos Vehiculares', icon: <Truck size={20} />, path: '/dashboard/depositos' },
    { name: 'Folios y Multas', icon: <FileText size={20} />, path: '/dashboard/folios' },
    { name: 'Grúas y Arrastres', icon: <CarFront size={20} />, path: '/dashboard/gruas' },
    {name: 'Gestión de Oficiales', icon: <Users size={20} />, path: '/dashboard/oficiales' },
    {name: 'Reportes Ejecutivos', icon: <FileBarChart size={20} />, path: '/dashboard/reportes' }
  ];

  return (
    <aside className="w-72 bg-[#691C32] min-h-screen flex flex-col shadow-2xl">
      <div className="p-8">
        <h1 className="text-white text-3xl font-black tracking-tighter">SSC ADMIN</h1>
      </div>

      <nav className="flex-1 px-4 space-y-2">
        {menu.map((item) => (
          <div 
            key={item.path}
            onClick={() => router.push(item.path)}
            className={`flex items-center gap-4 px-5 py-4 rounded-2xl cursor-pointer transition-all ${
              pathname === item.path 
              ? 'bg-white/10 text-white border-l-4 border-[#BC955C]' 
              : 'text-white/50 hover:bg-white/5 hover:text-white'
            }`}
          >
            {item.icon}
            <span className="text-sm font-bold">{item.name}</span>
          </div>
        ))}
      </nav>

      <div className="p-6 border-t border-white/10">
        <button 
          onClick={() => router.push('/')}
          className="w-full flex items-center gap-4 px-5 py-4 rounded-2xl text-red-300 hover:bg-red-500/10 transition-all font-bold text-sm"
        >
          <LogOut size={20} />
          Cerrar Sesión
        </button>
      </div>
    </aside>
  );
}