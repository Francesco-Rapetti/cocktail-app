import { Cocktail } from '@/entities/Cocktail';
import { CocktailRepository } from '@/repositories/CocktailRepository';
import { useCallback, useRef, useState } from 'react';

const repository = new CocktailRepository();

export const useCocktails = () => {
    const [cocktails, setCocktails] = useState<Cocktail[]>([]);
    const [cocktail, setCocktail] = useState<Cocktail | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const abortControllerRef = useRef<AbortController | null>(null);

    const searchCocktailsByName = useCallback(async (query: string) => {
        if (abortControllerRef.current) {
            abortControllerRef.current.abort();
        }

        const controller = new AbortController();
        abortControllerRef.current = controller;

        setLoading(true);
        setError(null);

        try {
            const data = await repository.searchCocktailsByName(query, controller.signal);


            setCocktails(data);
        } catch (err: any) {
            if (err.name === 'AbortError') {
                console.log('Richiesta annullata: ' + query);
                return;
            }

            setError('Impossibile caricare i cocktail');
        } finally {
            if (!controller.signal.aborted) {
                setLoading(false);
            }
        }
    }, []);

    const searchCocktailsByFirstLetter = useCallback(async (letter: string) => {
        if (abortControllerRef.current) {
            abortControllerRef.current.abort();
        }

        const controller = new AbortController();
        abortControllerRef.current = controller;

        setLoading(true);
        setError(null);

        try {
            const data = await repository.searchCocktailsByFirstLetter(letter, controller.signal);
            setCocktails(data);
        } catch (err: any) {
            if (err.name === 'AbortError') {
                console.log('Richiesta annullata: ' + letter);
                return;
            }

            setError('Impossibile caricare i cocktail');
        } finally {
            if (!controller.signal.aborted) {
                setLoading(false);
            }
        }
    }, []);

    const getCocktailById = useCallback(async (id: string) => {
        setLoading(true);
        setError(null);

        try {
            const cocktail = await repository.getCocktailById(id);
            setCocktail(cocktail);
            return cocktail;
        } catch (err) {
            setError('Impossibile caricare il cocktail');
            throw err;
        } finally {
            setLoading(false);
        }
    }, []);

    const getRandomCocktails = useCallback(async (number: number) => {
        setLoading(true);
        setError(null);

        try {
            const promises = Array.from({ length: number }, () => repository.getRandomCocktail());
            const randomCocktails = await Promise.all(promises);
            setCocktails(randomCocktails);
        } catch (err) {
            setError('Impossibile caricare i cocktail');
        } finally {
            setLoading(false);
        }
    }, []);

    const filterCocktailsByAlcoholic = useCallback(async (alcoholic: string) => {
        setLoading(true);
        setError(null);

        try {
            const data = await repository.filterCocktailsByAlcoholic(alcoholic);
            setCocktails(data as Cocktail[]);
        } catch (err) {
            setError('Impossibile caricare i cocktail');
        } finally {
            setLoading(false);
        }
    }, []);

    const filterCocktailsByCategory = useCallback(async (category: string) => {
        setLoading(true);
        setError(null);

        try {
            const data = await repository.filterCocktailsByCategory(category);
            setCocktails(data as Cocktail[]);
        } catch (err) {
            setError('Impossibile caricare i cocktail');
        } finally {
            setLoading(false);
        }
    }, []);

    const filterCocktailsByIngredient = useCallback(async (ingredient: string) => {
        setLoading(true);
        setError(null);

        try {
            const data = await repository.filterCocktailsByIngredient(ingredient);
            setCocktails(data as Cocktail[]);
        } catch (err) {
            setError('Impossibile caricare i cocktail');
        } finally {
            setLoading(false);
        }
    }, []);

    const filterCocktailsByGlass = useCallback(async (glass: string) => {
        setLoading(true);
        setError(null);

        try {
            const data = await repository.filterCocktailsByGlass(glass);
            setCocktails(data as Cocktail[]);
        } catch (err) {
            setError('Impossibile caricare i cocktail');
        } finally {
            setLoading(false);
        }
    }, []);

    return {
        cocktails,
        cocktail,
        loading,
        error,
        searchCocktailsByName,
        searchCocktailsByFirstLetter,
        getCocktailById,
        getRandomCocktails,
        filterCocktailsByAlcoholic,
        filterCocktailsByCategory,
        filterCocktailsByIngredient,
        filterCocktailsByGlass,
    };
};