import { userRepository } from "../../repositories/user";
import { authTokenRepository } from "../../repositories/auth-token";
import { resetPassword } from "../../use-cases/reset-password";
import { resetPasswordController } from "../controllers/auth/reset-password";

export function makeResetPassword() {
    const userRepo = userRepository();
    const authTokenRepo = authTokenRepository();
    const useCase = resetPassword(userRepo, authTokenRepo);
    return resetPasswordController(useCase);
}
