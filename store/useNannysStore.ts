import { create } from 'zustand';
import { getAllNannys } from '@/services/nannys';
import { Nanny } from '@/types/nannys';

interface NannysState {
  items: Nanny[];
  page: number;
  isLoading: boolean;
  hasMore: boolean;
  error: string | null;
  fetchNannys: (
    loadMore: boolean,
    filters?: Record<string, unknown>
  ) => Promise<void>;
  resetNannys: () => void;
}

export const useNannysStore = create<NannysState>((set, get) => ({
  items: [],
  page: 1,
  isLoading: false,
  hasMore: true,
  error: null,

  fetchNannys: async (loadMore, filters: Record<string, unknown> = {}) => {
    const currentPage = loadMore ? get().page + 1 : 1;

    set({ isLoading: true, error: null });

    try {
      const data = await getAllNannys({
        page: currentPage,
        perPage: 4,
        ...filters,
      });
      const nannies = Array.isArray(data.nannies) ? data.nannies : [];
      const uniqueById = (list: Nanny[]) => {
        const seen = new Set<string>();
        const result: Nanny[] = [];

        for (const nanny of list) {
          if (!seen.has(nanny._id)) {
            seen.add(nanny._id);
            result.push(nanny);
          }
        }

        return result;
      };

      const mergedItems = loadMore
        ? [...get().items, ...nannies]
        : nannies;
      const newItems = uniqueById(mergedItems);

      set({
        items: newItems,
        page: currentPage,
        hasMore:
          typeof data.hasNextPage === 'boolean'
            ? data.hasNextPage
            : nannies.length === 4,
        isLoading: false,
        error: null,
      });
    } catch (error) {
      console.error(error);
      set({
        isLoading: false,
        error: 'Failed to load nannies. Check API and try again.',
      });
    }
  },

  resetNannys: () => {
    set({
      items: [],
      page: 1,
      hasMore: true,
      error: null,
    });
  },
}));
