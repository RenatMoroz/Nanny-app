import { getNannyById } from '@/services/nannys';
import css from './page.module.css';
import NannyModal from '@/components/NannyModal/NannyModal';
import Header from '@/components/Header/Header';

interface PageProps {
  params: Promise<{ id: string }>;
}

const Page = async ({ params }: PageProps) => {
  const { id } = await params;
  const nanny = await getNannyById(id);

  return (
    <section>
      <div className={css.headerShell}>
        <Header variant="catalog" />
      </div>
      <div className={css.page}>
        <NannyModal nanny={nanny} />
      </div>
    </section>
  );
};
export default Page;
