import { Router } from "express";
import { makeCreateOrUpdateUnit } from "../../adapters/factories/create-unit";
import { makeGetUnits } from "../../adapters/factories/get-units";
import { makeDelUnit } from "../../adapters/factories/del-unit";
import { authGuard } from "../config/middleware/auth-guard";
import { adaptRoute } from "../config/adapt-route";

const createOrUpdateController = makeCreateOrUpdateUnit();
const listController = makeGetUnits();
const delController = makeDelUnit();

export default (router: Router): void => {
    router.post("/unit", authGuard, adaptRoute(createOrUpdateController))
    router.get("/units", adaptRoute(listController))
    router.delete("/unit/:id", authGuard, adaptRoute(delController))
}
