const CategoryButton = ({ name, colorIndex = 1, onClick }) => {
  // Aseguramos que el índice cicle del 1 al 5 en caso de haber más categorías
  const index = ((colorIndex - 1) % 5) + 1;
  
  return (
    <button 
      className={`cat-btn cat-btn--${index}`} 
      onClick={onClick}
      type="button"
    >
      {name}
    </button>
  );
};

export default CategoryButton;