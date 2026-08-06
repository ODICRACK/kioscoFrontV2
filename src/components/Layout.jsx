const Layout = ({ children }) => {
  return (
    <div className="layout">
      {/* El contenido principal de cada página (Home, Ventas, Stock) 
          se renderizará aquí y ocupará el espacio necesario */}
      <main className="layout__main">
        {children}
      </main>
    </div>
  );
};

export default Layout;