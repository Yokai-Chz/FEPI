'use client';
import { Folio, FolioHistory, DashboardService } from '../../src/services/dashboard.service';
import { X, Calendar, User, MapPin, Edit2, AlertTriangle, Download, Trash2, ShieldCheck, History } from 'lucide-react';
import { useEffect, useState } from 'react';

interface FolioDetailModalProps {
  folio: Folio | null;
  onClose: () => void;
}

export default function FolioDetailModal({ folio, onClose }: FolioDetailModalProps) {
  const [currentFolio, setCurrentFolio] = useState<Folio | null>(folio);
  const [history, setHistory] = useState<FolioHistory[]>([]);
  const [isEditingPlaca, setIsEditingPlaca] = useState(false);
  const [newPlaca, setNewPlaca] = useState(folio?.placa || '');

  useEffect(() => {
    if (folio) {
      setCurrentFolio(folio);
      setNewPlaca(folio.placa);
      fetchHistory(folio.id);
    }
  }, [folio]);

  const fetchHistory = async (folioId: string) => {
    const fetchedHistory = await DashboardService.getFolioHistory(folioId);
    setHistory(fetchedHistory);
  };

  if (!currentFolio) return null;

  // --- HU007: Modificación de infracciones ---
  const handleCorregirPlaca = async () => {
    if (!isEditingPlaca) {
      setIsEditingPlaca(true);
      return;
    }
    // Lógica para guardar la nueva placa
    if (newPlaca.trim() === '' || newPlaca === currentFolio.placa) {
      alert('La placa no puede estar vacía o ser la misma.');
      return;
    }

    if (confirm(`¿Está seguro de corregir la placa de "${currentFolio.placa}" a "${newPlaca}"?`)) {
      const success = await DashboardService.corregirPlaca(currentFolio.id, newPlaca);
      if (success) {
        alert('Placa corregida exitosamente.');
        setCurrentFolio(prev => prev ? { ...prev, placa: newPlaca } : null);
        setIsEditingPlaca(false);
        fetchHistory(currentFolio.id); // Recargar historial
      } else {
        alert('Error al corregir la placa.');
      }
    }
  };

  const handleAnularInfraccion = async () => {
    const motivo = prompt('Por favor, ingrese el motivo para anular esta infracción:');
    if (motivo && motivo.trim() !== '') {
      if (confirm(`¿Está seguro de anular la infracción ${currentFolio.folio} por el motivo: "${motivo}"?`)) {
        const success = await DashboardService.anularFolio(currentFolio.id, motivo);
        if (success) {
          alert('Infracción anulada exitosamente.');
          setCurrentFolio(prev => prev ? { ...prev, estatusPago: 'IMPUGNADA' } : null); // Actualizar estatus
          fetchHistory(currentFolio.id); // Recargar historial
        } else {
          alert('Error al anular la infracción.');
        }
      }
    } else if (motivo !== null) { // Si el usuario no cancela pero deja vacío
      alert('El motivo para anular la infracción es obligatorio.');
    }
  };

  // --- HU009: Generación de carpeta de evidencias ---
  const handleExportarCarpeta = async () => {
    if (confirm(`¿Desea exportar la carpeta de evidencias para el folio ${currentFolio.folio}?`)) {
      await DashboardService.exportEvidence(currentFolio.id);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-white w-full max-w-4xl h-[90vh] rounded-[32px] flex flex-col shadow-2xl" onClick={(e) => e.stopPropagation()}>
        
        {/* Header */}
        <header className="p-6 border-b border-gray-100 flex justify-between items-center">
          <div>
            <h2 className="text-xl font-black text-[#691C32] tracking-tight">Detalles del Folio: {currentFolio.folio}</h2>
            {isEditingPlaca ? (
              <input 
                type="text" 
                value={newPlaca} 
                onChange={(e) => setNewPlaca(e.target.value)} 
                className="text-xs text-gray-700 font-bold uppercase tracking-widest border border-gray-300 rounded px-2 py-1 mt-1"
              />
            ) : (
              <p className="text-xs text-gray-400 font-bold uppercase tracking-widest">Placa: {currentFolio.placa}</p>
            )}
          </div>
          <button onClick={onClose} className="p-2 rounded-full hover:bg-gray-100 transition-colors">
            <X size={24} className="text-gray-500" />
          </button>
        </header>

        {/* Content */}
        <div className="flex-1 flex overflow-hidden">
          {/* Columna Principal */}
          <main className="flex-[2] p-8 overflow-y-auto">
            <div className="space-y-6">
              {/* Motivo y Monto */}
              <div>
                <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Motivo de la Infracción</h3>
                <p className="text-gray-700 font-medium">{currentFolio.motivo}</p>
                <p className="text-2xl font-bold text-[#691C32] mt-2">{currentFolio.monto}</p>
                <span className={`px-3 py-1 rounded-full font-black uppercase tracking-tighter text-xs mt-2 inline-block ${currentFolio.estatusPago === 'PENDIENTE' ? 'bg-orange-100 text-orange-600' : currentFolio.estatusPago === 'LIQUIDADA' ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>
                  Estatus: {currentFolio.estatusPago}
                </span>
              </div>

              {/* Información General */}
              <div className="grid grid-cols-2 gap-x-8 gap-y-4 text-sm">
                <div className="flex items-start gap-3">
                  <Calendar size={16} className="text-gray-400 mt-0.5" />
                  <div>
                    <p className="font-bold text-gray-600">Fecha y Hora</p>
                    <p className="text-gray-500">{currentFolio.fechaHora}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <User size={16} className="text-gray-400 mt-0.5" />
                  <div>
                    <p className="font-bold text-gray-600">Oficial</p>
                    <p className="text-gray-500">{currentFolio.oficialNombre} (ID: {currentFolio.oficialId})</p>
                  </div>
                </div>
                 <div className="flex items-start gap-3 col-span-2">
                  <MapPin size={16} className="text-gray-400 mt-0.5" />
                  <div>
                    <p className="font-bold text-gray-600">Ubicación</p>
                    <p className="text-gray-500">{currentFolio.ubicacion.direccion}</p>
                  </div>
                </div>
              </div>

              {/* Evidencias */}
              <div>
                <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">Evidencias Fotográficas ({currentFolio.evidenciaCount})</h3>
                <div className="grid grid-cols-3 gap-4">
                  {currentFolio.evidencias.map(ev => (
                    <img key={ev.id} src={ev.url} alt={`Evidencia ${ev.id}`} className="rounded-lg w-full h-32 object-cover" />
                  ))}
                </div>
              </div>
            </div>
          </main>

          {/* Columna Derecha (Acciones e Historial) */}
          <aside className="flex-1 bg-gray-50/70 border-l border-gray-100 p-6 flex flex-col gap-6 overflow-y-auto">
             {/* Acciones */}
            <div>
              <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">Acciones</h3>
              <div className="space-y-2">
                {isEditingPlaca ? (
                  <div className="flex gap-2">
                    <button 
                      onClick={handleCorregirPlaca}
                      className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-[#BC955C] text-white rounded-lg text-sm font-bold hover:bg-[#a68350] transition-colors"
                    >
                      <ShieldCheck size={16} /> Guardar
                    </button>
                    <button 
                      onClick={() => { setIsEditingPlaca(false); setNewPlaca(currentFolio.placa); }}
                      className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-gray-200 text-gray-700 rounded-lg text-sm font-bold hover:bg-gray-300 transition-colors"
                    >
                      <X size={16} /> Cancelar
                    </button>
                  </div>
                ) : (
                  <button 
                    onClick={() => setIsEditingPlaca(true)}
                    className="w-full flex items-center gap-3 px-4 py-3 bg-white border border-gray-200 rounded-lg text-sm font-bold text-gray-700 hover:bg-gray-100 transition-colors"
                  >
                    <Edit2 size={16} /> Corregir Placa
                  </button>
                )}
                 <button 
                    onClick={handleExportarCarpeta}
                    className="w-full flex items-center gap-3 px-4 py-3 bg-white border border-gray-200 rounded-lg text-sm font-bold text-gray-700 hover:bg-gray-100 transition-colors"
                >
                  <Download size={16} /> Exportar Carpeta
                </button>
                <button 
                  onClick={handleAnularInfraccion}
                  className="w-full flex items-center gap-3 px-4 py-3 bg-red-50 border border-red-100 rounded-lg text-sm font-bold text-red-600 hover:bg-red-100 transition-colors"
                >
                  <Trash2 size={16} /> Anular Infracción
                </button>
              </div>
            </div>

            {/* Historial (HU008) */}
            <div>
              <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">Historial de Cambios</h3>
              <div className="space-y-4 text-xs">
                {history.length > 0 ? history.map(h => (
                  <div key={h.id} className="flex items-start gap-3">
                    <div className="bg-gray-200 p-1.5 rounded-full mt-0.5">
                      <History size={12} className="text-gray-500" />
                    </div>
                    <div>
                      <p className="font-bold text-gray-600">{h.accion}</p>
                      <p className="text-gray-400">{h.usuario} - {h.fecha}</p>
                    </div>
                  </div>
                )) : <p className="text-gray-400">No hay historial disponible.</p>}
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}