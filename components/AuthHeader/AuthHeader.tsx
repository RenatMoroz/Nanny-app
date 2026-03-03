'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import css from './AuthHeader.module.css';

const AuthHeader = () => {
  const pathname = usePathname();

  return (
    <header className={css.header}>
      <Link href="/" className={css.logo}>
        Nanny.Services
      </Link>
      <nav className={css['headerNav']}>
        <ul className={css['header-list-items']}>
          <li className={css['header-item']}>
            <Link href="/" className={css['header-nav-link']}>
              Home
            </Link>
          </li>
          <li className={css['header-item']}>
            <Link href="/nannies" className={css['header-nav-link']}>
              Nannies
            </Link>
          </li>
        </ul>
      </nav>
      <nav className={css.nav}>
        <Link
          href="/auth/login"
          className={`${css.link} ${pathname === '/auth/login' ? css.active : ''}`}
        >
          Login
        </Link>
        <Link
          href="/auth/register"
          className={`${css.link} ${pathname === '/auth/register' ? css.active : ''}`}
        >
          Registration
        </Link>
      </nav>
    </header>
  );
};

export default AuthHeader;
