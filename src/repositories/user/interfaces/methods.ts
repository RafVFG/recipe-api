import { User } from "../../../entities/user/interfaces/user";

export interface UserRepositoryMethods {
    findByEmail(email: string): Promise<User | null>;
}
