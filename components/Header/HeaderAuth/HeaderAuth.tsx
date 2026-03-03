'use client';
import Link from 'next/link';
import css from './HeaderAuth.module.css';
import LogoutButton from '@/components/LogoutButton';
import { useAuthStore } from '@/store/authStore';

const HeaderAuth = () => {
  const user = useAuthStore((state) => state.user);

  if (user) {
    const trimmedName = user.name?.trim();
    const emailAlias = user.email?.split('@')[0];
    const profileName = trimmedName || emailAlias || 'User';

    return (
      <div className={css['header-auth']}>
        <div className={css['header-profile']}>
          <span className={css['profile-icon-wrap']} aria-hidden="true">
            <svg width={16} height={16} className={css['profile-icon']}>
              <use href="/icons-sprite.svg#icon-user"></use>
            </svg>
          </span>
          <span className={css['header-login']}>{profileName}</span>
        </div>
        <LogoutButton />
      </div>
    );
  }

  return (
    <div className={css['header-auth']}>
      <div className={css['header-auth-login']}>
        <Link href="/auth/login" className={css['header-auth-link-login']}>
          Login
        </Link>
      </div>
      <div className={css['header-auth-register']}>
        <Link href="/auth/register" className={css['header-auth-link']}>
          Registration
        </Link>
      </div>
    </div>
  );
};

export default HeaderAuth;
