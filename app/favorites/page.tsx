'use client';

import { Suspense, useEffect, useMemo, useState } from 'react';
import Header from '@/components/Header/Header';
import NannysCard from '@/components/Nannys/NannysCard/NannysCard';
import FiltersForm from '@/components/Nannys/FiltersForm/FiltersForm';
import { useFavoritesStore } from '@/store/favoritesStore';
import { getNannyById } from '@/services/nannys';
import { Nanny } from '@/types/nannys';
import { useSearchParams } from 'next/navigation';
import css from './page.module.css';

const PER_PAGE = 4;

const FavoritesContent = () => {
  const searchParams = useSearchParams();
  const favoriteIds = useFavoritesStore((state) => state.favorites);
  const [favoriteNannies, setFavoriteNannies] = useState<Nanny[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [visibleCount, setVisibleCount] = useState(PER_PAGE);

  const preset = searchParams.get('preset');

  const filteredFavorites = useMemo(() => {
    const items = [...favoriteNannies];

    switch (preset) {
      case 'a-z':
        return items.sort((a, b) => a.name.localeCompare(b.name));
      case 'z-a':
        return items.sort((a, b) => b.name.localeCompare(a.name));
      case 'less-than-10':
        return items.filter((nanny) => nanny.price_per_hour < 10);
      case 'greater-than-10':
        return items.filter((nanny) => nanny.price_per_hour > 10);
      case 'popular':
        return items.sort((a, b) => b.rating - a.rating);
      case 'not-popular':
        return items.sort((a, b) => a.rating - b.rating);
      case 'show-all':
      default:
        return items;
    }
  }, [favoriteNannies, preset]);

  const visibleFavorites = useMemo(
    () => filteredFavorites.slice(0, visibleCount),
    [filteredFavorites, visibleCount]
  );

  const hasMore = visibleFavorites.length < filteredFavorites.length;

  useEffect(() => {
    let isActive = true;

    const loadFavorites = async () => {
      if (favoriteIds.length === 0) {
        setFavoriteNannies([]);
        setError(null);
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      setError(null);

      try {
        const result = await Promise.all(
          favoriteIds.map(async (id) => {
            try {
              return await getNannyById(id);
            } catch {
              return null;
            }
          })
        );

        if (!isActive) {
          return;
        }

        setFavoriteNannies(
          result.filter((nanny): nanny is Nanny => nanny !== null)
        );
      } catch {
        if (!isActive) {
          return;
        }

        setError('Failed to load favorites. Please try again.');
      } finally {
        if (isActive) {
          setIsLoading(false);
        }
      }
    };

    loadFavorites();

    return () => {
      isActive = false;
    };
  }, [favoriteIds]);

  useEffect(() => {
    setVisibleCount(PER_PAGE);
  }, [preset, favoriteIds.length, favoriteNannies.length]);

  const handleLoadMore = () => {
    setVisibleCount((prev) => prev + PER_PAGE);
  };

  return (
    <section className={css.page}>
      <div className={css.headerShell}>
        <Header variant="catalog" />
      </div>

      <div className={css.content}>
        <div className={css.contentFilterBlock}>
          <h1 className={css.title}>Favorites</h1>
          <p className={css.description}>
            Here you will see nannies you added to favorites.
          </p>
        </div>
        <div className={css.filtersWrap}>
          <FiltersForm />
        </div>

        {isLoading && <p className={css.statusText}>Loading favorites...</p>}
        {!isLoading && error && <p className={css.statusText}>{error}</p>}

        {!isLoading && !error && favoriteNannies.length === 0 && (
          <p className={css.statusText}>
            You don&apos;t have favorite nannies yet.
          </p>
        )}

        {!isLoading &&
          !error &&
          favoriteNannies.length > 0 &&
          filteredFavorites.length === 0 && (
            <p className={css.statusText}>
              No favorites match selected filter.
            </p>
          )}

        {!isLoading && !error && filteredFavorites.length > 0 && (
          <div className={css.favoritesList}>
            {visibleFavorites.map((nanny) => (
              <NannysCard key={nanny._id} nanny={nanny} />
            ))}
          </div>
        )}

        {!isLoading && !error && filteredFavorites.length > 0 && hasMore && (
          <button className={css.btnLoadMore} onClick={handleLoadMore}>
            Load more
          </button>
        )}
      </div>
    </section>
  );
};

const Page = () => {
  return (
    <Suspense fallback={<p className={css.statusText}>Loading favorites...</p>}>
      <FavoritesContent />
    </Suspense>
  );
};

export default Page;
