import { STORAGE_KEYS, StorageService } from '@/services/StorageService';
import { useAppStore } from '@/stores/AppStore';
import { useEffect } from 'react';

export const usePersistenceSubscription = () => {
    useEffect(() => {
        const unsubscribe = useAppStore.subscribe(
            (state) => {
                console.log('[usePersistenceSubscription] Salvataggio automatico preferiti...');
                StorageService.save(STORAGE_KEYS.FAVORITES, state.favorites);
            }
        );

        return () => unsubscribe();
    }, []);
};