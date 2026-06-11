import { User, UserProfile } from "../../../entities/user/interfaces/user";

export interface UserRepositoryMethods {
    findByEmail(email: string): Promise<User | null>;
    create(name: string, email: string, passwordHash: string): Promise<User>;
    findById(id: number): Promise<UserProfile | null>;
    updatePassword(idUser: number, passwordHash: string): Promise<void>;
}
