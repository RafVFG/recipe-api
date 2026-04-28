import nodemailer from "nodemailer";
import { EmailSenderMethods } from "../../use-cases/request-magic-link/interfaces/email-sender";

export function emailSender(): EmailSenderMethods {
    const transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: Number(process.env.SMTP_PORT),
        auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASS,
        },
    });

    async function send(data: { to: string; subject: string; html: string }): Promise<void> {
        await transporter.sendMail({
            from: process.env.SMTP_FROM,
            to: data.to,
            subject: data.subject,
            html: data.html,
        });
    }

    return { send };
}
