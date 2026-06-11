import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { LoginMethods } from "./interfaces/methods";
import { UserRepositoryMethods } from "../../repositories/user/interfaces/methods";

export function login(
    userRepository: UserRepositoryMethods
): LoginMethods {
    async function run(email: string, password: string): Promise<{ jwt: string }> {
        const user = await userRepository.findByEmail(email);

        if (!user || !user.password) {
            throw new Error("Email ou senha inválidos");
        }

        const match = await bcrypt.compare(password, user.password);
        if (!match) {
            throw new Error("Email ou senha inválidos");
        }

        const token = jwt.sign(
            { userId: user.id },
            process.env.JWT_SECRET!,
            { expiresIn: "7d" }
        );

        return { jwt: token };
    }

    return { run };
}
