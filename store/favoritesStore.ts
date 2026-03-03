import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface FavoritesState {
  ownerKey: string | null;
  favoritesByOwner: Record<string, string[]>;
  favorites: string[];
  setOwner: (ownerKey: string | null) => void;
  replaceFavorites: (favorites: string[]) => void;
  clearFavorites: () => void;
  toggleFavorite: (id: string) => void;
}

export const useFavoritesStore = create<FavoritesState>()(
  persist(
    (set, get) => ({
      ownerKey: null,
      favoritesByOwner: {},
      favorites: [],
      setOwner: (ownerKey) => {
        if (get().ownerKey === ownerKey) {
          return;
        }

        if (!ownerKey) {
          set({ ownerKey: null, favorites: [] });
          return;
        }

        const ownerFavorites = get().favoritesByOwner[ownerKey] ?? [];
        set({ ownerKey, favorites: ownerFavorites });
      },
      replaceFavorites: (favorites) => {
        const uniqueFavorites = [...new Set(favorites)];
        const owner = get().ownerKey;

        if (!owner) {
          set({ favorites: uniqueFavorites });
          return;
        }

        set((state) => ({
          favorites: uniqueFavorites,
          favoritesByOwner: {
            ...state.favoritesByOwner,
            [owner]: uniqueFavorites,
          },
        }));
      },
      clearFavorites: () => {
        const owner = get().ownerKey;

        if (!owner) {
          set({ favorites: [] });
          return;
        }

        set((state) => ({
          favorites: [],
          favoritesByOwner: {
            ...state.favoritesByOwner,
            [owner]: [],
          },
        }));
      },

      toggleFavorite: (id) => {
        const current = get().favorites;
        const owner = get().ownerKey;
        const nextFavorites = current.includes(id)
          ? current.filter((el) => el !== id)
          : [...current, id];

        if (!owner) {
          set({ favorites: nextFavorites });
          return;
        }

        set((state) => ({
          favorites: nextFavorites,
          favoritesByOwner: {
            ...state.favoritesByOwner,
            [owner]: nextFavorites,
          },
        }));
      },
    }),
    {
      name: 'favorites-storage',
    }
  )
);
