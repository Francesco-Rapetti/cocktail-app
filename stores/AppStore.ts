import { Cocktail } from '@/entities/Cocktail';
import { create } from 'zustand';

export interface SnackbarState {
    message: string;
    type: 'success' | 'error' | 'info';
}

interface AppState {
    categories: string[];
    glasses: string[];
    ingredients: string[];
    alcoholicFilters: string[];
    favorites: Partial<Cocktail>[];
    isInitialized: boolean;

    snackbar: SnackbarState | null;
    showSnackbar: (message: string, type?: 'success' | 'error' | 'info') => void;
    hideSnackbar: () => void;

    setCategories: (data: string[]) => void;
    setGlasses: (data: string[]) => void;
    setIngredients: (data: string[]) => void;
    setAlcoholicFilters: (data: string[]) => void;
    setFavorites: (data: Partial<Cocktail>[]) => void;
    toggleFavorite: (cocktail: Partial<Cocktail>) => void;
    setInitialized: (value: boolean) => void;
}

export const useAppStore = create<AppState>((set, get) => ({
    categories: [],
    glasses: [],
    ingredients: [],
    alcoholicFilters: [],
    favorites: [],
    isInitialized: false,

    snackbar: null,

    showSnackbar: (message, type = 'error') => set({ snackbar: { message, type } }),
    hideSnackbar: () => set({ snackbar: null }),

    setCategories: (data) => set({ categories: data }),
    setGlasses: (data) => set({ glasses: data }),
    setIngredients: (data) => set({ ingredients: data }),
    setAlcoholicFilters: (data) => set({ alcoholicFilters: data }),
    setFavorites: (data) => set({ favorites: data }),
    setInitialized: (value) => set({ isInitialized: value }),

    toggleFavorite: (cocktail) => {
        if (!cocktail.idDrink) return;
        const currentFavs = get().favorites;
        const exists = currentFavs.find((c) => c.idDrink === cocktail.idDrink);

        let newFavs;
        if (exists) {
            newFavs = currentFavs.filter((c) => c.idDrink !== cocktail.idDrink);
            get().showSnackbar('Cocktail rimosso dai preferiti', 'info');
        } else {
            newFavs = [...currentFavs, cocktail];
            get().showSnackbar('Cocktail aggiunto ai preferiti!', 'success');
        }

        set({ favorites: newFavs });
    },
}));