import { ListRepository } from "@/repositories/ListRepository";
import { useState } from "react";

const repository = new ListRepository();

export const useLists = () => {
    const [list, setList] = useState<{ [key: string]: string }[] | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const getCategories = async () => {
        setLoading(true);
        setError(null);

        try {
            const categories = await repository.getCategories();
            setList(categories);
            return categories;
        } catch (err) {
            setError('Impossibile caricare le categorie');
            throw err;
        } finally {
            setLoading(false);
        }
    };

    const getGlasses = async () => {
        setLoading(true);
        setError(null);

        try {
            const glasses = await repository.getGlasses();
            setList(glasses);
            return glasses;
        } catch (err) {
            setError('Impossibile caricare i bicchieri');
            throw err;
        } finally {
            setLoading(false);
        }
    };

    const getIngredients = async () => {
        setLoading(true);
        setError(null);

        try {
            const ingredients = await repository.getIngredients();
            setList(ingredients);
            return ingredients;
        } catch (err) {
            setError('Impossibile caricare gli ingredienti');
            throw err;
        } finally {
            setLoading(false);
        }
    };

    const getAlcoholicFilters = async () => {
        setLoading(true);
        setError(null);

        try {
            const alcoholicFilters = await repository.getAlcoholicFilters();
            setList(alcoholicFilters);
            return alcoholicFilters;
        } catch (err) {
            setError('Impossibile caricare i filtri alcolici');
            throw err;
        } finally {
            setLoading(false);
        }
    };

    return {
        list,
        loading,
        error,
        getCategories,
        getGlasses,
        getIngredients,
        getAlcoholicFilters,
    };
};