'use client';

import { useRouter } from 'next/navigation';
import { logout } from '@/services/auth';
import { useAuthStore } from '@/store/authStore';
import css from '@/components/Header/HeaderAuth/HeaderAuth.module.css';
import toast from 'react-hot-toast';

const LogoutButton = () => {
  const router = useRouter();
  const clearUser = useAuthStore((state) => state.clearUser);

  const handleLogout = async () => {
    try {
      await logout();
      clearUser();
      toast.success('You have successfully logged out!');
      router.push('/');
    } catch (error: unknown) {
      console.error(error);
      toast.error('Logout failed. Please try again.');
    }
  };

  return (
    <button type="button" className={css.logoutButton} onClick={handleLogout}>
      Logout
    </button>
  );
};

export default LogoutButton;
