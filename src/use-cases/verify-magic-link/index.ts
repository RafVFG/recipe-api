import crypto from "crypto";
import jwt from "jsonwebtoken";
import { VerifyMagicLinkMethods } from "./interfaces/methods";
import { AuthTokenRepositoryMethods } from "../../repositories/auth-token/interfaces/methods";

export function verifyMagicLink(
    authTokenRepository: AuthTokenRepositoryMethods
): VerifyMagicLinkMethods {
    async function run(rawToken: string): Promise<{ jwt: string }> {
        const hash = crypto.createHash("sha256").update(rawToken).digest("hex");

        const tokenData = await authTokenRepository.findByHash(hash);

        if (!tokenData) {
            throw new Error("Token inválido");
        }

        if (new Date() > new Date(tokenData.expires_at)) {
            throw new Error("Link expirado");
        }

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
