import { Cocktail } from "@/entities/Cocktail";
import { ICocktailRepository } from "@/interfaces/ICocktailRepository";

export class CocktailRepository implements ICocktailRepository {
    private apiUrl = process.env.EXPO_PUBLIC_API_URL;

    async getCocktailById(id: string) {
        const url = `${this.apiUrl}/lookup.php?i=${id}`;
        const response = await fetch(url);

        if (!response.ok) {
            throw new Error(`HTTP Error: ${response.status}`, { cause: response });
        }

        const data = await response.json();
        const drinks = data.drinks;

        return drinks[0] as Cocktail;
    }

    async searchCocktailsByName(name: string, signal?: AbortSignal): Promise<Cocktail[]> {
        const url = `${this.apiUrl}/search.php?s=${encodeURIComponent(name)}`;

        try {
            const response = await fetch(url, { signal });

            if (!response.ok) {
                throw new Error(`HTTP Error: ${response.status}`, { cause: response });
            }

            const data = await response.json();
            const drinks = data.drinks;

            return drinks ? (drinks as Cocktail[]) : [];
        } catch (error: any) {
            if (error.name === 'AbortError') {
                throw error;
            }
            console.error('Error fetching cocktails by name:', error);
            throw error;
        }
    }

    async searchCocktailsByFirstLetter(letter: string, signal?: AbortSignal): Promise<Cocktail[]> {
        const url = `${this.apiUrl}/search.php?f=${encodeURIComponent(letter)}`;

        try {
            const response = await fetch(url, { signal });

            if (!response.ok) {
                throw new Error(`HTTP Error: ${response.status}`, { cause: response });
            }

            const data = await response.json();
            const drinks = data.drinks;

            return drinks ? (drinks as Cocktail[]) : [];
        } catch (error: any) {
            if (error.name === 'AbortError') {
                throw error;
            }
            console.error('Error fetching cocktails by first letter:', error);
            throw error;
        }
    }

    async getRandomCocktail(): Promise<Cocktail> {
        const url = `${this.apiUrl}/random.php`;
        const response = await fetch(url);

        if (!response.ok) {
            throw new Error(`HTTP Error: ${response.status}`, { cause: response });
        }

        const data = await response.json();
        const drinks = data.drinks;

        return drinks[0] as Cocktail;
    }

    async filterCocktailsByAlcoholic(alcoholic: string): Promise<Partial<Cocktail>[]> {
        const url = `${this.apiUrl}/filter.php?a=${encodeURIComponent(alcoholic)}`;
        const response = await fetch(url);

        if (!response.ok) {
            throw new Error(`HTTP Error: ${response.status}`, { cause: response });
        }

        const data = await response.json();
        const drinks = data.drinks;

        return drinks ? (drinks as Partial<Cocktail>[]) : [];
    }

    async filterCocktailsByCategory(category: string): Promise<Partial<Cocktail>[]> {
        const url = `${this.apiUrl}/filter.php?c=${encodeURIComponent(category)}`;
        const response = await fetch(url);

        if (!response.ok) {
            throw new Error(`HTTP Error: ${response.status}`, { cause: response });
        }

        const data = await response.json();
        const drinks = data.drinks;

        return drinks ? (drinks as Partial<Cocktail>[]) : [];
    }

    async filterCocktailsByIngredient(ingredient: string): Promise<Partial<Cocktail>[]> {
        const url = `${this.apiUrl}/filter.php?i=${encodeURIComponent(ingredient)}`;
        const response = await fetch(url);

        if (!response.ok) {
            throw new Error(`HTTP Error: ${response.status}`, { cause: response });
        }

        const data = await response.json();
        const drinks = data.drinks;

        return drinks ? (drinks as Partial<Cocktail>[]) : [];
    }

    async filterCocktailsByGlass(glass: string): Promise<Partial<Cocktail>[]> {
        const url = `${this.apiUrl}/filter.php?g=${encodeURIComponent(glass)}`;
        const response = await fetch(url);

        if (!response.ok) {
            throw new Error(`HTTP Error: ${response.status}`, { cause: response });
        }

        const data = await response.json();
        const drinks = data.drinks;

        return drinks ? (drinks as Partial<Cocktail>[]) : [];
    }
}