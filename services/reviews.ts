import { Review } from '@/types/reviews';
import { nextApi } from './serverConfig';

export async function getReviewsByNannyId(id: string) {
  const response = await nextApi.get<Review[]>(`/reviews/nanny/${id}`);
  return response.data;
}
