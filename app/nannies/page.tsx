import Header from '@/components/Header/Header';
import css from './Page.module.css';
import Nannys from '@/components/Nannys/Nannys';
import { Suspense } from 'react';

const Page = () => {
  return (
    <section className={css.page}>
      <div className={css.headerShell}>
        <Header variant="catalog" />
      </div>

      <div className={css.content}>
        <Suspense fallback={<p>Loading...</p>}>
          <Nannys />
        </Suspense>
      </div>
    </section>
  );
};

export default Page;
