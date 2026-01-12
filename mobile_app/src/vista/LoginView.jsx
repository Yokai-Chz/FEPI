import React from 'react';
import { useNavigate } from 'react-router-dom';
import logo_gobierno from "../assets/logo_gobierno.png"
import logo_ssc from "../assets/logo_ssc.png"
import icon_user from "../assets/icon_user.png"
import icon_candado from "../assets/icon_candado.png"
import icon_ojo from "../assets/icon_ojo.png"

export default function LoginView() {
  const navigate = useNavigate(); 

  const manejarLogin = () => {
    // validaciones de usuario/contraseña 
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen bg-[#691C32] flex flex-col font-sans text-white">
      {/* Header */}
      <div className="p-6 flex justify-between items-start">
        <div className="flex flex-col items-center">
          <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center mb-1 overflow-hidden">
            <img 
                src={logo_gobierno} 
                alt="Logo Gobierno" 
                className="w-10 h-10 object-contain" 
            />
          </div>
          <span className="text-[9px] font-bold uppercase text-center">Gobierno CDMX</span>
        </div>
        <div className="flex flex-col items-center">
          <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center mb-1 overflow-hidden">
            <img 
                src={logo_ssc} 
                alt="Logo ssc" 
                className="w-10 h-10 object-contain" 
            />
          </div>
          <span className="text-[9px] font-bold uppercase text-center leading-3">Secretaría de<br/>Seguridad Ciudadana</span>
        </div>
      </div>

      {/* Titulo Central */}
      <div className="text-center mt-4 mb-10">
        <h1 className="text-4xl font-bold tracking-[0.2em]">SCC</h1>
        <p className="text-[10px] opacity-80 uppercase tracking-widest mt-1">Control de Tránsito</p>
      </div>

      {/* Tarjeta Blanca */}
      <div className="flex-1 bg-white rounded-t-[45px] px-8 pt-12 pb-6 shadow-2xl overflow-y-auto">
        <div className="max-w-md mx-auto">
          <h2 className="text-2xl font-bold text-gray-800 mb-1">Bienvenido</h2>
          <p className="text-gray-400 text-sm mb-10">Ingrese sus credenciales de oficial</p>

          <form className="space-y-6">
            <div>
              <label className="text-[#691C32] text-[10px] font-black uppercase mb-2 block tracking-wider">Número de Placa / ID</label>
              <div className="flex items-center bg-gray-50 border border-gray-100 rounded-2xl px-4 py-4 shadow-sm">
                <div className="w-6 h-6 mr-3 flex items-center justify-center">
                  <img 
                      src={icon_user} 
                      alt="Logo usuario" 
                      className="w-full h-full object-contain opacity-40" 
                  />
                </div>
                <input 
                  type="text" 
                  placeholder="982734" 
                  className="bg-transparent w-full text-gray-700 outline-none font-bold" 
                />
              </div>
            </div>

            <div>
              <label className="text-[#691C32] text-[10px] font-black uppercase mb-2 block tracking-wider">Contraseña (NIP)</label>
              <div className="flex items-center bg-gray-50 border border-gray-100 rounded-2xl px-4 py-4 shadow-sm">
                <div className="w-6 h-6 mr-3 flex items-center justify-center">
                  <img 
                        src={icon_candado} 
                        alt="Logo candado" 
                        className="w-5 h-5 object-contain opacity-40" 
                    />
                </div>
                <input 
                  type="password" 
                  placeholder="••••••••" 
                  className="bg-transparent w-full text-gray-700 outline-none font-bold" 
                />
                <button type="button" className="opacity-40 hover:opacity-100 transition-opacity">
                    <img 
                        src={icon_ojo} 
                        alt="Ver contraseña" 
                        className="w-6 h-6 object-contain" 
                    />
                </button>
              </div>
            </div>

            {/* Botón */}
            <button 
              type="button" 
              onClick={manejarLogin}
              className="w-full bg-[#691C32] hover:bg-[#4d1425] text-white font-bold py-5 rounded-3xl mt-6 shadow-xl active:scale-95 transition-all uppercase tracking-widest text-xs"
            >
              Iniciar Turno
            </button>
          </form>

          <p className="text-center mt-12 mb-6">
            <a href="#" className="text-[#BC955C] text-[10px] font-bold uppercase">
              ¿Olvidó sus credenciales? Contacte a Mesa de Control
            </a>
          </p>
        </div>
      </div>

      {/* Footer */}
      <div className="bg-white pb-6 text-center pt-2">
          <p className="text-[9px] text-gray-300 font-bold uppercase tracking-tighter">Secretaría de Seguridad Ciudadana</p>
          <div className="w-12 h-1 bg-gray-100 mx-auto mt-3 rounded-full"></div>
      </div>
    </div>
  );
}