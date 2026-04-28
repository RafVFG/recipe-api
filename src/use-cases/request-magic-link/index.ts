import crypto from "crypto";
import { RequestMagicLinkMethods } from "./interfaces/methods";
import { UserRepositoryMethods } from "../../repositories/user/interfaces/methods";
import { AuthTokenRepositoryMethods } from "../../repositories/auth-token/interfaces/methods";
import { EmailSenderMethods } from "./interfaces/email-sender";

export function requestMagicLink(
    userRepository: UserRepositoryMethods,
    authTokenRepository: AuthTokenRepositoryMethods,
    emailSender: EmailSenderMethods
): RequestMagicLinkMethods {
    async function run(email: string): Promise<void> {
        const user = await userRepository.findByEmail(email);

        if (!user) {
            throw new Error("Email não encontrado");
        }

        const rawToken = crypto.randomBytes(32).toString("hex");
        const hash = crypto.createHash("sha256").update(rawToken).digest("hex");

        const expiresAt = new Date();
        expiresAt.setMinutes(expiresAt.getMinutes() + 15);

        await authTokenRepository.create({ idUser: user.id, hash, expiresAt });

        const link = `${process.env.FRONTEND_URL}/auth/verify?token=${rawToken}`;

        await emailSender.send({
            to: email,
            subject: "Seu link de acesso",
            html: `<p>Clique no link para acessar (válido por 15 minutos):</p><p><a href="${link}">${link}</a></p>`,
        });
    }

    return { run };
}
