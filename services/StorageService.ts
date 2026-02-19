import AsyncStorage from '@react-native-async-storage/async-storage';

export const STORAGE_KEYS = {
    CATEGORIES: '@categories',
    GLASSES: '@glasses',
    INGREDIENTS: '@ingredients',
    ALCOHOLIC: '@alcoholic',
    FAVORITES: '@favorites',
};

export const StorageService = {
    async save(key: string, data: any): Promise<void> {
        try {
            await AsyncStorage.setItem(key, JSON.stringify(data));
        } catch (e) {
            console.error(`Errore salvataggio ${key}`, e);
        }
    },

    async get<T>(key: string): Promise<T | null> {
        try {
            const jsonValue = await AsyncStorage.getItem(key);
            return jsonValue != null ? JSON.parse(jsonValue) : null;
        } catch (e) {
            console.error(`Errore lettura ${key}`, e);
            return null;
        }
    }
};