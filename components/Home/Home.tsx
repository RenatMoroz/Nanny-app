import Link from 'next/link';
import Header from '../Header/Header';
import css from './Home.module.css';

const Home = () => {
  return (
    <section className={css.home}>
      <div className={css.hero}>
        <div className={css.headerWrap}>
          <Header variant="home" />
        </div>

        <div className={css.homeContent}>
          <h1 className={css.homeTitle}>Make Life Easier for the Family:</h1>
          <p className={css.homeDescription}>
            Find Babysitters Online for All Occasions
          </p>

          <Link href="/nannies" className={css.homeLink}>
            <span>Get started</span>
            <svg width="14" height="14" aria-hidden="true">
              <use href="/icons-sprite.svg#icon-Arrow"></use>
            </svg>
          </Link>
        </div>

        <div className={css.heroImage}>
          <div className={css.experienceCard}>
            <div className={css.checkIcon}>
              <svg width={30} height={30} className={css.svgIcon}>
                <use href="/icons-sprite.svg#icon-check"></use>
              </svg>
            </div>
            <div className={css.experienceText}>
              <p>Experienced nannies</p>
              <span>15,000</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Home;
