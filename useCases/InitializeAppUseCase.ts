import { Cocktail } from "@/entities/Cocktail";
import { ListRepository } from "@/repositories/ListRepository";
import { STORAGE_KEYS, StorageService } from "@/services/StorageService";
import { useAppStore } from "@/stores/AppStore";

export class InitializeAppUseCase {
    private repository: ListRepository;

    constructor() {
        this.repository = new ListRepository();
    }

    async execute(): Promise<void> {
        const store = useAppStore.getState();

        console.log("[InitializeAppUseCase] Inizio Inizializzazione App...");

        const localFavs = await StorageService.get<Partial<Cocktail>[]>(STORAGE_KEYS.FAVORITES);
        if (localFavs) {
            store.setFavorites(localFavs);
        }

        await Promise.all([
            this._syncData(
                STORAGE_KEYS.CATEGORIES,
                async () => {
                    const categories = await this.repository.getCategories();
                    return categories.map(c => c.strCategory);
                },
                store.setCategories
            ),
            this._syncData(
                STORAGE_KEYS.GLASSES,
                async () => {
                    const glasses = await this.repository.getGlasses();
                    return glasses.map(g => g.strGlass);
                },
                store.setGlasses
            ),
            this._syncData(
                STORAGE_KEYS.ALCOHOLIC,
                async () => {
                    const alcoholic = await this.repository.getAlcoholicFilters();
                    return alcoholic.map(a => a.strAlcoholic);
                },
                store.setAlcoholicFilters
            ),
            this._syncData(
                STORAGE_KEYS.INGREDIENTS,
                async () => {
                    const ingredients = await this.repository.getIngredients();
                    return ingredients.map(i => i.strIngredient1);
                },
                store.setIngredients
            ),
        ]);

        store.setInitialized(true);
        console.log("[InitializeAppUseCase] App Inizializzata!");
    }

    private async _syncData<T>(
        storageKey: string,
        apiCall: () => Promise<T>,
        storeSetter: (data: T) => void
    ): Promise<void> {

        const localData = await StorageService.get<T>(storageKey);
        if (localData) {
            console.log(`[InitializeAppUseCase] Cache trovata per ${storageKey}`);
            storeSetter(localData);
        }

        try {
            const remoteData = await apiCall();

            if (JSON.stringify(remoteData) !== JSON.stringify(localData)) {
                console.log(`[InitializeAppUseCase] Aggiornamento API per ${storageKey}`);
                storeSetter(remoteData);
                await StorageService.save(storageKey, remoteData);
            }
        } catch (error) {
            console.warn(`[InitializeAppUseCase] Fetch fallita per ${storageKey}. Uso cache se disponibile.`);
        }
    }
}