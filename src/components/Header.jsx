import BackButton from './BackButton';

const Header = ({ title, onBackClick }) => {
  return (
    <header className="header">
      <BackButton onClick={onBackClick} />
      <h1 className="header__title">{title}</h1>
    </header>
  );
};

export default Header;