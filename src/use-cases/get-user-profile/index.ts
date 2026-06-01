import { UserRepositoryMethods } from "../../repositories/user/interfaces/methods";
import { GetUserProfileMethods } from "./interfaces/methods";
import { UserProfile } from "../../entities/user/interfaces/user";

export function getUserProfile(userRepository: UserRepositoryMethods): GetUserProfileMethods {
    async function run(userId: number): Promise<UserProfile> {
        const profile = await userRepository.findById(userId);
        if (!profile) throw new Error("Usuário não encontrado");
        return profile;
    }
    return { run };
}
