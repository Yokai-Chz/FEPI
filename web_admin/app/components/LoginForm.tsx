export default function LoginForm() {
  return (
    <form className="space-y-6">
      <div>
        <label className="block text-[10px] font-bold text-gobVino uppercase tracking-wider mb-2">
          Usuario Gubernamental
        </label>
        <div className="relative">
          <span className="absolute inset-y-0 left-4 flex items-center text-gobDorado opacity-50">○</span>
          <input 
            type="text" 
            placeholder="usuario_admin"
            className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-gobDorado/20 transition-all"
          />
        </div>
      </div>

      <div>
        <label className="block text-[10px] font-bold text-gobVino uppercase tracking-wider mb-2">
          Clave de Acceso (NIP)
        </label>
        <div className="relative">
          <span className="absolute inset-y-0 left-4 flex items-center text-gobDorado opacity-50">□</span>
          <input 
            type="password" 
            placeholder="••••••••••••"
            className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-gobDorado/20 transition-all"
          />
        </div>
      </div>

      <button className="w-full bg-gobVino hover:bg-opacity-95 text-white font-bold py-3.5 rounded-xl text-xs uppercase tracking-widest transition-all shadow-lg shadow-gobVino/20">
        Ingresar al Panel
      </button>
      
      <div className="text-center">
        <button type="button" className="text-[10px] text-gobDorado font-bold hover:underline">
          ¿Olvidó su contraseña?
        </button>
      </div>
    </form>
  );
}