'use client';
import Image from 'next/image';

export default function Navbar() {
  return (
    <header className="bg-white h-20 border-b border-gray-200 flex items-center justify-between px-10 shrink-0">
      <div className="flex items-center gap-6">
        <Image src="/logo_gobierno.png" alt="Gob" width={45} height={45} />
        <div className="h-10 w-[1px] bg-gray-200" />
        <span className="text-[11px] font-black text-gray-400 uppercase tracking-widest">
          Secretaría de Seguridad Ciudadana
        </span>
      </div>
      <div className="flex items-center gap-4">
        <div className="text-right">
          <p className="text-xs font-black text-gray-800 uppercase">Samuel Patiño</p>
          <p className="text-[9px] text-[#BC955C] font-bold uppercase tracking-widest">Administrador Central</p>
        </div>
        <div className="w-10 h-10 bg-[#BC955C] rounded-full flex items-center justify-center text-white font-bold shadow-lg">
          SP
        </div>
      </div>
    </header>
  );
}
