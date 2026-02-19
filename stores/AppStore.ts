import { Cocktail } from '@/entities/Cocktail';
import { create } from 'zustand';

interface AppState {
    categories: string[];
    glasses: string[];
    ingredients: string[];
    alcoholicFilters: string[];
    favorites: Partial<Cocktail>[];

    isInitialized: boolean;

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
        } else {
            newFavs = [...currentFavs, cocktail];
        }

        set({ favorites: newFavs });
    },
}));