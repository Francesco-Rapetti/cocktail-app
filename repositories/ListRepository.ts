import { IListRepository } from "@/interfaces/IListRepository";

export class ListRepository implements IListRepository {
    private apiUrl = process.env.EXPO_PUBLIC_API_URL;

    async getCategories(): Promise<{ strCategory: string }[]> {
        const url = `${this.apiUrl}/list.php?c=list`;
        const response = await fetch(url);

        if (!response.ok) {
            throw new Error(`HTTP Error: ${response.status}`, { cause: response });
        }

        const data = await response.json();
        return data.drinks;
    }

    async getGlasses(): Promise<{ strGlass: string }[]> {
        const url = `${this.apiUrl}/list.php?g=list`;
        const response = await fetch(url);

        if (!response.ok) {
            throw new Error(`HTTP Error: ${response.status}`, { cause: response });
        }

        const data = await response.json();
        return data.drinks;
    }

    async getIngredients(): Promise<{ strIngredient1: string }[]> {
        const url = `${this.apiUrl}/list.php?i=list`;
        const response = await fetch(url);

        if (!response.ok) {
            throw new Error(`HTTP Error: ${response.status}`, { cause: response });
        }

        const data = await response.json();
        return data.drinks;
    }

    async getAlcoholicFilters(): Promise<{ strAlcoholic: string }[]> {
        const url = `${this.apiUrl}/list.php?a=list`;
        const response = await fetch(url);

        if (!response.ok) {
            throw new Error(`HTTP Error: ${response.status}`, { cause: response });
        }

        const data = await response.json();
        return data.drinks;
    }
}