import { createContext, useContext, useState, useCallback } from 'react';

const SnackbarContext = createContext();

export const SnackbarProvider = ({ children }) => {
  const [snackbar, setSnackbar] = useState({ isOpen: false, message: '', type: 'success' });

  const showSnackbar = useCallback((message, type = 'success') => {
    setSnackbar({ isOpen: true, message, type });
    // Se oculta automáticamente después de 3 segundos
    setTimeout(() => {
      setSnackbar((prev) => ({ ...prev, isOpen: false }));
    }, 3000);
  }, []);

  return (
    <SnackbarContext.Provider value={{ showSnackbar }}>
      {children}
      
      {snackbar.isOpen && (
        <div className="snackbar-container">
          <div className={`snackbar snackbar--${snackbar.type}`}>
            {snackbar.message}
          </div>
        </div>
      )}
    </SnackbarContext.Provider>
  );
};

export const useSnackbar = () => useContext(SnackbarContext);