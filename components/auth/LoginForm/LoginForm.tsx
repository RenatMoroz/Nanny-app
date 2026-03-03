'use client';
import Link from 'next/link';
import css from './LoginForm.module.css';
import { useState } from 'react';
import { useAuthStore, User } from '@/store/authStore';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { login } from '@/services/auth';

interface LoginResponse {
  user?: User;
  favorites?: string[];
  favoriteNannys?: string[];
  id?: string;
  name?: string;
  email?: string;
}

const LoginForm = () => {
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();
  const setUser = useAuthStore((state) => state.setUser);
  const checkAuth = useAuthStore((state) => state.checkAuth);
  const handleTogglePassword = () => {
    setShowPassword((prev) => !prev);
  };
  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const email = formData.get('email') as string;
    const password = formData.get('Password') as string;
    const data = { email, password };

    try {
      const response = (await login(data)) as LoginResponse;

      if (response?.user) {
        setUser({
          ...response.user,
          favorites:
            response.user.favorites ??
            response.favorites ??
            response.user.favoriteNannys ??
            response.favoriteNannys,
        });
      } else if (response?.id || response?.name || response?.email) {
        const { id, name, email } = response;
        setUser({ id, name, email });
      } else {
        await checkAuth();
      }

      toast.success('You have successfully logged in!');
      router.push('/');
    } catch (error: unknown) {
      console.error(error);
      toast.error('Login failed. Please check your credentials.');
    }
  };

  return (
    <div className={css['login-form-wrap']}>
      <form className={css['login-form']} onSubmit={handleSubmit}>
        <div className={css['form-block-login']}>
          <h2 className={css['title']}>Log in</h2>
          <p className={css['description']}>
            Welcome back! Please enter your credentials to access your account
            and continue your babysitter search.
          </p>
        </div>
        <input
          name="email"
          type="email"
          placeholder="Email"
          required
          className={css['inputs']}
        />
        <div style={{ position: 'relative' }}>
          <input
            className={css['inputs-password']}
            name="Password"
            placeholder="Password"
            type={showPassword ? 'text' : 'password'}
            required
          />
          <svg
            key={showPassword ? 'eye-on' : 'eye-off'}
            width={20}
            height={20}
            className={css['form-login-svg']}
            onClick={handleTogglePassword}
          >
            <use
              href={
                showPassword
                  ? '/icons-sprite.svg#icon-eye-on'
                  : '/icons-sprite.svg#icon-eye-off'
              }
            ></use>
          </svg>
        </div>
        <button type="submit" className={css['submit-btn']}>
          Log in
        </button>
        <p className={`${css['form-login-content']} ${css['footer']}`}>
          Dont have an account yet?{' '}
          <Link href="/auth/register" className={css['form-login-link']}>
            Register
          </Link>
        </p>
      </form>
    </div>
  );
};

export default LoginForm;
