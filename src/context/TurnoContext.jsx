import { createContext, useContext, useState, useEffect } from 'react';

const TurnoContext = createContext();

export const TurnoProvider = ({ children }) => {
  // Inicializa con el valor guardado o 'mañana' por defecto
  const [turno, setTurno] = useState(() => {
    return localStorage.getItem('turno_activo') || 'mañana';
  });

  // Cada vez que el turno cambia, actualiza el DOM y el LocalStorage
  useEffect(() => {
    document.body.setAttribute('data-theme', turno);
    localStorage.setItem('turno_activo', turno);
  }, [turno]);

  return (
    <TurnoContext.Provider value={{ turno, setTurno }}>
      {children}
    </TurnoContext.Provider>
  );
};

export const useTurno = () => useContext(TurnoContext);