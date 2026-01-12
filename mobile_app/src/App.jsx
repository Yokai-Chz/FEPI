import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// Importación de todas tus vistas
import MainDashboardView from './vista/MainDashboardView';
import NuevaInfraccionView from './vista/NuevaInfraccionView';
import EvidenceCaptureView from './vista/EvidenceCaptureView';
import DetallesVehiculoView from './vista/DetallesVehiculoView';
import TowRequestView from './vista/TowRequestView';
import ParquimetroView from './vista/ParquimetroView';
import LoginView from './vista/LoginView';

export default function App() {
  return (
    <Router>
      <Routes>
        {/* Pantalla inicial (Login) */}
        <Route path="/" element={<LoginView />} />
        
        {/* Panel Principal */}
        <Route path="/dashboard" element={<MainDashboardView />} />
        
        {/* Flujo de Infracción y Grúa */}
        <Route path="/nueva-infraccion" element={<NuevaInfraccionView />} />
        <Route path="/evidencia" element={<EvidenceCaptureView />} />
        <Route path="/detalles" element={<DetallesVehiculoView />} />
        <Route path="/grua" element={<TowRequestView />} />
        
        {/* Consultas */}
        <Route path="/parquimetro" element={<ParquimetroView />} />
      </Routes>
    </Router>
  );
}