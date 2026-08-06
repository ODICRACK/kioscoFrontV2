const Button = ({ children, variant, onClick, className = '', type = 'button' }) => {
  // variant puede ser: 'vender', 'vaciar', 'eliminar', 'transferencia', 'efectivo' o vacío (default)
  const variantClass = variant ? `btn--${variant}` : '';
  
  return (
    <button 
      className={`btn ${variantClass} ${className}`} 
      onClick={onClick} 
      type={type}
    >
      {children}
    </button>
  );
};

export default Button;