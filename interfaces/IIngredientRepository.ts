import { Ingredient } from "@/entities/Ingredient";

export interface IIngredientRepository {
    getIngredientById(id: string): Promise<Ingredient>;
    searchIngredientByName(name: string): Promise<Ingredient>;
}