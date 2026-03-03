import type { ReactNode } from 'react';
import AuthHeader from '@/components/AuthHeader/AuthHeader';
import css from './layout.module.css';

const AuthLayout = ({ children }: { children: ReactNode }) => {
  return (
    <div className={css.authLayout}>
      <AuthHeader />
      {children}
    </div>
  );
};

export default AuthLayout;
