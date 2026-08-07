import BackButton from './BackButton';

const Header = ({ title, onBackClick, rightIcon, onRightClick }) => {
  return (
    <header className="header">
      <BackButton onClick={onBackClick} />
      <h1 className="header__title">{title}</h1>
      
      {rightIcon && (
        <button className="header__action-btn" onClick={onRightClick} type="button">
          <span className="material-symbols-outlined">{rightIcon}</span>
        </button>
      )}
    </header>
  );
};

export default Header;