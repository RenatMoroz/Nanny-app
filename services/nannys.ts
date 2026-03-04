import type {
  GetAllNannysParams,
  GetNannysResponse,
  Nanny,
} from '@/types/nannys';
import axios from 'axios';
import { nextApi } from './serverConfig';

type NannyListPayload =
  | Nanny[]
  | {
      nannys?: Nanny[];
      nannies?: Nanny[];
      items?: Nanny[];
      docs?: Nanny[];
      data?:
        | Nanny[]
        | {
            nannys?: Nanny[];
            nannies?: Nanny[];
            items?: Nanny[];
            docs?: Nanny[];
          };
      results?: Nanny[];
      page?: number;
      perPage?: number;
      totalPages?: number;
      totalItems?: number;
      hasNextPage?: boolean;
      hasPreviousPage?: boolean;
    };

const normalizeNanny = (item: unknown): Nanny | null => {
  if (!item || typeof item !== 'object') {
    return null;
  }

  const record = item as Record<string, unknown>;
  const id =
    typeof record._id === 'string'
      ? record._id
      : typeof record.id === 'string'
        ? record.id
        : null;

  if (!id) {
    return null;
  }

  return {
    _id: id,
    name: typeof record.name === 'string' ? record.name : '',
    avatar_url:
      typeof record.avatar_url === 'string'
        ? record.avatar_url
        : typeof record.avatarUrl === 'string'
          ? record.avatarUrl
          : '',
    birthday: typeof record.birthday === 'string' ? record.birthday : '',
    experience: typeof record.experience === 'string' ? record.experience : '',
    reviews: Array.isArray(record.reviews) ? (record.reviews as Nanny['reviews']) : [],
    education: typeof record.education === 'string' ? record.education : '',
    kids_age: typeof record.kids_age === 'string' ? record.kids_age : '',
    price_per_hour:
      typeof record.price_per_hour === 'number'
        ? record.price_per_hour
        : typeof record.pricePerHour === 'number'
          ? record.pricePerHour
          : 0,
    location: typeof record.location === 'string' ? record.location : '',
    about: typeof record.about === 'string' ? record.about : '',
    characters: Array.isArray(record.characters)
      ? (record.characters.filter((value): value is string => typeof value === 'string') as string[])
      : [],
    rating: typeof record.rating === 'number' ? record.rating : 0,
  };
};

const extractFirstArrayDeep = (
  value: unknown,
  depth = 0
): unknown[] | null => {
  if (depth > 5 || value == null) {
    return null;
  }

  if (Array.isArray(value)) {
    return value;
  }

  if (typeof value !== 'object') {
    return null;
  }

  const objectValue = value as Record<string, unknown>;
  for (const nested of Object.values(objectValue)) {
    const found = extractFirstArrayDeep(nested, depth + 1);
    if (found) {
      return found;
    }
  }

  return null;
};

function toArray(payload: NannyListPayload): Nanny[] {
  const directCandidates = [
    Array.isArray(payload) ? payload : null,
    !Array.isArray(payload) && Array.isArray(payload.nannys) ? payload.nannys : null,
    !Array.isArray(payload) && Array.isArray(payload.nannies) ? payload.nannies : null,
    !Array.isArray(payload) && Array.isArray(payload.items) ? payload.items : null,
    !Array.isArray(payload) && Array.isArray(payload.docs) ? payload.docs : null,
    !Array.isArray(payload) && Array.isArray(payload.results) ? payload.results : null,
    !Array.isArray(payload) && Array.isArray(payload.data) ? payload.data : null,
  ].filter(Array.isArray);

  for (const candidate of directCandidates) {
    const normalized = candidate
      .map(normalizeNanny)
      .filter((item): item is Nanny => Boolean(item));
    if (normalized.length > 0) {
      return normalized;
    }
  }

  const deepArray = extractFirstArrayDeep(payload);
  if (!deepArray) {
    return [];
  }

  return deepArray
    .map(normalizeNanny)
    .filter((item): item is Nanny => Boolean(item));
}

const normalizeNannyOrThrow = (payload: unknown): Nanny => {
  const nanny = normalizeNanny(payload);
  if (!nanny) {
    throw new Error('Invalid nanny payload');
  }
  return nanny;
};

const toRequestParams = (
  params: GetAllNannysParams = {}
): Record<string, string | number> => {
  const { preset, ...rest } = params;
  const prepared: Record<string, string | number> = {};

  for (const [key, value] of Object.entries(rest)) {
    if (value !== undefined && value !== null) {
      prepared[key] = value as string | number;
    }
  }

  switch (preset) {
    case 'a-z':
      prepared.sortBy = 'name';
      prepared.sortOrder = 'asc';
      break;
    case 'z-a':
      prepared.sortBy = 'name';
      prepared.sortOrder = 'desc';
      break;
    case 'less-than-10':
      prepared.maxPrice = 10;
      break;
    case 'greater-than-10':
      prepared.minPrice = 10;
      break;
    case 'popular':
      prepared.sortBy = 'rating';
      prepared.sortOrder = 'desc';
      break;
    case 'not-popular':
      prepared.sortBy = 'rating';
      prepared.sortOrder = 'asc';
      break;
    case 'show-all':
    default:
      break;
  }

  return prepared;
};

export async function getAllNannys(
  params: GetAllNannysParams = {}
): Promise<GetNannysResponse> {
  const requestParams = toRequestParams(params);
  const response = await nextApi.get<NannyListPayload>('/nannys', {
    params: requestParams,
  });

  const payload = response.data;
  const nannies = toArray(payload);
  const page = (payload as { page?: number })?.page ?? (params.page ?? 1);
  const perPage =
    (payload as { perPage?: number })?.perPage ?? (params.perPage ?? 4);
  const totalItems =
    (payload as { totalItems?: number })?.totalItems ?? nannies.length;
  const totalPages =
    (payload as { totalPages?: number })?.totalPages ??
    (perPage > 0 ? Math.max(1, Math.ceil(totalItems / perPage)) : 1);
  const hasNextPage =
    (payload as { hasNextPage?: boolean })?.hasNextPage ?? page < totalPages;
  const hasPreviousPage =
    (payload as { hasPreviousPage?: boolean })?.hasPreviousPage ?? page > 1;

  return {
    nannies,
    page,
    perPage,
    totalPages,
    totalItems,
    hasNextPage,
    hasPreviousPage,
  };
}

export async function getNannyById(id: string): Promise<Nanny> {
  try {
    if (typeof window === 'undefined' && process.env.NEXT_PUBLIC_API_URL) {
      const baseURL = process.env.NEXT_PUBLIC_API_URL;

      try {
        const response = await axios.get(`${baseURL}/nannys/${id}`);
        return normalizeNannyOrThrow(response.data);
      } catch (error) {
        if (
          (error as { response?: { status?: number } })?.response?.status !==
          404
        ) {
          throw error;
        }
      }

      const response = await axios.get(`${baseURL}/nanny/${id}`);
      return normalizeNannyOrThrow(response.data);
    }

    const response = await nextApi.get(`/nannys/${id}`);
    return normalizeNannyOrThrow(response.data);
  } catch (error) {
    console.error('Error fetching nanny by ID:', error);
    throw error;
  }
}
