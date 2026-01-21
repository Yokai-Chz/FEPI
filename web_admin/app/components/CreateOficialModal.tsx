'use client';
import { useState } from 'react';
import { X, Save, Loader2, Eye, EyeOff } from 'lucide-react';
import { OficialesService } from '../../src/services/oficiales.service';

interface CreateOficialModalProps {
  onClose: () => void;
  onSuccess: () => void;
}

export default function CreateOficialModal({ onClose, onSuccess }: CreateOficialModalProps) {
  // Estado local granular para captura
  const [form, setForm] = useState({
    placa: '',
    nombres: '',
    paterno: '',
    materno: '',
    curp: '',
    rfc: '',
    sector: '',
    password: ''
  });

  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    // Validaciones básicas
    if (!form.placa || !form.nombres || !form.paterno || !form.sector || !form.curp || !form.rfc || !form.password) {
      setError('Todos los campos marcados con * son obligatorios.');
      setIsLoading(false);
      return;
    }

    // Validación formato RFC/CURP básica (longitud)
    if (form.curp.length < 18) {
      setError('El CURP debe tener 18 caracteres.');
      setIsLoading(false);
      return;
    }
    if (form.rfc.length < 13) {
      setError('El RFC debe tener 13 caracteres.');
      setIsLoading(false);
      return;
    }

    if (form.password.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres.');
      setIsLoading(false);
      return;
    }

    // Construir DTO
    const payload = {
      placa: form.placa.toUpperCase(),
      nombres: form.nombres.toUpperCase(),
      paterno: form.paterno.toUpperCase(),
      materno: form.materno.toUpperCase(),
      sector: form.sector.toUpperCase(),
      curp: form.curp.toUpperCase(),
      rfc: form.rfc.toUpperCase(),
      password: form.password
    };

    try {
      const success = await OficialesService.create(payload);
      if (success) {
        onSuccess();
        onClose();
      } else {
        setError('Error al registrar. Verifique que la placa o CURP no estén duplicados.');
      }
    } catch (err) {
      setError('Ocurrió un error de conexión.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-white w-full max-w-2xl rounded-[32px] shadow-2xl border border-gray-100 overflow-hidden animate-in fade-in zoom-in duration-200 flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="bg-[#691C32] p-6 flex justify-between items-center shrink-0">
          <div>
             <h3 className="text-white font-black text-lg uppercase tracking-widest">Alta de Oficial</h3>
             <p className="text-white/60 text-[10px] uppercase tracking-wider font-bold">Registro de nuevo personal operativo</p>
          </div>
          <button onClick={onClose} className="text-white/70 hover:text-white transition-colors">
            <X size={24} />
          </button>
        </div>

        {/* Body - Scrollable */}
        <div className="overflow-y-auto p-8">
            <form id="create-oficial-form" onSubmit={handleSubmit} className="space-y-6">
            {error && (
                <div className="bg-red-50 text-red-600 text-xs font-bold p-3 rounded-xl border border-red-100 mb-4">
                {error}
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Placa y Sector */}
                <div className="space-y-2">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">
                    Placa / ID Oficial *
                    </label>
                    <input
                    name="placa"
                    value={form.placa}
                    onChange={handleChange}
                    placeholder="Ej. 839210"
                    className="w-full px-4 py-3 bg-gray-50 border-none rounded-xl text-sm font-bold text-gray-800 focus:ring-2 focus:ring-[#BC955C] outline-none transition-all uppercase"
                    autoFocus
                    />
                </div>
                <div className="space-y-2">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">
                    Sector / Adscripción *
                    </label>
                    <input
                    name="sector"
                    value={form.sector}
                    onChange={handleChange}
                    placeholder="Ej. Sector 53 'Oasis'"
                    className="w-full px-4 py-3 bg-gray-50 border-none rounded-xl text-sm font-medium text-gray-800 focus:ring-2 focus:ring-[#BC955C] outline-none transition-all uppercase"
                    />
                </div>

                {/* Datos Personales */}
                <div className="md:col-span-2 border-t border-gray-100 pt-4">
                    <p className="text-[#691C32] text-xs font-black uppercase tracking-widest mb-4">Datos Personales</p>
                </div>

                <div className="space-y-2 md:col-span-2">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">
                    Nombre(s) *
                    </label>
                    <input
                    name="nombres"
                    value={form.nombres}
                    onChange={handleChange}
                    placeholder="Ej. Juan Carlos"
                    className="w-full px-4 py-3 bg-gray-50 border-none rounded-xl text-sm font-medium text-gray-800 focus:ring-2 focus:ring-[#BC955C] outline-none transition-all uppercase"
                    />
                </div>

                <div className="space-y-2">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">
                    Apellido Paterno *
                    </label>
                    <input
                    name="paterno"
                    value={form.paterno}
                    onChange={handleChange}
                    placeholder="Ej. Pérez"
                    className="w-full px-4 py-3 bg-gray-50 border-none rounded-xl text-sm font-medium text-gray-800 focus:ring-2 focus:ring-[#BC955C] outline-none transition-all uppercase"
                    />
                </div>

                <div className="space-y-2">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">
                    Apellido Materno
                    </label>
                    <input
                    name="materno"
                    value={form.materno}
                    onChange={handleChange}
                    placeholder="Ej. López"
                    className="w-full px-4 py-3 bg-gray-50 border-none rounded-xl text-sm font-medium text-gray-800 focus:ring-2 focus:ring-[#BC955C] outline-none transition-all uppercase"
                    />
                </div>

                {/* Identificación */}
                <div className="space-y-2">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">
                    CURP *
                    </label>
                    <input
                    name="curp"
                    value={form.curp}
                    onChange={handleChange}
                    maxLength={18}
                    placeholder="18 caracteres"
                    className="w-full px-4 py-3 bg-gray-50 border-none rounded-xl text-sm font-medium text-gray-800 focus:ring-2 focus:ring-[#BC955C] outline-none transition-all uppercase tracking-wide"
                    />
                </div>

                <div className="space-y-2">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">
                    RFC *
                    </label>
                    <input
                    name="rfc"
                    value={form.rfc}
                    onChange={handleChange}
                    maxLength={13}
                    placeholder="13 caracteres"
                    className="w-full px-4 py-3 bg-gray-50 border-none rounded-xl text-sm font-medium text-gray-800 focus:ring-2 focus:ring-[#BC955C] outline-none transition-all uppercase tracking-wide"
                    />
                </div>

                {/* Seguridad */}
                <div className="md:col-span-2 border-t border-gray-100 pt-4">
                    <p className="text-[#691C32] text-xs font-black uppercase tracking-widest mb-4">Seguridad de Acceso</p>
                </div>

                <div className="space-y-2 md:col-span-2">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">
                    Contraseña Inicial *
                    </label>
                    <div className="relative">
                      <input
                        name="password"
                        type={showPassword ? "text" : "password"}
                        value={form.password}
                        onChange={handleChange}
                        placeholder="Mínimo 6 caracteres"
                        className="w-full px-4 py-3 bg-gray-50 border-none rounded-xl text-sm font-medium text-gray-800 focus:ring-2 focus:ring-[#BC955C] outline-none transition-all"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      >
                        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                      </button>
                    </div>
                    <p className="text-[10px] text-gray-400 italic ml-1">El oficial deberá cambiar esta contraseña en su primer inicio de sesión.</p>
                </div>
            </div>
            </form>
        </div>

        {/* Footer actions */}
        <div className="p-6 border-t border-gray-100 bg-gray-50/50 shrink-0 flex gap-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-4 text-gray-400 font-black text-xs uppercase tracking-widest hover:text-gray-600 transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              form="create-oficial-form"
              disabled={isLoading}
              className="flex-1 bg-[#BC955C] text-white py-4 rounded-xl font-black text-xs uppercase tracking-widest hover:bg-[#a37f4a] transition-all flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed shadow-lg shadow-[#BC955C]/20"
            >
              {isLoading ? <Loader2 className="animate-spin" size={16} /> : <Save size={16} />}
              Guardar Registro
            </button>
        </div>
      </div>
    </div>
  );
}
