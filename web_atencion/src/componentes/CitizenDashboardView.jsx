import React, { useState } from 'react';
import { 
  LayoutDashboard, 
  Car, 
  History, 
  Gavel, 
  MapPin, 
  Settings, 
  Bell, 
  ChevronRight,
  ExternalLink,
  Info
} from 'lucide-react';

const CitizenDashboardView = () => {
  const [activeTab, setActiveTab] = useState('Dashboard');

  const colors = {
    primary: '#6b1d31', // Guinda CDMX
    accent: '#c4a456',  // Dorado
    bgLight: '#f4f4f7',
    success: '#059669',
    error: '#dc2626'
  };

  const SidebarItem = ({ icon: Icon, label }) => (
    <button
      onClick={() => setActiveTab(label)}
      className={`w-full flex items-center space-x-3 px-6 py-3 transition-all duration-200 rounded-lg mb-1 ${
        activeTab === label 
          ? 'bg-rose-50 text-[#6b1d31] font-black' 
          : 'text-zinc-500 hover:bg-zinc-50 font-bold'
      }`}
    >
      <Icon size={18} className={activeTab === label ? 'text-[#6b1d31]' : 'text-zinc-400'} />
      <span className="text-xs uppercase tracking-tight">{label}</span>
    </button>
  );

  return (
    <div className="flex h-screen bg-[#f4f4f7] font-sans overflow-hidden">
      
      {/* 1. SIDEBAR IZQUIERDO */}
      <aside className="w-64 bg-white border-r border-zinc-200 flex flex-col shrink-0">
        {/* Logo Area */}
        <div style={{ backgroundColor: colors.primary }} className="p-6 mb-6">
          <h1 className="text-white text-sm font-black uppercase tracking-widest">
            SCC Ciudadano
          </h1>
        </div>

        <nav className="flex-1 px-4">
          <SidebarItem icon={LayoutDashboard} label="Dashboard" />
          <SidebarItem icon={Car} label="Mis Vehiculos" />
          <SidebarItem icon={History} label="Historial de Multas" />
          <SidebarItem icon={Gavel} label="Impugnaciones" />
          <SidebarItem icon={MapPin} label="Depositos (Corralon)" />
          
          <div className="my-6 border-t border-zinc-100"></div>
          
          <SidebarItem icon={Settings} label="Configuracion" />
        </nav>
      </aside>

      {/* 2. CONTENIDO PRINCIPAL */}
      <main className="flex-1 flex flex-col overflow-hidden">
        
        {/* Top Bar */}
        <header className="h-16 bg-white border-b border-zinc-200 flex items-center justify-between px-8 shrink-0">
          <div className="flex flex-col">
            <span className="text-[10px] font-black text-zinc-800 uppercase leading-none tracking-tighter">Gobierno de la Ciudad de Mexico</span>
            <span className="text-[9px] text-zinc-400 font-bold uppercase leading-none">Subsecretaria de Control de Transito</span>
          </div>

          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className="text-xs font-bold text-zinc-800">Alejandro Crombie</p>
            </div>
            <div style={{ backgroundColor: colors.accent }} className="w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-xs">
              AC
            </div>
          </div>
        </header>

        {/* Dashboard Area */}
        <div className="flex-1 overflow-y-auto p-8">
          <div className="max-w-6xl mx-auto">
            
            {/* Titulo de Seccion */}
            <div className="mb-8">
              <h2 className="text-2xl font-black text-zinc-800 tracking-tight">Resumen de Cuenta</h2>
              <p className="text-xs text-zinc-400 font-bold uppercase mt-1">Placa registrada: ABC-123-D</p>
            </div>

            {/* Grid de Tarjetas de Resumen */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              {/* Multas Pendientes */}
              <div className="bg-white p-6 rounded-2xl border border-zinc-100 shadow-sm relative overflow-hidden">
                <div className="absolute right-0 top-0 bottom-0 w-2 bg-rose-50 opacity-50"></div>
                <p className="text-[10px] font-black text-zinc-400 uppercase mb-4 tracking-widest">Multas Pendientes</p>
                <h3 className="text-5xl font-black text-rose-700 mb-2">2</h3>
                <p className="text-[10px] font-bold text-rose-500 uppercase">Requieren pago inmediato</p>
              </div>

              {/* Puntos Fotocivicas */}
              <div className="bg-white p-6 rounded-2xl border border-zinc-100 shadow-sm">
                <p className="text-[10px] font-black text-zinc-400 uppercase mb-4 tracking-widest">Puntos Fotocivicas</p>
                <h3 className="text-5xl font-black text-emerald-600 mb-2">08/10</h3>
                <p className="text-[10px] font-bold text-emerald-500 uppercase">Estatus: Conductor Responsable</p>
              </div>

              {/* Verificacion Vehicular */}
              <div className="bg-white p-6 rounded-2xl border border-zinc-100 shadow-sm">
                <p className="text-[10px] font-black text-zinc-400 uppercase mb-4 tracking-widest">Verificacion Vehicular</p>
                <h3 style={{ color: colors.accent }} className="text-2xl font-black mb-2 uppercase">Holograma 0</h3>
                <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-tighter">Vigente hasta: Oct 2024</p>
              </div>
            </div>

            {/* Tabla de Historial Reciente */}
            <div className="bg-white rounded-3xl border border-zinc-100 shadow-sm overflow-hidden">
              <div className="p-6 border-b border-zinc-50">
                <h3 className="text-sm font-black text-zinc-800 uppercase tracking-tight">Historial Reciente</h3>
              </div>
              
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-zinc-50/50 text-zinc-400 text-[10px] font-black uppercase tracking-widest">
                      <th className="px-8 py-4">Folio</th>
                      <th className="px-8 py-4">Fecha</th>
                      <th className="px-8 py-4">Infraccion</th>
                      <th className="px-8 py-4">Monto / Penalidad</th>
                      <th className="px-8 py-4 text-center">Acciones</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-50">
                    <tr className="hover:bg-zinc-50/30 transition-colors">
                      <td className="px-8 py-6 text-xs font-bold text-zinc-500 tracking-tighter">INV-2024-001</td>
                      <td className="px-8 py-6 text-xs font-bold text-zinc-800">24/05/2024</td>
                      <td className="px-8 py-6 text-xs font-bold text-zinc-500">Exceso de velocidad (Radar)</td>
                      <td className="px-8 py-6 text-xs font-black text-rose-700">$1,085.00 MXN</td>
                      <td className="px-8 py-6">
                        <div className="flex items-center justify-center gap-2">
                          <button style={{ backgroundColor: colors.primary }} className="px-4 py-2 rounded-lg text-white text-[10px] font-black uppercase tracking-widest shadow-md active:scale-95 transition-all">
                            Pagar
                          </button>
                          <button className="px-4 py-2 rounded-lg border border-rose-900 text-rose-900 text-[10px] font-black uppercase tracking-widest hover:bg-rose-50 transition-all">
                            Detalles
                          </button>
                        </div>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

          </div>
        </div>
      </main>

    </div>
  );
};

export default CitizenDashboardView;