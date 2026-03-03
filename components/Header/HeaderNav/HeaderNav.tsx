'use client';

import Link from 'next/link';
import css from './HeaderNav.module.css';
import { useAuthStore } from '@/store/authStore';
import { usePathname } from 'next/navigation';

const HeaderNav = () => {
  const user = useAuthStore((state) => state.user);
  const pathname = usePathname();

  return (
    <nav className={css['headerNav']}>
      <ul className={css['header-list-items']}>
        <li className={css['header-item']}>
          <Link
            href="/"
            className={`${css['header-nav-link']} ${
              pathname === '/' ? css.active : ''
            }`}
          >
            Home
          </Link>
        </li>
        <li className={css['header-item']}>
          <Link
            href="/nannies"
            className={`${css['header-nav-link']} ${
              pathname === '/nannies' ? css.active : ''
            }`}
          >
            Nannies
          </Link>
        </li>
        {user && (
          <li className={css['header-item']}>
            <Link
              href="/favorites"
              className={`${css['header-nav-link']} ${
                pathname === '/favorites' ? css.active : ''
              }`}
            >
              Favorites
            </Link>
          </li>
        )}
      </ul>
    </nav>
  );
};

export default HeaderNav;
