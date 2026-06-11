import crypto from "crypto";
import bcrypt from "bcryptjs";
import { RegisterUserMethods } from "./interfaces/methods";
import { UserRepositoryMethods } from "../../repositories/user/interfaces/methods";
import { AuthTokenRepositoryMethods } from "../../repositories/auth-token/interfaces/methods";
import { EmailSenderMethods } from "../request-magic-link/interfaces/email-sender";

export function registerUser(
    userRepository: UserRepositoryMethods,
    authTokenRepository: AuthTokenRepositoryMethods,
    emailSender: EmailSenderMethods
): RegisterUserMethods {
    async function run(name: string, email: string, password: string): Promise<void> {
        const existing = await userRepository.findByEmail(email);
        if (existing) throw new Error("Email já cadastrado");

        const passwordHash = await bcrypt.hash(password, 10);
        const user = await userRepository.create(name, email, passwordHash);

        const rawToken = crypto.randomBytes(32).toString("hex");
        const hash = crypto.createHash("sha256").update(rawToken).digest("hex");

        const expiresAt = new Date();
        expiresAt.setMinutes(expiresAt.getMinutes() + 15);

        await authTokenRepository.create({ idUser: user.id, hash, expiresAt, type: 'magic_link' });

        const frontendUrl = process.env.FRONTEND_URL;
        if (!frontendUrl) throw new Error("FRONTEND_URL não configurado");
        const link = `${frontendUrl}/auth/verify?token=${rawToken}`;

        await emailSender.send({
            to: email,
            subject: "Bem-vindo! Seu link de acesso",
            html: `<p>Sua conta foi criada. Clique no link para acessar (válido por 15 minutos):</p><p><a href="${link}">${link}</a></p>`,
        });
    }

    return { run };
}
