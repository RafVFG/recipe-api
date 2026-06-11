import { Router, Request, Response } from "express";
import { makeLogin } from "../../adapters/factories/login";
import { makeVerifyMagicLink } from "../../adapters/factories/verify-magic-link";
import { makeForgotPassword } from "../../adapters/factories/forgot-password";
import { makeResetPassword } from "../../adapters/factories/reset-password";

function adaptRoute(controller: { handle: (req: any) => Promise<any> }) {
    return async (req: Request, res: Response) => {
        const httpRequest = { body: req.body, query: req.query };
        const httpResponse = await controller.handle(httpRequest);
        res.status(httpResponse.statusCode).json(httpResponse.body);
    };
}

const loginCtrl = makeLogin();
const verifyCtrl = makeVerifyMagicLink();
const forgotPasswordCtrl = makeForgotPassword();
const resetPasswordCtrl = makeResetPassword();

export default (router: Router): void => {
    router.post("/auth/login", adaptRoute(loginCtrl));
    router.get("/auth/verify", adaptRoute(verifyCtrl));
    router.post("/auth/forgot-password", adaptRoute(forgotPasswordCtrl));
    router.post("/auth/reset-password", adaptRoute(resetPasswordCtrl));
};
