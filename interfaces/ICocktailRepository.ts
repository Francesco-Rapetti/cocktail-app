import { Cocktail } from "@/entities/Cocktail";

export interface ICocktailRepository {
    getCocktailById(id: string): Promise<Cocktail>;
    searchCocktailsByName(name: string, signal?: AbortSignal): Promise<Cocktail[]>;
    searchCocktailsByFirstLetter(letter: string, signal?: AbortSignal): Promise<Cocktail[]>;
    getRandomCocktail(): Promise<Cocktail>;
    filterCocktailsByAlcoholic(alcoholic: string): Promise<Partial<Cocktail>[]>;
    filterCocktailsByCategory(category: string): Promise<Partial<Cocktail>[]>;
    filterCocktailsByIngredient(ingredient: string): Promise<Partial<Cocktail>[]>;
    filterCocktailsByGlass(glass: string): Promise<Partial<Cocktail>[]>;
}
