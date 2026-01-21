'use client';
import { useState } from 'react';
import { X, Save, Loader2 } from 'lucide-react';
import { OficialesService } from '../../src/services/oficiales.service';
import { Oficial } from '../../src/services/dashboard.service';

interface EditOficialModalProps {
  oficial: Oficial;
  onClose: () => void;
  onSuccess: () => void;
}

export default function EditOficialModal({ oficial, onClose, onSuccess }: EditOficialModalProps) {
  const [form, setForm] = useState({
    nombres: oficial.nombres || '',
    paterno: oficial.paterno || '',
    materno: oficial.materno || '',
    sector: oficial.sector,
    curp: oficial.curp || '',
    rfc: oficial.rfc || ''
  });

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    if (!form.nombres || !form.paterno || !form.sector) {
      setError('Nombre, Apellido Paterno y Sector son obligatorios.');
      setIsLoading(false);
      return;
    }

    try {
      const success = await OficialesService.update(oficial.id, {
        nombres: form.nombres.toUpperCase(),
        paterno: form.paterno.toUpperCase(),
        materno: form.materno.toUpperCase(),
        sector: form.sector.toUpperCase(),
        curp: form.curp.toUpperCase(),
        rfc: form.rfc.toUpperCase()
      });

      if (success) {
        onSuccess();
        onClose();
      } else {
        setError('No se pudo actualizar la información del oficial.');
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
        <div className="bg-gray-800 p-6 flex justify-between items-center shrink-0">
          <div>
             <h3 className="text-white font-black text-lg uppercase tracking-widest">Editar Oficial</h3>
             <p className="text-white/60 text-[10px] uppercase tracking-wider font-bold">Placa: {oficial.placa}</p>
          </div>
          <button onClick={onClose} className="text-white/70 hover:text-white transition-colors">
            <X size={24} />
          </button>
        </div>

        {/* Body */}
        <div className="overflow-y-auto p-8">
            <form id="edit-oficial-form" onSubmit={handleSubmit} className="space-y-6">
                {error && (
                    <div className="bg-red-50 text-red-600 text-xs font-bold p-3 rounded-xl border border-red-100 mb-4">
                    {error}
                    </div>
                )}

                 <div className="space-y-2">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">
                    Sector / Adscripción *
                    </label>
                    <input
                    name="sector"
                    value={form.sector}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-gray-50 border-none rounded-xl text-sm font-medium text-gray-800 focus:ring-2 focus:ring-[#BC955C] outline-none transition-all uppercase"
                    />
                </div>

                {/* Datos Personales */}
                <div className="md:col-span-2 border-t border-gray-100 pt-4">
                    <p className="text-[#691C32] text-xs font-black uppercase tracking-widest mb-4">Datos Personales</p>
                </div>

                <div className="space-y-2">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">
                    Nombre(s) *
                    </label>
                    <input
                    name="nombres"
                    value={form.nombres}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-gray-50 border-none rounded-xl text-sm font-bold text-gray-800 focus:ring-2 focus:ring-[#BC955C] outline-none transition-all uppercase"
                    />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">
                        Apellido Paterno *
                        </label>
                        <input
                        name="paterno"
                        value={form.paterno}
                        onChange={handleChange}
                        className="w-full px-4 py-3 bg-gray-50 border-none rounded-xl text-sm font-bold text-gray-800 focus:ring-2 focus:ring-[#BC955C] outline-none transition-all uppercase"
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
                        className="w-full px-4 py-3 bg-gray-50 border-none rounded-xl text-sm font-bold text-gray-800 focus:ring-2 focus:ring-[#BC955C] outline-none transition-all uppercase"
                        />
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">
                        CURP
                        </label>
                        <input
                        name="curp"
                        value={form.curp}
                        onChange={handleChange}
                        maxLength={18}
                        className="w-full px-4 py-3 bg-gray-50 border-none rounded-xl text-sm font-medium text-gray-800 focus:ring-2 focus:ring-[#BC955C] outline-none transition-all uppercase"
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">
                        RFC
                        </label>
                        <input
                        name="rfc"
                        value={form.rfc}
                        onChange={handleChange}
                        maxLength={13}
                        className="w-full px-4 py-3 bg-gray-50 border-none rounded-xl text-sm font-medium text-gray-800 focus:ring-2 focus:ring-[#BC955C] outline-none transition-all uppercase"
                        />
                    </div>
                </div>
            </form>
        </div>

        {/* Footer actions */}
        <div className="p-6 border-t border-gray-100 bg-gray-50/50 flex gap-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-4 text-gray-400 font-black text-xs uppercase tracking-widest hover:text-gray-600 transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              form="edit-oficial-form"
              disabled={isLoading}
              className="flex-1 bg-[#691C32] text-white py-4 rounded-xl font-black text-xs uppercase tracking-widest hover:bg-[#4d1425] transition-all flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed shadow-lg"
            >
              {isLoading ? <Loader2 className="animate-spin" size={16} /> : <Save size={16} />}
              Actualizar Datos
            </button>
        </div>
      </div>
    </div>
  );
}