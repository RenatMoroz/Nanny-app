'use client';
import Image from 'next/image';
import css from './NannysCard.module.css';
import { useState } from 'react';
import { useFavoritesStore } from '@/store/favoritesStore';
import { useAuthStore } from '@/store/authStore';
import { Nanny } from '@/types/nannys';
import Link from 'next/link';
import ReviewList from '@/components/ReviewList/ReviewList';
import { useRouter } from 'next/navigation';
interface NannyProps {
  nanny: Nanny;
}

const getAgeFromBirthday = (birthday: string): number | null => {
  const birthDate = new Date(birthday);
  if (Number.isNaN(birthDate.getTime())) {
    return null;
  }

  const today = new Date();
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();

  if (
    monthDiff < 0 ||
    (monthDiff === 0 && today.getDate() < birthDate.getDate())
  ) {
    age -= 1;
  }

  return Math.max(age, 0);
};

const NannysCard = ({ nanny }: NannyProps) => {
  const [showMore, setShowMore] = useState(false);
  const router = useRouter();
  const user = useAuthStore((state) => state.user);
  const { favorites, toggleFavorite } = useFavoritesStore();
  const isFavorite = Boolean(user) && favorites.includes(nanny._id);
  const nannyAge = getAgeFromBirthday(nanny.birthday);

  const handleReadMore = () => {
    setShowMore((prev) => !prev);
  };

  const handleToggleFavorite = () => {
    if (!user) {
      router.push('/auth/login');
      return;
    }

    toggleFavorite(nanny._id);
  };

  return (
    <div className={css['nannysCard']}>
      <div className={css['nannys-img']}>
        <Image
          src={nanny.avatar_url}
          alt={`${nanny.name}`}
          className={css['nannyImage']}
          width={80}
          height={80}
          unoptimized
          loader={({ src }) => src}
        />
      </div>

      <div className={css['nannys-block']}>
        <div className={css['nannys-block-row']}>
          <div className={css['nannys-block-text']}>
            <p className={css['nannys-special']}>Nanny</p>
            <h2 className={css['nannys-name']}>{nanny.name}</h2>
          </div>

          <div className={css['nannys-stat-row']}>
            <div className={css['nannys-location']}>
              <svg width={16} height={16}>
                <use href="/icons-sprite.svg#icon-map"></use>
              </svg>
              <p>{nanny.location}</p>
            </div>

            <div className={css['nannys-star']}>
              <svg width={16} height={16}>
                <use href="/icons-sprite.svg#icon-star"></use>
              </svg>
              <p>{nanny.rating}</p>
            </div>

            <div className={css['nannys-price']}>
              <p className={css['nannys-price-text']}>
                Price / 1 hour{' '}
                <span className={css['nannys-price-span']}>
                  {nanny.price_per_hour}$
                </span>
              </p>
            </div>

            <button
              className={css['favoriteButton']}
              type="button"
              aria-pressed={isFavorite}
              onClick={handleToggleFavorite}
            >
              <svg
                className={`${css['heartIcon']} ${
                  isFavorite ? css['heartIconActive'] : ''
                }`}
              >
                <use href="/icons-sprite.svg#icon-heart" />
              </svg>
            </button>
          </div>
        </div>

        <div className={css['detalit-block']}>
          <p className={css['detalit-block-text']}>
            <span className={css['detalit-block-span']}>Age:</span>
            {nannyAge ?? '-'}
          </p>
          <p className={css['detalit-block-text']}>
            <span className={css['detalit-block-span']}>Experience:</span>
            {nanny.experience}
          </p>
          <p className={css['detalit-block-text']}>
            <span className={css['detalit-block-span']}>Kids Age:</span>
            {nanny.kids_age}
          </p>
          <p className={css['detalit-block-text']}>
            <span className={css['detalit-block-span']}>Characters:</span>
            {nanny.characters}
          </p>
          <p className={css['detalit-block-text']}>
            <span className={css['detalit-block-span']}>Education:</span>
            {nanny.education}
          </p>
          <p>{nanny.about}</p>
        </div>
        <button className={css['readMoreButton']} onClick={handleReadMore}>
          {showMore ? 'Show less' : 'Read more'}
        </button>
        {showMore && <ReviewList id={nanny._id} />}
        {showMore && (
          <Link className={css['nannyButton']} href={`/nannys/${nanny._id}`}>
            Make an appointment
          </Link>
        )}
      </div>
    </div>
  );
};

export default NannysCard;
