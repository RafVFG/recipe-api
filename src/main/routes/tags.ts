import { Router } from "express";
import { makeGetTags } from "../../adapters/factories/get-tags";
import { makeDelTag } from "../../adapters/factories/del-tag";
import { authGuard } from "../config/middleware/auth-guard";
import { adaptRoute } from "../config/adapt-route";

const listController = makeGetTags();
const delController = makeDelTag();

export default (router: Router): void => {
    router.get("/tags", adaptRoute(listController));
    router.delete("/tag/:id", authGuard, adaptRoute(delController));
};
