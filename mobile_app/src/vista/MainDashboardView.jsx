import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Menu, Bell, User, 
  FileText, Truck, Camera, Clock, 
  Search, ShieldAlert, BookOpen 
} from 'lucide-react';

export default function MainDashboardView() {
  const navigate = useNavigate();
  
  // Colores Institucionales CDMX
  const gobVino = '#691C32';
  const gobDorado = '#BC955C';

  return (
    <div className="min-h-screen bg-gray-50 font-sans pb-24">
      {/* Header Superior con estilo en línea para garantizar el color */}
      <div 
        style={{ backgroundColor: gobVino }} 
        className="p-4 pt-8 flex justify-between items-center text-white shadow-lg"
      >
        <div className="flex items-center gap-3">
          <Menu size={24} />
          <div>
            <h1 className="text-[12px] font-black leading-none tracking-tight">TRÁNSITO CDMX</h1>
            <p className="text-[8px] opacity-80 uppercase font-bold">Secretaría de Seguridad Ciudadana</p>
          </div>
        </div>
        <Bell size={20} className="text-amber-400" />
      </div>

      <div className="p-5 space-y-6">
        
        {/* Perfil del Oficial */}
        <div className="flex items-center gap-4 py-2">
          <div className="w-14 h-14 rounded-full bg-gray-200 border-2 border-white shadow-sm flex items-center justify-center overflow-hidden">
            <User size={30} className="text-gray-400" />
          </div>
          <div>
            <h2 style={{ color: gobVino }} className="font-black text-lg">Hola, Oficial García</h2>
            <p className="text-gray-400 text-[10px] font-bold uppercase tracking-widest">ID: 4429 • SECTOR JUÁREZ</p>
          </div>
        </div>

        {/* Filtros Rápidos */}
        <div className="flex gap-2">
          <button style={{ backgroundColor: gobVino }} className="px-5 py-1.5 rounded-full text-[10px] font-black uppercase text-white shadow-md">
            General
          </button>
          <button className="px-5 py-1.5 rounded-full text-[10px] font-black uppercase bg-gray-100 text-gray-400">
            Operativo
          </button>
          <button className="px-5 py-1.5 rounded-full text-[10px] font-black uppercase bg-gray-100 text-gray-400">
            Vialidad
          </button>
        </div>

        {/* Status Sistema */}
        <div className="bg-emerald-50 border border-emerald-100 rounded-2xl p-3 flex items-center gap-3">
          <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
          <p className="text-emerald-700 text-[9px] font-black uppercase tracking-widest">Sistema Conectado (CDMX-HUB)</p>
        </div>

        {/* Servicios de Tránsito */}
        <div>
          <h3 style={{ color: gobVino }} className="font-black text-[11px] uppercase mb-4 ml-1 tracking-widest italic">
            Servicios de Tránsito
          </h3>
          <div className="grid grid-cols-3 gap-4">
            <button 
              onClick={() => navigate('/nueva-infraccion')} 
              className="bg-white p-4 rounded-3xl shadow-sm border border-gray-100 flex flex-col items-center gap-3 active:scale-95 transition-all"
            >
              <div style={{ backgroundColor: gobVino }} className="w-12 h-12 rounded-2xl flex items-center justify-center text-white shadow-inner">
                <FileText size={20} />
              </div>
              <span className="text-[9px] font-black text-gray-600 uppercase">Crear Multa</span>
            </button>

            <button 
              onClick={() => navigate('/detalles')} 
              className="bg-white p-4 rounded-3xl shadow-sm border border-gray-100 flex flex-col items-center gap-3 active:scale-95 transition-all"
            >
              <div className="w-12 h-12 rounded-2xl bg-emerald-500 flex items-center justify-center text-white shadow-inner">
                <Truck size={20} />
              </div>
              <span className="text-[9px] font-black text-gray-600 uppercase">Pedir Grúa</span>
            </button>

            <button 
              onClick={() => navigate('/evidencia')} 
              className="bg-white p-4 rounded-3xl shadow-sm border border-gray-100 flex flex-col items-center gap-3 active:scale-95 transition-all"
            >
              <div style={{ backgroundColor: gobDorado }} className="w-12 h-12 rounded-2xl flex items-center justify-center text-white shadow-inner">
                <Camera size={20} />
              </div>
              <span className="text-[9px] font-black text-gray-600 uppercase">Evidencias</span>
            </button>
          </div>
        </div>

        {/* Mis Atajos */}
        <div>
          <h3 style={{ color: gobVino }} className="font-black text-[11px] uppercase mb-4 ml-1 tracking-widest italic">
            Mis Atajos
          </h3>
          <div className="grid grid-cols-2 gap-3">
            <button 
              onClick={() => navigate('/parquimetro')} 
              className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-3 text-left active:bg-gray-50 transition-colors"
            >
              <div style={{ backgroundColor: `${gobDorado}20`, color: gobDorado }} className="w-8 h-8 rounded-lg flex items-center justify-center">
                <Clock size={16} />
              </div>
              <div>
                <p className="text-[10px] font-black text-gray-800 uppercase leading-none">Parquímetro</p>
                <p className="text-[8px] text-gray-400 font-bold mt-1">Consultar Tiempo</p>
              </div>
            </button>
            
            <button className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-3 text-left opacity-60">
              <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center text-blue-500">
                <Search size={16} />
              </div>
              <div>
                <p className="text-[10px] font-black text-gray-800 uppercase leading-none">Adeudos</p>
                <p className="text-[8px] text-gray-400 font-bold mt-1">Estatus Historial</p>
              </div>
            </button>

            <button className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-3 text-left opacity-60">
              <div className="w-8 h-8 rounded-lg bg-rose-50 flex items-center justify-center text-rose-500">
                <ShieldAlert size={16} />
              </div>
              <div>
                <p className="text-[10px] font-black text-gray-800 uppercase leading-none">Robo</p>
                <p className="text-[8px] text-gray-400 font-bold mt-1">Verificación SSC</p>
              </div>
            </button>

            <button className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-3 text-left opacity-60">
              <div className="w-8 h-8 rounded-lg bg-gray-50 flex items-center justify-center text-gray-600">
                <BookOpen size={16} />
              </div>
              <div>
                <p className="text-[10px] font-black text-gray-800 uppercase leading-none">Reglamento</p>
                <p className="text-[8px] text-gray-400 font-bold mt-1">Artículos</p>
              </div>
            </button>
          </div>
        </div>
      </div>

      {/* Tab Bar Inferior (Fijo) */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 px-8 py-4 flex justify-between items-center z-50">
        <div style={{ color: gobVino }} className="flex flex-col items-center gap-1">
          <div style={{ backgroundColor: `${gobVino}15` }} className="px-4 py-1 rounded-full"><Clock size={18} /></div>
          <span className="text-[9px] font-black uppercase">Inicio</span>
        </div>
        <div className="flex flex-col items-center gap-1 text-gray-300">
          <FileText size={18} />
          <span className="text-[9px] font-black uppercase">Servicios</span>
        </div>
        <div className="flex flex-col items-center gap-1 text-gray-300">
          <BookOpen size={18} />
          <span className="text-[9px] font-black uppercase">Folios</span>
        </div>
        <div className="flex flex-col items-center gap-1 text-gray-300">
          <User size={18} />
          <span className="text-[9px] font-black uppercase">Perfil</span>
        </div>
      </div>
    </div>
  );
}