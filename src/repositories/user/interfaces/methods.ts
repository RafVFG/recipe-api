import { User, UserProfile } from "../../../entities/user/interfaces/user";

export interface UserRepositoryMethods {
    findByEmail(email: string): Promise<User | null>;
    create(name: string, email: string): Promise<User>;
    findById(id: number): Promise<UserProfile | null>;
}
