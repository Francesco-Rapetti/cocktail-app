import { Ingredient } from "@/entities/Ingredient";
import { IngredientRepository } from "@/repositories/IngredientRepository";
import { useState } from "react";

const repository = new IngredientRepository();

export const useIngredients = () => {
    const [ingredient, setIngredient] = useState<Ingredient | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const getIngredientById = async (id: string) => {
        setLoading(true);
        setError(null);

        try {
            const ingredient = await repository.getIngredientById(id);
            setIngredient(ingredient);
            return ingredient;
        } catch (err) {
            setError('Impossibile caricare l\'ingrediente');
            throw err;
        } finally {
            setLoading(false);
        }
    };

    const searchIngredientByName = async (name: string) => {
        setLoading(true);
        setError(null);

        try {
            const ingredient = await repository.searchIngredientByName(name);
            setIngredient(ingredient);
            return ingredient;
        } catch (err) {
            setError('Impossibile caricare l\'ingrediente');
            throw err;
        } finally {
            setLoading(false);
        }
    };


    return {
        ingredient,
        loading,
        error,
        getIngredientById,
        searchIngredientByName,
    };
};