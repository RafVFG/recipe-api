import { UserProfile } from "../../../entities/user/interfaces/user";

export interface GetUserProfileMethods {
    run: (userId: number) => Promise<UserProfile>;
}
