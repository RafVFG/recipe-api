export interface User {
    id: number;
    name: string;
    email: string;
}

export interface UserProfile extends User {
    recipesCount: number;
    favoritesCount: number;
}
