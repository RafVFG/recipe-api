import { Router } from "express"
import { authGuard } from "../config/middleware/auth-guard"
import { adaptRoute } from "../config/adapt-route"
import { makeGetUserRecipes } from "../../adapters/factories/get-user-recipes"
import { makeRegisterUser } from "../../adapters/factories/register-user"
import { makeGetUserProfile } from "../../adapters/factories/get-user-profile"

const getUserRecipesController = makeGetUserRecipes()
const registerUserController = makeRegisterUser()
const getUserProfileController = makeGetUserProfile()

export default (router: Router): void => {
    router.post("/register", adaptRoute(registerUserController))
    router.get("/user/recipes", authGuard, adaptRoute(getUserRecipesController))
    router.get("/user/profile", authGuard, adaptRoute(getUserProfileController))
}
