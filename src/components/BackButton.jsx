import { useLocation } from 'wouter';

const BackButton = ({ onClick }) => {
  const [, setLocation] = useLocation();

  const handleClick = () => {
    if (onClick) {
      onClick(); // Ejecuta una función personalizada (ej. Logout en el Home)
    } else {
      setLocation('/'); // Por defecto, vuelve al Home
    }
  };

  return (
    <button className="btn-back" onClick={handleClick} type="button">
      <span class="material-symbols-outlined">
        arrow_back
      </span>
    </button>
  );
};

export default BackButton;