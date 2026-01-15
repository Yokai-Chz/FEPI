'use client';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

export default function LoginPage() {
  const router = useRouter();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault(); 
    // Lógica backend
    router.push('/dashboard');
  };

  return (
    <div className="min-h-screen bg-[#f0f0f0] flex flex-col font-sans text-gray-800">
      
      {/* Header */}
      <header className="p-4 bg-white border-b border-gray-200 flex items-center justify-start gap-6 px-10">
        <div className="flex items-center gap-3 border-r pr-6 border-gray-300">
          <Image src="/logo_gobierno.png" alt="Gobierno" width={45} height={45} />
          <span className="text-[#691C32] font-bold text-[11px] leading-tight uppercase">
            Gobierno de la <br/> Ciudad de México
          </span>
        </div>
        <div className="flex items-center gap-3">
          <Image src="/logo_ssc.png" alt="SSC" width={40} height={40} />
          <span className="text-gray-500 text-[10px] font-bold tracking-widest uppercase">
            Secretaría de Seguridad Ciudadana
          </span>
        </div>
      </header>

      {/* Card Login */}
      <main className="flex-1 flex items-center justify-center p-6">
        <div className="bg-white rounded-[40px] shadow-2xl flex overflow-hidden max-w-[950px] w-full min-h-[580px]">
          <div className="w-[35%] bg-[#691C32] p-12 flex flex-col justify-between relative text-white">
            <div className="bg-white/10 w-14 h-14 rounded-2xl flex items-center justify-center border border-white/20">
              <span className="text-3xl font-light">+</span>
            </div>
            
            <div>
              <h1 className="text-5xl font-bold tracking-tighter mb-2">SSC</h1>
              <p className="text-[10px] font-bold opacity-60 uppercase tracking-[0.3em]">
                Control Administrativo
              </p>
            </div>
            <div className="w-12 h-1.5 bg-[#BC955C] rounded-full" />
          </div>

          {/* Formulario */}
          <div className="flex-1 p-20 flex flex-col justify-center">
            <div className="mb-10 text-left">
              <h2 className="text-4xl font-extrabold text-gray-800 mb-2 tracking-tight">Iniciar Sesión</h2>
              <p className="text-gray-400 text-[11px] font-bold uppercase tracking-[0.15em]">
                Panel de gestión centralizada SCC
              </p>
            </div>

            <form onSubmit={handleLogin} className="space-y-6">
              <div>
                <label className="block text-[10px] font-black text-[#691C32] uppercase tracking-widest mb-2">
                  Usuario Gubernamental
                </label>
                <input 
                  required
                  type="text" 
                  placeholder="usuario_admin"
                  className="w-full px-5 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:outline-none focus:border-[#BC955C] transition-all outline-none"
                />
              </div>

              <div>
                <label className="block text-[10px] font-black text-[#691C32] uppercase tracking-widest mb-2">
                  Clave de Acceso (NIP)
                </label>
                <input 
                  required
                  type="password" 
                  placeholder="••••••••••••"
                  className="w-full px-5 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:outline-none focus:border-[#BC955C] transition-all outline-none"
                />
              </div>

              <button 
                type="submit" 
                className="w-full bg-[#691C32] hover:bg-[#4d1425] text-white font-bold py-4 rounded-2xl text-[11px] uppercase tracking-[0.2em] transition-all shadow-xl mt-4"
              >
                Ingresar al Panel
              </button>
            </form>

            <button className="text-center mt-6 text-[10px] text-[#BC955C] font-black uppercase tracking-widest hover:underline">
              ¿Olvidó su contraseña?
            </button>

            <div className="mt-12 bg-red-50 py-3 rounded-2xl border border-red-100">
              <p className="text-center text-[9px] text-red-500 font-black uppercase tracking-widest">
                Sistema monitoreado por asuntos internos
              </p>
            </div>
          </div>
        </div>
      </main>

      <footer className="p-8 text-center">
        <p className="text-[10px] text-gray-400 font-bold tracking-[0.2em] uppercase">
          v2.1.0-Admin | Subsecretaría de Control de Tránsito | CDMX 2026
        </p>
      </footer>
    </div>
  );
}