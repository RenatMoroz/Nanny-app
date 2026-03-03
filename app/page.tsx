import Home from '@/components/Home/Home';
import Container from '@/components/Container/Container';
import css from './page.module.css';

const Page = () => {
  return (
    <Container>
      <div className={css['page']}>
        <Home />
      </div>
    </Container>
  );
};

export default Page;
