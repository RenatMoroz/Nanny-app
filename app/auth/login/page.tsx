import LoginForm from '@/components/auth/LoginForm/LoginForm';
import css from './page.module.css';

const Page = () => {
  return (
    <div className={css['page']}>
      <LoginForm />
    </div>
  );
};

export default Page;
