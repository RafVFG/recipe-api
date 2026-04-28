import { Router } from "express";
import { makeCreateOrUpdateIngredient } from "../../adapters/factories/create-ingredient";
import { makeGetIngredients } from "../../adapters/factories/get-ingredients";
import { makeDelIngredient } from "../../adapters/factories/del-ingredient";
import { authGuard } from "../config/middleware/auth-guard";
import { adaptRoute } from "../config/adapt-route";

const createOrUpdateController = makeCreateOrUpdateIngredient();
const listController = makeGetIngredients();
const delController = makeDelIngredient();

export default (router: Router): void => {
    router.post("/ingredient", authGuard, adaptRoute(createOrUpdateController))
    router.get("/ingredients", adaptRoute(listController))
    router.delete("/ingredient/:id", authGuard, adaptRoute(delController))
}
