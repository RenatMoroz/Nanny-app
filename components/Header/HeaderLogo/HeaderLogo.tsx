import Link from 'next/link';
import css from './HeaderLogo.module.css';

const HeaderLogo = () => {
  return (
    <div className={css['header-logo']}>
      <Link href="/" className={css['header-link']}>
        Nanny.Services
      </Link>
    </div>
  );
};

export default HeaderLogo;
