import css from './Header.module.css';
import HeaderAuth from './HeaderAuth/HeaderAuth';
import HeaderLogo from './HeaderLogo/HeaderLogo';
import HeaderNav from './HeaderNav/HeaderNav';

interface HeaderProps {
  variant?: 'home' | 'catalog';
}

const Header = ({ variant = 'home' }: HeaderProps) => {
  if (variant === 'catalog') {
    return (
      <div className={css['headerWrap']}>
        <div className={`${css['header']} ${css['headerCatalog']}`}>
          <div className={css['headerLeft']}>
            <HeaderLogo />
          </div>
          <div className={css['headerCenter']}>
            <HeaderNav />
          </div>
          <div className={css['headerRight']}>
            <HeaderAuth />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={css['headerWrap']}>
      <div className={`${css['header']} ${css['headerHome']}`}>
        <HeaderLogo />
        <div className={css['headerHomeRight']}>
          <HeaderNav />
          <HeaderAuth />
        </div>
      </div>
    </div>
  );
};

export default Header;
