import { authTokenRepository } from "../../repositories/auth-token";
import { verifyMagicLink } from "../../use-cases/verify-magic-link";
import { authVerifyController } from "../controllers/auth/verify";

export function makeVerifyMagicLink() {
    const authTokenRepo = authTokenRepository();
    const useCase = verifyMagicLink(authTokenRepo);
    const controller = authVerifyController(useCase);

    return controller;
}
