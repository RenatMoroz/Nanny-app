import { create } from 'zustand';
import { me, refresh } from '@/services/auth';
import { useFavoritesStore } from '@/store/favoritesStore';

export interface User {
  id?: string;
  name?: string;
  email?: string;
  favorites?: string[];
  favoriteNannys?: string[];
}

interface RefreshResponse {
  success?: boolean;
  user?: User;
  favorites?: string[];
  favoriteNannys?: string[];
  id?: string;
  name?: string;
  email?: string;
}

interface MeResponse {
  user?: User;
  favorites?: string[];
  favoriteNannys?: string[];
  id?: string;
  name?: string;
  email?: string;
}

interface AuthState {
  user: User | null;
  setUser: (user: User) => void;
  clearUser: () => void;
  checkAuth: () => Promise<void>;
}

const getUserKey = (user: User | null) => user?.id ?? user?.email ?? null;

const normalizeFavorites = (value: unknown): string[] => {
  if (!Array.isArray(value)) {
    return [];
  }

  return value
    .map((item) => {
      if (typeof item === 'string') {
        return item;
      }

      if (item && typeof item === 'object') {
        const record = item as Record<string, unknown>;
        const id =
          typeof record._id === 'string'
            ? record._id
            : typeof record.id === 'string'
              ? record.id
              : null;

        return id;
      }

      return null;
    })
    .filter((id): id is string => Boolean(id));
};

const extractFavorites = (
  user: User | null | undefined,
  payload?: MeResponse
): string[] | null => {
  if (payload?.favorites) {
    return normalizeFavorites(payload.favorites);
  }

  if (payload?.favoriteNannys) {
    return normalizeFavorites(payload.favoriteNannys);
  }

  if (user?.favorites) {
    return normalizeFavorites(user.favorites);
  }

  if (user?.favoriteNannys) {
    return normalizeFavorites(user.favoriteNannys);
  }

  return null;
};

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  setUser: (user) => {
    const nextUserKey = getUserKey(user);
    const favoritesStore = useFavoritesStore.getState();
    favoritesStore.setOwner(nextUserKey);
    const favorites = extractFavorites(user);
    if (favorites) {
      favoritesStore.replaceFavorites(favorites);
    }
    set({ user });
  },
  clearUser: () => {
    useFavoritesStore.getState().clearFavorites();
    useFavoritesStore.getState().setOwner(null);
    set({ user: null });
  },
  checkAuth: async () => {
    try {
      const refreshResponse = (await refresh()) as RefreshResponse;

      if (!refreshResponse?.success) {
        get().clearUser();
        return;
      }

      if (refreshResponse?.user) {
        get().setUser({
          ...refreshResponse.user,
          favorites:
            refreshResponse.user.favorites ??
            refreshResponse.favorites ??
            refreshResponse.user.favoriteNannys ??
            refreshResponse.favoriteNannys,
        });
        return;
      }

      if (
        refreshResponse?.id ||
        refreshResponse?.name ||
        refreshResponse?.email
      ) {
        const { id, name, email } = refreshResponse;
        get().setUser({ id, name, email });
        return;
      }

      const meResponse = (await me()) as MeResponse;
      if (meResponse?.user) {
        const favoritesStore = useFavoritesStore.getState();
        const userWithServerData = {
          ...meResponse.user,
          favorites:
            meResponse.user.favorites ??
            meResponse.favorites ??
            meResponse.user.favoriteNannys ??
            meResponse.favoriteNannys,
        };

        get().setUser(userWithServerData);
        const favorites = extractFavorites(meResponse.user, meResponse);
        if (favorites) {
          favoritesStore.replaceFavorites(favorites);
        }
        return;
      }

      if (meResponse?.id || meResponse?.name || meResponse?.email) {
        const { id, name, email } = meResponse;
        get().setUser({ id, name, email });
        return;
      }

      get().clearUser();
    } catch {
      get().clearUser();
    }
  },
}));
