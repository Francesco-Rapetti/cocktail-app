import { useAppStore } from "@/stores/AppStore";

export const useIsFavorite = (idDrink: string): boolean => {
    const isFav = useAppStore((state) =>
        state.favorites.some((fav) => fav.idDrink === idDrink)
    );

    return isFav;
};