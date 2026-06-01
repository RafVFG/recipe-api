import { userRepository } from "../../repositories/user"
import { getUserProfile } from "../../use-cases/get-user-profile"
import { userProfileController } from "../controllers/user/profile"

export function makeGetUserProfile() {
    const repo = userRepository()
    const useCase = getUserProfile(repo)
    return userProfileController(useCase)
}
