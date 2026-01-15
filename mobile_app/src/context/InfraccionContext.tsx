import React, { createContext, useContext, useState } from 'react';

interface InfraccionContextType {
  fotos: Record<string, string | null>;
  setFoto: (categoria: string, uri: string | null) => void;
  resetFotos: () => void;
}

const InfraccionContext = createContext<InfraccionContextType>({} as InfraccionContextType);

export function InfraccionProvider({ children }: { children: React.ReactNode }) {
  const [fotos, setFotos] = useState<Record<string, string | null>>({
    placa: null,
    infraccion: null,
    frente: null,
    posterior: null
  });

  const setFoto = (categoria: string, uri: string | null) => {
    setFotos(prev => ({ ...prev, [categoria]: uri }));
  };

  const resetFotos = () => {
    setFotos({
      placa: null,
      infraccion: null,
      frente: null,
      posterior: null
    });
  };

  return (
    <InfraccionContext.Provider value={{ fotos, setFoto, resetFotos }}>
      {children}
    </InfraccionContext.Provider>
  );
}

export const useInfraccion = () => useContext(InfraccionContext);
