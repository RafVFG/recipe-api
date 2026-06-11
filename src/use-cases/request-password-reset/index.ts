import crypto from "crypto";
import { RequestPasswordResetMethods } from "./interfaces/methods";
import { UserRepositoryMethods } from "../../repositories/user/interfaces/methods";
import { AuthTokenRepositoryMethods } from "../../repositories/auth-token/interfaces/methods";
import { EmailSenderMethods } from "../request-magic-link/interfaces/email-sender";

export function requestPasswordReset(
    userRepository: UserRepositoryMethods,
    authTokenRepository: AuthTokenRepositoryMethods,
    emailSender: EmailSenderMethods
): RequestPasswordResetMethods {
    async function run(email: string): Promise<void> {
        const user = await userRepository.findByEmail(email);
        if (!user) return;

        const rawToken = crypto.randomBytes(32).toString("hex");
        const hash = crypto.createHash("sha256").update(rawToken).digest("hex");

        const expiresAt = new Date();
        expiresAt.setMinutes(expiresAt.getMinutes() + 15);

        await authTokenRepository.create({ idUser: user.id, hash, expiresAt, type: 'password_reset' });

        const link = `${process.env.FRONTEND_URL}/nova-senha?token=${rawToken}`;
        await emailSender.send({
            to: email,
            subject: "Redefinir sua senha",
            html: `<p>Clique no link para redefinir sua senha (válido por 15 minutos):</p><p><a href="${link}">${link}</a></p>`,
        });
    }

    return { run };
}
