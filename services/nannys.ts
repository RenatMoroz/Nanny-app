import type {
  GetAllNannysParams,
  GetNannysResponse,
  Nanny,
} from '@/types/nannys';
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

export async function getAllNannys(
  params: GetAllNannysParams = {}
): Promise<GetNannysResponse> {
  const response = await nextApi.get<NannyListPayload>('/nanny', {
    params,
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
    const response = await nextApi.get<Nanny>(`/nannys/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching nanny by ID:', error);
    throw error;
  }
}
