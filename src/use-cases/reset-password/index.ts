import crypto from "crypto";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { ResetPasswordMethods } from "./interfaces/methods";
import { UserRepositoryMethods } from "../../repositories/user/interfaces/methods";
import { AuthTokenRepositoryMethods } from "../../repositories/auth-token/interfaces/methods";

export function resetPassword(
    userRepository: UserRepositoryMethods,
    authTokenRepository: AuthTokenRepositoryMethods
): ResetPasswordMethods {
    async function run(rawToken: string, newPassword: string): Promise<{ jwt: string }> {
        const hash = crypto.createHash("sha256").update(rawToken).digest("hex");
        const tokenData = await authTokenRepository.findByHash(hash, 'password_reset');

        if (!tokenData) throw new Error("Token inválido ou expirado");
        if (new Date() > new Date(tokenData.expires_at)) throw new Error("Token inválido ou expirado");

        const passwordHash = await bcrypt.hash(newPassword, 10);
        await userRepository.updatePassword(tokenData.idUser, passwordHash);
        await authTokenRepository.deleteByHash(hash);

        const token = jwt.sign(
            { userId: tokenData.idUser },
            process.env.JWT_SECRET!,
            { expiresIn: "7d" }
        );

        return { jwt: token };
    }

    return { run };
}
