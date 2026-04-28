import { Router, Request, Response } from "express";
import { makeRequestMagicLink } from "../../adapters/factories/request-magic-link";
import { makeVerifyMagicLink } from "../../adapters/factories/verify-magic-link";

function adaptRoute(controller: { handle: (req: any) => Promise<any> }) {
    return async (req: Request, res: Response) => {
        const httpRequest = { body: req.body, query: req.query };
        const httpResponse = await controller.handle(httpRequest);
        res.status(httpResponse.statusCode).json(httpResponse.body);
    };
}

const requestController = makeRequestMagicLink();
const verifyController = makeVerifyMagicLink();

export default (router: Router): void => {
    router.post("/auth/request", adaptRoute(requestController));
    router.get("/auth/verify", adaptRoute(verifyController));
};
