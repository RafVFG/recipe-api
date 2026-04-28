export interface Item {
  name: string;
  amount?: string;
}

export interface Recipe {
  id?: number;
  idUser: number;
  name: string;
  description?: string;
  ingredients: Item[];
  directions: string[];
  rating?: number;
  tags?: string[];
  prepTime?: number;
  yields?: number;
}
