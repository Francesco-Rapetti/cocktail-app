import { Ingredient } from "@/entities/Ingredient";
import { IIngredientRepository } from "@/interfaces/IIngredientRepository";

export class IngredientRepository implements IIngredientRepository {
    private apiUrl = process.env.EXPO_PUBLIC_API_URL;

    async getIngredientById(id: string): Promise<Ingredient> {
        const url = `${this.apiUrl}/lookup.php?iid=${id}`;
        const response = await fetch(url);

        if (!response.ok) {
            throw new Error(`HTTP Error: ${response.status}`, { cause: response });
        }

        const data = await response.json();
        const ingredients = data.ingredients;

        return ingredients[0] as Ingredient;
    }

    async searchIngredientByName(name: string): Promise<Ingredient> {
        const url = `${this.apiUrl}/search.php?i=${encodeURIComponent(name)}`;
        const response = await fetch(url);

        if (!response.ok) {
            throw new Error(`HTTP Error: ${response.status}`, { cause: response });
        }

        const data = await response.json();
        const ingredients = data.ingredients;

        return ingredients[0] as Ingredient;
    }
}