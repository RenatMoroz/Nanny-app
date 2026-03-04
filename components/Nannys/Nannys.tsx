'use client';
import css from './Nannys.module.css';
import NannysCard from './NannysCard/NannysCard';
import FiltersForm from './FiltersForm/FiltersForm';
import { useSearchParams } from 'next/navigation';
import { useNannysStore } from '@/store/useNannysStore';
import { useEffect, useMemo } from 'react';

const Nannys = () => {
  const searchParams = useSearchParams();
  const params = Object.fromEntries(searchParams.entries());
  const queryKey = searchParams.toString();
  const preset = searchParams.get('preset');

  const { items, isLoading, fetchNannys, hasMore, resetNannys, error } =
    useNannysStore();

  useEffect(() => {
    resetNannys();
    fetchNannys(false, params);
  }, [queryKey]);

  const filteredItems = useMemo(() => {
    const list = [...items];

    switch (preset) {
      case 'a-z':
        return list.sort((a, b) => a.name.localeCompare(b.name));
      case 'z-a':
        return list.sort((a, b) => b.name.localeCompare(a.name));
      case 'less-than-10':
        return list.filter((nanny) => nanny.price_per_hour < 10);
      case 'greater-than-10':
        return list.filter((nanny) => nanny.price_per_hour > 10);
      case 'popular':
        return list.sort((a, b) => b.rating - a.rating);
      case 'not-popular':
        return list.sort((a, b) => a.rating - b.rating);
      case 'show-all':
      default:
        return list;
    }
  }, [items, preset]);

  const handleLoadMore = () => {
    fetchNannys(true, params);
  };

  return (
    <div className={css['nannys']}>
      <FiltersForm />
      <ul className={css['nannys-ul']}>
        {filteredItems.map((el) => (
          <NannysCard key={el._id} nanny={el} />
        ))}
      </ul>
      {isLoading && <p>Loading...</p>}
      {!isLoading && error && <p>{error}</p>}
      {!isLoading && !error && filteredItems.length === 0 && (
        <p>No nannies found.</p>
      )}

      {!isLoading && hasMore && filteredItems.length > 0 && (
        <button className={css['btn-load-more']} onClick={handleLoadMore}>
          Load more
        </button>
      )}
    </div>
  );
};

export default Nannys;
