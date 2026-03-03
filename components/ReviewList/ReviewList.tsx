'use client';
import { getReviewsByNannyId } from '@/services/reviews';
import css from './ReviewList.module.css';
import { useQuery } from '@tanstack/react-query';
import type { Review } from '@/types/reviews';
interface ReviewListProps {
  id: string;
}
const ReviewList = ({ id }: ReviewListProps) => {
  const revieQuery = useQuery({
    queryKey: ['nannyReviews', id],
    queryFn: () => getReviewsByNannyId(id),
  });
  const reviews: Review[] = revieQuery.data ?? [];
  return (
    <div className={css['reviewList']}>
      {reviews.map((review) => (
        <div key={review._id} className={css['reviewItem']}>
          <div className={css['reviewBlock']}>
            <h4 className={css['reviewName']}>{review.reviewer}</h4>
            <div className={css['statItem']}>
              <svg width={24} height={24}>
                <use href="/icons-sprite.svg#icon-star"></use>
              </svg>
              <p>{review.rating}</p>
            </div>
          </div>
          <p className={css['reviewComment']}>{review.comment}</p>
        </div>
      ))}
    </div>
  );
};

export default ReviewList;
