export interface IListRepository {
    getCategories(): Promise<{ strCategory: string }[]>;
    getGlasses(): Promise<{ strGlass: string }[]>;
    getIngredients(): Promise<{ strIngredient1: string }[]>;
    getAlcoholicFilters(): Promise<{ strAlcoholic: string }[]>;
}