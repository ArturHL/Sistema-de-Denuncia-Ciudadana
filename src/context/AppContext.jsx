import { createContext, useState, useContext } from 'react';
import { mockDenuncias } from '../data/mockData';

const AppContext = createContext();

export function AppProvider({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [denuncias, setDenuncias] = useState(mockDenuncias);
  const [modalAbierto, setModalAbierto] = useState(false);
  const [folioGenerado, setFolioGenerado] = useState('');

  const generarFolio = () => {
    const año = new Date().getFullYear();
    const numero = String(denuncias.length + 1).padStart(5, '0');
    return `DEN-${año}-${numero}`;
  };

  const handleLogin = () => {
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
  };

  const agregarDenuncia = (nuevaDenuncia) => {
    const folio = generarFolio();
    const denunciaCompleta = {
      ...nuevaDenuncia,
      id: denuncias.length + 1,
      folio: folio,
      estado: 'Pendiente',
      fechaRegistro: new Date().toISOString()
    };

    setDenuncias([denunciaCompleta, ...denuncias]);
    setFolioGenerado(folio);
    setModalAbierto(true);
  };

  const cerrarModal = () => {
    setModalAbierto(false);
  };

  const value = {
    isAuthenticated,
    denuncias,
    modalAbierto,
    folioGenerado,
    handleLogin,
    handleLogout,
    agregarDenuncia,
    cerrarModal
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within AppProvider');
  }
  return context;
}
