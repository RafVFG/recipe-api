import { userRepository } from "../../repositories/user";
import { authTokenRepository } from "../../repositories/auth-token";
import { emailSender } from "../../main/config/email";
import { registerUser } from "../../use-cases/register-user";
import { registerController } from "../controllers/user/register";

export function makeRegisterUser() {
    const userRepo = userRepository();
    const authTokenRepo = authTokenRepository();
    const sender = emailSender();
    const useCase = registerUser(userRepo, authTokenRepo, sender);
    const controller = registerController(useCase);
    return controller;
}
