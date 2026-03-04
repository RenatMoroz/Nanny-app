'use client';
import { useState } from 'react';
import css from './RegisterForm.module.css';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { register } from '@/services/auth';
import toast from 'react-hot-toast';

const RegisterForm = () => {
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();
  const handleTogglePassword = () => {
    setShowPassword((prev) => !prev);
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const name = formData.get('name') as string;
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;
    const data = { name, email, password };

    try {
      await register(data);
      toast.success('You have successfully registered!');
      router.push('/auth/login');
    } catch (error: unknown) {
      console.error(error);
      toast.error('Registration failed. Please try again.');
    }
  };

  return (
    <div className={css['register-form-wrap']}>
      <form className={css['register-form']} onSubmit={handleSubmit}>
        <div className={css['form-block-register']}>
          <h2 className={css['title']}>Registration</h2>
          <p className={css['description']}>
            Thank you for your interest in our platform! In order to register,
            we need some information. Please provide us with the following
            information.
          </p>
        </div>
        <input
          name="name"
          type="text"
          placeholder="Name"
          required
          className={css['inputs']}
        />
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
            name="password"
            placeholder="Password"
            type={showPassword ? 'text' : 'password'}
            required
          />
          <button
            type="button"
            className={css['form-register-svg']}
            onClick={handleTogglePassword}
            aria-label={showPassword ? 'Hide password' : 'Show password'}
          >
            <svg key={showPassword ? 'eye-on' : 'eye-off'} width={20} height={20}>
              <use
                href={
                  showPassword
                    ? '/icons-sprite.svg#icon-eye-on'
                    : '/icons-sprite.svg#icon-eye-off'
                }
              ></use>
            </svg>
          </button>
        </div>
        <button type="submit" className={css['submit-btn']}>
          Sign Up
        </button>
        <p className={`${css['form-register-content']} ${css['footer']}`}>
          Already have an account?{' '}
          <Link href="/auth/login" className={css['form-register-link']}>
            Log in
          </Link>
        </p>
      </form>
    </div>
  );
};

export default RegisterForm;
