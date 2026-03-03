export interface GetAllNannysParams {
  page?: number;
  perPage?: number;
  name?: string;
  location?: string;
  characters?: string;
  price_per_hour?: number;
  minPrice?: number;
  maxPrice?: number;
  minRating?: number;
  preset?:
    | 'a-z'
    | 'z-a'
    | 'less-than-10'
    | 'greater-than-10'
    | 'popular'
    | 'not-popular'
    | 'show-all';
  sortBy?: 'name' | 'price_per_hour' | 'rating';
  sortOrder?: 'asc' | 'desc';
}

export interface GetNannysResponse {
  nannies: Nanny[];
  page: number;
  perPage: number;
  totalPages: number;
  totalItems: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

export interface NannyReview {
  reviewer: string;
  rating: number;
  comment: string;
}

export interface Nanny {
  _id: string;
  name: string;
  avatar_url: string;
  birthday: string;
  experience: string;
  reviews: NannyReview[];
  education: string;
  kids_age: string;
  price_per_hour: number;
  location: string;
  about: string;
  characters: string[];
  rating: number;
}
