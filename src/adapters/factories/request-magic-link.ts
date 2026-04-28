import { userRepository } from "../../repositories/user";
import { authTokenRepository } from "../../repositories/auth-token";
import { requestMagicLink } from "../../use-cases/request-magic-link";
import { authRequestController } from "../controllers/auth/request";
import { emailSender } from "../../main/config/email";

export function makeRequestMagicLink() {
    const userRepo = userRepository();
    const authTokenRepo = authTokenRepository();
    const sender = emailSender();
    const useCase = requestMagicLink(userRepo, authTokenRepo, sender);
    const controller = authRequestController(useCase);

    return controller;
}
