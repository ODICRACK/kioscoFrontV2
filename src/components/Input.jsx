const Input = ({ type = 'text', value, onChange, placeholder, className = '', ...props }) => {
  return (
    <input 
      className={`input ${className}`}
      type={type}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      {...props} /* <-- Inyectamos esos atributos extra al input nativo */
    />
  );
};

export default Input;