import { userRepository } from "../../repositories/user";
import { authTokenRepository } from "../../repositories/auth-token";
import { emailSender } from "../../main/config/email";
import { requestPasswordReset } from "../../use-cases/request-password-reset";
import { forgotPasswordController } from "../controllers/auth/forgot-password";

export function makeForgotPassword() {
    const userRepo = userRepository();
    const authTokenRepo = authTokenRepository();
    const sender = emailSender();
    const useCase = requestPasswordReset(userRepo, authTokenRepo, sender);
    return forgotPasswordController(useCase);
}
