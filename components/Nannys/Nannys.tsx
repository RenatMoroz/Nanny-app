'use client';
import css from './Nannys.module.css';
import NannysCard from './NannysCard/NannysCard';
import FiltersForm from './FiltersForm/FiltersForm';
import { useSearchParams } from 'next/navigation';
import { useNannysStore } from '@/store/useNannysStore';
import { useEffect } from 'react';

const Nannys = () => {
  const searchParams = useSearchParams();
  const params = Object.fromEntries(searchParams.entries());
  const queryKey = searchParams.toString();

  const { items, isLoading, fetchNannys, hasMore, resetNannys, error } =
    useNannysStore();

  useEffect(() => {
    resetNannys();
    fetchNannys(false, params);
  }, [queryKey]);

  const handleLoadMore = () => {
    fetchNannys(true, params);
  };

  return (
    <div className={css['nannys']}>
      <FiltersForm />
      <ul className={css['nannys-ul']}>
        {items.map((el) => (
          <NannysCard key={el._id} nanny={el} />
        ))}
      </ul>
      {isLoading && <p>Loading...</p>}
      {!isLoading && error && <p>{error}</p>}
      {!isLoading && !error && items.length === 0 && <p>No nannies found.</p>}

      {!isLoading && hasMore && items.length > 0 && (
        <button className={css['btn-load-more']} onClick={handleLoadMore}>
          Load more
        </button>
      )}
    </div>
  );
};

export default Nannys;
