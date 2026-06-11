import { userRepository } from "../../repositories/user";
import { login } from "../../use-cases/login";
import { loginController } from "../controllers/auth/login";

export function makeLogin() {
    const userRepo = userRepository();
    const useCase = login(userRepo);
    return loginController(useCase);
}
