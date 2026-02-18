export interface Ingredient {
    idIngredient: string;
    strIngredient: string;
    strDescription: string;
    strType: string | null;
    strAlcohol: "Yes" | "No";
    strABV: string | null;
}
